// metrics.js
// Real, un-faked per-container metrics. Replaces the old CPU number in websocket.js,
// which was clamped and had Math.random() jitter added.
//
// collect() is delta-based, so it must be called by ONE caller on a steady cadence
// (the heartbeat in cluster.js calls it once per second).
const { monitorEventLoopDelay } = require('perf_hooks');

// Event-loop delay: how late timers fire. This is the direct measure of "starvation".
const LOOP_RESOLUTION_MS = 10;
const loop = monitorEventLoopDelay({ resolution: LOOP_RESOLUTION_MS });
loop.enable();

const counters = { ticks: 0, tickMsSum: 0, tickMsMax: 0, computeMsSum: 0, messages: 0 };
let clientCounter = () => 0;
let prev = {
    cpu: process.cpuUsage(),
    t: process.hrtime.bigint(),
    ticks: 0,
    messages: 0
};

// Called by engine.js after every tick the leader computes.
function markTick(totalMs, computeMs) {
    counters.ticks++;
    counters.tickMsSum += totalMs;
    counters.computeMsSum += computeMs;
    if (totalMs > counters.tickMsMax) counters.tickMsMax = totalMs;
}

// Called by sqsWorker.js after it finishes a batch of chaos messages.
function markMessages(n) {
    counters.messages += n;
}

// Called by cluster.js so metrics can report connected WebSocket clients.
function setClientCounter(fn) {
    clientCounter = fn;
}

const round = (n, d = 1) => {
    const f = 10 ** d;
    return Math.round((Number.isFinite(n) ? n : 0) * f) / f;
};
const nsToMs = (ns) => (Number.isFinite(ns) ? ns / 1e6 : 0);
// The histogram records the full interval between samples, so an idle loop reads ~10ms.
// Subtract the sampling interval to get the actual lag (idle ~0ms).
const lagMs = (ns) => Math.max(0, nsToMs(ns) - LOOP_RESOLUTION_MS);

function collect({ cpuLimit, memLimitMb }) {
    const nowT = process.hrtime.bigint();
    const cpu = process.cpuUsage();
    const wallUs = Number(nowT - prev.t) / 1000;
    const wallSec = wallUs / 1e6;

    // CPU as a percentage of this container's limit (0.25 vCPU on your Fargate task).
    const cpuUs = (cpu.user - prev.cpu.user) + (cpu.system - prev.cpu.system);
    const cpuPct = wallUs > 0 ? (cpuUs / (wallUs * cpuLimit)) * 100 : 0;

    const ticks = counters.ticks - prev.ticks;
    const msgs = counters.messages - prev.messages;

    const hasLoopSamples = loop.count > 0;
    const rss = process.memoryUsage().rss / 1048576;

    const snapshot = {
        cpuPct: round(cpuPct),
        memMb: round(rss),
        memPct: round((rss / memLimitMb) * 100),
        loopLagP50Ms: round(hasLoopSamples ? lagMs(loop.percentile(50)) : 0, 2),
        loopLagP99Ms: round(hasLoopSamples ? lagMs(loop.percentile(99)) : 0, 2),
        loopLagMaxMs: round(hasLoopSamples ? lagMs(loop.max) : 0, 2),
        ticksPerSec: round(wallSec > 0 ? ticks / wallSec : 0),
        tickAvgMs: round(ticks > 0 ? counters.tickMsSum / ticks : 0, 2),
        tickMaxMs: round(counters.tickMsMax, 2),
        computeAvgMs: round(ticks > 0 ? counters.computeMsSum / ticks : 0, 2),
        msgPerSec: round(wallSec > 0 ? msgs / wallSec : 0),
        clients: clientCounter()
    };

    // Start the next window.
    loop.reset();
    counters.tickMsSum = 0;
    counters.tickMsMax = 0;
    counters.computeMsSum = 0;
    prev = { cpu, t: nowT, ticks: counters.ticks, messages: counters.messages };

    return snapshot;
}

module.exports = { collect, markTick, markMessages, setClientCounter };

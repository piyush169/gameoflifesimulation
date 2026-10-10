// cluster.js
// Makes the cluster observable.
//
//  1. Every container writes a heartbeat to Redis once a second:   gol:node:<id>  (expires in 6s)
//     If a container dies, its key simply expires, which is how the UI notices it is gone.
//  2. The leader polls SQS queue depth once and shares it via Redis (instead of every
//     container calling SQS every 2 seconds).
//  3. Every container reads ALL heartbeats and pushes one CLUSTER message to its own
//     browsers, so the dashboard shows the whole cluster no matter which container
//     the load balancer attached the browser to.
//
// createCluster() takes its dependencies as arguments so it can be tested without Redis/AWS.

const HEARTBEAT_MS = 1000;
const NODE_TTL_MS = 6000;      // heartbeat key lifetime
const STALE_AFTER_MS = 2500;   // heartbeat older than this => "stale" (alive in Redis but not updating)
const QUEUE_POLL_MS = 2000;
const NODE_PREFIX = 'gol:node:';
const QUEUE_KEY = 'gol:queue-depth';

function createCluster({ redis, getIdentity, collectMetrics, getRole, fetchQueueDepth, now = Date.now }) {
    let beating = false;

    async function publishHeartbeat() {
        const id = getIdentity();
        const { role, leaderSince } = getRole();
        const beat = {
            id: id.id,
            shortId: id.shortId,
            az: id.az,
            source: id.source,
            startedAt: id.startedAt,
            cpuLimit: id.cpuLimit,
            memLimitMb: id.memLimitMb,
            role,
            leaderSince,
            ts: now(),
            ...collectMetrics({ cpuLimit: id.cpuLimit, memLimitMb: id.memLimitMb })
        };
        await redis.set(NODE_PREFIX + id.id, JSON.stringify(beat), 'PX', NODE_TTL_MS);
    }

    async function heartbeatOnce() {
        if (beating) return; // don't overlap if Redis is slow
        beating = true;
        try {
            await publishHeartbeat();
        } catch (err) {
            console.error('Heartbeat failed:', err.message);
        } finally {
            beating = false;
        }
    }

    // Leader only: one SQS call for the whole cluster.
    async function pollQueueOnce() {
        if (!fetchQueueDepth || getRole().role !== 'leader') return;
        try {
            const depth = await fetchQueueDepth();
            if (depth !== null && depth !== undefined) {
                await redis.set(QUEUE_KEY, String(depth), 'PX', NODE_TTL_MS);
            }
        } catch (err) {
            console.error('Queue depth poll failed:', err.message);
        }
    }

    async function listNodeKeys() {
        const keys = [];
        let cursor = '0';
        do {
            const [next, batch] = await redis.scan(cursor, 'MATCH', NODE_PREFIX + '*', 'COUNT', 100);
            cursor = next;
            keys.push(...batch);
        } while (cursor !== '0');
        return keys;
    }

    // Build the CLUSTER message. Ages are computed here so browsers need no clock sync.
    // (Assumes container clocks are within a few hundred ms of each other, true on Fargate.)
    async function readCluster() {
        const t = now();
        const keys = await listNodeKeys();
        const raw = keys.length ? await redis.mget(keys) : [];

        const nodes = raw
            .map((s) => { try { return s ? JSON.parse(s) : null; } catch (_) { return null; } })
            .filter(Boolean)
            .map((n) => {
                const ageMs = Math.max(0, t - n.ts);
                return { ...n, ageMs, status: ageMs > STALE_AFTER_MS ? 'stale' : 'ok' };
            })
            // leader first, then oldest container first (stable card order)
            .sort((a, b) => (b.role === 'leader') - (a.role === 'leader') || a.startedAt - b.startedAt);

        const queueRaw = await redis.get(QUEUE_KEY);

        return {
            type: 'CLUSTER',
            serverTime: t,
            nodes,
            // Normally exactly one. Zero = election in progress. Two = handover overlap.
            leaderIds: nodes.filter((n) => n.role === 'leader' && n.status === 'ok').map((n) => n.id),
            queueDepth: queueRaw === null || queueRaw === undefined ? null : Number(queueRaw)
        };
    }

    // Remove our own heartbeat on graceful shutdown so the card disappears immediately.
    async function removeSelf() {
        try { await redis.del(NODE_PREFIX + getIdentity().id); } catch (_) { /* best effort */ }
    }

    return { heartbeatOnce, pollQueueOnce, readCluster, removeSelf };
}

// ---------------------------------------------------------------------------
// Production wiring (lazy requires keep createCluster() testable without ioredis / AWS SDK)
// ---------------------------------------------------------------------------
let singleton = null;
let timers = [];

function getCluster() {
    if (singleton) return singleton;

    const { redisClient } = require('./redis.js');
    const { getIdentity } = require('./identity.js');
    const metrics = require('./metrics.js');
    const { getRole } = require('./roleManager.js');

    let fetchQueueDepth = null;
    if (process.env.SQS_QUEUE_URL) {
        const { SQSClient, GetQueueAttributesCommand } = require('@aws-sdk/client-sqs');
        const sqs = new SQSClient({ region: process.env.AWS_REGION || 'us-east-1' });
        fetchQueueDepth = async () => {
            const data = await sqs.send(new GetQueueAttributesCommand({
                QueueUrl: process.env.SQS_QUEUE_URL,
                AttributeNames: ['ApproximateNumberOfMessages']
            }));
            return parseInt(data.Attributes.ApproximateNumberOfMessages, 10) || 0;
        };
    }

    singleton = createCluster({
        redis: redisClient,
        getIdentity,
        collectMetrics: metrics.collect,
        getRole,
        fetchQueueDepth
    });
    return singleton;
}

// Start heartbeats + (leader-only) queue polling. Called once from index.js.
async function startCluster() {
    await require('./identity.js').loadIdentity();
    const cluster = getCluster();
    cluster.heartbeatOnce();
    timers.push(setInterval(cluster.heartbeatOnce, HEARTBEAT_MS));
    timers.push(setInterval(cluster.pollQueueOnce, QUEUE_POLL_MS));
}

// Push the CLUSTER message to this container's browsers once a second. Called from websocket.js.
function startBroadcast(wss) {
    const { getIdentity, loadIdentity } = require('./identity.js');
    require('./metrics.js').setClientCounter(() => wss.clients.size);

    setInterval(async () => {
        if (wss.clients.size === 0) return; // nobody listening, skip the Redis reads
        try {
            await loadIdentity();
            const message = JSON.stringify({ ...(await getCluster().readCluster()), you: getIdentity().id });
            wss.clients.forEach((client) => {
                if (client.readyState === 1) client.send(message);
            });
        } catch (err) {
            console.error('Cluster broadcast failed:', err.message);
        }
    }, HEARTBEAT_MS);
}

async function stopCluster() {
    timers.forEach(clearInterval);
    timers = [];
    if (singleton) await singleton.removeSelf();
}

module.exports = { createCluster, startCluster, startBroadcast, stopCluster };

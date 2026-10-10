// roleManager.js
const { default: Redlock } = require('redlock');
const { redisClient } = require('./redis.js');
const { startEngine, stopEngine } = require('./engine.js');

const redlock = new Redlock([redisClient], {
    driftFactor: 0.01,
    retryCount: 0, // Do not retry instantly; we handle the loop ourselves
});

const LOCK_KEY = 'locks:gol-leader';
const LOCK_TTL = 2000; // 2 seconds
let currentLock = null;
let leaderSince = null;   // ms timestamp when this container became leader
let shuttingDown = false;

let isAttempting = false;

async function attemptLeadership() {
    if (isAttempting || shuttingDown) return;
    isAttempting = true;

    try {
        if (currentLock) {
            // If we already have the lock, extend it
            currentLock = await currentLock.extend(LOCK_TTL);
            startEngine(); // Ensure engine is running
        } else {
            // Try to acquire the lock
            currentLock = await redlock.acquire([LOCK_KEY], LOCK_TTL);
            leaderSince = Date.now();
            startEngine(); // We got it, start computing
        }
    } catch (error) {
        // Failed to acquire lock - someone else is the Leader
        currentLock = null;
        leaderSince = null;
        stopEngine(); 
    } finally {
        isAttempting = false;
    }
}

function startRoleManager() {
    // Attempt to acquire/extend the lock every 1 second
    setInterval(attemptLeadership, 1000);
}

// Used by cluster.js so every heartbeat says whether this container is the leader.
function getRole() {
    return { role: currentLock ? 'leader' : 'follower', leaderSince };
}

// Called on SIGTERM (e.g. ECS scale-in): give up the lock right away so another
// container takes over immediately instead of waiting for the 2s lock to expire.
async function releaseLeadership() {
    shuttingDown = true;
    stopEngine();
    if (currentLock) {
        try { await currentLock.release(); } catch (_) { /* lock may already be gone */ }
        currentLock = null;
        leaderSince = null;
    }
}

module.exports = { startRoleManager, getRole, releaseLeadership };
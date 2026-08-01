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

let isAttempting = false;

async function attemptLeadership() {
    if (isAttempting) return;
    isAttempting = true;

    try {
        if (currentLock) {
            // If we already have the lock, extend it
            currentLock = await currentLock.extend(LOCK_TTL);
            startEngine(); // Ensure engine is running
        } else {
            // Try to acquire the lock
            currentLock = await redlock.acquire([LOCK_KEY], LOCK_TTL);
            startEngine(); // We got it, start computing
        }
    } catch (error) {
        // Failed to acquire lock - someone else is the Leader
        currentLock = null;
        stopEngine(); 
    } finally {
        isAttempting = false;
    }
}

function startRoleManager() {
    // Attempt to acquire/extend the lock every 1 second
    setInterval(attemptLeadership, 1000);
}

module.exports = { startRoleManager };
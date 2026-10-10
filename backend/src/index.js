// index.js
require('dotenv').config();
const { startServer } = require('./websocket.js');
const { startRoleManager, releaseLeadership } = require('./roleManager.js');
const { startCluster, stopCluster } = require('./cluster.js');
const { startSqsWorker } = require('./sqsWorker.js');

console.log("Initializing Fargate Container...");

// 1. Start the HTTP/WebSocket server to accept traffic
startServer();

// 2. Start the Role Manager to determine if this is a Leader or Worker
startRoleManager();

// 3. Start polling SQS to be ready for the load injection
startSqsWorker();

// 4. Publish heartbeats so the dashboard can see this container
startCluster().catch((err) => console.error('Failed to start cluster heartbeat:', err));

// 5. Graceful shutdown (ECS sends SIGTERM on scale-in / deploy): hand over leadership
//    and remove our heartbeat so the cluster view updates immediately.
async function shutdown(signal) {
    console.log(`${signal} received, shutting down...`);
    try {
        await releaseLeadership();
        await stopCluster();
    } finally {
        process.exit(0);
    }
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
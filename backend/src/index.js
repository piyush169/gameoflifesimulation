// index.js
require('dotenv').config();
const { startServer } = require('./websocket.js');
const { startRoleManager } = require('./roleManager.js');
const { startSqsWorker } = require('./sqsWorker.js');

console.log("Initializing Fargate Container...");

// 1. Start the HTTP/WebSocket server to accept traffic
startServer();

// 2. Start the Role Manager to determine if this is a Leader or Worker
startRoleManager();

// 3. Start polling SQS to be ready for the load injection
startSqsWorker();
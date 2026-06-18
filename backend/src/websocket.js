const express = require('express');
const { WebSocketServer } = require('ws');
const { redisSubscriber } = require('./redis.js');

function startServer() {
    const app = express();
    const port = process.env.PORT || 8080;

    // Health check endpoint for ALB
    app.get('/health', (req, res) => res.status(200).send('OK'));

    const server = app.listen(port, () => {
        console.log(`HTTP/WS Server listening on port ${port}`);
    });

    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
        console.log('Browser connected to WebSocket');
        ws.on('error', console.error);
    });

    // Subscribe to the Redis channel
    redisSubscriber.subscribe('gol-frames', (err) => {
        if (err) console.error("Redis Subscribe Error:", err);
    });

    // When the Leader pushes a new frame, broadcast it to all connected browsers
    redisSubscriber.on('message', (channel, message) => {
        if (channel === 'gol-frames') {
            wss.clients.forEach((client) => {
                if (client.readyState === 1) { // WebSocket.OPEN
                    client.send(message);
                }
            });
        }
    });
}

module.exports = { startServer };
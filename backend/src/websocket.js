const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');

const { redisSubscriber, redisClient } = require('./redis.js'); 

const GRID_SIZE = 50;
const lambdaClient = new LambdaClient({ region: process.env.AWS_REGION || 'us-east-1' });

let currentCpu = 15;
let currentQueue = 0;

function generateRandomGrid() {
    const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
    const gun = [
        [5, 1], [5, 2], [6, 1], [6, 2],
        [5, 11], [6, 11], [7, 11], [4, 12], [8, 12], [3, 13], [9, 13], [3, 14], [9, 14], [6, 15], [4, 16], [8, 16], [5, 17], [6, 17], [7, 17], [6, 18],
        [3, 21], [4, 21], [5, 21], [3, 22], [4, 22], [5, 22], [2, 23], [6, 23], [1, 25], [2, 25], [6, 25], [7, 25],
        [3, 35], [4, 35], [3, 36], [4, 36]
    ];
    gun.forEach(([r, c]) => {
        if (r < GRID_SIZE && c < GRID_SIZE) grid[r][c] = 1;
    });
    return grid;
}

function startServer() {
    const app = express();
    const port = process.env.PORT || 8080;

    app.get('/health', (req, res) => res.status(200).send('OK'));

    const server = http.createServer(app);
    const wss = new WebSocketServer({ server });

    
    if (redisSubscriber) {
        redisSubscriber.subscribe('gol-frames').then(() => {
            console.log("Successfully connected to Redis stream: gol-frames");
        }).catch((err) => {
            console.error("Failed to bind Redis subscriber:", err);
        });

        redisSubscriber.on('message', (channel, message) => {
            if (channel === 'gol-frames') {
                wss.clients.forEach(client => {
                    if (client.readyState === 1) {
                        client.send(message); // Forward raw frame to UI
                    }
                });
            }
        });
    }

    // --- 2. WEBSOCKET INCOMING COMMAND HANDLER ---
    wss.on('connection', (ws) => {
        console.log('Client connected to WebSocket.');

        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message);
                
                if (data.type === 'COMMAND') {
                    if (data.action === 'RESET_GRID') {
                        console.log('Resetting grid state in shared storage...');
                        const newGrid = generateRandomGrid();
                        
                        if (redisClient) {
                            await redisClient.set('gol-state', JSON.stringify(newGrid));
                        }
                        
                        wss.clients.forEach(client => {
                            if (client.readyState === 1) client.send(JSON.stringify(newGrid));
                        });

                    } else if (data.action === 'TRIGGER_CHAOS') {
                        console.log('Chaos initiated! Spiking telemetry metrics...');
                        currentCpu = 98;
                        currentQueue = 1000;

                        try {
                            const command = new InvokeCommand({
                                FunctionName: 'gol-chaos-load-injector',
                                InvocationType: 'Event'
                            });
                            await lambdaClient.send(command);
                        } catch (err) {
                            console.error('Failed to trigger Lambda:', err);
                        }
                    }
                }
            } catch (err) {
                console.error('WebSocket message processing error:', err);
            }
        });
    });

    // --- 3. TELEMETRY SYSTEM DECAY LOOP ---
    setInterval(() => {
        currentCpu = Math.max(10 + (Math.random() * 5), currentCpu - 5);
        currentQueue = Math.max(0, currentQueue - 75);

        const telemetryPayload = {
            type: 'TELEMETRY',
            cpu: currentCpu.toFixed(1),
            queueDepth: Math.floor(currentQueue)
        };

        wss.clients.forEach(client => {
            if (client.readyState === 1) {
                client.send(JSON.stringify(telemetryPayload));
            }
        });
    }, 2000);

    server.listen(port, '0.0.0.0', () => {
        console.log(`Server listening on port ${port}`);
    });
}

module.exports = { startServer };
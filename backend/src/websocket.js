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
    const grid = [];
    for (let r = 0; r < GRID_SIZE; r++) {
        const row = [];
        for (let c = 0; c < GRID_SIZE; c++) {
            row.push(Math.random() > 0.90 ? 1 : 0); 
        }
        grid.push(row);
    }
    return grid;
}

function startServer() {
    const app = express();
    const port = process.env.PORT || 8080;

    app.get('/health', (req, res) => res.status(200).send('OK'));

    const server = http.createServer(app);
    const wss = new WebSocketServer({ server });

    
    if (redisSubscriber) {
        redisSubscriber.subscribe('game-updates', (message) => {
            wss.clients.forEach(client => {
                if (client.readyState === 1) {
                    client.send(message); // Forward raw frame to UI
                }
            });
        }).then(() => {
            console.log("Successfully connected to Redis stream: game-updates");
        }).catch((err) => {
            console.error("Failed to bind Redis subscriber:", err);
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
                            await redisClient.set('gol-shared-state', JSON.stringify(newGrid));
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
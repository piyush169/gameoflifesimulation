const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const { redisSubscriber, redisClient } = require('./redis.js');
const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');

const GRID_SIZE = 50;
const lambdaClient = new LambdaClient({ region: process.env.AWS_REGION || 'us-east-1' });

let currentCpu = 15;
let currentQueue = 0;

function generateRandomGrid() {
    const grid = [];
    for (let r = 0; r < GRID_SIZE; r++) {
        const row = [];
        for (let c = 0; c < GRID_SIZE; c++) {
            row.push(Math.random() > 0.75 ? 1 : 0); 
        }
        grid.push(row);
    }
    return grid;
}

function startServer() {
    const app = express();
    const port = process.env.PORT || 8080;

    // 1. Health check endpoint for ALB
    app.get('/health', (req, res) => res.status(200).send('OK'));

    // 2. Attach HTTP server and WebSocket server
    const server = http.createServer(app);
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
        console.log('Client connected to WebSocket.');

        ws.on('message', async (message) => {
            try {
                const data = JSON.parse(message);
                
                if (data.type === 'COMMAND') {
                    if (data.action === 'RESET_GRID') {
                        console.log('Resetting grid...');
                        const newGrid = generateRandomGrid();
                        
                        // Overwrite the shared state in ElastiCache
                        if (redisClient) {
                            await redisClient.set('gol-shared-state', JSON.stringify(newGrid));
                        }
                        
                        // Instantly push the new grid to all viewing clients
                        wss.clients.forEach(client => {
                            if (client.readyState === 1) client.send(JSON.stringify(newGrid));
                        });

                    } else if (data.action === 'TRIGGER_CHAOS') {
                        console.log('Chaos initiated! Spiking metrics and triggering Lambda...');
                        
                        // Spike the internal metrics for the UI graphs
                        currentCpu = 98;
                        currentQueue = 1000;

                        // Fire the actual AWS Lambda function asynchronously
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
                console.error('WebSocket message error:', err);
            }
        });
    });

    // 3. Telemetry Broadcasting Loop (Runs every 2 seconds)
    setInterval(() => {
        // Decay the pressure to simulate system recovery
        // CPU drops by ~5% per tick, floors at a jittery 10-15%
        currentCpu = Math.max(10 + (Math.random() * 5), currentCpu - 5);
        
        // Queue drains by ~75 messages per tick, floors at 0
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

    // 4. Bind to 0.0.0.0 so the AWS Load Balancer can reach it
    server.listen(port, '0.0.0.0', () => {
        console.log(`Server listening on port ${port}`);
    });
}

module.exports = { startServer };
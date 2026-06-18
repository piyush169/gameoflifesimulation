// --- CONFIGURATION ---
// REPLACE THIS with the DNS name of your AWS Application Load Balancer
const ALB_WEBSOCKET_URL = 'ws://YOUR-ALB-DNS-NAME.us-east-1.elb.amazonaws.com';

// --- DOM ELEMENTS ---
const canvas = document.getElementById('golCanvas');
const ctx = canvas.getContext('2d');
const statusText = document.getElementById('status');
const fpsText = document.getElementById('fps');
const populationText = document.getElementById('population');

// --- GRID SETTINGS ---
const GRID_SIZE = 50; 
const CELL_SIZE = canvas.width / GRID_SIZE;

// --- TELEMETRY STATE ---
let lastFrameTime = Date.now();
let frameCount = 0;

// Draw the initial blank grid
ctx.fillStyle = '#000';
ctx.fillRect(0, 0, canvas.width, canvas.height);

function drawGrid(grid) {
    let activePopulation = 0;

    // Clear previous frame
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#3fb950'; // Bright green for alive cells

    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (grid[r][c] === 1) {
                activePopulation++;
                ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
            }
        }
    }

    populationText.innerText = activePopulation;
}

function updateTickRate() {
    frameCount++;
    const now = Date.now();
    const elapsed = now - lastFrameTime;

    // Update FPS calculation every 1 second
    if (elapsed >= 1000) {
        const fps = (frameCount / (elapsed / 1000)).toFixed(1);
        fpsText.innerText = fps;
        
        // Visual indicator of stutter (turns red if dropping below 5 ticks/sec)
        fpsText.style.color = fps < 5.0 ? '#f85149' : '#58a6ff';

        frameCount = 0;
        lastFrameTime = now;
    }
}

function connect() {
    const ws = new WebSocket(ALB_WEBSOCKET_URL);

    ws.onopen = () => {
        statusText.innerText = 'CONNECTED & STREAMING';
        statusText.className = 'status-connected';
    };

    ws.onmessage = (event) => {
        try {
            const grid = JSON.parse(event.data);
            drawGrid(grid);
            updateTickRate();
        } catch (err) {
            console.error("Failed to parse grid data", err);
        }
    };

    ws.onclose = () => {
        statusText.innerText = 'CONNECTION LOST - RECONNECTING...';
        statusText.className = 'status-disconnected';
        fpsText.innerText = '0.0';
        setTimeout(connect, 3000); // Try to reconnect after 3 seconds
    };

    ws.onerror = (err) => {
        console.error("WebSocket Error: ", err);
    };
}

// Start connection
connect();
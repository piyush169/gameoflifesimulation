// --- CONFIGURATION ---
// REPLACE THIS with the DNS name of your AWS Application Load Balancer
const ALB_WEBSOCKET_URL = 'ws://gol-backend-alb-626509893.us-east-1.elb.amazonaws.com';

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

let ws;
function connect() {

    ws = new WebSocket(ALB_WEBSOCKET_URL);

    ws.onopen = () => {
        statusText.innerText = 'CONNECTED & STREAMING';
        statusText.className = 'status-connected';
    };

    ws.onmessage = (event) => {
        try {
            const payload = JSON.parse(event.data);
        
             // Handle Telemetry Metrics (CPU & SQS)
            if (payload.type === 'TELEMETRY') {
                updateCharts(payload.cpu, payload.queueDepth);
            } 
            // Handle Game Grid Data
            else if (Array.isArray(payload)) {
                drawGrid(payload);
                updateTickRate();
            }
        } catch (err) {
          console.error("Failed to parse incoming stream", err);
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

document.getElementById('resetBtn').addEventListener('click', () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        // Send a command to the backend to re-seed the grid
        ws.send(JSON.stringify({ type: 'COMMAND', action: 'RESET_GRID' }));
    }
});

document.getElementById('chaosBtn').addEventListener('click', () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
        // Send a command to the backend to trigger the Lambda
        ws.send(JSON.stringify({ type: 'COMMAND', action: 'TRIGGER_CHAOS' }));
    }
});

// --- TELEMETRY GRAPHS (Chart.js) ---
const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 }, // Turn off animation for real-time snappy updates
    scales: {
        x: { display: false }, // Hide X axis labels for a cleaner look
        y: { beginAtZero: true, grid: { color: '#30363d' } }
    },
    plugins: { legend: { labels: { color: '#8b949e' } } }
};

// 1. CPU Pressure Chart
const cpuCtx = document.getElementById('cpuChart').getContext('2d');
const cpuChart = new Chart(cpuCtx, {
    type: 'line',
    data: {
        labels: Array(20).fill(''), // Hold last 20 data points
        datasets: [{
            label: 'Cluster CPU %',
            data: Array(20).fill(0),
            borderColor: '#f2cc60',
            tension: 0.3
        }]
    },
    options: { ...commonChartOptions, scales: { y: { max: 100 } } }
});

// 2. SQS Queue Depth Chart
const queueCtx = document.getElementById('queueChart').getContext('2d');
const queueChart = new Chart(queueCtx, {
    type: 'line',
    data: {
        labels: Array(20).fill(''),
        datasets: [{
            label: 'SQS Backlog',
            data: Array(20).fill(0),
            borderColor: '#f85149',
            tension: 0.3
        }]
    },
    options: commonChartOptions
});

// Function to update charts when telemetry arrives
function updateCharts(cpuVal, queueVal) {
    // Push new data and remove oldest
    cpuChart.data.datasets[0].data.push(cpuVal);
    cpuChart.data.datasets[0].data.shift();
    cpuChart.update();

    queueChart.data.datasets[0].data.push(queueVal);
    queueChart.data.datasets[0].data.shift();
    queueChart.update();
}

// Start connection
connect();
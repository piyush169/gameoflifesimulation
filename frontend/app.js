// --- CONFIGURATION ---
// REPLACE THIS with the DNS name of your AWS Application Load Balancer
const ALB_WEBSOCKET_URL = 'ws://gol-backend-alb-626509893.us-east-1.elb.amazonaws.com';

// When the page is opened from localhost (e.g. docker-compose), talk to a local backend instead.
// You can also override it with ?ws=ws://host:port in the page URL.
const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
const WS_URL = new URLSearchParams(location.search).get('ws')
    || (isLocal ? 'ws://localhost:8080' : ALB_WEBSOCKET_URL);

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

    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
        statusText.innerText = 'CONNECTED & STREAMING';
        statusText.className = 'status-connected';
    };

    ws.onmessage = (event) => {
        try {
            const payload = JSON.parse(event.data);
        
            // Handle the cluster view: every container's heartbeat + shared queue depth
            if (payload.type === 'CLUSTER') {
                renderCluster(payload);
                updateChartsFromCluster(payload);
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
        clearCluster();
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
            label: 'Average container CPU % (of each limit)',
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

// Feed the charts from the cluster view. Throttled to one point per 2s so the
// 20-point window keeps showing ~40s of history, as before.
let lastChartPush = 0;
function updateChartsFromCluster(cluster) {
    const now = Date.now();
    if (now - lastChartPush < 2000) return;
    lastChartPush = now;

    const fresh = cluster.nodes.filter((n) => n.status === 'ok');
    const avgCpu = fresh.length ? fresh.reduce((sum, n) => sum + n.cpuPct, 0) / fresh.length : 0;
    // queueDepth is null when no leader has published it recently: plot a gap, not a false zero.
    updateCharts(Math.min(100, avgCpu), cluster.queueDepth);
}

// --- CLUSTER VIEW ---
const nodeGrid = document.getElementById('nodeGrid');
const nodeCountText = document.getElementById('nodeCount');
const leaderNameText = document.getElementById('leaderName');
const clusterAlert = document.getElementById('clusterAlert');
const cards = new Map(); // node id -> { el, refs }

const TICK_BUDGET_MS = 100;

function fmtDuration(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    if (s < 60) return `${s}s`;
    if (s < 3600) return `${Math.floor(s / 60)}m ${s % 60}s`;
    return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
}

// Colour a value by thresholds: below warn = green, below bad = amber, else red.
function level(value, warn, bad) {
    return value < warn ? 'ok' : value < bad ? 'warn' : 'bad';
}

function makeRow(label) {
    const row = document.createElement('div');
    row.className = 'node-row';
    const k = document.createElement('span'); k.className = 'k'; k.textContent = label;
    const v = document.createElement('span'); v.className = 'v';
    row.append(k, v);
    return { row, v };
}

function makeBarRow(label) {
    const wrap = document.createElement('div');
    wrap.style.marginTop = '6px';
    const { row, v } = makeRow(label);
    row.style.marginTop = '0';
    const bar = document.createElement('div'); bar.className = 'bar';
    const fill = document.createElement('i');
    bar.append(fill);
    wrap.append(row, bar);
    return { wrap, v, fill };
}

function createCard() {
    const el = document.createElement('article');
    el.className = 'node-card';
    el.tabIndex = 0;

    const head = document.createElement('div'); head.className = 'node-head';
    const id = document.createElement('span'); id.className = 'node-id';
    const role = document.createElement('span'); role.className = 'node-role';
    head.append(id, role);

    const sub = document.createElement('div'); sub.className = 'node-sub';

    const cpu = makeBarRow('CPU');
    const mem = makeBarRow('Memory');
    const lag = makeRow('Event-loop lag p99');
    const tick = makeRow('Tick time');
    const msgs = makeRow('Chaos messages');
    const clients = makeRow('Browsers connected');
    const beat = makeRow('Last heartbeat');

    el.append(head, sub, cpu.wrap, mem.wrap, lag.row, tick.row, msgs.row, clients.row, beat.row);
    return { el, refs: { id, role, sub, cpu, mem, lag, tick, msgs, clients, beat } };
}

function setLevel(node, lvl) {
    node.classList.remove('ok-text', 'warn-text', 'bad-text');
    node.classList.add(`${lvl}-text`);
}

function updateCard({ el, refs }, n, serverTime, youId) {
    el.classList.toggle('leader', n.role === 'leader');
    el.classList.toggle('stale', n.status === 'stale');

    refs.id.textContent = n.shortId;
    refs.role.textContent = n.status === 'stale' ? 'not responding' : n.role;

    const leaderFor = n.role === 'leader' && n.leaderSince ? `, leader for ${fmtDuration(serverTime - n.leaderSince)}` : '';
    refs.sub.textContent = `${n.az}, up ${fmtDuration(serverTime - n.startedAt)}${leaderFor}${n.id === youId ? ', serving you' : ''}`;

    refs.cpu.v.textContent = `${n.cpuPct.toFixed(1)}%`;
    refs.cpu.fill.style.width = `${Math.min(100, n.cpuPct)}%`;
    refs.cpu.fill.className = level(n.cpuPct, 60, 85) === 'ok' ? '' : level(n.cpuPct, 60, 85);

    refs.mem.v.textContent = `${n.memMb.toFixed(0)} MB (${n.memPct.toFixed(0)}%)`;
    refs.mem.fill.style.width = `${Math.min(100, n.memPct)}%`;
    refs.mem.fill.className = level(n.memPct, 70, 90) === 'ok' ? '' : level(n.memPct, 70, 90);

    refs.lag.v.textContent = `${n.loopLagP99Ms.toFixed(1)} ms`;
    setLevel(refs.lag.v, level(n.loopLagP99Ms, 20, 100));

    // Only the leader computes ticks; followers show a dash.
    if (n.ticksPerSec > 0 || n.role === 'leader') {
        refs.tick.v.textContent = `${n.tickAvgMs.toFixed(1)} ms of ${TICK_BUDGET_MS}`;
        setLevel(refs.tick.v, level(n.tickAvgMs, TICK_BUDGET_MS * 0.5, TICK_BUDGET_MS));
    } else {
        refs.tick.v.textContent = '-';
        setLevel(refs.tick.v, 'ok');
    }

    refs.msgs.v.textContent = `${n.msgPerSec.toFixed(1)}/s`;
    refs.clients.v.textContent = n.clients;

    refs.beat.v.textContent = `${(n.ageMs / 1000).toFixed(1)}s ago`;
    setLevel(refs.beat.v, n.status === 'stale' ? 'warn' : 'ok');
}

function renderCluster(cluster) {
    const { nodes, serverTime, you, leaderIds } = cluster;

    nodeGrid.querySelector('.node-empty')?.remove();

    // Add or update a card for every node; cards keep their DOM element so nothing flickers.
    const seen = new Set();
    nodes.forEach((n, index) => {
        seen.add(n.id);
        let card = cards.get(n.id);
        if (!card) {
            card = createCard();
            cards.set(n.id, card);
        }
        updateCard(card, n, serverTime, you);
        // Keep DOM order equal to the sorted order from the server (leader first).
        if (nodeGrid.children[index] !== card.el) nodeGrid.insertBefore(card.el, nodeGrid.children[index] || null);
    });

    // Remove cards for containers that disappeared.
    for (const [id, card] of cards) {
        if (!seen.has(id)) { card.el.remove(); cards.delete(id); }
    }
    if (nodes.length === 0) showEmpty('No container is reporting. Check that the backend is running and can reach Redis.');

    nodeCountText.textContent = nodes.length;
    const leader = nodes.find((n) => n.id === leaderIds[0]);
    leaderNameText.textContent = leader ? leader.shortId : 'none';

    // Say plainly when leadership isn't a clean "exactly one".
    const stale = nodes.filter((n) => n.status === 'stale').length;
    if (nodes.length > 0 && leaderIds.length === 0) {
        setAlert('No leader right now. An election should finish within a couple of seconds.', true);
    } else if (leaderIds.length > 1) {
        setAlert(`${leaderIds.length} containers think they are the leader. This should only last during a handover.`, true);
    } else if (stale > 0) {
        setAlert(`${stale} container${stale > 1 ? 's are' : ' is'} not sending heartbeats on time. Its event loop may be blocked.`, false);
    } else {
        setAlert('', false);
    }
}

function showEmpty(text) {
    if (nodeGrid.querySelector('.node-empty')) return;
    const p = document.createElement('p');
    p.className = 'node-empty';
    p.textContent = text;
    nodeGrid.append(p);
}

function setAlert(text, isBad) {
    clusterAlert.hidden = !text;
    clusterAlert.textContent = text;
    clusterAlert.classList.toggle('bad', isBad);
}

function clearCluster() {
    for (const card of cards.values()) card.el.remove();
    cards.clear();
    nodeCountText.textContent = '0';
    leaderNameText.textContent = 'none';
    setAlert('', false);
    showEmpty('Disconnected from the backend. Reconnecting...');
}

// Start connection
connect();
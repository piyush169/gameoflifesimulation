const { redisClient } = require('./redis.js');

const GRID_SIZE = 50;
const TICK_RATE_MS = 100; // Aiming for 10 FPS
let engineInterval = null;

// Helper to generate a random starting grid
function createRandomGrid() {
    return Array.from({ length: GRID_SIZE }, () => 
        Array.from({ length: GRID_SIZE }, () => (Math.random() > 0.7 ? 1 : 0))
    );
}

//  Conway's Game of Life logic
function computeNextGeneration(grid) {
    const nextGrid = grid.map(arr => [...arr]);
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            let neighbors = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i === 0 && j === 0) continue;
                    const nr = r + i;
                    const nc = c + j;
                    if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
                        neighbors += grid[nr][nc];
                    }
                }
            }
            if (grid[r][c] === 1 && (neighbors < 2 || neighbors > 3)) nextGrid[r][c] = 0;
            else if (grid[r][c] === 0 && neighbors === 3) nextGrid[r][c] = 1;
        }
    }
    return nextGrid;
}

async function tick() {
    try {
        let rawGrid = await redisClient.get('gol-state');
        let grid = rawGrid ? JSON.parse(rawGrid) : createRandomGrid();

        const nextGrid = computeNextGeneration(grid);
        const gridString = JSON.stringify(nextGrid);

        // Save state and broadcast
        await redisClient.set('gol-state', gridString);
        await redisClient.publish('gol-frames', gridString);
    } catch (err) {
        console.error("Engine Tick Error:", err);
    }
}

function startEngine() {
    if (!engineInterval) {
        console.log("Acquired Leadership. Starting Game of Life Engine...");
        engineInterval = setInterval(tick, TICK_RATE_MS);
    }
}

function stopEngine() {
    if (engineInterval) {
        console.log("Lost Leadership. Stopping Game of Life Engine...");
        clearInterval(engineInterval);
        engineInterval = null;
    }
}

module.exports = { startEngine, stopEngine };
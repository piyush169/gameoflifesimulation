//engine.js
const { redisClient } = require('./redis.js');

const GRID_SIZE = 50;
const TICK_RATE_MS = 100; // Aiming for 10 FPS
let engineInterval = null;

function createRandomGrid() {
    const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
    //gosper glider gun pattern
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
const zeroes = require('zeroes');

const serial = 9110;

function createGrid(serial: number) {
    const grid: number[][] = [];
    for (let i = 0; i < 300; i++) {
        grid[i] = Array(300).fill(0);
    }
    for (let x = 0; x < 300; x++) {
        for (let y = 0; y < 300; y++) {
            grid[x][y] = getPowerLevel(serial, x + 1, y + 1);
        }
    }
    return grid;
}

const grid = createGrid(9110);

function getPowerLevel(serial: number, x: number, y: number) {
    const rackId = x + 10;
    let powerLevel = rackId * y;
    powerLevel += serial;
    powerLevel *= rackId;
    let hundredsDigit = ('' + powerLevel).split('').reverse()[2];
    return (+hundredsDigit) - 5;
}

function getGridPowerLevel(grid: number[][], x: number, y: number, size = 3) {
    let totalLevel = 0;
    for (let xIter = 0; xIter < size; xIter++) {
        for (let yIter = 0; yIter < size; yIter++) {
            totalLevel += grid[x + xIter - 1][y + yIter - 1];
        }
    }
    return totalLevel;
}

let highestPowerLevel = { x: -1, y: -1, totalLevel: 0, size: 0 };
for (let x = 1; x <= 297; x++) {
    for (let y = 1; y <= 297; y++) {
        const totalLevel = getGridPowerLevel(grid, x, y);
        if (totalLevel > highestPowerLevel.totalLevel) {
            highestPowerLevel = { x, y, totalLevel, size: 3 };
        }
    }
}

console.log(`Solution pt1: ${highestPowerLevel.x},${highestPowerLevel.y}`);

highestPowerLevel = { x: -1, y: -1, totalLevel: 0, size: 0 };

for (let size = 1; size <= 300; size++) {
    if (size % 10 == 0) { console.log(`Checking size ${size}`); }
    for (let x = 1; x <= 300 - size; x++) {
        for (let y = 1; y <= 300 - size; y++) {
            const totalLevel = getGridPowerLevel(grid, x, y, size);
            if (totalLevel > highestPowerLevel.totalLevel) {
                highestPowerLevel = { x, y, size, totalLevel };
                console.log(highestPowerLevel);
            }
        }
    }
}

console.log(`Solution pt2}`, highestPowerLevel);

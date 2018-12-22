import { Array2d } from '../helpers';

enum RegionType {
    Rocky = 0,
    Narrow = 1,
    Wet = 2,
    Target = 99,
    Mouth = -1
}

type Position = { x: number, y: number };

type Region = { pos: Position, type: RegionType };

const depth = 11739;
const target: Position = { x: 11, y: 718 };

const rawMap = new Array2d<number>(target.x + 50, target.y + 50);
for (let x = 0; x < rawMap.width; x++) {
    for (let y = 0; y < rawMap.height; y++) {
        let erosionLevel: number;
        if ((x == 0 && y == 0) || (x == target.x && y == target.y)) {
            erosionLevel = (0 + depth) % 20183;
        } else if (y == 0) {
            erosionLevel = ((x * 16807) + depth) % 20183;
        } else if (x == 0) {
            erosionLevel = ((y * 48271) + depth) % 20183;
        } else {
            erosionLevel = (rawMap.get(x - 1, y) * rawMap.get(x, y - 1) + depth) % 20183;
        }
        rawMap.set(x, y, erosionLevel);
    }
}

function calculateRisk(map: Array2d<number>) {
    let risk = 0;
    for (let y = 0; y <= target.y; y++) {
        for (let x = 0; x <= target.x; x++) {
            risk += map.get(x, y) % 3;
        }
    }
    return risk;
}

console.log(`Solution pt1 : ${calculateRisk(rawMap)}`);

const map = new Array2d<Region>(rawMap.width, rawMap.height);
for (let y = 0; y <= rawMap.height; y++) {
    for (let x = 0; x <= rawMap.width; x++) {
        map.set(x, y, { type: rawMap.get(x, y) % 3, pos: { x, y } })
    }
}

map.get(target.x, target.y).type = RegionType.Rocky;
map.get(0, 0).type = RegionType.Mouth;

enum Tool {
    Torch = 0,
    ClimbingGear = 1,
    None = 2
}

function getAdjacent(x: number, y: number) {
    return [map.get(x, y - 1), map.get(x - 1, y), map.get(x + 1, y), map.get(x, y + 1)].filter(
        n => n !== undefined
    );
}

const allowedTools = new Map<RegionType, Tool[]>();
allowedTools.set(RegionType.Rocky, [Tool.ClimbingGear, Tool.Torch]);
allowedTools.set(RegionType.Wet, [Tool.ClimbingGear, Tool.None]);
allowedTools.set(RegionType.Narrow, [Tool.Torch, Tool.None]);
allowedTools.set(RegionType.Target, [Tool.ClimbingGear, Tool.Torch]);
allowedTools.set(RegionType.Mouth, [Tool.Torch]);

const Graph = require('node-dijkstra')

const route = new Graph();
for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
        const currentAllowedTools = allowedTools.get(map.get(x, y).type);
        const adj = getAdjacent(x, y);
        currentAllowedTools.forEach((currentTool) => {
            const edges = {};
            adj.forEach((adjacentRegion) => {
                allowedTools.get(adjacentRegion.type)
                    .filter(atool => currentAllowedTools.includes(atool)).forEach((atool) => {
                        edges[`${adjacentRegion.pos.x}:${adjacentRegion.pos.y}:${atool}`] = currentTool === atool ? 1 : 7;
                    });
            });
            route.addNode(`${x}:${y}:${currentTool}`, edges);
        });
    }
}
console.log('Solution pt2: ', route.path(`${0}:${0}:${Tool.Torch}`, `${target.x}:${target.y}:${Tool.Torch}`, { trim: true, cost: true }).cost + 7 + 2);

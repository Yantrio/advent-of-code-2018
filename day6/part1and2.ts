import { input } from './input.json';

type Point = { x: number, y: number }

const size = 500;
const map = Array.from(Array(size), () => Array(size));
let safeAreaSize = 0;

function iterateMap(callback: (x, y) => any) { // i hate writing nested forloops over and over
    for (let x = 0; x < map.length; x++) {
        for (let y = 0; y < map.length; y++) {
            callback(x, y);
        }
    }
}

function getDistance(a: Point, b: Point): number {
    return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
}

iterateMap((x, y) => {
    const distances: number[] = input.map((c) => getDistance({ x: c[0], y: c[1] }, { x, y })); //stupid type inference not working here, have to declare as number[] ¬_¬
    const shortest = Math.min(...distances);
    if (distances.filter((d) => d === shortest).length === 1) { // closest should nots be tied in distance
        map[x][y] = distances.indexOf(shortest);
    }
    if (distances.reduce((a, b) => a + b, 0) < 10000) {
        safeAreaSize++;
    }
});

// if a co-ordinate is the cloest coordinate to a position on the edge of the map
/// then it will be infinate, we can (and should) ignore these
const ignoreThese = new Set(Array.from(Array(size), (_, idx) => [
    map[0][idx],
    map[idx][0],
    map[idx][size - 1],
    map[size - 1][idx]
]).reduce((a, b) => a.concat(b), []));

// calculate the sizes
const regionSizes = Array(input.length).fill(0);
iterateMap((x, y) => {
    if (!ignoreThese.has(map[x][y])) {
        regionSizes[map[x][y]]++;
    }
});

console.log(`Solution Part 1 ${Math.max(...regionSizes)}`);
console.log(`Solution Part 2 ${safeAreaSize}`);

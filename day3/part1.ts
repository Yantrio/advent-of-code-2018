import { claims } from './input.json';
import { Claim } from './claim.js';

function applyToFabric(fabric: number[][], claim: Claim) {
    for (let x = claim.x - 1; x < claim.x - 1 + claim.width; x++) {
        for (let y = claim.y - 1; y < claim.y - 1 + claim.height; y++) {
            fabric[x][y]++;
        }
    }
}

function howManyHave2Claims(fabric: number[][]) {
    return fabric.map((row) => row.filter((claimed) => claimed >= 2).length).reduce((a, b) => { return a + b; }, 0);
}

const parsedClaims = (claims as string[]).map(Claim.fromInputString);

const mainFab: number[][] = Array.from(Array(1000), (_) => Array(1000).fill(0));
parsedClaims.forEach((c) => applyToFabric(mainFab, c));
console.log(`Solution: ${howManyHave2Claims(mainFab)}`);


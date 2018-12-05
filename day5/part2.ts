import * as fs from 'fs';
import * as path from 'path';
import { Polymer } from './polymer';

function getSolution(polymer: Polymer) {
    let finished = false;
    while (!finished) {
        const deleted = polymer.collapseDown();
        if (deleted === 0) {
            finished = true;
        }
    }
    return polymer.toString().length
}

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString();
const poly = new Polymer(input);
const unitTypes = Array.from(new Set(poly.units.map((u) => u.type)));


let results = unitTypes.map((u) => {
    const testPoly = new Polymer(input);
    testPoly.removeType(u);
    return {
        u,
        finalLength: getSolution(testPoly)
    }
})

console.log(`Solution: ${Math.min(...results.map((r) => r.finalLength))}`);

console.log();
import { getSolution, input } from './common';
import { Polymer } from './polymer';

let results = Array.from(new Set(new Polymer(input).units.map((u) => u.type))).map((u) => {
    const testPoly = new Polymer(input);
    testPoly.removeType(u);
    return {
        u,
        finalLength: getSolution(testPoly)
    }
});

console.log(`Solution: ${Math.min(...results.map((r) => r.finalLength))}`);

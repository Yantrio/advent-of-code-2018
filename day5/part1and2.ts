import * as fs from 'fs';
import * as path from 'path';
import { performance } from 'perf_hooks';

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString();

export function react(polymer: string) {
    let i = 0;
    let units = polymer.split('');
    while (i + 1 < units.length) {
        if (i < 0) { i = 0; }
        if ((units[i].charCodeAt(0) ^ units[i + 1].charCodeAt(0)) === 32) {
            units.splice(i, 2); i -= 1;
        } else { i++; }
    }
    return units.join('');
}

let start = performance.now();
console.log(`Part 1 Solution : ${react(input).length}`);
let end = performance.now();
console.log(`Solved in ${end - start}ms`);

start = performance.now();
let result = Math.min(...'abcdefghijklmnopqrstuvwxyz'
    .split('') //foreach letter of the alphabet
    .map((u) => input.split('').filter((unit) => unit.toLowerCase() !== u).join('')) //remove the letter from input
    .map(react) //solve
    .map((u) => u.length) //get length and spread map into Math.min
);

console.log(`Part 2 Solution: ${result}`);
end = performance.now();
console.log(`Solved in ${end - start}ms`);

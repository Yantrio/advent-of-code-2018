import * as fs from 'fs';
import * as path from 'path';

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString();

export function react(polymer: string) {
    let i = -0;
    let units = polymer.split('');
    while (units[i + 1] !== undefined) {
        if (i < 0) { i = 0; }
        if ((units[i].charCodeAt(0) ^ units[i + 1].charCodeAt(0)) === 32) {
            units.splice(i, 2);
            i -= 2;
        }
        i++;
    }
    return units.join('');;
}

console.log(`Part 1 Solution : ${react(input).length}`);

let result = Math.min(...'abcdefghijklmnopqrstuvwxyz'
    .split('') //foreach letter of the alphabet
    .map((u) => input.split('').filter((unit) => unit.toLowerCase() !== u).join('')) //remove the letter from input
    .map(react) //solve
    .map((u) => u.length) //get length and spread map into Math.min
);

console.log(`Part 2 Solution: ${result}`);

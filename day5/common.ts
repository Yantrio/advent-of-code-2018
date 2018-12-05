import * as fs from 'fs';
import * as path from 'path';
import { Polymer } from './polymer';

export function getSolution(polymer: Polymer) {
    let finished = false;
    while (!finished) {
        const deleted = polymer.collapseDown();
        if (deleted === 0) {
            finished = true;
        }
    }
    return polymer.toString().length
}

export const input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString();
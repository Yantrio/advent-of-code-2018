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
import { input } from './input.json';

let current = 0;
let seenItems = new Set<number>();

while (!input.some((c: number) => {
    current += c;
    if (seenItems.has(current)) {
        return true;
    }
    seenItems.add(current);
})) { }

console.log(`Solution: ${current}`);
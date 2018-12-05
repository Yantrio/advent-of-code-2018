import * as fs from 'fs';
import * as path from 'path';
import { Polymer } from './polymer';
import { getSolution } from './common';

const input = fs.readFileSync(path.resolve(__dirname, 'input.txt')).toString();

const poly = new Polymer(input);

console.log(`Solution: ${getSolution(poly)}`);
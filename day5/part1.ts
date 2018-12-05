import { Polymer } from './polymer';
import { getSolution, input } from './common';

const poly = new Polymer(input);
console.log(`Solution: ${getSolution(poly)}`);
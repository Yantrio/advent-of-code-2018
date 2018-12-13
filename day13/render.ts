import { Cart, MapNode } from './types';
import chalk from 'chalk';

export function renderMap(nodes: MapNode[][], carts: Cart[]) {
    const width = nodes.length;
    const height = nodes[0].length;
    const toRender: string[][] = [];
    for (let x = 0; x < height; x++) {
        toRender.push([]);
        for (let y = 0; y < width; y++) {
            toRender[x].push('.');
        }
    }
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const cartAtNode = carts.find(c => c.position.x === x && c.position.y === y);
            if (cartAtNode) {
                toRender[y][x] = chalk.bgBlackBright(cartAtNode.type);
            } else if (nodes[x][y] !== undefined) {
                toRender[y][x] = nodes[x][y].type
            }
        }
    }
    toRender.forEach((r) => {
        console.log(r.join(''));
    });
}
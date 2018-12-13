import chalk from 'chalk';
import * as fs from 'fs';
import { Cart, CartDirection, MapNode, TrackType } from './types';
import { parseMap } from './parser';
import { renderMap } from './render';

function tick(nodes: MapNode[][], carts: Cart[]) {
    const sortedCarts: Cart[] = [];
    let crashedCarts: Cart[] = [];
    for (let y = 0; y < nodes[0].length; y++) {
        for (let x = 0; x < nodes.length; x++) {
            const cartAtNode = carts.find(c => c.node == nodes[x][y]);
            if (cartAtNode) {
                sortedCarts.push(cartAtNode);
            }
        }
    }
    sortedCarts.forEach((cart: Cart) => {
        switch (cart.type) {
            case CartDirection.Down:
                switch (cart.node.type) {
                    case TrackType.Intersection: {
                        switch (cart.inter++ % 3) {
                            case 0:
                                //turn left
                                cart.position.x++; cart.type = CartDirection.Right;
                                break;
                            case 1:
                                //go straight
                                cart.position.y++;
                                break;
                            case 2:
                                //turn right
                                cart.position.x--; cart.type = CartDirection.Left;
                                break;
                        }
                        break;
                    }
                    case TrackType.Curve1: cart.position.x--; cart.type = CartDirection.Left; break;
                    case TrackType.Curve2: cart.position.x++; cart.type = CartDirection.Right; break;
                    default: cart.position.y++; break;
                }
                break;
            case CartDirection.Up:
                switch (cart.node.type) {
                    case TrackType.Intersection: {
                        switch (cart.inter++ % 3) {
                            case 0:
                                //turn left
                                cart.position.x--; cart.type = CartDirection.Left;
                                break;
                            case 1:
                                //go straight
                                cart.position.y--;
                                break;
                            case 2:
                                //turn right
                                cart.position.x++; cart.type = CartDirection.Right;
                                break;
                        }
                        break;
                    }
                    case TrackType.Curve1: cart.position.x++; cart.type = CartDirection.Right; break;
                    case TrackType.Curve2: cart.position.x--; cart.type = CartDirection.Left; break;
                    default: cart.position.y--; break;
                }
                break;
            case CartDirection.Left:
                switch (cart.node.type) {
                    case TrackType.Intersection: {
                        switch (cart.inter++ % 3) {
                            case 0:
                                //turn left
                                cart.position.y++; cart.type = CartDirection.Down;
                                break;
                            case 1:
                                //go straight
                                cart.position.x--;
                                break;
                            case 2:
                                //turn right
                                cart.position.y--; cart.type = CartDirection.Up;
                                break;
                        }
                        break;
                    }
                    case TrackType.Curve1: cart.position.y++; cart.type = CartDirection.Down; break;
                    case TrackType.Curve2: cart.position.y--; cart.type = CartDirection.Up; break;
                    default: cart.position.x--; break;
                }
                break;
            case CartDirection.Right:
                switch (cart.node.type) {
                    case TrackType.Intersection: {
                        switch (cart.inter++ % 3) {
                            case 0:
                                //turn left
                                cart.position.y--; cart.type = CartDirection.Up;
                                break;
                            case 1:
                                //go straight
                                cart.position.x++;
                                break;
                            case 2:
                                //turn right
                                cart.position.y++; cart.type = CartDirection.Down;
                                break;
                        }
                        break;
                    }
                    case TrackType.Curve1: cart.position.y--; cart.type = CartDirection.Up; break;
                    case TrackType.Curve2: cart.position.y++; cart.type = CartDirection.Down; break;
                    default: cart.position.x++; break;
                }
                break;
        }
        cart.node = nodes[cart.position.x][cart.position.y];

        const crash = getCrashed(carts);
        if (crash.length > 1) {
            crash.forEach((c) => crashedCarts.push(c));
        }
    });
    return { nodes, carts, crashedCarts };
}

const getCrashed = (carts: Cart[]) => carts.filter((c) =>
    carts.filter((cart) => c.position.x === cart.position.x && c.position.y === cart.position.y).length > 1);

const input = fs.readFileSync('input.txt', 'UTF8');
const rawMap = input.split(/\n/).map((l) => l.split(''));
let { nodes, carts } = parseMap(rawMap);

const visualize = false;

if (visualize) {
    renderMap(nodes, carts);
}

let iter = 0;
let crashes: { x: number, y: number }[] = [];
while (true) {
    var startTime = new Date().getTime();
    let { nodes: newNodes, carts: newCarts, crashedCarts } = tick(nodes, carts);
    nodes = newNodes;
    carts = newCarts.filter((c) => !crashedCarts.find((crashed) => crashed.id === c.id));
    if (crashedCarts.length > 1) {
        crashes.push(crashedCarts[0].position);
        if (carts.length === 1) {
            console.log(`Last cart is at ${JSON.stringify(carts[0].position)}`);
            break;
        }
    }

    iter++;
    if (visualize) {
        console.clear();
        console.log(`-------- ${iter} --------`);
        renderMap(nodes, carts);
        while (new Date().getTime() < startTime + 100) { }; //sleep
    } else if (iter % 100 == 0) {
        console.clear();
        console.log(`-------- Iteration ${iter} --------`);
        console.log(`Carts remaining: ${carts.length}`);
        console.log(`---`);
        crashes.forEach((c) => console.log(`Crash at ${c.x},${c.y}`));

    }
}

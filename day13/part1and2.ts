import * as fs from 'fs'

import chalk from 'chalk';

enum TrackType {
    Vertical = '|',
    Horizontal = '-',
    Curve1 = '/',
    Curve2 = '\\',
    Intersection = '+'
}

enum CartDirection {
    Up = '^',
    Down = 'v',
    Left = '<',
    Right = '>'
}

type Cart = {
    position: { x: number, y: number }
    node: Node
    direction: CartDirection,
    intersectionHitCount: number;
    id: number
}

type Node = {
    position: { x: number, y: number }
    type: TrackType
}

function parseMap(rawMap: string[][]) {
    const carts: Cart[] = [];

    const width = Math.max(...rawMap.map((r) => r.length));
    const height = rawMap.length;

    const nodes: Node[][] = Array.from(Array(width), () => Array(height).fill('').map(() => undefined));

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let { node, cart } = parseNode(rawMap[y][x], x, y);
            if (node) {
                nodes[x][y] = node;
            }
            if (cart) {
                cart.id = carts.length;
                carts.push(cart);
            }
        }
    }
    return { nodes, carts };
}

function parseNode(rawNode: string, x: number, y: number) {
    let trackType: TrackType;
    let cartDirection: CartDirection;

    switch (rawNode) {
        //track
        case '|': { trackType = TrackType.Vertical; break; }
        case '-': { trackType = TrackType.Horizontal; break; }
        case '/': { trackType = TrackType.Curve1; break; }
        case '\\': { trackType = TrackType.Curve2; break; }
        case '+': { trackType = TrackType.Intersection; break; }
        //cart
        case 'v': { trackType = TrackType.Vertical; cartDirection = CartDirection.Down; break; }
        case '^': { trackType = TrackType.Vertical; cartDirection = CartDirection.Up; break; }
        case '>': { trackType = TrackType.Horizontal; cartDirection = CartDirection.Right; break; }
        case '<': { trackType = TrackType.Horizontal; cartDirection = CartDirection.Left; break; }
    }
    let cart: Cart;
    let node: Node;
    if (trackType !== undefined) {
        node = { position: { x, y }, type: trackType }
    }
    if (cartDirection !== undefined) {
        cart = { position: { x, y }, node, direction: cartDirection, intersectionHitCount: 0 } as any;
    }

    return { node, cart }
}

function tick(nodes: Node[][], carts: Cart[]) {
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
    sortedCarts.forEach((cart) => {
        switch (cart.direction) {
            case CartDirection.Down:
                switch (cart.node.type) {
                    case TrackType.Intersection: {
                        switch (cart.intersectionHitCount++ % 3) {
                            case 0:
                                //turn left
                                cart.position.x++; cart.direction = CartDirection.Right;
                                break;
                            case 1:
                                //go straight
                                cart.position.y++;
                                break;
                            case 2:
                                //turn right
                                cart.position.x--; cart.direction = CartDirection.Left;
                                break;
                        }
                        break;
                    }
                    case TrackType.Curve1: cart.position.x--; cart.direction = CartDirection.Left; break;
                    case TrackType.Curve2: cart.position.x++; cart.direction = CartDirection.Right; break;
                    default: cart.position.y++; break;
                }
                break;
            case CartDirection.Up:
                switch (cart.node.type) {
                    case TrackType.Intersection: {
                        switch (cart.intersectionHitCount++ % 3) {
                            case 0:
                                //turn left
                                cart.position.x--; cart.direction = CartDirection.Left;
                                break;
                            case 1:
                                //go straight
                                cart.position.y--;
                                break;
                            case 2:
                                //turn right
                                cart.position.x++; cart.direction = CartDirection.Right;
                                break;
                        }
                        break;
                    }
                    case TrackType.Curve1: cart.position.x++; cart.direction = CartDirection.Right; break;
                    case TrackType.Curve2: cart.position.x--; cart.direction = CartDirection.Left; break;
                    default: cart.position.y--; break;
                }
                break;
            case CartDirection.Left:
                switch (cart.node.type) {
                    case TrackType.Intersection: {
                        switch (cart.intersectionHitCount++ % 3) {
                            case 0:
                                //turn left
                                cart.position.y++; cart.direction = CartDirection.Down;
                                break;
                            case 1:
                                //go straight
                                cart.position.x--;
                                break;
                            case 2:
                                //turn right
                                cart.position.y--; cart.direction = CartDirection.Up;
                                break;
                        }
                        break;
                    }
                    case TrackType.Curve1: cart.position.y++; cart.direction = CartDirection.Down; break;
                    case TrackType.Curve2: cart.position.y--; cart.direction = CartDirection.Up; break;
                    default: cart.position.x--; break;
                }
                break;
            case CartDirection.Right:
                switch (cart.node.type) {
                    case TrackType.Intersection: {
                        switch (cart.intersectionHitCount++ % 3) {
                            case 0:
                                //turn left
                                cart.position.y--; cart.direction = CartDirection.Up;
                                break;
                            case 1:
                                //go straight
                                cart.position.x++;
                                break;
                            case 2:
                                //turn right
                                cart.position.y++; cart.direction = CartDirection.Down;
                                break;
                        }
                        break;
                    }
                    case TrackType.Curve1: cart.position.y--; cart.direction = CartDirection.Up; break;
                    case TrackType.Curve2: cart.position.y++; cart.direction = CartDirection.Down; break;
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

function renderMap(nodes: Node[][], carts: Cart[]) {
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
                toRender[y][x] = cartAtNode.direction;
                if (cartAtNode.id === 10) {
                    toRender[y][x] = chalk.bgRedBright(toRender[y][x])
                } else {
                    toRender[y][x] = chalk.bgBlackBright(toRender[y][x]);
                }
            } else {
                if (nodes[x][y] !== undefined) {
                    toRender[y][x] = nodes[x][y].type
                }
            }
        }
    }

    toRender.forEach((r) => {
        console.log(r.join(''));
    });
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
while (true) {
    var startTime = new Date().getTime();
    let { nodes: newNodes, carts: newCarts, crashedCarts } = tick(nodes, carts);
    nodes = newNodes;
    carts = newCarts.filter((c) => !crashedCarts.find((crashed) => crashed.id === c.id));
    if (crashedCarts.length > 1) {
        console.log(`Crash detected at ${JSON.stringify(crashedCarts[0].position)}, [Remaining: ${carts.length}]`);
        if (carts.length === 1) {
            console.log(`Last cart is at ${JSON.stringify(carts[0].position)}`);
            break;
        }
    }
    if (visualize) {
        console.clear();
        console.log(`-------- ${iter++} --------`);
        renderMap(nodes, carts);
        while (new Date().getTime() < startTime + 100) { }; //sleep
    }
}

import { Cart, CartDirection, MapNode, TrackType } from './types';

export function parseMap(rawMap: string[][]) {
    const carts: Cart[] = [];

    const width = Math.max(...rawMap.map((r) => r.length));
    const height = rawMap.length;

    const nodes: MapNode[][] = Array.from(Array(width), () => Array(height).fill('').map(() => undefined));

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

export function parseNode(rawNode: string, x: number, y: number): { node: MapNode, cart: Cart } {
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
    let node: MapNode;
    if (trackType !== undefined) {
        node = { position: { x, y }, type: trackType }
    }
    if (cartDirection !== undefined) {
        cart = { position: { x, y }, node, type: cartDirection, inter: 0, id: -1 };
    }

    return { node, cart }
}
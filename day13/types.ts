export enum TrackType {
    Vertical = '|',
    Horizontal = '-',
    Curve1 = '/',
    Curve2 = '\\',
    Intersection = '+'
}

export enum CartDirection {
    Up = '^',
    Down = 'v',
    Left = '<',
    Right = '>'
}

export type Entity = { position: { x: number, y: number } }

export type Cart = Entity & {
    id: number,
    node: MapNode,
    type: CartDirection,
    inter: number
}

export type MapNode = Entity & { type: TrackType }
export type Pos = { x: number, y: number };

export enum EntityType {
    Goblin = '😈 ',
    Elf = '😀 '
}

export enum TileType {
    Open = '◻️ ',
    Wall = '◼️ ',
    Unknown = '??',
}

export enum Direction {
    North = 0, South = 1, East = 2, West = 3
}

export enum Status {
    Unknown,
    Invalid,
    Blocked,
    Valid,
    Start,
    Goal,
    Visited
}

export type NodeToCheck = { pos: Pos, path: Direction[], status: Status }

export class MapNode {
    public Visited = false;
    constructor(public type: TileType, public position: Pos) {
    }
}

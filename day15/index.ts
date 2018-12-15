import * as fs from 'fs';
import { Array2d } from './helpers';

type Pos = { x: number, y: number };

enum EntityType {
    Goblin = '😈 ',
    Elf = '😀 '
}

enum TileType {
    Open = '◻️ ',
    Wall = '◼️ ',
    Unknown = '??',
}


class World {
    constructor(public entities: Entity[], public map: Array2d<MapNode>) { }

    tick(): any {
        this.entities.sort((a, b) => {
            return (a.position.y * this.map.width + a.position.x) - (b.position.y * this.map.width + b.position.x);
        }).forEach((e) => e.tick(this));
    }

    resetVisited() {
        this.map.rawData.forEach((m) => m.Visited = false);
    }

    checkIfFinished() {
        const entityOne = this.entities[0];
        const enemy = this.entities.find((e) => e.type !== entityOne.type);
        return enemy === undefined;
    }
}

const getEntityAtPos = (pos: Pos, world: World) => world.entities.find((e) =>
    e.position.x === pos.x && e.position.y === pos.y);


class MapNode {
    public Visited = false;
    constructor(public type: TileType, public position: Pos) {
    }

    public compareTo(node: MapNode) {

    }
}

enum Direction {
    North = 'N', South = 'S', East = 'E', West = 'W'
}

enum Status {
    Unknown,
    Invalid,
    Blocked,
    Valid,
    Start,
    Goal,
    Visited
}

type NodeToCheck = { pos: Pos, path: Direction[], status: Status }

class Entity {

    public AttackPower: number;
    public HP: number;
    constructor(public type: EntityType, public position: Pos) {
        this.AttackPower = 3;
        this.HP = 200;
    }

    tick(world: World) {
        world.resetVisited();

        if (!world.entities.includes(this)) {
            return;
        }

        const nearest = this.getNearestEnemy(world);
        if (nearest && nearest.path && nearest.path.length > 1) {
            this.move(nearest.path[0]); //move towards it
        }

        const enemyToAttack = this.selectTargetToAttack(world);
        if (enemyToAttack !== undefined) {
            this.attack(enemyToAttack.enemy, world);
        }
    }


    private move(direction: Direction) {
        let { x, y } = this.position;
        switch (direction) {
            case Direction.East:
                x++;
                break;
            case Direction.South:
                y++;
                break;
            case Direction.West:
                x--;
                break;
            case Direction.North:
                y--;
                break;
        }
        this.position = { x, y };
    }

    selectTargetToAttack(world: World) {
        world.resetVisited();
        //first, identify all possible targets
        const enemies = world.entities.filter((e) => e.type !== this.type);
        const pathsToEnemies = enemies.map((enemy) => ({ path: this.findPathTo(enemy, world), enemy }));
        const attackable = pathsToEnemies.filter((p) => p.path && p.path.length === 1);

        if (attackable.length === 0) {
            return undefined;
        }
        //get lowest health
        const lowestHealth = Math.min(...attackable.map((a) => a.enemy.HP));
        const lowestHealthEnemies = attackable.filter((r) => r.enemy.HP === lowestHealth);
        const selectedEnemy = lowestHealthEnemies.sort((a, b) => {
            return (a.enemy.position.y * world.map.width + a.enemy.position.x) - (b.enemy.position.y * world.map.width + b.enemy.position.x);
        })[0];
        return selectedEnemy;
    }

    attack(enemy: Entity, world: World) {
        enemy.HP -= this.AttackPower;
        if (enemy.HP <= 0) {
            world.entities = world.entities.filter((e) => e !== enemy);
        }
    }

    getNearestEnemy(world: World) {
        world.resetVisited();
        //first, identify all possible targets
        const enemies = world.entities.filter((e) => e.type !== this.type);
        const pathsToEnemies = enemies.map((enemy) => ({ path: this.findPathTo(enemy, world), enemy }));
        const reachable = pathsToEnemies.filter((p) => p.path !== undefined);
        if (reachable.length === 0) {
            return undefined;
        }
        const minDistance = Math.min(...reachable.map((r) => r.path.length));
        const nearestEnemies = reachable.filter((r) => r.path.length === minDistance);
        const selectedEnemy = nearestEnemies.sort((a, b) => {
            return (a.enemy.position.y * world.map.width + a.enemy.position.x) - (b.enemy.position.y * world.map.width + b.enemy.position.x);
        })[0];
        return selectedEnemy;
    }

    findPathTo(entityToFind: Entity, world: World): Direction[] {
        world.resetVisited();
        const location: NodeToCheck = {
            pos: this.position,
            path: [],
            status: Status.Start
        }

        const queue: NodeToCheck[] = [location];

        while (queue.length > 0) {
            if (queue.length > 99999) {
                console.log('not found');
                return undefined;
            }
            const currentLoc = queue.shift();

            //north
            let newLoc = Entity.exploreInDirection(currentLoc, Direction.North, world, entityToFind)
            if (newLoc.status === Status.Goal) {
                return newLoc.path;
            } else if (newLoc.status === Status.Valid) {
                queue.push(newLoc);
            }

            //east
            newLoc = Entity.exploreInDirection(currentLoc, Direction.East, world, entityToFind)
            if (newLoc.status === Status.Goal) {
                return newLoc.path;
            } else if (newLoc.status === Status.Valid) {
                queue.push(newLoc);
            }

            //west
            newLoc = Entity.exploreInDirection(currentLoc, Direction.West, world, entityToFind)
            if (newLoc.status === Status.Goal) {
                return newLoc.path;
            } else if (newLoc.status === Status.Valid) {
                queue.push(newLoc);
            }

            //south
            newLoc = Entity.exploreInDirection(currentLoc, Direction.South, world, entityToFind)
            if (newLoc.status === Status.Goal) {
                return newLoc.path;
            } else if (newLoc.status === Status.Valid) {
                queue.push(newLoc);
            }
        }
    }

    static exploreInDirection(currentLocation: NodeToCheck, direction: Direction, world: World, entityToFind: Entity) {

        let { x, y } = currentLocation.pos;
        const newPath = currentLocation.path.slice();
        newPath.push(direction);
        switch (direction) {
            case Direction.North:
                y--;
                break;
            case Direction.South:
                y++;
                break;
            case Direction.East:
                x++;
                break;
            case Direction.West:
                x--;
                break;
        }

        const newLoc: NodeToCheck = {
            pos: { x, y },
            path: newPath,
            status: Status.Unknown
        }

        newLoc.status = this.getLocationStatus(newLoc, world, entityToFind);

        if (newLoc.status === Status.Valid) {
            world.map.get(newLoc.pos.x, newLoc.pos.y).Visited = true;
        }

        return newLoc;
    }

    static getLocationStatus(location: NodeToCheck, world: World, entityToFind: Entity) {
        if (location.pos.x < 0 || location.pos.x > world.map.width ||
            location.pos.y < 0 || location.pos.y > world.map.height) {
            return Status.Invalid;
        }

        if (world.map.get(location.pos.x, location.pos.y).type === TileType.Open
            && getEntityAtPos(location.pos, world) === undefined && !world.map.get(location.pos.x, location.pos.y).Visited) {
            //if we can move to the tile
            return Status.Valid;
        }
        if (getEntityAtPos(location.pos, world) === entityToFind) {
            return Status.Goal;
        }
        if (world.map.get(location.pos.x, location.pos.y).type === TileType.Wall
            || getEntityAtPos(location.pos, world) !== undefined ||
            world.map.get(location.pos.x, location.pos.y).Visited) {
            return Status.Blocked;
        }
    }
}

function createWorld(input: string): World {
    const lines = input.split(/\n/);
    const width = lines[0].length;
    const height = lines.length;
    const rawMap = Array2d.FromData(input.split('').filter((c) => c !== '\n'), width, height);
    const worldMap = new Array2d<MapNode>(width, height);
    const worldEntities: Array<Entity> = [];
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            const c = rawMap.get(x, y);
            const entityType = /([GE])/.test(c);
            if (entityType) {
                const [, type] = /([GE])/.exec(c);
                worldEntities.push(new Entity(type == 'E' ? EntityType.Elf : EntityType.Goblin, { x, y }));
                worldMap.set(x, y, new MapNode(TileType.Open, { x, y }));
            } else {
                const [, tileType] = /([\.#])/.exec(c);
                worldMap.set(x, y, new MapNode(tileType === '#' ? TileType.Wall : TileType.Open, { x, y }))
            }
        }
    }
    return new World(worldEntities, worldMap);
}

function renderWorld(world: World) {
    let result = '';
    for (var y = 0; y < world.map.height; ++y) {
        const entitiesOnRow: Entity[] = [];
        for (var x = 0; x < world.map.width; x++) {
            const entity = getEntityAtPos({ x, y }, world);
            if (entity) {
                result += entity.type.toString();
                entitiesOnRow.push(entity);
            } else {
                result += world.map.get(x, y).type.toString();
            }
        }
        if (entitiesOnRow.length > 0) {
            result += ' '.repeat(3);
        }
        result += entitiesOnRow.sort((a, b) => a.position.x - b.position.x).map((e) => `${e.type}(${e.HP})`).join(', ');
        result += '\n'
    }
    console.log(result);
    console.log(EntityType.Goblin, world.entities.filter((e) => e.type === EntityType.Goblin).map((e) => e.HP).join(', '));
    console.log(EntityType.Elf, world.entities.filter((e) => e.type === EntityType.Elf).map((e) => e.HP).join(', '));
}

function Solve(rawInput: string, render: boolean = false) {
    let world = createWorld(rawInput);

    for (let i = 0; i < 50000; i++) {
        if (render) {
            console.clear();
            console.log(`===== ${i} =====`);
            renderWorld(world);
        }
        world.tick();

        if (world.checkIfFinished()) {
            const sumOfHP = world.entities.map((e) => e.HP).reduce((a, b) => a + b, 0);
            console.log(`Solution : ${sumOfHP}*${i} = ${sumOfHP * i}`)
            return sumOfHP * i;
        }
    }
}

console.log(Solve(`#######
#G..#E#
#E#E.E#
#G.##.#
#...#E#
#...E.#
#######`))
console.log('should be 36334');

console.log(Solve(`#######
#E..EG#
#.#G.E#
#E.##E#
#G..#.#
#..E#.#
#######`));
console.log('should be 39514');

console.log(Solve(`#######
#E.G#.#
#.#G..#
#G.#.G#
#G..#.#
#...E.#
#######`));
console.log('should be 27755');

console.log(Solve(`#######
#.E...#
#.#..G#
#.###.#
#E#G#G#
#...#G#
#######`))
console.log('should be 28944');

console.log(Solve(`#########
#G......#
#.E.#...#
#..##..G#
#...##..#
#...#...#
#.G...G.#
#.....G.#
#########`));
console.log('should be 18740');

console.log(Solve(fs.readFileSync('./input.txt', 'UTF8'), true));

//failed guesses: 214134
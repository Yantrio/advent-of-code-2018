import { Pos, TileType, Status, NodeToCheck, Direction, EntityType } from './types';
import { World } from './world';

export class Entity {

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
            if (queue.length > 999999) {
                console.log('not found');
                return undefined;
            }
            const currentLoc = queue.shift();

            let newLoc: NodeToCheck;
            for (let d of world.directionOrder) {
                newLoc = Entity.exploreInDirection(currentLoc, d, world, entityToFind)
                if (newLoc.status === Status.Goal) {
                    return newLoc.path;
                } else if (newLoc.status === Status.Valid) {
                    queue.push(newLoc);
                }
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

export const getEntityAtPos = (pos: Pos, world: World) => world.entities.find((e) =>
    e.position.x === pos.x && e.position.y === pos.y);
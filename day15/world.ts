import { Array2d } from "../helpers";
import { MapNode, EntityType, TileType, Direction } from "./types";
import { Entity, getEntityAtPos } from "./entity";

export class World {
  constructor(
    public entities: Entity[],
    public map: Array2d<MapNode>,
    public directionOrder: Direction[]
  ) {}

  static fromInput(input: string, directionOrder: Direction[]): World {
    const lines = input.split(/\n/);
    const width = lines[0].length;
    const height = lines.length;
    const rawMap = Array2d.FromData(
      input.split("").filter(c => c !== "\n"),
      width,
      height
    );
    const worldMap = new Array2d<MapNode>(width, height);
    const worldEntities: Array<Entity> = [];
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        const c = rawMap.get(x, y);
        const entityType = /([GE])/.test(c);
        if (entityType) {
          const [, type] = /([GE])/.exec(c);
          worldEntities.push(
            new Entity(type == "E" ? EntityType.Elf : EntityType.Goblin, {
              x,
              y
            })
          );
          worldMap.set(x, y, new MapNode(TileType.Open, { x, y }));
        } else {
          const [, tileType] = /([\.#])/.exec(c);
          worldMap.set(
            x,
            y,
            new MapNode(tileType === "#" ? TileType.Wall : TileType.Open, {
              x,
              y
            })
          );
        }
      }
    }
    return new World(worldEntities, worldMap, directionOrder);
  }

  tick(): any {
    this.entities
      .sort((a, b) => {
        return (
          a.position.y * this.map.width +
          a.position.x -
          (b.position.y * this.map.width + b.position.x)
        );
      })
      .forEach(e => e.tick(this));
  }

  resetVisited() {
    this.map.rawData.forEach(m => (m.Visited = false));
  }

  checkIfFinished() {
    const entityOne = this.entities[0];
    const enemy = this.entities.find(e => e.type !== entityOne.type);
    return enemy === undefined;
  }

  public render() {
    let result = "";
    for (var y = 0; y < this.map.height; ++y) {
      const entitiesOnRow: Entity[] = [];
      for (var x = 0; x < this.map.width; x++) {
        const entity = getEntityAtPos({ x, y }, this);
        if (entity) {
          result += entity.type.toString();
          entitiesOnRow.push(entity);
        } else {
          result += this.map.get(x, y).type.toString();
        }
      }
      if (entitiesOnRow.length > 0) {
        result += " ".repeat(3);
      }
      result += entitiesOnRow
        .sort((a, b) => a.position.x - b.position.x)
        .map(e => `${e.type}(${e.HP})`)
        .join(", ");
      result += "\n";
    }
    console.log(result);
    console.log(
      EntityType.Goblin,
      this.entities
        .filter(e => e.type === EntityType.Goblin)
        .map(e => e.HP)
        .join(", ")
    );
    console.log(
      EntityType.Elf,
      this.entities
        .filter(e => e.type === EntityType.Elf)
        .map(e => e.HP)
        .join(", ")
    );
  }
}

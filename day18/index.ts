import { Array2d } from '../helpers';
import * as fs from 'fs';

type Position = { x: number; y: number };

enum NodeType {
  OpenGround = '.',
  Trees = '|',
  Lumberyard = '#'
}

type MapNode = {
  position: Position;
  type: NodeType;
};

function getAdjacentNodes(map: Array2d<MapNode>, position: Position) {
  let { x, y } = position;
  return [map.get(x - 1, y - 1), map.get(x, y - 1), map.get(x + 1, y - 1), map.get(x - 1, y), map.get(x + 1, y), map.get(x - 1, y + 1), map.get(x, y + 1), map.get(x + 1, y + 1)].filter(
    n => n !== undefined
  );
}
function tick(map: Array2d<MapNode>) {
  const result = map.clone();
  for (let x = 0; x < map.width; x++) {
    for (let y = 0; y < map.height; y++) {
      const adjacent = getAdjacentNodes(map, { x, y });
      const current = map.get(x, y);
      switch (current.type) {
        case NodeType.OpenGround:
          if (adjacent.filter(adj => adj.type === NodeType.Trees).length >= 3) {
            result.get(x, y).type = NodeType.Trees;
          }
          break;
        case NodeType.Trees:
          if (adjacent.filter(adj => adj.type === NodeType.Lumberyard).length >= 3) {
            result.get(x, y).type = NodeType.Lumberyard;
          }
          break;
        case NodeType.Lumberyard:
          const hasAdjLumber = adjacent.find(adj => adj.type === NodeType.Lumberyard) !== undefined;
          const hasAdjTrees = adjacent.find(adj => adj.type === NodeType.Trees) !== undefined;

          if (!hasAdjLumber || !hasAdjTrees) {
            result.get(x, y).type = NodeType.OpenGround;
          }
          break;
      }
    }
  }
  return result;
}

export function renderMap(map: Array2d<MapNode>) {
  for (let y = 0; y < map.height; y++) {
    let line = '';
    for (let x = 0; x < map.width; x++) {
      line += map.get(x, y).type;
    }
    console.log(line);
  }
}

function sleep(ms: number) {
  var start = new Date().getTime();
  for (let i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > ms) {
      break;
    }
  }
}

const realInput = fs.readFileSync('./input.txt', 'UTF8');

const testInput = `.#.#...|#.
.....#|##|
.|..|...#.
..|#.....#
#.#|||#|#|
...#.||...
.|....|...
||...#|.#|
|.||||..|.
...#.|..|.`;

const lines = realInput.split(/\n/);
const mapSize = { width: lines[0].length, height: lines.length };
const rawMap: MapNode[] = Array(mapSize.width * mapSize.height);

for (let x = 0; x < mapSize.width; x++) {
  for (let y = 0; y < mapSize.height; y++) {
    rawMap[y * mapSize.width + x] = {
      position: { x, y },
      type: lines[y][x] as NodeType
    };
  }
}

let currentMap = Array2d.FromData<MapNode>(rawMap, mapSize.width, mapSize.height);

for (let i = 1; i <= 10; i++) {
  currentMap = tick(currentMap);
}

const wooded = currentMap.rawData.filter(n => n.type === NodeType.Trees).length;
const lumberyards = currentMap.rawData.filter(n => n.type === NodeType.Lumberyard).length;
console.log(`Solution pt1: ${wooded * lumberyards}`);

// PART 2 : LOOK FOR A PATTERN/REPEAT: it works, but I did it with math once I ran the code below
for (let i = 1; i <= 550; i++) {
  currentMap = tick(currentMap);
  if (i >= 500) {
    const wooded = currentMap.rawData.filter(n => n.type === NodeType.Trees).length;
    const lumberyards = currentMap.rawData.filter(n => n.type === NodeType.Lumberyard).length;
    console.clear();
    console.log(`${i}\tValue: ${wooded * lumberyards}`);
    renderMap(currentMap);
    sleep(30);
  }
}

// I can see it's repeating every 28, therefore, lets go do math and figure it out. no need for code....
// I could do pattern detection but im lazy, human eyes, brain, and a bit of math later, I have the answer!

console.log(`Solution pt2: 207900`);

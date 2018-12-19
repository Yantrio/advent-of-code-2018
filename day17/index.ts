import { Array2d } from '../helpers';
import * as fs from 'fs';

enum groundType {
  Sand = '.',
  Clay = '#',
  Spring = '+',
  FallingWater = '|',
  SettledWater = '~'
}

type Patch = {
  xstart: number;
  xend: number;
  ystart: number;
  yend: number;
  type: groundType;
};

type Position = { x: number; y: number };
type MapNode = { position: Position; type: groundType };

enum Direction {
  Left = -1,
  Right = 1
}

//yay recursion!
function fill(map: Array2d<MapNode>, position: Position) {
  let { x, y } = position;
  if (y >= map.height - 1) {
    return;
  }
  const below = map.get(x, y + 1);
  const right = map.get(x + 1, y);
  const left = map.get(x - 1, y);

  if (below.type === groundType.Sand) {
    below.type = groundType.FallingWater;
    fill(map, below.position);
  }

  if ((below.type === groundType.Clay || below.type === groundType.SettledWater) && right.type === groundType.Sand) {
    right.type = groundType.FallingWater;
    fill(map, right.position);
  }

  if ((below.type === groundType.Clay || below.type === groundType.SettledWater) && left.type === groundType.Sand) {
    left.type = groundType.FallingWater;
    fill(map, left.position);
  }
  if (foundWall(map, position, Direction.Right) && foundWall(map, position, Direction.Left)) {
    fillInDirection(map, position, Direction.Right);
    fillInDirection(map, position, Direction.Left);
  }
}

function fillInDirection(map: Array2d<MapNode>, pos: Position, direction: Direction) {
  let x = pos.x;
  while (true) {
    if (map.get(x, pos.y).type === groundType.Clay) return; // go until it's clay
    map.get(x, pos.y).type = groundType.SettledWater; //settle the water
    x += direction; //go in the direction specified
  }
}

function foundWall(map: Array2d<MapNode>, pos: Position, direction: Direction) {
  let x = pos.x;
  while (true) {
    if (map.get(x, pos.y).type === groundType.Sand) return false;
    if (map.get(x, pos.y).type === groundType.Clay) return true;
    x += direction;
  }
}

function getNodesInRange(map: Array2d<MapNode>, topLeft: Position, bottomRight: Position) {
  return map.rawData.filter(n => {
    return n.position.x >= topLeft.x && n.position.y >= topLeft.y && n.position.x <= bottomRight.x && n.position.y <= bottomRight.y;
  });
}

const mapSize = { width: 2000, height: 2000 };

const rawMap: MapNode[] = Array(mapSize.width * mapSize.height);

for (let x = 0; x < mapSize.width; x++) {
  for (let y = 0; y < mapSize.height; y++) {
    rawMap[y * mapSize.width + x] = {
      position: { x, y },
      type: groundType.Sand
    };
  }
}

const map = Array2d.FromData<MapNode>(rawMap, mapSize.width, mapSize.height);

const lines = fs.readFileSync('input.txt', 'utf8').split(/\n/);

const patches = [
  ...lines.map(l => {
    let [[, xstart, xend], [, ystart, yend]] = [/x=(\d+)(?:..(\d+))?/.exec(l).map(Number), /y=(\d+)(?:..(\d+))?/.exec(l).map(Number)];
    if (Number.isNaN(yend)) yend = ystart;
    if (Number.isNaN(xend)) xend = xstart;
    let result: Patch = { xstart, xend, ystart, yend, type: groundType.Clay };
    return result;
  }),
  {
    xstart: 500,
    xend: 500,
    ystart: 0,
    yend: 0,
    type: groundType.Spring
  }
];

const [yMin, yMax] = [Math.min(...patches.filter(p => p.type === groundType.Clay).map(p => p.ystart)), Math.max(...patches.map(p => p.yend))];

patches.forEach(p => {
  for (let x = p.xstart; x <= p.xend; x++) {
    for (let y = p.ystart; y <= p.yend; y++) {
      map.set(x, y, { position: { x, y }, type: p.type });
    }
  }
});

fill(map, { x: 500, y: 0 });
// console.log(renderMap(map, xMin - 1, yMin, xMax, yMax));

const nodesICareAbout = getNodesInRange(map, { x: 0, y: yMin }, { x: map.width, y: yMax });
const solutionPt1 = nodesICareAbout.filter(node => node.type === groundType.FallingWater || node.type == groundType.SettledWater).length;
const solutionPt2 = nodesICareAbout.filter(node => node.type == groundType.SettledWater).length;

console.log(`Solution pt1: ${solutionPt1}`);
console.log(`Solution pt2: ${solutionPt2}`);

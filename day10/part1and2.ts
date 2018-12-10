const input = require('./input.json').input;
import chalk from 'chalk';
type Vector = { x: number, y: number, xvel: number, yvel: number };

const inputParser = /position=<([-\s]*\d+), ([-\s]*\d+)> velocity=<([-\s]*\d+), ([-\s]*\d+)>/;

function getSmallestBox(input: Vector[]) {
    let smallestSize = {
        i: -1, width: Number.MAX_SAFE_INTEGER, height: Number.MAX_SAFE_INTEGER,
        minX: -Number.MAX_SAFE_INTEGER, minY: -Number.MAX_SAFE_INTEGER
    };
    // this should be when it all stops at the word, let's hope it's within 20000!
    for (let i = 0; i < 20000; i++) {
        const [xVals, yVals] = [
            input.map((inp) => inp.x + i * inp.xvel),
            input.map((inp) => inp.y + i * inp.yvel)
        ];
        let [minX, maxX, minY, maxY] = [
            Math.min(...xVals), Math.max(...xVals),
            Math.min(...yVals), Math.max(...yVals)
        ];

        if (((maxX - minX) < smallestSize.width) && (maxY - minY) < smallestSize.height) {
            smallestSize = {
                i, width: (maxX - minX), height: (maxY - minY), minX, minY
            }
        }
    }
    return smallestSize;
}

const parsedInput = input.map((i: string) => {
    let [, x, y, xvel, yvel] = inputParser.exec(i);
    return { x: +(x.trim()), y: +(y.trim()), xvel: +(xvel.trim()), yvel: +(yvel.trim()) };
}) as Vector[];

const smallestBox = getSmallestBox([...parsedInput]);
const map = Array(smallestBox.height + 1).fill('').map(() => Array(smallestBox.width + 1).fill(chalk.blue('░')));
const movedPoints = parsedInput.map((p) => {
    // move them with regards to their velocity over time, 
    // then transpose them onto our co-ordinate space
    p.x = (p.x + smallestBox.i * p.xvel) - smallestBox.minX;
    p.y = (p.y + smallestBox.i * p.yvel) - smallestBox.minY;
    return p;
});

// map the points
movedPoints.forEach((p: Vector) => {
    map[p.y][p.x] = chalk.red('▓');
});

console.log('Solution pt 1:');
map.forEach((m) => {
    console.log(m.join(''));
})

console.log('Solution pt 2: ', smallestBox.i);

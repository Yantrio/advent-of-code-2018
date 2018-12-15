import * as fs from 'fs';
import { World } from './world';
import { Direction, EntityType } from './types';

let directionOrder = [Direction.North, Direction.West, Direction.East, Direction.South];

function TrySolvePt1(rawInput: string, render: boolean = false) {
    let world = World.fromInput(rawInput, directionOrder);

    for (let i = 0; i < 50000; i++) {
        if (render) {
            console.clear();
            console.log(`===== ${i} =====`);
            world.render();
        }
        world.tick();

        if (world.checkIfFinished()) {
            const sumOfHP = world.entities.map((e) => e.HP).reduce((a, b) => a + b, 0);
            return sumOfHP * i;
        }
    }
}

function TrySolvePt2(rawInput: string, shouldRender: boolean = false, elfAP: number = 3) {
    let world = World.fromInput(rawInput, directionOrder);
    world.entities.filter((e) => e.type === EntityType.Elf).forEach((elf) => elf.AttackPower = elfAP);

    for (let i = 0; i < 50000; i++) {
        if (shouldRender) {
            console.clear();
            console.log(`===== ${i} =====`);
            world.render();
        }

        const elfCount = world.entities.filter((e) => e.type === EntityType.Elf).length;
        world.tick();
        const newElfCount = world.entities.filter((e) => e.type === EntityType.Elf).length;

        if (elfCount !== newElfCount) {
            console.log(`elf died at round ${i}, after AP :`, elfAP)
            return -1;
        }

        if (world.checkIfFinished()) {
            const sumOfHP = world.entities.map((e) => e.HP).reduce((a, b) => a + b, 0);
            return sumOfHP * i;
        }
    }
}

const solutions = [];
const shouldRender = false;

solutions.push(TrySolvePt1(fs.readFileSync('./input.txt', 'UTF8'), shouldRender));

//uncomment to solve pt2gst
// for (let ap = 0; ap < 20; ap++) {
//     const output = TrySolvePt2(fs.readFileSync('./input.txt', 'UTF8'), false, ap);
//     if (output !== -1) {
//         solutions.push(output);
//         break;
//     }
// }

console.log(solutions);
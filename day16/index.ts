import * as fs from 'fs';
import { handle, processor, Instruction, InstructionSet, Register } from './instructions';

const numberPuller = /(\d+),? (\d+),? (\d+),? (\d+)/;
function findPossibleOpcodesForTestSuite() {
    const findMatchingInstructions = (input: Register, inputInstruction: Instruction, expectedResult: Register): (keyof InstructionSet)[] =>
        Object.keys(processor)
            .filter((ins) => ins !== "UNKNOWN")
            .filter((testInstruction) => {
                const testInput = [...input];
                processor[testInstruction](inputInstruction, testInput);
                return testInput.join('') === expectedResult.join('');
            }) as (keyof InstructionSet)[];

    const lines = fs.readFileSync('input1.txt', 'UTF8').split(/\n/);
    const results = [];

    for (let i = 0; i < lines.length; i += 4) {
        const linesToParse = lines.slice(i, i + 3);
        const [initialRegister, rawInstruction, expectedResult] = linesToParse.map((l) => numberPuller.exec(l)).map((s) => s.slice(1, 5).map(Number));
        const [, a, b, out] = rawInstruction;
        const matching = findMatchingInstructions(initialRegister, { type: "UNKNOWN", a, b, out }, expectedResult);
        results.push({ rawInstruction, matching });
    }
    return results;
}

function deduceOpcodesFromTestResults(input: {
    rawInstruction: Array<Number>,
    matching: Array<keyof InstructionSet>
}[]): Array<keyof InstructionSet> {
    let unknownOps = new Set(Array.from(Array(16).keys()));
    const possibilities = Array.from(unknownOps).map((o) => new Set<keyof InstructionSet>());

    //construct possibilities map from known values
    unknownOps.forEach((opCode) =>
        input.filter((o) => o.rawInstruction[0] === opCode)
            .forEach(((i) => i.matching.forEach((m) => possibilities[opCode].add(m)))));

    //reduce down until we know them all
    let knownOps = [];
    while (unknownOps.size > 0) {
        for (const i of Array.from(unknownOps).filter((o) => possibilities[o].size === 1)) {
            unknownOps.delete(i);
            knownOps[i] = [...possibilities[i]][0];
            for (let otherOp = 0; otherOp < 16; otherOp++) {
                possibilities[otherOp].delete(knownOps[i]);
            }
        }
    }
    return knownOps;
}

const testResults = findPossibleOpcodesForTestSuite();
const knownOps = deduceOpcodesFromTestResults(testResults as []);

const instructions = fs.readFileSync('input2.txt', 'utf8').split(/\n/).map((l) => {
    let [, op, a, b, out] = numberPuller.exec(l).map(Number);
    return {
        type: knownOps[op],
        a, b, out
    } as Instruction;
});

let register = Array(4).fill(0);
instructions.forEach((i) => handle(processor, i, register));

console.log(`Solution pt1: ${testResults.filter((r) => r.matching.length > 2).length}`);
console.log(`Solution pt2: ${register[0]}`);

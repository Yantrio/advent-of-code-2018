import * as fs from 'fs';
export type Instruction = {
    type: keyof InstructionSet;
    a: number;
    b: number;
    out: number;
};

export type Register = Array<number>;

export type Op = (i: Instruction, input: Register) => void;

export interface InstructionSet {
    addr: Op;
    addi: Op;
    mulr: Op;
    muli: Op;
    banr: Op;
    bani: Op;
    borr: Op;
    bori: Op;
    setr: Op;
    seti: Op;
    gtir: Op;
    gtri: Op;
    gtrr: Op;
    eqir: Op;
    eqri: Op;
    eqrr: Op;
    UNKNOWN: Op;
}

type InstructionPointer = {
    pointer: number;
    isRegister: boolean;
    value: number;
};

export const cpu: InstructionSet = {
    addr: (i, r) => r[i.out] = r[i.a] + r[i.b],
    addi: (i, r) => r[i.out] = r[i.a] + i.b,
    mulr: (i, r) => r[i.out] = r[i.a] * r[i.b],
    muli: (i, r) => r[i.out] = r[i.a] * i.b,
    bani: (i, r) => r[i.out] = r[i.a] & i.b,
    banr: (i, r) => r[i.out] = r[i.a] & r[i.b],
    bori: (i, r) => r[i.out] = r[i.a] | i.b,
    borr: (i, r) => r[i.out] = r[i.a] | r[i.b],
    setr: (i, r) => r[i.out] = r[i.a],
    seti: (i, r) => r[i.out] = i.a,
    gtir: (i, r) => r[i.out] = i.a > r[i.b] ? 1 : 0,
    gtri: (i, r) => r[i.out] = r[i.a] > i.b ? 1 : 0,
    gtrr: (i, r) => r[i.out] = r[i.a] > r[i.b] ? 1 : 0,
    eqir: (i, r) => r[i.out] = i.a === r[i.b] ? 1 : 0,
    eqri: (i, r) => r[i.out] = r[i.a] === i.b ? 1 : 0,
    eqrr: (i, r) => r[i.out] = r[i.a] === r[i.b] ? 1 : 0,
    UNKNOWN: undefined
};

export class Handler {
    public register: number[] = [0, 0, 0, 0, 0, 0];

    constructor(public ip: InstructionPointer, public instructions: Array<Instruction>, public processor: InstructionSet = cpu) { }

    public handle() {
        while (true) {
            if (this.ip.value >= this.instructions.length) {
                break;
            }
            this.register[this.ip.pointer] = this.ip.value;
            const currentInstruction = this.instructions[this.ip.value];
            const handlerFunction = this.processor[currentInstruction.type] as Op;
            handlerFunction(currentInstruction, this.register);
            this.ip.value = this.register[this.ip.pointer] + 1;
            if (this.ip.value === 30) { // This is the important instruction, taken from reverse engineering
                break;
            }
        }
    }
}

const input = fs.readFileSync(__dirname + '/input.txt', 'utf8').split(/\n/);

const ip = {
    value: 0,
    pointer: +input
        .shift()
        .split('')
        .reverse()[0],
    isRegister: false
};

const instructions = input.map(line => {
    let [, instruction, a, b, out] = /(.*) (\d+) (\d+) (\d+)/.exec(line);
    return { type: instruction, a: +a, b: +b, out: +out } as Instruction;
});

const seen: number[] = [];
const handler = new Handler({ ...ip }, instructions);
handler.handle();

seen.push(handler.register[1]);
console.log(`Solution pt1: ${handler.register[1]}`); //part 1 solved

while (true) {
    handler.handle();
    if (seen.includes(handler.register[1])) {
        break;
    } else {
        seen.push(handler.register[1]);
    }
}

console.log(`Solution pt2: ${seen.reverse()[0]}`); //the last item in the list is pt2
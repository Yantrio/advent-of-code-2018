export type Instruction = {
    type: keyof InstructionSet
    a: number,
    b: number,
    out: number
}

export type Register = Array<number>;

export type Op = (i: Instruction, input: Register) => void;

export interface InstructionSet {
    addr: Op, addi: Op, mulr: Op, muli: Op, banr: Op, bani: Op, borr: Op, bori: Op, setr: Op, seti: Op, gtir: Op, gtri: Op, gtrr: Op, eqir: Op, eqri: Op, eqrr: Op, UNKNOWN: Op
}

export const processor: InstructionSet = {
    addr: (i, input) => input[i.out] = input[i.a] + input[i.b],
    addi: (i, input) => input[i.out] = input[i.a] + i.b,
    mulr: (i, input) => input[i.out] = input[i.a] * input[i.b],
    muli: (i, input) => input[i.out] = input[i.a] * i.b,
    bani: (i, input) => input[i.out] = input[i.a] & input[i.b],
    banr: (i, input) => input[i.out] = input[i.a] & i.b,
    bori: (i, input) => input[i.out] = input[i.a] | input[i.b],
    borr: (i, input) => input[i.out] = input[i.a] | i.b,
    setr: (i, input) => input[i.out] = input[i.a],
    seti: (i, input) => input[i.out] = i.a,
    gtir: (i, input) => input[i.out] = i.a > input[i.b] ? 1 : 0,
    gtri: (i, input) => input[i.out] = input[i.a] > i.b ? 1 : 0,
    gtrr: (i, input) => input[i.out] = input[i.a] > input[i.b] ? 1 : 0,
    eqir: (i, input) => input[i.out] = i.a === input[i.b] ? 1 : 0,
    eqri: (i, input) => input[i.out] = input[i.a] === i.b ? 1 : 0,
    eqrr: (i, input) => input[i.out] = input[i.a] === input[i.b] ? 1 : 0,
    UNKNOWN: undefined
}

export function handle(processor: InstructionSet, i: Instruction, input: Register) {
    const handlingFunction = processor[i.type] as Op;
    return handlingFunction(i, input)
}
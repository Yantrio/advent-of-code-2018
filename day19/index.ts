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
  addr: (i, input) => (input[i.out] = input[i.a] + input[i.b]),
  addi: (i, input) => (input[i.out] = input[i.a] + i.b),
  mulr: (i, input) => (input[i.out] = input[i.a] * input[i.b]),
  muli: (i, input) => (input[i.out] = input[i.a] * i.b),
  bani: (i, input) => (input[i.out] = input[i.a] & input[i.b]),
  banr: (i, input) => (input[i.out] = input[i.a] & i.b),
  bori: (i, input) => (input[i.out] = input[i.a] | input[i.b]),
  borr: (i, input) => (input[i.out] = input[i.a] | i.b),
  setr: (i, input) => (input[i.out] = input[i.a]),
  seti: (i, input) => (input[i.out] = i.a),
  gtir: (i, input) => (input[i.out] = i.a > input[i.b] ? 1 : 0),
  gtri: (i, input) => (input[i.out] = input[i.a] > i.b ? 1 : 0),
  gtrr: (i, input) => (input[i.out] = input[i.a] > input[i.b] ? 1 : 0),
  eqir: (i, input) => (input[i.out] = i.a === input[i.b] ? 1 : 0),
  eqri: (i, input) => (input[i.out] = input[i.a] === i.b ? 1 : 0),
  eqrr: (i, input) => (input[i.out] = input[i.a] === input[i.b] ? 1 : 0),
  UNKNOWN: undefined
};

export class Handler {
  public register: number[] = [0, 0, 0, 0, 0, 0];

  constructor(public ip: InstructionPointer, public instructions: Array<Instruction>, public processor: InstructionSet = cpu) {}

  public handle() {
    while (true) {
      //if we're out of range, exit
      if (this.ip.value >= this.instructions.length) {
        break;
      }
      //write IP to it's register
      this.register[this.ip.pointer] = this.ip.value;

      //get instruction that pointer is pointing to
      const currentInstruction = this.instructions[this.ip.value];
      const handlerFunction = this.processor[currentInstruction.type] as Op;
      //handle it
      handlerFunction(currentInstruction, this.register);
      //read IP for next loop
      this.ip.value = this.register[this.ip.pointer] + 1;
    }
  }
}

const input = fs.readFileSync('input.txt', 'utf8').split(/\n/);

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

const handler = new Handler({ ...ip }, instructions);
handler.handle();

console.log(`Solution pt1: ${handler.register[0]}`);

// const handler2 = new Handler({ ...ip }, instructions);
// handler2.register[0] = 1;
// handler2.handle();

// console.log(`Solution pt2: ${handler2.register[0]}`);

// I ran the above for way too long, then I started looking for patterns like in previous days
// patterns gave me fuck all, time to reverse engineer! (only pattern I saw is the loop in 3->11 so I'll focus on that)

/* MEGA SPOILERS !!!!!!

reverse engineering notes
[ORIGINAL 3 to 11]
seti 1 1 5
seti 1 1 3
mulr 5 3 4
eqrr 4 1 4
addr 4 2 2
addi 2 1 2
addr 5 0 0
addi 3 1 3
gtrr 3 1 4

let i1 = 10551309;
3: let i5 = 1;
4: let i3 = 1;
5: let i4 = i5*i3; //multiplies
6: if(i4 == i1) { //check if result is equal to i1
  i4 = 1;
} else {
  i4 = 0
}
...
loop up if i4 != i1 // (i suppose its checking every possible factor)

.. getting factors? (this loops up i5 and i3, checking if they multiply to be equal to i1 using i4 as a register to check)
it seems to be going through all numbers, checking if they're a factor of register[1]. then adding up the total
*/

function sumAllFactors(num: number) {
  let sum = 0;
  for (let i = 1; i <= num; i++) {
    if (num % i == 0) {
      sum += i;
    }
  }
  return sum;
}

console.log(`Solution pt2: ${sumAllFactors(10551309)}`);

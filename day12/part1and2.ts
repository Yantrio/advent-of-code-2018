import { initialState as rawState, rules as rawRules } from './input.json';

const initialOffset = 10;
const initialState = ('.'.repeat(initialOffset)) + rawState + ('.'.repeat(200));

const rules = rawRules.map((r: string) => {
    const [, pattern, output] = /(.*) => (.)/.exec(r);
    return { pattern, output };
});

const getScore = (input: string, offset: number): number => input.split('').reduce((sum, c, idx) => c === "#" ? (sum + idx - offset) : sum, 0);

function genNext(rules: { pattern: string, output: string }[], initialState: string) {
    let nextGen = Array(initialState.length).fill('.');
    for (let i = 2; i < initialState.length; i++) {
        const rule = rules.find(r => r.pattern === initialState.substr(i - 2, 5));
        if (rule) {
            nextGen[i] = rule.output;
        }
    }
    return nextGen.join('');
}

function solveGenerations(state: string, generationCount: number): string[] {
    let generations = [];
    for (let i = 0; i <= generationCount; i++) {
        generations.push(state);
        state = genNext(rules, state);
    }
    return generations;
}

let gen200 = solveGenerations(initialState, 200).reverse();
const scoreAt200 = getScore(gen200[0], initialOffset);
const delta = getScore(gen200.shift(), initialOffset) - (getScore(gen200.shift(), initialOffset));

console.log(`Solution pt1: ${getScore(solveGenerations(initialState, 20).reverse()[0], initialOffset)}`)
console.log(`Solution pt2: ${((50000000000 - 200) * (delta)) + scoreAt200}`);
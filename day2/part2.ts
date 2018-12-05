import { input } from './input.json';

function getResult(input: string[]) {
    const [first, second] = getClosestTwoStrings(input);
    let result = '';
    for (let i = 0; i < first.length; i++) {
        if (first[i] === second[i]) {
            result += first[i];
        }
    }
    return result;
}

function getClosestTwoStrings(input: string[]) {
    for (let i = 0; i < input.length; i++) {
        for (let j = i + 1; j < input.length; j++) {
            let difference = 0;
            for (let charIdx = 0; charIdx < input[i].length; charIdx++) {
                if (input[i][charIdx] !== input[j][charIdx]) {
                    difference++;
                }
            }
            if (difference === 1) {
                return [input[i], input[j]];
            }
        }
    }
}

console.log(getResult(input));
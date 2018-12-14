const getNextScores = (a: number, b: number) => ((a + b) + '').split('').map((s) => +s);

function pt1(input: number) {
    let [elves, scores] = [[0, 1], [3, 7]];
    while (scores.length < 10 + input) {
        scores.push(...getNextScores(scores[elves[0]], scores[elves[1]]));
        elves = elves.map((e) => (e + 1 + scores[e]) % scores.length);
    }
    return scores.slice(input).join('');
}

function pt2(input: string) {
    let [elves, scores] = [[0, 1], [3, 7]];
    while (true) {
        const newScores = getNextScores(scores[elves[0]], scores[elves[1]]);
        scores.push(...newScores);
        const startIdx = scores.length - newScores.length - input.length;
        const foundIdx = scores.slice(startIdx, scores.length).join("").indexOf(input);
        if (foundIdx > -1) {
            return foundIdx + startIdx;
        }
        elves = elves.map((e) => (e + 1 + scores[e]) % scores.length);
    }
}
console.log(`Solution pt1: ${pt1(702831)}`);
// console.log(`Solution pt2: ${pt2('702831')}`);
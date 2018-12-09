type placedMarble = {
    next: placedMarble, prev: placedMarble, value: number
}

function solve(input: string) {
    const [, rawPlayerCount, rawMarbles] = /(\d+) players; last marble is worth (\d+) points/.exec(input);
    const [playerCount, marbles] = [+rawPlayerCount, +rawMarbles]

    //setup variables and make first marble
    const scores = Array(playerCount).fill(0);
    let currentElf = 0;
    let currentMarble = { value: 0 } as placedMarble;
    currentMarble.next = currentMarble;
    currentMarble.prev = currentMarble;

    for (let currentValue = 1; currentValue < marbles; currentValue++) {
        if (currentValue % 23 === 0) {
            scores[currentElf] += currentValue; // 23 marble is kept, added to score
            currentMarble = currentMarble.prev.prev.prev.prev.prev.prev; // go back 6, (not 7)
            scores[currentElf] += currentMarble.prev.value; // grab the 7th back now and add to score
            currentMarble.prev.prev.next = currentMarble; // pull it from the linked list
            currentMarble.prev = currentMarble.prev.prev;
        } else {
            const newMarble = { value: currentValue, next: currentMarble.next.next, prev: currentMarble.next };
            currentMarble.next.next.prev = newMarble; // insert it
            currentMarble.next.next = newMarble;
            currentMarble = newMarble; // update current marble
        }
        currentElf = (++currentElf % playerCount); //next player
    }
    return Math.max(...scores);
}

console.log(`Solution pt1: ${solve('476 players; last marble is worth 71657 points')}`);
console.log(`Solution pt2: ${solve('476 players; last marble is worth 7165700 points')}`);

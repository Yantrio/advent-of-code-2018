import { input } from './input.json';

let sleepingTimes = new Map<number, Map<string, boolean[]>>();
let isSleeping = new Map<number, { isSleeping: boolean, startedSleepingAt: number }>();

function parseInput(input: string[]) {
    let currentGuard = 0;
    for (let currentLine of input) {
        const time = getTime(currentLine);
        const timeKey = `${time.getMonth()}${time.getMinutes()}`;

        const guardResult = /.*Guard #(\d+) begins shift/.exec(currentLine);
        const fallsAsleepResult = /.* falls asleep/.exec(currentLine);
        const wakesUpResult = /.* wakes up/.exec(currentLine);

        if (guardResult) {
            let [, guardID] = guardResult;
            currentGuard = +guardID;
            if (!sleepingTimes.has(currentGuard)) {
                sleepingTimes.set(currentGuard, new Map<string, boolean[]>());
                isSleeping.set(currentGuard, { isSleeping: false, startedSleepingAt: 0 });
            }
        }
        if (fallsAsleepResult) {
            isSleeping.get(currentGuard).isSleeping = true;
            isSleeping.get(currentGuard).startedSleepingAt = time.getMinutes();

        }
        if (wakesUpResult) {
            isSleeping.get(currentGuard).isSleeping = false;
            const startedSleeping = isSleeping.get(currentGuard).startedSleepingAt;
            const now = time.getMinutes();
            if (!sleepingTimes.get(currentGuard).has(timeKey)) {
                sleepingTimes.get(currentGuard).set(timeKey, Array(60).fill(false));
            }
            for (let i = startedSleeping; i < now; i++) {
                sleepingTimes.get(currentGuard).get(timeKey)[i] = true;
            }
        }
    }
}

function getTime(input: string): Date {
    const [, year, month, day, hour, min] = /\[(\d+)\-(\d+)-(\d+)\s(\d+):(\d+)\]/.exec(input);
    return new Date(+year, +month, +day, +hour, +min, 0, 0);
}

function findSleepiestMinuteForGuard(guardId) {
    const guardSleepingTimes = sleepingTimes.get(guardId);
    const minutes = Array(60).fill(0);
    for (let sleeping of guardSleepingTimes.values()) {
        sleeping.forEach((value, idx) => {
            if (value) { minutes[idx]++; }
        })
    }
    const max = Math.max(...minutes);
    return {
        count: max,
        minute: minutes.indexOf(max),
        totalTimeSleeping: minutes.reduce((a, b) => a + b, 0)
    }
}

parseInput(input);

const sleepData = Array.from(sleepingTimes.keys()).map((guard) => {
    const sleepiestMinute = findSleepiestMinuteForGuard(guard);
    return {
        guard,
        sleepiestMinute
    };
});

const highest = Math.max.apply(Math, sleepData.map((guard) => guard.sleepiestMinute.totalTimeSleeping));
const sleepiestGuard = sleepData.find((guard) => guard.sleepiestMinute.totalTimeSleeping == highest);
console.log(sleepiestGuard.guard * sleepiestGuard.sleepiestMinute.minute);

const highest2 = Math.max.apply(Math, sleepData.map((guard) => guard.sleepiestMinute.count));
const sleepiestGuard2 = sleepData.find((guard) => guard.sleepiestMinute.count == highest2);
console.log(sleepiestGuard2.guard * sleepiestGuard2.sleepiestMinute.minute);

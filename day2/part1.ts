import { input } from './input.json';

function checkSum(inputArr: string[]) {
    const counted = inputArr.map((input) => {
        const counted = Array.from(new Set(input)).map((c) => {
            return {
                c,
                count: input.split('').filter((cinput) => cinput === c).length
            };
        });
        return {
            hasTwo: counted.find((c) => c.count == 2) !== undefined,
            hasThree: counted.find((c) => c.count == 3) !== undefined
        }
    });
    return counted.filter((c) => c.hasTwo).length * counted.filter((c) => c.hasThree).length;
}

console.log(`Solution ${checkSum(input)}`);
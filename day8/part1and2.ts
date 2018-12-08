import { performance } from 'perf_hooks';
import { input } from './input.json';

type Node = { id: number, childCount: number, metadataCount: number, children: Node[], metadata: number[] };
const sum = (numbers: number[]) => numbers.reduce((a, b) => a + b, 0);

const getNodeValue = (node: Node) => (node.childCount === 0) ?
    sum(node.metadata) :
    sum(node.metadata.filter((i) => i <= node.children.length)
        .map((idx) => getNodeValue(node.children[idx - 1])));

function parse(input: number[], id: number = 0, nodeList: Node[] = []): { node: Node, nodeList: Node[] } {
    const [childCount, metadataCount] = [input.shift(), input.shift()];
    const node = {
        id: id++, childCount, metadataCount,
        children: Array.from(Array(childCount), () => parse(input, id++, nodeList).node),
        metadata: Array.from(Array(metadataCount), () => input.shift())
    };
    nodeList.push(node);
    return { node: node, nodeList };
}

function solve(input: number[]) {
    const { node, nodeList } = parse([...input]);
    return { pt1: sum(nodeList.map(((n) => sum(n.metadata)))), pt2: getNodeValue(node) };
}

// tests  
const testInput = [2, 3, 0, 3, 10, 11, 12, 1, 1, 0, 1, 99, 2, 1, 1, 2];
let { pt1: pt1Test, pt2: pt2Test } = solve(testInput);
console.log(`Test Solution Pt 1: ${pt1Test} [Expected 138]}`);
console.log(`Test Solution Pt 2: ${pt2Test} [Expected 66]`);

// solution
const start = performance.now();
let { pt1, pt2 } = solve(input);
console.log(`Solution Pt 1: ${pt1}`);
console.log(`Solution Pt 2: ${pt2}`);
const end = performance.now();
console.log(`Time taken for final solution : ${end - start} ms`)

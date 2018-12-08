import { input } from './input.json';

export class Node {

    constructor(public id: number,
        public childCount: number,
        public metadataCount: number,
        public metadata: number[] = [],
        public children: Node[] = []) {
    }

    public getValue() {
        if (this.childCount === 0) {
            return this.metadata.reduce((a, b) => a + b, 0);
        }
        return this.metadata
            .filter((i) => i <= this.children.length && i > 0)
            .map((idx) => this.children[idx - 1].getValue())
            .reduce((a, b) => a + b, 0);
    }
}

const nodes: Node[] = [];
let idCounter = 0;

function parseNode(startIndex: number, input: number[]): { node: Node, end: number } {
    let position = startIndex;
    const childCount = input[position++];
    const metadataCount = input[position++];
    const result = new Node(idCounter++, childCount, metadataCount);
    for (let i = 0; i < childCount; i++) {
        let { node, end } = parseNode(position, input);
        result.children.push(node);
        position = end;
    }
    result.metadata = input.slice(position, position + metadataCount);
    position += metadataCount;
    nodes.push(result); // im lazy and don't want to flatten the tree later if needed.
    return { node: result, end: position };
}

parseNode(0, input);
const solution = nodes.map((n) => n.metadata.reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0);
console.log(`Solution Pt 1: ${solution}`);
console.log(`Solution Pt 2: ${nodes.find((n) => n.id === 0).getValue()}`);
import { input } from './input.json';

export type Node = {
    id: number, childCount: number, metadataCount: number, children: Node[], metadata: number[]
}

const sum = (numbers: number[]) => numbers.reduce((a, b) => a + b, 0);

const getNodeValue = (node: Node) => (node.childCount === 0) ?
    sum(node.metadata) :
    sum(node.metadata.filter((i) => i <= node.children.length)
        .map((idx) => getNodeValue(node.children[idx - 1])));

function parse(input: number[], id: number = 0, nodeList: Node[] = []): { parsed: Node, nodeList: Node[] } {
    const [childCount, metadataCount] = [input.shift(), input.shift()];
    const parsed: Node = {
        id: id++, childCount, metadataCount,
        children: Array.from(Array(childCount), () => parse(input, id++, nodeList).parsed),
        metadata: Array.from(Array(metadataCount), () => input.shift())
    };
    nodeList.push(parsed);
    return { parsed, nodeList };
}

const { parsed: rootNode, nodeList } = parse([...input]);
console.log(`Solution Pt 1: ${sum(nodeList.map(((n) => sum(n.metadata))))}`);
console.log(`Solution Pt 2: ${getNodeValue(rootNode)}`);
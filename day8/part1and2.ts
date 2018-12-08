import { input } from './input.json';

export type Node = {
    id: number, childCount: number, metadataCount: number, children: Node[], metadata: number[]
}

const sum = (numbers: number[]) => numbers.reduce((a, b) => a + b, 0);

const getNodeValue = (node: Node) => (node.childCount === 0) ?
    sum(node.metadata) :
    node.metadata
        .filter((i) => i <= node.children.length && i > 0)
        .map((idx) => getNodeValue(node.children[idx - 1]))
        .reduce((a, b) => a + b, 0);

function parse(input: number[], id: number, nodes: Node[]): { node: Node, nodeList: Node[] } {
    const [childCount, metadataCount] = [input.shift(), input.shift()];
    const parsed: Node = {
        id: id++, childCount, metadataCount,
        children: Array.from(Array(childCount), () => parse(input, id++, nodes)).map((n) => n.node),
        metadata: Array.from(Array(metadataCount), () => input.shift())
    };
    nodes.push(parsed);
    return { node: parsed, nodeList: nodes };
}

const { node: rootNode, nodeList } = parse([...input], 0, []);
console.log(`Solution Pt 1: ${sum(nodeList.map(((n) => sum(n.metadata))))}`);
console.log(`Solution Pt 2: ${getNodeValue(rootNode)}`);
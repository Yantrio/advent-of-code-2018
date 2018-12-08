import { input } from './input.json';

let steps =
  ["Step C must be finished before step A can begin.",
    "Step C must be finished before step F can begin.",
    "Step A must be finished before step B can begin.",
    "Step A must be finished before step D can begin.",
    "Step B must be finished before step E can begin.",
    "Step D must be finished before step E can begin.",
    "Step F must be finished before step E can begin."];

steps = input as string[];

interface TreeNode {
  step: string, dependsOn: TreeNode[], ready: boolean, resolved: boolean
}

class Worker {
  public workingOn: TreeNode;
  public timeRemaining: number;
  constructor(public id: number) {
  }

  public startWorkingOn(node: TreeNode) {
    if (node == undefined) {
      return;
    }
    this.workingOn = node;
    this.timeRemaining = 60 + node.step.charCodeAt(0) - 64;
  }

  public work() {
    if (this.workingOn) {
      if (--this.timeRemaining <= 0) {
        resolveItem(this.workingOn, nodeList, resolved)
        this.workingOn = undefined;
      }

    }
  }
}

const stepParser = /Step (.*) must be finished before step (.*) can begin./;
const parsedSteps = steps.map((s) => stepParser.exec(s)).map((s) => ({
  step: s[1],
  child: s[2]
}));

const nodeList: TreeNode[] = [];
Array.from(new Set(parsedSteps.map((s) => s.step).concat(parsedSteps.map((s) => s.child))))
  .forEach((s) => {
    if (!nodeList.find((n) => n.step === s)) {
      nodeList.push({ step: s, dependsOn: [], ready: false, resolved: false });
    }
  });

parsedSteps.forEach((d) => {
  const parent = nodeList.find((n) => n.step === d.step);
  const child = nodeList.find((n) => n.step === d.child);
  child.dependsOn.push(parent);
});

function resolveItem(node: TreeNode, nodeList: TreeNode[], resolved: TreeNode[]) {
  resolved.push(node);
  node.resolved = true;
  const dependants = nodeList.filter((n) => n.dependsOn.includes(node));
  dependants.forEach((d) => {
    //if all parents are resolved, mark as ready
    if (!d.dependsOn.find((p) => !p.resolved)) {
      d.ready = true;
    }
  })
}

let firstItems = nodeList.filter((node) => node.dependsOn.length === 0);
firstItems.forEach((f) => f.ready = true);

let resolved: TreeNode[] = [];
while (true) {
  const toResolveNext = nodeList.filter((n) => n.ready && !n.resolved)
    .sort((a, b) => a.step.charCodeAt(0) - b.step.charCodeAt(0));
  if (!toResolveNext[0]) { break; }
  resolveItem(toResolveNext[0], nodeList, resolved);
}

console.log(`Solution: ${resolved.map((r) => r.step).join('')}`);

// reset for part 2
resolved = [];
nodeList.forEach((n) => { n.ready = false; n.resolved = false; })

const workers: Worker[] = Array(5).fill('').map((_, id) => new Worker(id));
firstItems = nodeList.filter((node) => node.dependsOn.length === 0);
firstItems.forEach((f) => f.ready = true);

let counter = 0;
while (true) {
  const nextUp = nodeList.filter((n) => n.ready && !n.resolved)
    .filter((n) => !workers.map((w) => w.workingOn).includes(n))
    .sort((a, b) => a.step.charCodeAt(0) - b.step.charCodeAt(0));

  const freeWorkers = workers.filter((w) => w.workingOn === undefined);
  freeWorkers
    .slice(0, Math.min(...[freeWorkers.length, nextUp.length]))
    .forEach((w, idx) => w.startWorkingOn(nextUp[idx]))

  const workingWorkers = workers.filter((w) => w.workingOn !== undefined);
  workingWorkers.forEach((w) => w.work());

  if (workingWorkers.length === 0) {
    break;
  }
  counter++;
}
console.log(`Solution ${counter}`);
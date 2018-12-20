import * as fs from 'fs';

type Position = { x: number, y: number };
type Room = { pos: Position, doors: Room[], dist: number };

function getOrCreateRoom(allRooms: Room[], pos: Position): Room {
    const found = allRooms.find((r) => r.pos.x == pos.x && r.pos.y == pos.y);
    if (found) {
        return found;
    }
    const room = { pos: { ...pos }, doors: [], dist: Number.MAX_VALUE };
    allRooms.push(room);
    return room;
}

function addRoom(allRooms: Room[], currentRoom: Room, direction: Position): Room {
    const newRoom = getOrCreateRoom(allRooms, { x: currentRoom.pos.x + direction.x, y: currentRoom.pos.y + direction.y });
    newRoom.dist = Math.min(currentRoom.dist + 1, newRoom.dist);
    currentRoom.doors.push(newRoom);
    return newRoom;
}

const Directions = {
    N: { x: 0, y: -1 },
    S: { x: 0, y: 1 },
    E: { x: 1, y: 1 },
    W: { x: -1, y: -1 }
}

function parse(input: string) {
    let newRoom: Room;
    const chars = input.split('');
    let currentRoom: Room = { pos: { x: 0, y: 0 }, doors: [], dist: 0 };
    const allRooms: Room[] = [currentRoom];
    const stack: Room[] = [currentRoom];
    for (let c of chars) {
        switch (c) {
            case "N": case "S": case "E": case "W": {
                currentRoom = addRoom(allRooms, currentRoom, Directions[c]); break;
            }
            case "(": { stack.push(currentRoom); break; }
            case ")": { currentRoom = stack.pop(); break; }
            case "|": { currentRoom = stack[stack.length - 1]; break; } //child iteration
            default: break;
        }
    }
    return allRooms;
}

const input = fs.readFileSync('./input.txt', 'utf8');
const allRooms = parse(input);
console.log(`Solution pt1: ${Math.max(...allRooms.map((r) => r.dist))}`);
console.log(`Solution pt2: ${allRooms.filter((r) => r.dist > 999).length}`);
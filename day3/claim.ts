export class Claim {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;

    public static fromInputString(input: string): Claim {
        const parser = /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/;
        const [, id, x, y, width, height] = parser.exec(input) || [] as string[];
        return {
            id: +id, x: +x, y: +y, width: +width, height: +height
        }
    }
}


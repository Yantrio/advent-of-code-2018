export class Array2d<T> {
    public rawData: Array<T> = [];
    constructor(public width: number, public height: number) {
        this.rawData = Array(width * height);
    }

    static FromData<T>(data: Array<T>, width: number, height: number) {
        if (width * height !== data.length) {
            throw new Error('The data is not the correct length');
        }
        const result = new Array2d<T>(width, height);
        result.rawData = data;
        return result;
    }

    public get(x: number, y: number): T {
        if (x > this.width - 1 || y > this.height - 1) {
            throw new Error('Out of bounds');
        }
        const idx = (y * this.width) + x;
        return this.rawData[idx];
    }
    public set(x: number, y: number, data: T) {
        this.rawData[y * this.width + x] = data;
    }

    public get2DArray(): Array<Array<T>> {
        const result: Array<Array<T>> = [];
        const chunkSize = this.width;
        for (let y = 0; y < this.height; y++) {
            result.push(this.rawData.slice(y * chunkSize, y * chunkSize + chunkSize))
        }
        return result;
    }
}
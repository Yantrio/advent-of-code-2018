export interface PolymerUnit {
    type: string;
    polarity: boolean;
}

export class Polymer {
    public units: Array<PolymerUnit>;

    constructor(input: string) {
        this.units = input.split('').map(Polymer.parseUnit);
    }

    private static parseUnit(unit: string): PolymerUnit {
        return {
            type: unit.toLowerCase(),
            polarity: /[A-Z]/.test(unit)
        }
    }

    public collapseDown() {
        const markedForDeletion = [];
        for (let i = 0; i < this.units.length - 1; i++) {
            const current = this.units[i];
            const next = this.units[i + 1];
            if (current.type === next.type && current.polarity !== next.polarity) {
                markedForDeletion.push(i, i + 1);
                i++; //skip the next one 
            }
        }
        for (let idx of markedForDeletion.sort((a, b) => b - a)) {
            this.units.splice(idx, 1);
        }

        return markedForDeletion.length;
    }

    public removeType(type: string) {
        const toKeep = this.units.filter((u) => u.type !== type);
        this.units = toKeep;
    }

    public toString() {
        return this.units.map((u) => {
            const type = u.type;
            return u.polarity ? type.toUpperCase() : type.toLowerCase()
        }).join('');
    }
}
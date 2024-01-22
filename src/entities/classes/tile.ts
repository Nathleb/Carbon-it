import { Biome } from "../types/biome.type";

export class Tile {
    private _nbrTreasures: number;
    private _biome: Biome;
    private _hasAdventurer: boolean;


    constructor(biome: Biome, nbrTreasures: number, hasAdventurer: boolean) {
        if (nbrTreasures < 0) {
            throw new Error('nbrTreasures must be positive.');
        }
        this._nbrTreasures = nbrTreasures;
        this._biome = biome;
        this._hasAdventurer = hasAdventurer;
    }

    /**
     * Getter nbrTreasures
     * @return {number}
     */
    public get nbrTreasures(): number {
        return this._nbrTreasures;
    }

    /**
     * Getter biome
     * @return {Biome}
     */
    public get biome(): Biome {
        return this._biome;
    }

    /**
     * Getter hasAdventurer
     * @return {boolean}
     */
    public get hasAdventurer(): boolean {
        return this._hasAdventurer;
    }

    /**
     * Setter nbrTreasures
     * @param {number} value
     */
    public set nbrTreasures(value: number) {
        if (value < 0) {
            throw new Error('nbrTreasures must be positive.');
        }
        this._nbrTreasures = value;
    }

    /**
     * Setter biome
     * @param {Biome} value
     */
    public set biome(value: Biome) {
        this._biome = value;
    }

    /**
     * Setter hasAdventurer
     * @param {boolean} value
     */
    public set hasAdventurer(value: boolean) {
        this._hasAdventurer = value;
    }

}
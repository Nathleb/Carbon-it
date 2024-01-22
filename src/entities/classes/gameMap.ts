import { BIOME } from "../types/biome.type";
import { Point } from "./point";
import { Tile } from "./tile";

export class GameMap {
    private _height: number;
    private _width: number;
    private _tileMap: Map<string, Tile>;


    constructor(height: number, width: number, tileMap: Map<string, Tile>) {
        if (height < 1 || width < 1) {
            throw new Error('Invalid map dimensions');
        }
        this._height = height;
        this._width = width;
        this._tileMap = tileMap;
    }

    /**
     * Getter height
     * @return {number}
     */
    public get height(): number {
        return this._height;
    }

    /**
     * Getter width
     * @return {number}
     */
    public get width(): number {
        return this._width;
    }

    /**
     * Getter tileMap
     * @return {Map<string, Tile>}
     */
    public get tileMap(): Map<string, Tile> {
        return new Map(this._tileMap);
    }

    /**
     * Setter tileMap
     * @param {Map<string, Tile>} value
     */
    public set tileMap(value: Map<string, Tile>) {
        this._tileMap = value;
    }


    /**
     * 
     * @returns 
     */
    public toString() {
        let array: string[][] = [];

        for (let i = 0; i < this._height; i++) {
            array[i] = [];
            for (let j = 0; j < this._width; j++) {
                const tile = this._tileMap.get(new Point(j, i).toHash());
                if (tile) {
                    if (tile.hasAdventurer) {
                        array[i][j] = "A";
                    }
                    else if (tile.biome === BIOME.MONTAGNE) {
                        array[i][j] = "M";
                    }
                    else {
                        array[i][j] = `${tile.nbrTreasures}`;
                    }
                }
                else {
                    array[i][j] = ".";
                }
            }
        }
        return array;
    }

}
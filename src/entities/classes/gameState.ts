import { Adventurer } from "./adventurer";
import { GameMap } from "./gameMap";

export class GameState {
    private _gameMap: GameMap;
    private _adventurers: Array<Adventurer>;
    private _retiredAdventurers: Array<Adventurer>;
    private _turn: number;

    constructor(gameMap: GameMap, adventurers: Array<Adventurer>, retiredAdventurers: Array<Adventurer>, turn: number) {
        this._turn = turn;
        this._gameMap = gameMap;
        this._adventurers = adventurers;
        this._retiredAdventurers = retiredAdventurers;
    }

    /**
     * Getter turn
     * @return {number}
     */
    public get turn(): number {
        return this._turn;
    }

    /**
     * Getter gameMap
     * @return {GameMap}
     */
    public get gameMap(): GameMap {
        return this._gameMap;
    }

    /**
     * Getter adventurers
     * @return {Array<Adventurer>}
     */
    public get adventurers(): Array<Adventurer> {
        return [...this._adventurers];
    };

    /**
    * Getter retiredAdventurers
    * @return {Array<Adventurer>}
    */
    public get retiredAdventurers(): Array<Adventurer> {
        return [...this._retiredAdventurers];
    };

    /**
     * Setter gameMap
     * @param {GameMap} value
     */
    public set gameMap(value: GameMap) {
        this._gameMap = value;
    }

    /**
     * Setter adventurers
     * @param {Array<Adventurer>} value
     */
    public set adventurers(value: Array<Adventurer>) {
        this._adventurers = value;
    }

    /**
     * Setter retiredAdventurers
     * @param {Array<retiredAdventurers>} value
     */
    public set retiredAdventurers(value: Array<Adventurer>) {
        this._retiredAdventurers = value;
    }

    /**
     * Setter turn
     * @param {number} value
     */
    public set turn(value: number) {
        this._turn = value;
    }

}
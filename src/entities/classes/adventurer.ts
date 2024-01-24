import { Movement } from "../types/movement.type";
import { Orientation } from "../types/orientation.type";
import { Point } from "./point";

export class Adventurer {
    private _name: string;
    private _position: Point;
    private _orientation: Orientation;
    private _nbrTreasures: number;
    private _pathing: Movement[];
    private _isOutOfBond: boolean;

    constructor(name: string, position: Point, orientation: Orientation, pathing: Movement[], nbrTreasures: number, isOutOfBond: boolean) {
        this._name = name;
        this._position = position;
        this._orientation = orientation;
        this._nbrTreasures = nbrTreasures;
        this._pathing = pathing;
        this._isOutOfBond = isOutOfBond;
    }

    /**
     * Getter name
     * @return {string}
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Getter isOutOfBond
     * @return {boolean}
     */
    public get isOutOfBond(): boolean {
        return this._isOutOfBond;
    }

    /**
     * Getter position
     * @return {Point}
     */
    public get position(): Point {
        return this._position;
    }

    /**
     * Getter orientation
     * @return {Orientation}
     */
    public get orientation(): Orientation {
        return this._orientation;
    }

    /**
     * Getter nbrTreasures
     * @return {number}
     */
    public get nbrTreasures(): number {
        return this._nbrTreasures;
    }

    /**
     * Getter pathing
     * @return {string}
     */
    public get pathing(): Movement[] {
        return this._pathing;
    }

    /**
     * Setter name
     * @param {string} value
     */
    public set name(value: string) {
        this._name = value;
    }

    /**
     * Setter position
     * @param {Point} value
     */
    public set position(value: Point) {
        this._position = value;
    }

    /**
     * Setter orientation
     * @param {Orientation} value
     */
    public set orientation(value: Orientation) {
        this._orientation = value;
    }

    /**
     * Setter nbrTreasures
     * @param {number} value
     */
    public set nbrTreasures(value: number) {
        this._nbrTreasures = value;
    }

    /**
     * Setter pathing
     * @param {string} value
     */
    public set pathing(value: Movement[]) {
        this._pathing = value;
    }

    /**
     * Setter isOutOfBond
     * @param {boolean} value
     */
    public set isOutOfBond(value: boolean) {
        this._isOutOfBond = value;
    }
}
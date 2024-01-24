export class Point {
    private readonly _x: number;
    private readonly _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    /**
     * Getter x
     * @return {x}
     */
    get x(): number {
        return this._x;
    }

    /**
    * Getter y
    * @return {y}
    */
    get y(): number {
        return this._y;
    }

    toHash(): string {
        return `${this._x}-${this._y}`;
    }
}
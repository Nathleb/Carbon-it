import { Adventurer } from "../entities/classes/adventurer";
import { GameMap } from "../entities/classes/gameMap";
import { Point } from "../entities/classes/point";
import { Tile } from "../entities/classes/tile";
import { PARSECODE } from "../entities/enums/parseCode.enum";
import { BIOME } from "../entities/types/biome.type";
import { Movement } from "../entities/types/movement.type";
import { Orientation } from "../entities/types/orientation.type";
import { toMovementArray } from "../utils/movement.utils";
import { toOrientation } from "../utils/orientation.utils";

/**
 * Parse line that gives the map dimensions
 * @param parsedLine 
 * @param lineNumber 
 * @returns 
 */
export function parseMapLine(parsedLine: string[], lineNumber: number): GameMap {
    if (parsedLine.length !== 3) {
        throw new Error(`Invalid number of parameters | line ${lineNumber}`);
    }
    const width = parseInt(parsedLine[1], 10);
    const height = parseInt(parsedLine[2], 10);

    if (isNaN(width) || isNaN(height)) {
        throw new Error(`Non-numeric parameters | line ${lineNumber}`);
    }

    try {
        return new GameMap(height, width, new Map<string, Tile>());
    }
    catch (error) {
        throw new Error(`Invalid entry | line ${lineNumber}: ${error}`);
    }
}

/**
 * Parse line that gives the position of a treasure
 * @param parsedLine 
 * @param lineNumber 
 * @returns 
 */
export function parseTreasureLine(parsedLine: string[], lineNumber: number): [Point, Tile] {
    if (parsedLine.length !== 4) {
        throw new Error(`Invalid number of parameters | line ${lineNumber}`);
    }
    const x: number = parseInt(parsedLine[1]);
    const y: number = parseInt(parsedLine[2]);
    const nbrTreasures: number = parseInt(parsedLine[3]);

    if (isNaN(x) || isNaN(y) || isNaN(nbrTreasures)) {
        throw new Error(`Non-numeric parameters | line ${lineNumber}`);
    }

    try {
        return [new Point(x, y), new Tile(BIOME.PLAINE, nbrTreasures, false)];
    }
    catch (error) {
        throw new Error(`Invalid entry | line ${lineNumber}: ${error}`);
    }
}

/**
 * Parse parameter line for a new adventurer
 * @param parsedLine 
 * @param lineNumber 
 * @returns 
 */
export function parseAdventurerLine(parsedLine: string[], lineNumber: number): Adventurer {
    if (parsedLine.length !== 6) {
        throw new Error(`Invalid number of parameters | line ${lineNumber}`);
    }

    const name: string = parsedLine[1];
    const x: number = parseInt(parsedLine[2]);
    const y: number = parseInt(parsedLine[3]);

    if (isNaN(x) || isNaN(y)) {
        throw new Error(`Non-numeric parameters | line ${lineNumber}`);
    }

    const orientation: Orientation | undefined = toOrientation(parsedLine[4]);
    const pathing: Movement[] | undefined = toMovementArray(parsedLine[5].split(""));

    if (pathing === undefined || orientation === undefined) {
        throw new Error(`Invalid entry | line ${lineNumber}`);
    }
    try {
        return new Adventurer(name, new Point(x, y), orientation, pathing, 0, false);
    }
    catch (error) {
        throw new Error(`Invalid entry | line ${lineNumber}: ${error}`);
    }
}

/**
 * parse line that gives the position of a mountain
 * @param parsedLine 
 * @param lineNumber 
 * @returns Tuple Point Tile with mountain as biome
 */
export function parseMountainLine(parsedLine: string[], lineNumber: number): [Point, Tile] {
    if (parsedLine.length !== 3) {
        throw new Error(`Invalid number of parameters | line ${lineNumber}`);
    }
    const x: number = parseInt(parsedLine[1]);
    const y: number = parseInt(parsedLine[2]);

    if (isNaN(x) || isNaN(y)) {
        throw new Error(`Non-numeric parameters | line ${lineNumber}`);
    }

    try {
        return [new Point(x, y), new Tile(PARSECODE.Montagne, 0, false)];
    }
    catch (error) {
        throw new Error(`Invalid entry | line ${lineNumber}: ${error}`);
    }
}
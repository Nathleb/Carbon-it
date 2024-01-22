import fs from 'node:fs';
import readline from 'node:readline';
import { Adventurer } from "../entities/classes/adventurer";
import { GameMap } from "../entities/classes/gameMap";
import { GameState } from "../entities/classes/gameState";
import { Movement } from "../entities/types/movement.type";
import { Orientation } from "../entities/types/orientation.type";
import { PARSECODE } from '../entities/enums/parseCode.enum';
import { Point } from "../entities/classes/point";
import { Tile } from "../entities/classes/tile";
import { toOrientation } from '../utils/orientation.utils';
import { toMovementArray } from '../utils/movement.utils';
import { BIOME } from '../entities/types/biome.type';

export class ParseSettingsService {

    readonly SEPARATOR: string = " - ";

    public async parseSettingFile(filePath: string): Promise<GameState> {

        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });

        let adventurers: Adventurer[] = [];
        let tileMap: Map<string, Tile> = new Map<string, Tile>();
        let gameMap: GameMap | null = null;

        let lineNumber = 1;

        for await (const line of rl) {
            const parsedLineResult = this.parseLine(line.trim(), lineNumber);
            if (parsedLineResult === undefined) {
                continue;
            }
            if (parsedLineResult instanceof GameMap) {
                if (gameMap === null) {
                    gameMap = parsedLineResult;
                }
            } else if (parsedLineResult instanceof Adventurer) {
                adventurers.push(parsedLineResult);
            } else {
                tileMap = this.updateTileMap(parsedLineResult, tileMap);
            }
            lineNumber++;
        };

        if (gameMap === null) {
            throw new Error("Bad entry map");
        }

        gameMap.tileMap = tileMap;
        return new GameState(gameMap, adventurers, [], 0);
    }

    private updateTileMap(parsedLineResult: [Point, Tile], tileMap: Map<string, Tile>): Map<string, Tile> {
        const [newTileCoordinates, newTile] = parsedLineResult;
        const newMap: Map<string, Tile> = new Map(tileMap);
        const tileToChange = newMap.get(newTileCoordinates.toHash());

        if (tileToChange) {
            tileToChange.biome = tileToChange.biome === BIOME.PLAINE ? newTile.biome : BIOME.PLAINE;
            tileToChange.nbrTreasures += newTile.nbrTreasures;
            newMap.set(newTileCoordinates.toHash(), tileToChange);
        } else {
            newMap.set(newTileCoordinates.toHash(), newTile);
        }

        return newMap;
    }

    private parseLine(line: string, lineNumber: number): GameMap | Adventurer | [Point, Tile] | undefined {
        let parsedLine: string[] = line.split(this.SEPARATOR);

        if (!parsedLine[0] || parsedLine[0].startsWith("#")) {
            return undefined;
        }

        switch (parsedLine[0]) {
            case PARSECODE.Carte:
                return this.parseMapLine(parsedLine, lineNumber);
            case PARSECODE.Montagne:
                return this.parseMountainLine(parsedLine, lineNumber);
            case PARSECODE.Tresor:
                return this.parseTreasureLine(parsedLine, lineNumber);
            case PARSECODE.Aventurier:
                return this.parseAdventurerLine(parsedLine, lineNumber);
            default:
                throw new Error(`${parsedLine[0]} is not a valid entry | line ${lineNumber}`);
        }
    }

    private parseMapLine(parsedLine: string[], lineNumber: number): GameMap {
        if (parsedLine.length !== 3) {
            throw new Error(`Invalid entry | line ${lineNumber}`);
        }
        const width: number = parseInt(parsedLine[1]);
        const height: number = parseInt(parsedLine[2]);

        try {
            return new GameMap(height, width, new Map<string, Tile>());
        }
        catch (error) {
            throw new Error(`Invalid entry | line ${lineNumber}: ${error}`);
        }
    }

    private parseTreasureLine(parsedLine: string[], lineNumber: number): [Point, Tile] {
        if (parsedLine.length !== 4) {
            throw new Error(`Invalid entry | line ${lineNumber}`);
        }
        const x: number = parseInt(parsedLine[1]);
        const y: number = parseInt(parsedLine[2]);
        const nbrTreasures: number = parseInt(parsedLine[3]);

        try {
            return [new Point(x, y), new Tile(BIOME.PLAINE, nbrTreasures, false)];
        }
        catch (error) {
            throw new Error(`Invalid entry | line ${lineNumber}: ${error}`);
        }
    }

    /**
     * 
     * @param parsedLine 
     * @param lineNumber 
     * @returns 
     */
    private parseAdventurerLine(parsedLine: string[], lineNumber: number): Adventurer {
        if (parsedLine.length !== 6) {
            throw new Error(`Invalid entry | line ${lineNumber}`);
        }

        const name: string = parsedLine[1];
        const x: number = parseInt(parsedLine[2]);
        const y: number = parseInt(parsedLine[3]);

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
     * 
     * @param parsedLine 
     * @param lineNumber 
     * @returns Tuple Point Tile with mountain as biome
     */
    private parseMountainLine(parsedLine: string[], lineNumber: number): [Point, Tile] {
        if (parsedLine.length !== 3) {
            throw new Error(`Invalid entry | line ${lineNumber}`);
        }
        const x: number = parseInt(parsedLine[1]);
        const y: number = parseInt(parsedLine[2]);
        try {
            return [new Point(x, y), new Tile(PARSECODE.Montagne, 0, false)];
        }
        catch (error) {
            throw new Error(`Invalid entry | line ${lineNumber}: ${error}`);
        }
    }

}
import fs from 'node:fs';
import readline from 'node:readline';
import { Adventurer } from "../entities/classes/adventurer";
import { GameMap } from "../entities/classes/gameMap";
import { GameState } from "../entities/classes/gameState";
import { PARSECODE } from '../entities/enums/parseCode.enum';
import { Point } from "../entities/classes/point";
import { Tile } from "../entities/classes/tile";
import { BIOME } from '../entities/types/biome.type';
import { parseAdventurerLine, parseMapLine, parseMountainLine, parseTreasureLine } from '../managers/lineParser.manager';

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
        let parsedLine: string[] = line.split(this.SEPARATOR).filter(str => str.length > 0);

        if (!parsedLine[0] || parsedLine[0].startsWith("#")) {
            return undefined;
        }

        switch (parsedLine[0]) {
            case PARSECODE.Carte:
                return parseMapLine(parsedLine, lineNumber);
            case PARSECODE.Montagne:
                return parseMountainLine(parsedLine, lineNumber);
            case PARSECODE.Tresor:
                return parseTreasureLine(parsedLine, lineNumber);
            case PARSECODE.Aventurier:
                return parseAdventurerLine(parsedLine, lineNumber);
            default:
                throw new Error(`${parsedLine[0]} is not a valid entry | line ${lineNumber}`);
        }
    }
}
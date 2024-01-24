import { GameMap } from "../entities/classes/gameMap";
import { GameState } from "../entities/classes/gameState";
import { Point } from "../entities/classes/point";
import { Tile } from "../entities/classes/tile";
import { BIOME } from "../entities/types/biome.type";
import { Adventurer } from "../entities/classes/adventurer";


export function logFinalGameState(gameState: GameState): string {

    const map: GameMap = gameState.gameMap;
    let gameStateString: string = `C - ${map.width} - ${map.height}\n`;
    let biomeString = "";
    let treasureString = "";
    let adventurerString = "";

    map.tileMap.forEach((tile: Tile, hash: string) => {
        const [x, y] = hash.split("-");
        if (tile.nbrTreasures > 0) {
            treasureString += `T - ${x} - ${y} - ${tile.nbrTreasures}\n`;
        }
        if (tile.biome !== BIOME.PLAINE) {
            biomeString += `${tile.biome} - ${x} - ${y}\n`;
        }
    });

    gameStateString += biomeString + treasureString;
    gameState.retiredAdventurers.forEach((adv) => {
        adventurerString += adv.isOutOfBond
            ? ``
            : `A - ${adv.name} - ${adv.position.x} - ${adv.position.y} - ${adv.orientation} - ${adv.nbrTreasures}\n`;
    });

    return gameStateString + adventurerString;
}

export function logMap(map: GameMap, adventurers: Adventurer[], maxCellWidth: number): string {

    let formattedString = "";
    for (let i = 0; i < map.height; i++) {
        for (let j = 0; j < map.width; j++) {
            const position = new Point(j, i).toHash();
            const tile = map.tileMap.get(position);
            if (tile) {
                const adv = adventurers.find(
                    (adv) => adv.position.toHash() === position
                );
                let str: string;
                if (adv) {
                    str = `A (${adv.name})`;
                } else if (tile.biome !== BIOME.PLAINE) {
                    str = `${tile.biome}`;
                } else {
                    str = `T (${tile.nbrTreasures})`;
                }
                const paddedStr = str
                    .padEnd(maxCellWidth)
                    .slice(0, maxCellWidth);
                formattedString += paddedStr;
            } else {
                formattedString += ".".padEnd(maxCellWidth);
            }
        }
        formattedString += "\n";
    }
    return formattedString;
}

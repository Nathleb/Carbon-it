import { Adventurer } from "../entities/classes/adventurer";
import { GameMap } from "../entities/classes/gameMap";
import { Point } from "../entities/classes/point";
import { Tile } from "../entities/classes/tile";
import { BIOME } from "../entities/types/biome.type";
import { MOUVEMENT, Movement } from "../entities/types/movement.type";
import { ORIENTATION, Orientation } from "../entities/types/orientation.type";

/**
 * Check if the adventurer if out of the map
 * @param x 
 * @param y 
 * @param map 
 * @returns true if the adventurer is out of bond
 */
export function isAdventurerOutOfBond(x: number, y: number, map: GameMap): boolean {
    return x < 0 || y < 0 || x >= map.width || y >= map.height;
}

/**
 *  Compute return the new orientation of the adventurer after a DROITE or GAUCHE Movement
 * @param orientation 
 * @param movement 
 * @returns return the new orientation of the adventurer
 */
export function rotateAdventurer(orientation: Orientation, movement: Movement): Orientation {
    switch (orientation) {
        case ORIENTATION.NORD:
            return movement === MOUVEMENT.GAUCHE ? ORIENTATION.OUEST : ORIENTATION.EST;
        case ORIENTATION.EST:
            return movement === MOUVEMENT.GAUCHE ? ORIENTATION.NORD : ORIENTATION.SUD;
        case ORIENTATION.SUD:
            return movement === MOUVEMENT.GAUCHE ? ORIENTATION.EST : ORIENTATION.OUEST;
        default:
            return movement === MOUVEMENT.GAUCHE ? ORIENTATION.SUD : ORIENTATION.NORD;
    }
}


/**
 * Save the position of an adventurer on the tileMap for when it's entering a tile
 * @param position 
 * @param tileMap 
 * @returns the updated tileMap
 */
export function handleAdventurerEnteringTile(position: Point, tileMap: Map<string, Tile>): Map<string, Tile> {
    let tile = tileMap.get(position.toHash());

    if (tile) {
        tile.hasAdventurer = true;
    }
    else {
        tile = new Tile(BIOME.PLAINE, 0, true);
    }
    tileMap.set(position.toHash(), tile);
    return tileMap;
};

/**
 * Free a tile from the tileMap for when an adventurer leaves it
 * @param position 
 * @param tileMap 
 * @returns the updated tileMap
 */
export function handleAdventurerLeavingTile(position: Point, tileMap: Map<string, Tile>): Map<string, Tile> {
    let tile = tileMap.get(position.toHash());
    if (tile) {
        if (tile.biome === BIOME.MONTAGNE || tile.nbrTreasures > 0) {
            tile.hasAdventurer = false;
            tileMap.set(position.toHash(), tile);
        }
        else {
            tileMap.delete(position.toHash());
        }
    }
    return tileMap;
};

/**
 * Compute the theorical coordinates of the adventurer after his movement
 * @param adventurer 
 * @returns the theorical coordinates
 */
export function calculateCoordinateAfterMovement(adventurer: Adventurer): [number, number] {
    let newX: number = adventurer.position.x;
    let newY: number = adventurer.position.y;
    switch (adventurer.orientation) {
        case ORIENTATION.EST:
            newX += 1;
            break;
        case ORIENTATION.OUEST:
            newX -= 1;
            break;
        case ORIENTATION.NORD:
            newY -= 1;
            break;
        default:
            newY += 1;
            break;
    }
    return [newX, newY];
}

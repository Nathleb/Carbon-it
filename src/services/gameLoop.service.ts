import { Adventurer } from "../entities/classes/adventurer";
import { GameMap } from "../entities/classes/gameMap";
import { GameState } from "../entities/classes/gameState";
import { Point } from "../entities/classes/point";
import { Tile } from "../entities/classes/tile";
import { BIOME } from "../entities/types/biome.type";
import { MOUVEMENT, Movement } from "../entities/types/movement.type";
import { ORIENTATION, Orientation } from "../entities/types/orientation.type";

export class GameLoopService {

    public startGame(gameState: GameState) {
        gameState = this.initializeGame(gameState);
        gameState = this.gameLoop(gameState);
    };

    /**
     * time for adventurers up high in the mountain, that landed on top of their friends, or lost outside of the map to retire
     * @param gameState 
     * @returns 
     */
    private initializeGame(gameState: GameState): GameState {

        let retiredAdventurers: Adventurer[] = [];
        let adventurers: Adventurer[] = [];
        let map = gameState.gameMap;

        gameState.adventurers.forEach(adv => {
            let tile = map.tileMap.get(adv.position.toHash());
            if (this.isAdventurerOutOfBond(adv.position.x, adv.position.y, map)
                || tile?.biome === BIOME.MONTAGNE || tile?.hasAdventurer) {
                adv.isOutOfBond = true;
                retiredAdventurers.push(adv);
            }
            else {
                gameState.gameMap.tileMap = this.handleAdventurerEnteringTile(adv.position, map.tileMap);
                adventurers.push(adv);
            }
        });
        return new GameState(map, adventurers, retiredAdventurers, 0);
    }

    /**
     * As long as their is active adventurers, Iterate over them to compute their turns
     * when an adventurer has no movement left or reach an incorrect position he retires
     * @param gameState 
     * @returns 
     */
    private gameLoop(gameState: GameState): GameState {
        let map = new GameMap(gameState.gameMap.height, gameState.gameMap.width, new Map(gameState.gameMap.tileMap));
        let retiredAdventurers = [...gameState.retiredAdventurers];
        let currentTurnAdventurers: Adventurer[] = [...gameState.adventurers];
        let nextTurnAdventurers: Adventurer[] = [];

        while (currentTurnAdventurers.length > 0) {
            console.debug(map.toString());
            nextTurnAdventurers = [];
            currentTurnAdventurers.forEach(adv => {
                const movement: Movement = adv.pathing[gameState.turn];
                if (!movement) {
                    retiredAdventurers.push(adv);
                    return;
                }
                if (movement === MOUVEMENT.AVANCER) {
                    this.handleMovementAvancer(map, adv, nextTurnAdventurers, retiredAdventurers);
                }
                else {
                    adv.orientation = this.rotateAdventurer(adv.orientation, movement);
                    nextTurnAdventurers.push(adv);
                }
            });
            currentTurnAdventurers = [...nextTurnAdventurers];
            gameState.turn += 1;
        }

        return new GameState(map, currentTurnAdventurers, retiredAdventurers, gameState.turn);
    }

    /**
     * Move the adventurer of one tile if possible, collect a treasure if he succesfully moved, update directly the list of next turn adventurers and retired ones
     * @param gameState 
     * @param adventurer 
     * @param nextTurnAdventurers 
     */
    private handleMovementAvancer(gameMap: GameMap, adventurer: Adventurer, nextTurnAdventurers: Adventurer[], retiredAdventurers: Adventurer[]) {
        let movedAdventurer = this.calculateNewPosition(adventurer, gameMap);
        if (movedAdventurer) {
            if (movedAdventurer.position.toHash() !== adventurer.position.toHash()) {
                [movedAdventurer, gameMap] = this.collectTreasure(movedAdventurer, gameMap);
            }
            nextTurnAdventurers.push(movedAdventurer);
        } else {
            adventurer.isOutOfBond = true;
            retiredAdventurers.push(adventurer);
        }
    }

    /**
     * Calculate the new position of the adventurer after an AVANCER Movement
     * return a copy of the adventurer at new position
     * return undefined if the adventure is outOfBond
     * @param adventurer 
     * @param map 
     * @returns 
     */
    private calculateNewPosition(adventurer: Adventurer, map: GameMap): Adventurer | undefined {
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
        if (this.isAdventurerOutOfBond(newX, newY, map)) {
            map.tileMap = this.handleAdventurerLeavingTile(adventurer.position, map.tileMap);
            return undefined;
        }
        const newPos = new Point(newX, newY);
        let newTile: Tile | undefined = map.tileMap.get(newPos.toHash());
        if (newTile?.biome === BIOME.MONTAGNE || newTile?.hasAdventurer === true) {
            return new Adventurer(adventurer.name, adventurer.position, adventurer.orientation, adventurer.pathing, adventurer.nbrTreasures, false);
        }
        map.tileMap = this.handleAdventurerEnteringTile(newPos, map.tileMap);
        map.tileMap = this.handleAdventurerLeavingTile(adventurer.position, map.tileMap);
        return new Adventurer(adventurer.name, newPos, adventurer.orientation, adventurer.pathing, adventurer.nbrTreasures, false);
    }

    /**
     * Move a treasure from the tile to the adventurer if the tile has one or more treasures
     * @param adventurer 
     * @param map 
     * @returns 
     */
    private collectTreasure(adventurer: Adventurer, map: GameMap): [Adventurer, GameMap] {
        const positionHash = new Point(adventurer.position.x, adventurer.position.y).toHash();
        const currentTile: Tile | undefined = map.tileMap.get(positionHash);
        const nbrTreasures: number | undefined = currentTile?.nbrTreasures;
        if (!currentTile || !nbrTreasures || nbrTreasures <= 0) {
            return [adventurer, map];
        }
        adventurer.nbrTreasures += 1;
        map.tileMap = map.tileMap.set(positionHash, new Tile(currentTile.biome, nbrTreasures - 1, currentTile.hasAdventurer));
        return [adventurer, map];
    }

    /**
     * return true if the adventurer if out of the map
     * @param x 
     * @param y 
     * @param map 
     * @returns 
     */
    private isAdventurerOutOfBond(x: number, y: number, map: GameMap): boolean {
        return x < 0 || y < 0 || x >= map.width || y >= map.height;
    }

    /**
     * return the new orientation of the adventurer after a DROITE or GAUCHE Movement
     * @param orientation 
     * @param movement 
     * @returns 
     */
    private rotateAdventurer(orientation: Orientation, movement: Movement): Orientation {
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
     * Save the position of an adventurer entering a tile
     * @param position 
     * @param tileMap 
     * @returns 
     */
    private handleAdventurerEnteringTile(position: Point, tileMap: Map<string, Tile>): Map<string, Tile> {
        let tile = tileMap.get(position.toHash());

        if (tile) {
            tile.hasAdventurer = true;
        }
        else {
            tile = new Tile(BIOME.PLAINE, 0, true);
        }
        tileMap.set(position.toHash(), tile);
        return tileMap;
    }

    /**
     * Free a tile when an adventurer leaves it
     * @param position 
     * @param tileMap 
     * @returns 
     */
    private handleAdventurerLeavingTile(position: Point, tileMap: Map<string, Tile>): Map<string, Tile> {
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
    }
}

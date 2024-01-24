import { Adventurer } from "../entities/classes/adventurer";
import { GameMap } from "../entities/classes/gameMap";
import { GameState } from "../entities/classes/gameState";
import { Point } from "../entities/classes/point";
import { Tile } from "../entities/classes/tile";
import { BIOME } from "../entities/types/biome.type";
import { MOUVEMENT, Movement } from "../entities/types/movement.type";
import { calculateCoordinateAfterMovement, handleAdventurerEnteringTile, handleAdventurerLeavingTile, isAdventurerOutOfBond, rotateAdventurer } from "../managers/adventurerMovement.manager";
import { logMap } from "../managers/gameLog.manager";

export class GameLoopService {

    public startGame(gameState: GameState) {
        gameState = this.initializeGame(gameState);
        return this.gameLoop(gameState);
    };

    /**
     * time for adventurers up high in the mountain, that landed on top of their friends, or lost outside of the map to retire
     * @param gameState 
     * @returns the initial game state
     */
    private initializeGame(gameState: GameState): GameState {

        let retiredAdventurers: Adventurer[] = [];
        let adventurers: Adventurer[] = [];
        let map = gameState.gameMap;

        gameState.adventurers.forEach(adv => {
            let tile = map.tileMap.get(adv.position.toHash());
            if (isAdventurerOutOfBond(adv.position.x, adv.position.y, map)
                || tile?.biome === BIOME.MONTAGNE || tile?.hasAdventurer) {
                adv.isOutOfBond = true;
                retiredAdventurers.push(adv);
            }
            else {
                gameState.gameMap.tileMap = handleAdventurerEnteringTile(adv.position, map.tileMap);
                adventurers.push(adv);
            }
        });
        return new GameState(map, adventurers, retiredAdventurers, 0);
    }

    /**
     * As long as there is active adventurers, Iterate over them to compute their turns
     * when an adventurer has no movement left or reach an incorrect position he retires
     * @param gameState 
     * @returns the finale gameState of the game
     */
    private gameLoop(gameState: GameState): GameState {
        let map = new GameMap(gameState.gameMap.height, gameState.gameMap.width, new Map(gameState.gameMap.tileMap));
        let retiredAdventurers = gameState.retiredAdventurers;
        let currentTurnAdventurers: Adventurer[] = gameState.adventurers;
        let nextTurnAdventurers: Adventurer[];

        while (currentTurnAdventurers.length > 0) {
            console.debug(logMap(map, [...currentTurnAdventurers, ...retiredAdventurers], 10));
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
                    adv.orientation = rotateAdventurer(adv.orientation, movement);
                    nextTurnAdventurers.push(adv);
                }
            });
            currentTurnAdventurers = nextTurnAdventurers;
            gameState.turn += 1;
        }

        return new GameState(map, currentTurnAdventurers, retiredAdventurers, gameState.turn);
    }

    /**
     * Move the adventurer of one tile if possible, collect a treasure if he succesfully moved, update directly the list of next turn adventurers and retired ones
     * modifies directly gameMap, nextTurnAdventurers and retiredAdventurers
     * @param gameState 
     * @param adventurer 
     * @param nextTurnAdventurers 
     */
    private handleMovementAvancer(gameMap: GameMap, adventurer: Adventurer, nextTurnAdventurers: Adventurer[], retiredAdventurers: Adventurer[]) {
        let adventurerAfterMovement: Adventurer | undefined = this.calculateNextPosition(adventurer, gameMap);

        if (adventurerAfterMovement) {
            if (adventurerAfterMovement.position.toHash() !== adventurer.position.toHash()) {
                this.collectTreasure(adventurerAfterMovement, gameMap);
            }
            nextTurnAdventurers.push(adventurerAfterMovement);
        } else {
            adventurer.isOutOfBond = true;
            retiredAdventurers.push(adventurer);
        }
    }

    /**
     * Moves the adventurer after an AVANCER Movement
     * @param adventurer 
     * @param map 
     * @returns  a copy of the adventurer at new position or  undefined if the adventure is outOfBond
     */
    private calculateNextPosition(adventurer: Adventurer, map: GameMap): Adventurer | undefined {
        const [newX, newY] = calculateCoordinateAfterMovement(adventurer);
        const tileMap: Map<string, Tile> = map.tileMap;

        if (isAdventurerOutOfBond(newX, newY, map)) {
            map.tileMap = handleAdventurerLeavingTile(adventurer.position, tileMap);
            return undefined;
        }

        const newPos = new Point(newX, newY);
        let newTile: Tile | undefined = tileMap.get(newPos.toHash());

        if (newTile?.biome === BIOME.MONTAGNE || newTile?.hasAdventurer === true) {
            return new Adventurer(adventurer.name, adventurer.position, adventurer.orientation, adventurer.pathing, adventurer.nbrTreasures, false);
        }

        map.tileMap = handleAdventurerLeavingTile(adventurer.position, tileMap);
        map.tileMap = handleAdventurerEnteringTile(newPos, tileMap);
        return new Adventurer(adventurer.name, newPos, adventurer.orientation, adventurer.pathing, adventurer.nbrTreasures, false);
    }

    /**
     * Move a treasure from the tile to the adventurer if the tile has one or more treasures
     * modifies directly the tileMap and the avdenturer Objects
     * @param adventurer 
     * @param map 
     * @returns 
     */
    private collectTreasure(adventurer: Adventurer, map: GameMap): Adventurer {
        const positionHash = new Point(adventurer.position.x, adventurer.position.y).toHash();
        const currentTile: Tile | undefined = map.tileMap.get(positionHash);
        const nbrTreasures: number | undefined = currentTile?.nbrTreasures;
        if (!currentTile || !nbrTreasures || nbrTreasures <= 0) {
            return adventurer;
        }
        adventurer.nbrTreasures += 1;
        map.tileMap = map.tileMap.set(positionHash, new Tile(currentTile.biome, nbrTreasures - 1, currentTile.hasAdventurer));
        return adventurer;
    }
}

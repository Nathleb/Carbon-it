import { Adventurer } from "../entities/classes/adventurer";
import { GameMap } from "../entities/classes/gameMap";
import { Point } from "../entities/classes/point";
import { Tile } from "../entities/classes/tile";
import { BIOME } from "../entities/types/biome.type";
import { MOUVEMENT } from "../entities/types/movement.type";
import { ORIENTATION } from "../entities/types/orientation.type";
import { calculateCoordinateAfterMovement, handleAdventurerEnteringTile, handleAdventurerLeavingTile, isAdventurerOutOfBond, rotateAdventurer } from "./adventurerMovement.manager";



describe('isAdventurerOutOfBond', () => {
    it('should return true if adventurer is out of bounds', () => {
        const map: GameMap = new GameMap(5, 5, new Map<string, Tile>());
        expect(isAdventurerOutOfBond(-1, 2, map)).toBe(true);
        expect(isAdventurerOutOfBond(2, -1, map)).toBe(true);
        expect(isAdventurerOutOfBond(6, 2, map)).toBe(true);
        expect(isAdventurerOutOfBond(2, 6, map)).toBe(true);
    });

    it('should return false if adventurer is within bounds', () => {
        const map: GameMap = new GameMap(5, 5, new Map<string, Tile>());
        expect(isAdventurerOutOfBond(2, 2, map)).toBe(false);
        expect(isAdventurerOutOfBond(0, 0, map)).toBe(false);
        expect(isAdventurerOutOfBond(4, 4, map)).toBe(false);
    });
});

describe('rotateAdventurer', () => {
    it('should return the new orientation after a GAUCHE movement', () => {
        expect(rotateAdventurer(ORIENTATION.NORD, MOUVEMENT.GAUCHE)).toBe(ORIENTATION.OUEST);
        expect(rotateAdventurer(ORIENTATION.EST, MOUVEMENT.GAUCHE)).toBe(ORIENTATION.NORD);
        expect(rotateAdventurer(ORIENTATION.SUD, MOUVEMENT.GAUCHE)).toBe(ORIENTATION.EST);
        expect(rotateAdventurer(ORIENTATION.OUEST, MOUVEMENT.GAUCHE)).toBe(ORIENTATION.SUD);
    });

    it('should return the new orientation after a DROITE movement', () => {
        expect(rotateAdventurer(ORIENTATION.NORD, MOUVEMENT.DROITE)).toBe(ORIENTATION.EST);
        expect(rotateAdventurer(ORIENTATION.EST, MOUVEMENT.DROITE)).toBe(ORIENTATION.SUD);
        expect(rotateAdventurer(ORIENTATION.SUD, MOUVEMENT.DROITE)).toBe(ORIENTATION.OUEST);
        expect(rotateAdventurer(ORIENTATION.OUEST, MOUVEMENT.DROITE)).toBe(ORIENTATION.NORD);
    });
});


describe('handleAdventurerEnteringTile', () => {

    it('should update the tileMap when adventurer enters on an existing tile', () => {
        const initialTileMap = new Map<string, Tile>();
        const position = new Point(1, 2);

        initialTileMap.set(position.toHash(), new Tile(BIOME.MONTAGNE, 2, false));

        const updatedTileMap = handleAdventurerEnteringTile(position, initialTileMap);

        expect(updatedTileMap.size).toBe(1);
        expect(updatedTileMap.get(position.toHash())).toEqual(expect.objectContaining({ hasAdventurer: true }));
    });

    it('should create a new tile when adventurer enters a position that is not already in tileMap', () => {
        const initialTileMap = new Map<string, Tile>();
        const position = new Point(3, 4);

        const updatedTileMap = handleAdventurerEnteringTile(position, initialTileMap);

        expect(updatedTileMap.size).toBe(1);
        expect(updatedTileMap.get(position.toHash())).toEqual(expect.objectContaining({ biome: BIOME.PLAINE, nbrTreasures: 0, hasAdventurer: true }));
    });
});


describe('handleAdventurerLeavingTile', () => {
    it('should update hasAdventurer to false when adventurer leaves a tile with treasures', () => {
        const initialTileMap = new Map<string, Tile>();
        const position = new Point(1, 2);
        const tile = new Tile(BIOME.PLAINE, 2, true);

        initialTileMap.set(position.toHash(), tile);

        const updatedTileMap = handleAdventurerLeavingTile(position, initialTileMap);

        expect(updatedTileMap.has(position.toHash())).toBe(true);
        expect(updatedTileMap.get(position.toHash())).toEqual(expect.objectContaining({ biome: BIOME.PLAINE, nbrTreasures: 2, hasAdventurer: false }));
    });

    it('should remove the tile when adventurer leaves a PLAINE tile with no treasure', () => {
        const initialTileMap = new Map<string, Tile>();
        const position = new Point(3, 4);
        const tile = new Tile(BIOME.PLAINE, 0, true);

        initialTileMap.set(position.toHash(), tile);

        const updatedTileMap = handleAdventurerLeavingTile(position, initialTileMap);

        expect(updatedTileMap.has(position.toHash())).toBe(false);
    });

    it('should update hasAdventurer to false when adventurer leaves a tile with MONTAGNE biome', () => {
        const initialTileMap = new Map<string, Tile>();
        const position = new Point(3, 4);
        const tile = new Tile(BIOME.MONTAGNE, 0, true);

        initialTileMap.set(position.toHash(), tile);

        const updatedTileMap = handleAdventurerLeavingTile(position, initialTileMap);

        expect(updatedTileMap.has(position.toHash())).toBe(true);
        expect(updatedTileMap.get(position.toHash())).toEqual(expect.objectContaining({ hasAdventurer: false }));
    });
});

describe('calculateCoordinateAfterMovement', () => {
    it('should decrement y coordinate for NORD orientation', () => {
        const adventurer: Adventurer = new Adventurer("Lara", new Point(3, 2), ORIENTATION.NORD, [MOUVEMENT.AVANCER], 0, false);

        const [newX, newY] = calculateCoordinateAfterMovement(adventurer);

        expect(newX).toBe(3);
        expect(newY).toBe(1);
    });
    it('should decrement x coordinate for OUEST orientation', () => {
        const adventurer: Adventurer = new Adventurer("Lara", new Point(3, 2), ORIENTATION.OUEST, [MOUVEMENT.AVANCER], 0, false);

        const [newX, newY] = calculateCoordinateAfterMovement(adventurer);

        expect(newX).toBe(2);
        expect(newY).toBe(2);
    });
    it('should increment y coordinate for SUD orientation', () => {
        const adventurer: Adventurer = new Adventurer("Lara", new Point(3, 2), ORIENTATION.SUD, [MOUVEMENT.AVANCER], 0, false);

        const [newX, newY] = calculateCoordinateAfterMovement(adventurer);

        expect(newX).toBe(3);
        expect(newY).toBe(3);
    });
    it('should increment x coordinate for EST orientation', () => {
        const adventurer: Adventurer = new Adventurer("Lara", new Point(3, 2), ORIENTATION.EST, [MOUVEMENT.AVANCER], 0, false);

        const [newX, newY] = calculateCoordinateAfterMovement(adventurer);

        expect(newX).toBe(4);
        expect(newY).toBe(2);
    });
});
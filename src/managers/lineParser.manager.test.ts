import { GameMap } from "../../src/entities/classes/gameMap";
import { Point } from "../../src/entities/classes/point";
import { BIOME } from "../../src/entities/types/biome.type";
import { MOUVEMENT } from "../../src/entities/types/movement.type";
import { ORIENTATION } from "../../src/entities/types/orientation.type";
import { parseAdventurerLine, parseMapLine, parseTreasureLine } from "../../src/managers/lineParser.manager";

describe('parseMapLine', () => {
    it('Correct line', () => {
        const parsedLine = ['C', '3', '4'];
        const lineNumber = 1;
        const result = parseMapLine(parsedLine, lineNumber);
        expect(result).toBeInstanceOf(GameMap);
        expect(result.height).toBe(4);
        expect(result.width).toBe(3);
    });

    it('should throw an error: Wrong number of parameters', () => {
        const parsedLine = ['C', '3'];
        const lineNumber = 1;
        expect(() => parseMapLine(parsedLine, lineNumber)).toThrow(`Invalid number of parameters | line ${lineNumber}`);
    });

    it('should throw an error: Negative coordinates', () => {
        const parsedLine = ['C', '3', '-4'];
        const lineNumber = 1;
        expect(() => parseMapLine(parsedLine, lineNumber)).toThrow(`Map dimensions should be strictly positives | line ${lineNumber}`);
    });

    it('should throw an error: non-numeric', () => {
        const parsedLine = ['C', 'a', '0'];
        const lineNumber = 1;
        expect(() => parseMapLine(parsedLine, lineNumber)).toThrow();
    });
});


describe('parseTreasureLine', () => {
    it('Correct line', () => {
        const parsedLine = ['T', '3', '4', "3"];
        const lineNumber = 1;
        const result = parseTreasureLine(parsedLine, lineNumber);
        expect(result[1].nbrTreasures).toBe(3);
        expect(result[1].biome).toBe(BIOME.PLAINE);
        expect(result[0].toHash()).toBe("3-4");
    });

    it('should throw an error: Wrong number of parameters', () => {
        const parsedLine = ['T', '3', '4'];
        const lineNumber = 1;
        expect(() => parseTreasureLine(parsedLine, lineNumber)).toThrow(`Invalid number of parameters | line ${lineNumber}`);
    });

    it('should throw an error: Negative coordinates', () => {
        const parsedLine = ['T', '-3', '4', "3"];
        const lineNumber = 1;
        expect(() => parseTreasureLine(parsedLine, lineNumber)).toThrow(`Negative coordinates | line ${lineNumber}`);
    });

    it('should throw an error: non-numeric', () => {
        const parsedLine = ['T', 'a', '4', "3"];
        const lineNumber = 1;
        expect(() => parseTreasureLine(parsedLine, lineNumber)).toThrow();
    });
    it('should throw an error: Number of treasures should be positive', () => {
        const parsedLine = ['T', 'a', '4', "0"];
        const lineNumber = 1;
        expect(() => parseTreasureLine(parsedLine, lineNumber)).toThrow(`Non-numeric parameters | line ${lineNumber}`);
    });
});

describe('parseAdventurerLine', () => {
    it('Correct line', () => {
        const parsedLine = ['A', "Benjamin Gates", '3', '4', "S", "AAGD"];
        const lineNumber = 1;
        const result = parseAdventurerLine(parsedLine, lineNumber);
        expect(result.isOutOfBond).toBe(false);
        expect(result.name).toBe("Benjamin Gates");
        expect(result.position.toHash()).toBe(new Point(3, 4).toHash());
        expect(result.pathing).toStrictEqual([
            MOUVEMENT.AVANCER, MOUVEMENT.AVANCER,
            MOUVEMENT.GAUCHE, MOUVEMENT.DROITE
        ]);
        expect(result.orientation).toBe(ORIENTATION.SUD);
    });

    it('should throw an error: invalid number of parameters', () => {
        const parsedLine = ['A', 'Benjamin', '1', '2', 'N'];
        const lineNumber = 2;
        expect(() => parseAdventurerLine(parsedLine, lineNumber)).toThrow(`Invalid number of parameters | line ${lineNumber}`);
    });

    it('should throw an error: non-numeric coordinates', () => {
        const parsedLine = ['A', 'Benjamin', 'x', '2', 'N', 'AADADAGGA'];
        const lineNumber = 3;
        expect(() => parseAdventurerLine(parsedLine, lineNumber)).toThrow(`Non-numeric parameters | line ${lineNumber}`);
    });

    it('should throw an error: invalid orientation', () => {
        const parsedLine = ['A', 'Benjamin Gates', '1', '2', 'X', 'AADADAGGA'];
        const lineNumber = 4;
        expect(() => parseAdventurerLine(parsedLine, lineNumber)).toThrow(`Invalid entry | line ${lineNumber}`);
    });

    it('should throw an error: invalid pathing', () => {
        const parsedLine = ['A', 'Benjamin Gates', '1', '2', 'N', 'AAZADAGGA'];
        const lineNumber = 5;
        expect(() => parseAdventurerLine(parsedLine, lineNumber)).toThrow(`Invalid entry | line ${lineNumber}`);
    });
})


import { ParseSettingsService } from './parseSettings.service';
import { GameState } from '../entities/classes/gameState';
import { Point } from '../entities/classes/point';

jest.mock('readline');
jest.mock('fs');

describe('ParseSettingsService', () => {
    let parseSettingsService: ParseSettingsService = new ParseSettingsService();

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('parseSettingFile function', () => {

        it('Correct gameMap: Valid Map', () => {
            const map = ["C - 3 - 4", "M - 1 - 3", "T - 1 - 1 - 3", "T - 1 - 1 - 2", "#Commentaire", " A - John - 1 - 1 - S - AADADAGG"];

            const result = parseSettingsService.parseSettingFile(map);
            expect(result).toBeInstanceOf(GameState);
            expect(result.gameMap.height).toBe(4);
            expect(result.gameMap.width).toBe(3);
            expect(result.gameMap.tileMap.size).toBe(2);
            expect(result.gameMap.tileMap.get(new Point(1, 1).toHash())?.nbrTreasures).toBe(5);
            expect(result.adventurers.length).toBe(1);
            expect(result.adventurers[0].name).toBe("John");

        });

        it('should throw an error: Negative x coordinate Map', () => {
            const map = ["M - -1 - 0"];

            return expect(() => parseSettingsService.parseSettingFile(map)).toThrow("Negative coordinates | line 1");
        });

        it('should throw an error: Negative y coordinate map', () => {
            const map = ["M - 2 - -1"];

            return expect(() => parseSettingsService.parseSettingFile(map)).toThrow("Negative coordinates | line 1");
        });

        it('should throw an error: No line starting with C', () => {
            const map = ["M - 2 - 1"];

            return expect(() => parseSettingsService.parseSettingFile(map)).toThrow();
        });

        it('should throw an error: Wrong pathing', () => {
            const map = [" A - John - 1 - 1 - N - AADADAGGE"];

            return expect(() => parseSettingsService.parseSettingFile(map)).toThrow();
        });

        it('should throw an error: Negative starting position', () => {
            const map = [" A - John - -1 - 1 - E - AADADAGG"];

            return expect(() => parseSettingsService.parseSettingFile(map)).toThrow();
        });

        it('should throw an error: E is not a parsingCode', () => {
            const map = [" E - John - -1 - 1 - E - AADADAGG"];

            return expect(() => parseSettingsService.parseSettingFile(map)).toThrow("E is not a valid entry | line 1");
        });
    });
});
import readline from 'node:readline';
import fs, { ReadStream } from 'node:fs';
import { ParseSettingsService } from '../../src/services/parseSettings.service';
import { GameState } from '../../src/entities/classes/gameState';
import { Point } from '../../src/entities/classes/point';

jest.mock('readline');
jest.mock('fs');

describe('ParseSettingsService', () => {
    let parseSettingsService: ParseSettingsService;

    afterEach(() => {
        jest.restoreAllMocks();
    });

    beforeEach(() => {
        parseSettingsService = new ParseSettingsService();
        jest.spyOn(fs, 'createReadStream').mockReturnValueOnce({} as any);

    });

    describe('parseSettingFile function', () => {

        it('Valid Map', () => {
            jest.spyOn(readline, 'createInterface').mockImplementationOnce(() => {
                return ["C - 3 - 4", "M - 1 - 3", "T - 1 - 1 - 3", "T - 1 - 1 - 2", "#Commentaire", " A - John - 1 - 1 - S - AADADAGG"] as any;
            });

            (parseSettingsService.parseSettingFile("").then(result => {
                expect(result).toBeInstanceOf(GameState);
                expect(result.gameMap.height).toBe(4);
                expect(result.gameMap.width).toBe(3);
                expect(result.gameMap.tileMap.size).toBe(2);
                expect(result.gameMap.tileMap.get(new Point(1, 1).toHash())?.nbrTreasures).toBe(5);
                expect(result.adventurers.length).toBe(1);
                expect(result.adventurers[0].name).toBe("John");
            }
            ).catch(error => console.log(error)));
        });

        it('Negative x coordinate Map', () => {
            jest.spyOn(readline, 'createInterface').mockImplementationOnce(() => {
                return ["M - -1 - 0"] as any;
            });

            return expect(parseSettingsService.parseSettingFile("")).rejects.toThrow();
        });

        it('Negative y coordinate map', () => {
            jest.spyOn(readline, 'createInterface').mockImplementationOnce(() => {
                return ["M - 2 - -1"] as any;
            });

            return expect(parseSettingsService.parseSettingFile("")).rejects.toThrow();
        });

        it('No line starting with C', () => {
            jest.spyOn(readline, 'createInterface').mockImplementationOnce(() => {
                return ["M - 2 - 1"] as any;
            });

            return expect(parseSettingsService.parseSettingFile("")).rejects.toThrow();
        });

        it('Wrong pathing', () => {
            jest.spyOn(readline, 'createInterface').mockImplementationOnce(() => {
                return [" A - John - 1 - 1 - N - AADADAGGE"] as any;
            });

            return expect(parseSettingsService.parseSettingFile("")).rejects.toThrow();
        });

        it('Negative starting position', () => {
            jest.spyOn(readline, 'createInterface').mockImplementationOnce(() => {
                return [" A - John - -1 - 1 - E - AADADAGG"] as any;
            });

            return expect(parseSettingsService.parseSettingFile("")).rejects.toThrow();
        });

        it('Wrong parseCode', () => {
            jest.spyOn(readline, 'createInterface').mockImplementationOnce(() => {
                return [" E - John - -1 - 1 - E - AADADAGG"] as any;
            });

            return expect(parseSettingsService.parseSettingFile("")).rejects.toThrow("E is not a valid entry | line 1");
        });


    });
});
import { toBiome, isBiome } from './../../src/utils/biome.utils';

describe('test Orientation Utils', () => {

    describe('isBiome function', () => {
        it('should return true for valid orientations', () => {
            expect(isBiome('M')).toBeTruthy();
            expect(isBiome('P')).toBeTruthy();
        });

        it('should return false for invalid orientations', () => {
            expect(isBiome('A')).toBeFalsy();
            expect(isBiome('Z')).toBeFalsy();
            expect(toBiome('MM')).toBeFalsy();
            expect(toBiome('PP')).toBeFalsy();
        });
    });

    describe('toBiome function', () => {
        it('should return the orientation for valid inputs', () => {
            expect(toBiome('M')).toBe('M');
            expect(toBiome('P')).toBe('P');
        });

        it('should return undefined for invalid inputs', () => {
            expect(toBiome('A')).toBeUndefined();
            expect(toBiome('Z')).toBeUndefined();
            expect(toBiome('MM')).toBeUndefined();
            expect(toBiome('PP')).toBeUndefined();
        });
    });
});
import { toOrientation, isOrientation } from './../../src/utils/orientation.utils';

describe('test Orientation Utils', () => {

    describe('isOrientation function', () => {
        it('should return true for valid orientations', () => {
            expect(isOrientation('N')).toBeTruthy();
            expect(isOrientation('S')).toBeTruthy();
            expect(isOrientation('E')).toBeTruthy();
            expect(isOrientation('O')).toBeTruthy();
        });

        it('should return false for invalid orientations', () => {
            expect(isOrientation('A')).toBeFalsy();
            expect(isOrientation('Z')).toBeFalsy();
            expect(isOrientation('NN')).toBeFalsy();
            expect(isOrientation('SS')).toBeFalsy();
        });
    });

    describe('toOrientation function', () => {
        it('should return the orientation for valid inputs', () => {
            expect(toOrientation('N')).toBe('N');
            expect(toOrientation('S')).toBe('S');
            expect(toOrientation('E')).toBe('E');
            expect(toOrientation('O')).toBe('O');
        });

        it('should return undefined for invalid inputs', () => {
            expect(toOrientation('A')).toBeUndefined();
            expect(toOrientation('Z')).toBeUndefined();
            expect(toOrientation('NN')).toBeUndefined();
            expect(toOrientation('SS')).toBeUndefined();
        });
    });
});
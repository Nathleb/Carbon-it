import { toMovement, isMovement } from './../../src/utils/movement.utils';

describe('test Orientation Utils', () => {

    describe('isMovement function', () => {
        it('should return true for valid orientations', () => {
            expect(isMovement('A')).toBeTruthy();
            expect(isMovement('G')).toBeTruthy();
            expect(isMovement('D')).toBeTruthy();
        });

        it('should return false for invalid orientations', () => {
            expect(isMovement('R')).toBeFalsy();
            expect(isMovement('Z')).toBeFalsy();
            expect(toMovement('GG')).toBeFalsy();
            expect(toMovement('DD')).toBeFalsy();
        });
    });

    describe('toMovement function', () => {
        it('should return the orientation for valid inputs', () => {
            expect(toMovement('A')).toBe('A');
            expect(toMovement('G')).toBe('G');
            expect(toMovement('D')).toBe('D');
        });

        it('should return undefined for invalid inputs', () => {
            expect(toMovement('S')).toBeUndefined();
            expect(toMovement('Z')).toBeUndefined();
            expect(toMovement('MM')).toBeUndefined();
            expect(toMovement('PP')).toBeUndefined();
        });
    });
});
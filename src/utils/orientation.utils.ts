import { Movement } from "../entities/types/movement.type";
import { Orientation } from "../entities/types/orientation.type";

export function toOrientation(orientation: string): Orientation | undefined {
    if (isOrientation(orientation)) {
        return orientation as Orientation;
    }
    return undefined;
}

export function isOrientation(orientation: string): boolean {
    return ["N", "S", "E", "O"].includes(orientation);
}

export function rotate(orientation: Orientation, movement: Movement): Orientation {
    switch (orientation) {
        case 'N':
            return movement === 'G' ? 'O' : 'E';
        case 'E':
            return movement === 'G' ? 'N' : 'S';
        case 'S':
            return movement === 'G' ? 'E' : 'O';
        case 'O':
            return movement === 'G' ? 'S' : 'N';
        default:
            throw new Error('Invalid orientation');
    }
}
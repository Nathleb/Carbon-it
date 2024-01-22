import { Movement } from "../entities/types/movement.type";

export function toMovement(movement: string): Movement | undefined {
    if (isMovement(movement)) {
        return movement as Movement;
    }
    return undefined;
}

export function isMovement(movement: string): boolean {
    return ["D", "G", "A"].includes(movement);
}

export function toMovementArray(movements: string[]): Movement[] | undefined {
    const convertedArray: Movement[] = [];

    for (const movement of movements) {
        if (isMovement(movement)) {
            convertedArray.push(movement as Movement);
        } else {
            return undefined;
        }
    }
    return convertedArray;
}
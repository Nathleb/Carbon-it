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
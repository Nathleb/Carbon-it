import { Biome } from "../entities/types/biome.type";

export function toBiome(biome: string): Biome | undefined {
    if (isBiome(biome)) {
        return biome as Biome;
    }
    return undefined;
}

export function isBiome(biome: string): boolean {
    return ["P", "M"].includes(biome);
}
import { GameLoopService } from './services/gameLoop.service';
import { ParseSettingsService } from './services/parseSettings.service';
import fs from 'node:fs';
import readline from 'node:readline';
import { GameState } from './entities/classes/gameState';
import { gameStateToString } from './managers/gameLog.manager';

async function main() {
    try {
        const parseSettingsService = new ParseSettingsService();
        const gameLoopService = new GameLoopService();
        const inputFilePath = process.argv[2];
        const outputFilePath = process.argv[3] || "output.txt";
        const fileStream = fs.createReadStream(inputFilePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });

        const lines: string[] = [];
        for await (const line of rl) {
            lines.push(line);
        }

        const initialGameState: GameState = parseSettingsService.parseSettingFile(lines);
        const finalGameState: GameState = gameLoopService.startGame(initialGameState);

        const fileContent = gameStateToString(finalGameState);
        fs.writeFile(outputFilePath, fileContent, () => { });
    }
    catch (error) {
        console.error('Error occurred:', error);
    }
}


main();

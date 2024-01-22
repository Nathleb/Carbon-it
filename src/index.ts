import { GameLoopService } from './services/gameLoop.service';
import { ParseSettingsService } from './services/parseSettings.service';

function main() {
    const parseSettingsService = new ParseSettingsService();
    const gameLoopService = new GameLoopService();
    const filePath = process.argv[2];


    parseSettingsService.parseSettingFile(filePath).then(
        res => {
            gameLoopService.startGame(res);
        },
        err => {
            console.log(err);
        });
};

main();

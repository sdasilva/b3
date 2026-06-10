import Phaser from "phaser";
import { CST } from "../CST";

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.MENU
        })
    }
    init() { }
    create() {
        let startButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height * 0.66, CST.IMAGE.START);

        startButton.setInteractive();

        let hasStarted = false;
        const startGame = () => {
            if (hasStarted) {
                return;
            }
            hasStarted = true;
            this.scene.start(CST.SCENES.PLAY);
        };

        startButton.on("pointerdown", startGame);
        startButton.on("pointerup", startGame);
    }
}
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

        startButton.on("pointerup", () => {
            this.scene.start(CST.SCENES.PLAY);
        });
    }
}
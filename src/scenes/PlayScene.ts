import Phaser from "phaser";
import { CST } from "../CST";

export class PlayScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.PLAY
        });
    }
    preload() { }
    create() {
        const { width, height } = this.scale;

        this.add.image(width / 2, height * 0.4, CST.IMAGE.START);
        this.add.text(width / 2, height * 0.7, "Gameplay is coming soon", {
            color: "#ffffff",
            fontSize: "28px"
        }).setOrigin(0.5);
    }
}
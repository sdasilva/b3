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
        const fontSize = `${Math.round(Math.min(width, height) * 0.05)}px`;

        this.add.text(width / 2, height * 0.7, "Gameplay is coming soon", {
            color: "#ffffff",
            fontSize
        }).setOrigin(0.5);
    }
}
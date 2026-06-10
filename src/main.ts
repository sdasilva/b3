import Phaser from "phaser";
import { LoadScene } from "./scenes/LoadScene";
import { MenuScene } from "./scenes/MenuScene";
import { PlayScene } from "./scenes/PlayScene";

let game: Phaser.Game = new Phaser.Game({
    title: "b3",
    type: Phaser.AUTO,
    parent: "game",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 640,
        height: 960,
    },
    scene: [
        LoadScene, MenuScene, PlayScene
    ],
    input: {
        keyboard: false,
        mouse: true,
        touch: true,
        gamepad: false
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 }
        }
    },
    backgroundColor: 0x202020,
    render: {
        pixelArt: true,
        antialias: false
    }
});
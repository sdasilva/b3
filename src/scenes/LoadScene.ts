import { CST } from "../CST";

export class LoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: CST.SCENES.LOAD
        })
    }
    init() { }
    loadImages() {
        this.load.setPath("./assets/image");

        for (let prop in CST.IMAGE) {
            this.load.image(CST.IMAGE[prop], CST.IMAGE[prop]);
        }
    }
    loadAudio() {
        this.load.setPath("./assets/audio");

        for (let prop in CST.AUDIO) {
            this.load.audio(CST.AUDIO[prop], CST.AUDIO[prop]);
        }
    }
    preload() {
        this.loadImages();
        this.loadAudio();

        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff
            }
        });

        // //simulate loading
        // for (let i = 0; i < 200; i++) {
        //     this.load.spritesheet("cat" + i, "./assets/cat.png", {
        //         frameHeight: 32,
        //         frameWidth: 32
        //     });
        // }

        this.load.on("progress", (percent: number) => {
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
            console.log(percent);
        });

        this.load.on("complete", () => { });

        this.load.on("load", (file: Phaser.Loader.File) => {
            console.log(file.src);
        });
    }
    create() {
        this.scene.start(CST.SCENES.MENU);
    }
}
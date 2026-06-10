import Phaser from "phaser";
import { CST } from "../CST";

const BALL_SPEED = 380;
const PADDLE_W = 120;
const PADDLE_H = 18;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_H = 22;
const BRICK_GAP = 4;
const BRICK_TOP = 80;
const BALL_SIZE = 32;

export class PlayScene extends Phaser.Scene {
    private ball!: Phaser.Physics.Arcade.Image;
    private paddle!: Phaser.Physics.Arcade.Image;
    private bricks!: Phaser.Physics.Arcade.StaticGroup;
    private lives!: number;
    private livesText!: Phaser.GameObjects.Text;
    private gameEnded!: boolean;

    constructor() {
        super({ key: CST.SCENES.PLAY });
    }

    create() {
        const { width, height } = this.scale;

        this.gameEnded = false;
        this.lives = 3;

        this.buildTextures(width);
        this.createBricks(width);
        this.createPaddle(width, height);
        this.createBall(width, height);
        this.createHUD();
        this.setupInput(width);
    }

    private buildTextures(width: number) {
        const brickW = Math.floor((width - (BRICK_COLS + 1) * BRICK_GAP) / BRICK_COLS);
        const colors = [0xff4444, 0xff8844, 0xffcc00, 0x44cc44, 0x4488ff];

        const pg = this.make.graphics({ x: 0, y: 0 });
        pg.fillStyle(0xeeeeee);
        pg.fillRoundedRect(0, 0, PADDLE_W, PADDLE_H, 6);
        pg.generateTexture("paddle", PADDLE_W, PADDLE_H);
        pg.destroy();

        for (let r = 0; r < BRICK_ROWS; r++) {
            const g = this.make.graphics({ x: 0, y: 0 });
            g.fillStyle(colors[r % colors.length]);
            g.fillRoundedRect(0, 0, brickW, BRICK_H, 3);
            g.generateTexture(`brick_${r}`, brickW, BRICK_H);
            g.destroy();
        }
    }

    private createBricks(width: number) {
        const brickW = Math.floor((width - (BRICK_COLS + 1) * BRICK_GAP) / BRICK_COLS);
        this.bricks = this.physics.add.staticGroup();
        for (let row = 0; row < BRICK_ROWS; row++) {
            for (let col = 0; col < BRICK_COLS; col++) {
                const x = BRICK_GAP + col * (brickW + BRICK_GAP) + brickW / 2;
                const y = BRICK_TOP + row * (BRICK_H + BRICK_GAP) + BRICK_H / 2;
                this.bricks.create(x, y, `brick_${row}`);
            }
        }
    }

    private createPaddle(width: number, height: number) {
        this.paddle = this.physics.add.image(width / 2, height - 60, "paddle");
        this.paddle.setImmovable(true);
        (this.paddle.body as Phaser.Physics.Arcade.Body).allowGravity = false;
    }

    private createBall(width: number, height: number) {
        this.ball = this.physics.add.image(width / 2, height - 100, CST.SPRITE.CAT);
        this.ball.setDisplaySize(BALL_SIZE, BALL_SIZE);
        (this.ball.body as Phaser.Physics.Arcade.Body).allowGravity = false;
        this.ball.setCollideWorldBounds(true);
        this.ball.setBounce(1);
        this.physics.world.setBoundsCollision(true, true, true, false);

        const dir = Phaser.Math.Between(0, 1) === 0 ? 1 : -1;
        this.ball.setVelocity(dir * Phaser.Math.Between(100, 200), -BALL_SPEED);

        this.physics.add.collider(this.ball, this.paddle, this.onHitPaddle, undefined, this);
        this.physics.add.collider(this.ball, this.bricks, this.onHitBrick, undefined, this);
    }

    private createHUD() {
        this.livesText = this.add.text(16, 16, `Lives: ${this.lives}`, {
            color: "#ffffff",
            fontSize: "22px",
            fontFamily: "monospace"
        }).setDepth(10);
    }

    private setupInput(width: number) {
        const clamp = (x: number) => Phaser.Math.Clamp(x, PADDLE_W / 2, width - PADDLE_W / 2);
        this.input.on("pointermove", (p: Phaser.Input.Pointer) => {
            if (!this.gameEnded) this.paddle.x = clamp(p.x);
        });
        this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
            if (!this.gameEnded) this.paddle.x = clamp(p.x);
        });
    }

    private onHitBrick(_ball: Phaser.GameObjects.GameObject, brick: Phaser.GameObjects.GameObject) {
        (brick as Phaser.Physics.Arcade.Image).destroy();
        if (this.bricks.countActive() === 0) {
            this.endGame("You Win! 🎉");
        }
    }

    private onHitPaddle() {
        const diff = this.ball.x - this.paddle.x;
        const norm = Phaser.Math.Clamp(diff / (PADDLE_W / 2), -1, 1);
        const angle = Phaser.Math.DegToRad(norm * 70 - 90);
        this.ball.setVelocity(BALL_SPEED * Math.cos(angle), BALL_SPEED * Math.sin(angle));
    }

    update() {
        if (this.gameEnded) return;

        if (this.ball.y > this.scale.height + 32) {
            this.lives--;
            this.livesText.setText(`Lives: ${this.lives}`);
            if (this.lives <= 0) {
                this.endGame("Game Over");
            } else {
                const { width, height } = this.scale;
                const dir = Phaser.Math.Between(0, 1) === 0 ? 1 : -1;
                this.ball.setPosition(width / 2, height - 100);
                this.ball.setVelocity(dir * Phaser.Math.Between(100, 200), -BALL_SPEED);
            }
        }
    }

    private endGame(msg: string) {
        this.gameEnded = true;
        const { width, height } = this.scale;
        const size = Math.round(Math.min(width, height) * 0.07);
        this.add.text(width / 2, height / 2, msg, {
            color: "#ffffff",
            fontSize: `${size}px`,
            fontFamily: "monospace",
            stroke: "#000000",
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(10);
        this.time.delayedCall(3000, () => this.scene.start(CST.SCENES.MENU));
    }
}

import { Player } from "./player";
import { Obstacle } from "./obstacle";
import cactus from "./assets/cacti.png";
import brokenGlass from "./assets/glasspoint.png";
import thornball from "./assets/thornball.png";
import type { AudioSuite } from "./audio";

export type GameState = "playing" | "gameOver";

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  player: Player;
  obstacles: Obstacle[] = [];
  obstacleImages: HTMLImageElement[] = [];

  state: GameState = "playing";
  sseraImage: HTMLImageElement;
  groundY: number;
  audio: AudioSuite;

  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    sseraImage: HTMLImageElement,
    audio: AudioSuite,
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.sseraImage = sseraImage;
    this.audio = audio;

    this.groundY = 330;

    this.player = new Player(100, this.groundY - 175, this.groundY);
    this.setupInput();
    //obstacle images

    const cacti = new Image();
    cacti.src = cactus;

    const glass = new Image();
    glass.src = brokenGlass;

    const thorn = new Image();
    thorn.src = thornball;

    this.obstacleImages = [cacti, glass, thorn];

    // this.spawnObstacle();
  }

  groundOffset = 0;
  wallOffset = 0;

  spawnTimer = 0;
  spawnInterval = 120;

  score = 0;

  setNextSpawnInterval() {
    this.spawnInterval = Math.floor(Math.random() * 90 + 90);
  }
  spawnObstacle() {
    const image =
      this.obstacleImages[
        Math.floor(Math.random() * this.obstacleImages.length)
      ];
    const obstacle = new Obstacle(
      this.canvas.width,
      this.groundY - 60,
      40,
      60,
      7,
      image,
    );
    this.obstacles.push(obstacle);
  }

  update() {
    console.log("UPDATE RUNNING");
    if (this.state === "gameOver") {
      return;
    }
    this.score++;

    this.player.update();

    for (const obstacle of this.obstacles) {
      obstacle.update();

      if (this.player.collidesWith(obstacle)) {
        this.state = "gameOver";
        this.audio.gameOver();
      }
    }

    this.obstacles = this.obstacles.filter(
      (obstacle) => obstacle.x + obstacle.width > 0,
    );

    this.spawnTimer++;

    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnObstacle();
      this.spawnTimer = 0;
      this.setNextSpawnInterval();
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawBackground();

    this.player.draw(this.ctx, this.sseraImage);

    for (const obstacle of this.obstacles) {
      obstacle.draw(this.ctx);
    }

    this.drawScore();

    if (this.state === "gameOver") {
      this.drawGameOver();
    }
  }

  drawGameOver() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.textAlign = "center";

    this.ctx.fillStyle = "#fff";
    this.ctx.font = "48px 'Geist Pixel', monospace";

    this.ctx.fillText("GAME OVER", this.canvas.width / 2, 290);

    this.ctx.font = "24px 'Geist Pixel', monospace";

    this.ctx.fillText(
      `SCORE: ${Math.floor(this.score / 6)}`,
      this.canvas.width / 2,
      340,
    );

    this.ctx.fillText("PRESS SPACE TO RESTART", this.canvas.width / 2, 390);
  }

  drawBackground() {
    // Walls
    this.ctx.fillStyle = "#b78390 ";
    this.ctx.fillRect(0, 0, this.canvas.width, 330);

    // Subtle wall panels
    this.ctx.strokeStyle = "#ab6783";
    this.ctx.lineWidth = 2;

    // for (let x = 0; x < this.canvas.width; x += 100) {
    //   this.ctx.beginPath();
    //   this.ctx.moveTo(x, 0);
    //   this.ctx.lineTo(x, 330);
    //   this.ctx.stroke();
    // }

    // Floor
    this.ctx.fillStyle = "#55798f";
    this.ctx.fillRect(0, 330, this.canvas.width, this.canvas.height - 330);

    this.ctx.fillStyle = "#6889a9";

    for (let x = this.groundOffset; x < this.canvas.width; x += 40) {
      this.ctx.fillRect(x, 350, 20, 4);
    }

    // Floor line
    this.ctx.fillStyle = "#3c5466";
    this.ctx.fillRect(0, 330, this.canvas.width, 5);

    this.groundOffset -= 2;

    if (this.groundOffset <= -40 || this.state === "gameOver") {
      this.groundOffset = 0;
    }

    this.ctx.fillStyle = "#e7dda9";
    this.ctx.fillRect(0, 0, this.canvas.width, 35);

    this.ctx.fillStyle = "#f4edc9";

    for (let x = this.wallOffset; x < this.canvas.width; x += 100) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 35);
      this.ctx.lineTo(x, this.groundY);
      this.ctx.stroke();
    }

    // Scroll wall
    this.wallOffset -= 1.5;

    if (this.wallOffset <= -100 || this.state === "gameOver") {
      this.wallOffset = 0;
    }
  }

  //drawscore
  drawScore() {
    this.ctx.fillStyle = "#3f3525";
    this.ctx.font = "24px 'Geist Pixel', monospace";
    this.ctx.textAlign = "right";

    this.ctx.fillText(
      `SCORE: ${Math.floor(this.score / 6)}`,
      this.canvas.width - 20,
      40,
    );
  }

  start() {
    const loop = () => {
      this.update();
      this.draw();

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }
  setupInput() {
    window.addEventListener("keydown", (event) => {
      if (event.code !== "Space") return;

      if (this.state === "gameOver") {
        this.reset();
      } else {
        this.player.jump();
        this.audio.jump();
      }
    });
  }

  //reset/restart

  reset() {
    this.state = "playing";

    this.score = 0;

    this.obstacles = [];

    this.spawnTimer = 0;
    this.setNextSpawnInterval();

    this.groundOffset = 0;
    this.wallOffset = 0;

    this.player.reset();
  }
}

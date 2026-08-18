import { Player } from "./player";
import { Obstacle } from "./obstacle";
import cactus from "./assets/cacti.png";
import brokenGlass from "./assets/glasspoint.png";
import thornball from "./assets/thornball.png";
import type { AudioSuite } from "./audio";

export type GameState = "idle" | "playing" | "gameOver";

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  player: Player;
  obstacles: Obstacle[] = [];
  obstacleImages: HTMLImageElement[] = [];

  state: GameState = "idle";
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

    //following works when obstacles move fast, environment moves fast too.
    const environmentSpeed = this.speed / 7;
    this.groundOffset -= 2 * environmentSpeed;
    this.wallOffset -= 1.5 * environmentSpeed;

    // this.spawnObstacle();
  }

  groundOffset = 0;
  wallOffset = 0;

  spawnTimer = 0;
  spawnInterval = 120;
  spawnDistance = 500;
  distSinceSpawn = 0;

  score = 0;

  speed = 7;
  nextSpeedInc = 150;
  // this.speed=Math.min(this.speed, 13)

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
      this.speed,
      image,
    );
    this.obstacles.push(obstacle);
  }

  update() {
    if (this.state === "idle") {
      return;
    }
    if (this.state === "gameOver") {
      return;
    }

    this.score++;

    //speed inc
    if (this.score >= this.nextSpeedInc) {
      const increase = Math.random() * 1 + 0.5;

      this.speed += increase;

      // Prevent the game from becoming impossible
      this.speed = Math.min(this.speed, 13);

      this.nextSpeedInc += Math.floor(Math.random() * 100 + 75);

      console.log(`Speed increased to ${this.speed.toFixed(2)}`);
    }

    this.player.update();

    //obstacle update
    for (const obstacle of this.obstacles) {
      obstacle.speed = this.speed;
      obstacle.update();

      if (this.player.collidesWith(obstacle)) {
        this.state = "gameOver";
        this.audio.gameOver();
      }
    }

    this.obstacles = this.obstacles.filter(
      (obstacle) => obstacle.x + obstacle.width > 0,
    );

    this.distSinceSpawn += this.speed;

    if (this.distSinceSpawn >= this.spawnDistance) {
      this.spawnObstacle();

      this.distSinceSpawn = 0;

      // Random gap between 700 and 1100 pixels
      this.spawnDistance = Math.random() * 400 + 700;
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

    if (this.state === "idle") {
      this.drawStartScreen();
    }

    if (this.state === "gameOver") {
      this.drawGameOver();
    }
  }
  drawStartScreen() {
    this.ctx.fillStyle = "rgba(40, 20, 45, 0.25)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.textAlign = "center";

    this.ctx.fillStyle = "#fff";
    this.ctx.font = "bold 42px monospace";

    this.ctx.fillText("Hi,SSERA Here!", this.canvas.width / 2, 150);

    //start button aesthetics
    this.ctx.fillStyle = "#e887b8";
    this.ctx.fillRect(this.canvas.width / 2 - 130, 200, 260, 70);

    this.ctx.fillStyle = "#fff";
    this.ctx.font = "bold 26px monospace";

    this.ctx.fillText("START RUN", this.canvas.width / 2, 245);
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
      `YOUR SCORE: ${Math.floor(this.score / 6)}`,
      this.canvas.width / 2,
      340,
    );

    this.ctx.fillText("PRESS SPACE TO RESTART", this.canvas.width / 2, 390);
  }

  drawBackground() {
    //backrooom-wall
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

    //ceiling here

    this.ctx.fillStyle = "#e7dda9";
    this.ctx.fillRect(0, 0, this.canvas.width, 35);

    //ceiling light nd their glow
    this.ctx.fillStyle = "#f4edc9";

    for (let x = this.wallOffset; x < this.canvas.width; x += 160) {
      this.ctx.fillRect(x, 10, 90, 10);
    }

    this.ctx.fillStyle = "rgba(244, 237, 201, 0.15)";

    for (let x = this.wallOffset; x < this.canvas.width; x += 160) {
      this.ctx.fillRect(x, 20, 90, 35);
    }

    for (let x = this.wallOffset; x < this.canvas.width; x += 100) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 35);
      this.ctx.lineTo(x, this.groundY);
      this.ctx.stroke();
    }

    //wall moves
    this.wallOffset -= 1.5;

    if (this.wallOffset <= -100 || this.state === "gameOver") {
      this.wallOffset = 0;
    }
  }

  //drawscore
  // drawScore() {
  //   this.ctx.fillStyle = "#3f3525";
  //   this.ctx.font = "24px 'Geist Pixel', monospace";
  //   this.ctx.textAlign = "right";

  //   this.ctx.fillText(
  //     `SCORE: ${Math.floor(this.score / 6)}`,
  //     this.canvas.width - 20,
  //     40,
  //   );
  // }
  drawScore() {
    const score = Math.floor(this.score / 6)
      .toString()
      .padStart(4, "0");

    const x = this.canvas.width - 190;
    const y = 15;
    const width = 150;
    const height = 50;

    // Panel
    this.ctx.fillStyle = "#caa2c4";
    this.ctx.fillRect(x, y, width, height);

    // Border
    this.ctx.strokeStyle = "#e3e3e3";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, width, height);

    // Title
    this.ctx.fillStyle = "#3f3525";
    this.ctx.font = "12px monospace";
    this.ctx.textAlign = "left";

    // this.ctx.fillText("♥  SSERUNNS", x + 10, y + 20);

    // Score
    this.ctx.font = "16px monospace";

    this.ctx.fillText(`SCORE  ${score}`, x + 25, y + 30);
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
    this.audio.startMusic();
  }

  handleClick(event: MouseEvent) {
    if (this.state !== "idle") {
      return;
    }

    const rect = this.canvas.getBoundingClientRect();

    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const buttonX = this.canvas.width / 2 - 130;
    const buttonY = 200;
    const buttonWidth = 260;
    const buttonHeight = 70;

    if (
      x >= buttonX &&
      x <= buttonX + buttonWidth &&
      y >= buttonY &&
      y <= buttonY + buttonHeight
    ) {
      this.state = "playing";

      this.audio.click();
      this.audio.startMusic();
    }
  }
}

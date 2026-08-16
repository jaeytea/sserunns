export class Player {
  x: number;
  y: number;

  width: number = 100;
  height: number = 130;

  velocityX: number = 0;
  velocityY: number = 0;

  gravity: number = 0.8;
  groundY: number;

  currentFrame: number = 0;
  animationTimer = 0;
  animationSpeed = 0.15;
  constructor(x: number, y: number, groundY: number) {
    this.x = x;
    this.y = y;
    this.groundY = groundY;
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;

    this.velocityY += this.gravity;

    if (this.y + this.height >= this.groundY) {
      this.y = this.groundY - this.height;
      this.velocityY = 0;
    }

    this.animationTimer += this.animationSpeed;
    if (this.animationTimer >= 1) {
      this.currentFrame = (this.currentFrame + 1) % 3;
      this.animationTimer = 0;
    }
  }

  draw(ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
    const frameX = [0, 362, 724];
    const frameY = [0, 483, 966];

    const column = this.currentFrame % 3;
    const row = Math.floor(this.currentFrame / 3);

    const sourceX = frameX[column];
    const sourceY = frameY[row];

    const sourceWidth = 362;
    const sourceHeight = row === 2 ? 482 : 483;

    ctx.drawImage(
      image,

      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,

      this.x,
      this.y,
      this.width,
      this.height,
    );
  }

  jump() {
    if (this.y + this.height >= this.groundY) {
      this.velocityY = -14;
    }
  }
}

export class Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    speed: number,
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
  }

  update() {
    this.x -= this.speed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#4b3b2a";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // ctx.strokeStyle = "blue";
    // ctx.lineWidth = 2;

    // ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
}

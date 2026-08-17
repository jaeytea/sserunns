export class Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  image: HTMLImageElement;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    speed: number,
    image: HTMLImageElement,
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.image = image;
  }

  update() {
    this.x -= this.speed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.image, this.x, this.y - 2, 60, 70);
  }
}

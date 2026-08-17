import playerSsera from "./assets/sseratwo.png";
import { Game } from "./game";

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("Could not get canvas context");
}

const context = ctx;

canvas.width = 1000;
canvas.height = 700;

const ssera = new Image();

ssera.src = playerSsera;

ssera.onload = () => {
  const game = new Game(canvas, context, ssera);

  game.start();
};

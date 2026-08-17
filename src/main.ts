import playerSsera from "./assets/sseratwo.png";
import { Game } from "./game";
import { GameConsole } from "./console";
import "./style.css";
import { AudioSuite } from "./audio";

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("Could not get canvas context");
}
document.addEventListener("contextmenu", (event) => {
  event.preventDefault();
});
const context = ctx;

canvas.width = 800;
canvas.height = 500;

const ssera = new Image();

ssera.src = playerSsera;

const audio = new AudioSuite();
window.addEventListener("keydown", (event) => {
  if (event.code === "KeyM") {
    audio.startMusic();
  }
});

ssera.onload = () => {
  const gameConsole = new GameConsole(canvas);

  gameConsole.render();
  const game = new Game(canvas, context, ssera, audio);
  canvas.addEventListener("click", (event) => {
    game.handleClick(event);
  });

  game.start();
};

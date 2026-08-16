import playerSsera from "./assets/sseratwo.png";
import { Player } from "./player";

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

// let sseraX = 100;
// let sseraY = 180;
const groundY = 330;

const player = new Player(100, 155, groundY);
let groundOffset = 0;

function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();

  player.update();
  player.draw(context, ssera);

  requestAnimationFrame(gameLoop);
}
window.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    player.jump();
  }
});
function drawBackground() {
  // Walls
  context.fillStyle = "#d8c98f";
  context.fillRect(0, 0, canvas.width, 330);

  // Subtle wall panels
  context.strokeStyle = "#c5b777";
  context.lineWidth = 2;

  for (let x = 0; x < canvas.width; x += 100) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, 330);
    context.stroke();
  }

  // Floor
  context.fillStyle = "#8f7a55";
  context.fillRect(0, 330, canvas.width, canvas.height - 330);

  context.fillStyle = "#a99168";

  for (let x = groundOffset; x < canvas.width; x += 40) {
    context.fillRect(x, 350, 20, 4);
  }

  // Floor line
  context.fillStyle = "#66553c";
  context.fillRect(0, 330, canvas.width, 5);

  groundOffset -= 2;

  if (groundOffset <= -40) {
    groundOffset = 0;
  }
}

ssera.onload = () => {
  console.log(ssera.naturalWidth, ssera.naturalHeight);
  gameLoop();
};

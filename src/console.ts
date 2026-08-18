import "./style.css";
export class GameConsole {
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  render() {
    const body = document.body;

    body.innerHTML = "";

    const consoleShell = document.createElement("div");
    consoleShell.className = "game-console";

    const title = document.createElement("div");
    title.className = "console-title";
    title.textContent = "✦ SSERA-RUNNS ✦";

    const screenFrame = document.createElement("div");
    screenFrame.className = "screen-frame";

    screenFrame.appendChild(this.canvas);

    const controls = document.createElement("div");
    controls.className = "console-controls";

    const dpad = document.createElement("div");
    dpad.className = "dpad";

    const gamepadIcon = document.createElement("span");
    gamepadIcon.className = "material-symbols-outlined gamepad-icon";
    gamepadIcon.textContent = "Gamepad";
    gamepadIcon.title = "Gamepad";

    dpad.appendChild(gamepadIcon);

    const label = document.createElement("div");
    label.className = "console-label";
    label.textContent = "@jaeytea";

    const buttons = document.createElement("div");
    buttons.className = "console-buttons";
    buttons.innerHTML = `
      <span>●</span>
      <span>●</span>
    `;

    controls.appendChild(dpad);
    controls.appendChild(label);
    controls.appendChild(buttons);

    consoleShell.appendChild(title);
    consoleShell.appendChild(screenFrame);
    consoleShell.appendChild(controls);

    body.appendChild(consoleShell);
  }
}

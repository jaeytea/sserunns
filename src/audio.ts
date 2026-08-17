export class AudioSuite {
  bgMusic: HTMLAudioElement;
  jumpSound: HTMLAudioElement;
  gameOverSound: HTMLAudioElement;
  clickSound: HTMLAudioElement;

  constructor() {
    this.bgMusic = new Audio("/audio/bgm.wav");
    this.jumpSound = new Audio("/audio/jump.wav");
    this.clickSound = new Audio("/audio/button.wav");
    this.gameOverSound = new Audio("/audio/playerhurt.wav");

    this.bgMusic.loop = true;
    this.bgMusic.volume = 0.2;
    this.jumpSound.volume = 0.5;
    this.gameOverSound.volume = 0.6;
    this.clickSound.volume = 0.5;
  }

  startMusic() {
    this.bgMusic.currentTime = 0;
    this.bgMusic.play().catch((error) => {
      console.warn("Could not play background music:", error);
    });
  }

  jump() {
    this.jumpSound.currentTime = 0;
    this.jumpSound.play();
  }

  gameOver() {
    this.bgMusic.pause();

    this.gameOverSound.currentTime = 0;
    this.gameOverSound.play();
  }

  click() {
    this.clickSound.currentTime = 0;
    this.clickSound.play();
  }

  reset() {
    this.bgMusic.currentTime = 0;
    this.bgMusic.play();
  }
}

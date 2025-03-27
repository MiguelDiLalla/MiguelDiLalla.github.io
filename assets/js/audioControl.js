class AudioController {
  constructor(audioElement) {
    this.audio = audioElement;
    this.speed = 1;
  }

  togglePlayback() {
    if (this.audio.paused) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  toggleSpeed() {
    this.speed = this.speed === 1 ? 2 : 1;
    this.audio.playbackRate = this.speed;
  }

  reset() {
    this.audio.currentTime = 0;
    this.audio.pause();
    this.speed = 1;
    this.audio.playbackRate = 1;
  }
}
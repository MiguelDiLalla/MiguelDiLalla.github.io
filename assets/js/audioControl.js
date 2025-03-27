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

/**
 * Audio Controller for Biography Section
 * Manages the playback and speed of the biography audio narration
 */

document.addEventListener('DOMContentLoaded', () => {
  // Audio element and control buttons
  const audio = new Audio('/audio/bio_intro.mp3');
  const playButton = document.getElementById('audio-play');
  const speedButton = document.getElementById('audio-speed');

  // Track the states
  let isPlaying = false;
  let isNormalSpeed = true;

  /**
   * Toggle play/pause functionality
   */
  playButton.addEventListener('click', () => {
    if (isPlaying) {
      audio.pause();
      playButton.textContent = 'Play';
    } else {
      audio.play().catch(error => {
        console.error('Audio playback failed:', error);
        // Show a message to the user if needed
      });
      playButton.textContent = 'Pause';
    }
    isPlaying = !isPlaying;
  });

  /**
   * Toggle between normal (x1) and double (x2) speed
   */
  speedButton.addEventListener('click', () => {
    if (isNormalSpeed) {
      audio.playbackRate = 2.0;
      speedButton.textContent = 'x2';
    } else {
      audio.playbackRate = 1.0;
      speedButton.textContent = 'x1';
    }
    isNormalSpeed = !isNormalSpeed;
  });

  /**
   * Reset button state when audio ends
   */
  audio.addEventListener('ended', () => {
    isPlaying = false;
    playButton.textContent = 'Play';
  });
});
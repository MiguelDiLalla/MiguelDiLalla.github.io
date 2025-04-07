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
 * Manages the playback, speed control, and rewind functionality for the biography audio narration
 */

document.addEventListener('DOMContentLoaded', () => {
  // Audio element and control buttons
  const audio = new Audio();
  audio.src = '/assets/audio/bio-podcast.mp3';
  audio.preload = 'metadata';
  
  const playButton = document.getElementById('audio-play');
  const speedButton = document.getElementById('audio-speed');
  const rewindButton = document.getElementById('audio-rewind');
  const floatingAudioControl = document.getElementById('floating-audio-control');

  // Added time display updates
  const currentTimeDisplay = document.getElementById('audio-current-time');
  const durationDisplay = document.getElementById('audio-duration');
  const floatingTimeDisplay = document.getElementById('floating-audio-time');
  const floatingDurationDisplay = document.getElementById('floating-audio-duration');

  // Track the states
  let isPlaying = false;
  let speedIndex = 0;
  const speeds = [1, 1.5, 2];
  const speedLabels = ['x1', 'x1.5', 'x2'];

  /**
   * Format time in MM:SS format
   */
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Update all time displays
   */
  function updateTimeDisplays() {
    const currentTime = formatTime(audio.currentTime);
    const duration = formatTime(audio.duration || 0);

    currentTimeDisplay.textContent = currentTime;
    durationDisplay.textContent = duration;
    floatingTimeDisplay.textContent = currentTime;
    floatingDurationDisplay.textContent = duration;
  }

  /**
   * Toggle play/pause functionality
   */
  function togglePlayPause() {
    if (isPlaying) {
      audio.pause();
      playButton.innerHTML = '<i class="fas fa-play"></i>';
      floatingAudioControl.classList.remove('visible');
    } else {
      audio.play().catch(error => {
        console.error('Audio playback failed:', error);
        // Show error message with icon
        playButton.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
        setTimeout(() => {
          playButton.innerHTML = '<i class="fas fa-play"></i>';
        }, 2000);
        return;
      });
      playButton.innerHTML = '<i class="fas fa-pause"></i>';
      floatingAudioControl.classList.add('visible');
    }
    isPlaying = !isPlaying;
  }

  // Main play button event listener
  playButton.addEventListener('click', togglePlayPause);

  // Floating audio control button event listener
  floatingAudioControl.addEventListener('click', togglePlayPause);

  /**
   * Cycle through playback speeds: x1 -> x1.5 -> x2 -> x1
   */
  speedButton.addEventListener('click', () => {
    // Move to the next speed in the cycle
    speedIndex = (speedIndex + 1) % speeds.length;
    
    // Update audio playback rate
    audio.playbackRate = speeds[speedIndex];
    
    // Update button text
    speedButton.textContent = speedLabels[speedIndex];
    
    // Highlight the button briefly for visual feedback
    speedButton.classList.add('bg-gray-300');
    setTimeout(() => {
      speedButton.classList.remove('bg-gray-300');
    }, 200);
  });

  /**
   * Rewind audio by 10 seconds when the rewind button is clicked
   */
  rewindButton.addEventListener('click', () => {
    // Calculate new time (don't go below 0)
    const newTime = Math.max(0, audio.currentTime - 10);
    
    // Apply new time
    audio.currentTime = newTime;
    
    // Visual feedback for user
    rewindButton.classList.add('bg-gray-300');
    setTimeout(() => {
      rewindButton.classList.remove('bg-gray-300');
    }, 200);
  });

  /**
   * Reset button state when audio ends
   */
  audio.addEventListener('ended', () => {
    isPlaying = false;
    playButton.innerHTML = '<i class="fas fa-play"></i>';
    floatingAudioControl.classList.remove('visible');
  });

  /**
   * Handle audio loading errors
   */
  audio.addEventListener('error', (e) => {
    console.error('Audio error:', e);
    playButton.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
    setTimeout(() => {
      playButton.innerHTML = '<i class="fas fa-play"></i>';
    }, 2000);
    floatingAudioControl.classList.remove('visible');
  });

  // When metadata is loaded, update the duration display
  audio.addEventListener('loadedmetadata', () => {
    updateTimeDisplays();
  });

  // Update time display during playback
  audio.addEventListener('timeupdate', () => {
    updateTimeDisplays();
  });

  // Ensure floating button is hidden initially
  floatingAudioControl.classList.remove('visible');
});
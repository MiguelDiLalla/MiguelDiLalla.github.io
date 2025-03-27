class ImageCarousel {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container with ID ${containerId} not found.`);
      return;
    }
    this.images = Array.from(this.container.children);
    this.currentIndex = 0;
    this.interval = options.interval || 3000;
    this.transitionDuration = options.transitionDuration || 500;
  }

  showImage(index) {
    this.images.forEach((img, i) => {
      if (i === index) {
        img.style.opacity = '1';
        img.style.zIndex = '1';
      } else {
        img.style.opacity = '0';
        img.style.zIndex = '0';
      }
    });
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.showImage(this.currentIndex);
  }

  start() {
    if (this.images && this.images.length > 0) {
      this.showImage(0);
      setInterval(() => this.next(), this.interval);
    }
  }
}

// Initialize carousels when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize carousels for other sections if needed
  // For example, we might still use it for the collage in the about section
  const collageCarousel = document.getElementById('collage-carousel');
  if (collageCarousel) {
    // Will initialize once collage content is added
    // const carousel = new ImageCarousel('collage-carousel', { interval: 4000 });
    // carousel.start();
  }
});

/**
 * Image Carousel for Biography Section
 * Manages the carousel animation for the collage images
 */

document.addEventListener('DOMContentLoaded', () => {
  // Find the collage carousel container
  const carousel = document.getElementById('collage-carousel');
  if (!carousel) return;

  // Get all collage images within the carousel
  const collages = carousel.querySelectorAll('img');
  if (collages.length <= 1) return;

  let currentIndex = 0;
  let nextIndex = 1;

  /**
   * Transition to the next collage in the sequence with a fade effect
   */
  function rotateCollages() {
    // Hide the current collage
    collages[currentIndex].style.opacity = '0';
    
    // Show the next collage
    collages[nextIndex].style.opacity = '1';
    
    // Update indices for next transition
    currentIndex = nextIndex;
    nextIndex = (nextIndex + 1) % collages.length;
  }

  // Start the carousel rotation - change every 3.5 seconds (faster than before)
  const intervalId = setInterval(rotateCollages, 3500);

  // Cleanup on page unload to avoid memory leaks
  window.addEventListener('beforeunload', () => {
    clearInterval(intervalId);
  });
});
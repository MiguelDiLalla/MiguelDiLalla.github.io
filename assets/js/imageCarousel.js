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

// Initialize typewriter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize carousels for other sections if needed
  // For example, we might still use it for the collage in the about section
  const collageCarousel = document.getElementById('collage-carousel');
  if (collageCarousel) {
    // Will initialize once collage content is added
    // const carousel = new ImageCarousel('collage-carousel', { interval: 4000 });
    // carousel.start();
  }

  // Initialize typewriter
  const typewriterElement = document.getElementById('typewriter');
  if (typewriterElement) {
    const typewriter = new Typewriter(
      typewriterElement,
      ['Hola!', "Hi! I'm Miguel. It's great that you are here."],
      { speed: 100, delay: 1000 }
    );
    typewriter.start();
  } else {
    console.error('Typewriter element not found.');
  }
});
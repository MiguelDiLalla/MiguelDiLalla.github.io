class ImageCarousel {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
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
    this.showImage(0);
    setInterval(() => this.next(), this.interval);
  }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const carousel = new ImageCarousel('hero-images', {
    interval: 3000,
    transitionDuration: 500
  });
  carousel.start();

  // Initialize typewriter
  const typewriter = new Typewriter(
    document.getElementById('typewriter'),
    ['Hola!', "Hi! I'm Miguel. It's great that you are here."],
    { speed: 100, delay: 1000 }
  );
  typewriter.start();
});
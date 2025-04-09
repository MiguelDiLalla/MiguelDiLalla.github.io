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
  const collageCarousel = document.getElementById('collage-carousel');
  if (collageCarousel) {
    // Will initialize once collage content is added
    // const carousel = new ImageCarousel('collage-carousel', { interval: 4000 });
    // carousel.start();
  }
});

/**
 * Dynamic Parallax Scrolling Gallery for Role Models Section
 * Loads all images from the /assets/images/collage/ directory
 * and displays them in horizontally scrolling rows with random speeds
 * Using WebP format for optimized performance
 */

document.addEventListener('DOMContentLoaded', () => {
  // Constants for the collage
  const IMAGE_PATH = '/assets/images/collage/';
  const TOTAL_IMAGES = 42; // Confirmed correct number of images
  const ROWS = 3;
  
  // Speed ranges for animations (in seconds)
  const MIN_SPEED = 30;  // Fastest animation (seconds)
  const MAX_SPEED = 70;  // Slowest animation (seconds)

  // Find the collage rows
  const rows = document.querySelectorAll('.collage-row');
  if (!rows.length) return;

  // Create array of all available image paths (image_01.webp to image_42.webp)
  const imagePaths = [];
  for (let i = 1; i <= TOTAL_IMAGES; i++) {
    // Format the number with leading zero if needed (01, 02, ... 37)
    const imageNumber = i.toString().padStart(2, '0');
    imagePaths.push(`image_${imageNumber}.webp`);
  }

  // Shuffle the image array to get random distribution
  const shuffledImages = [...imagePaths].sort(() => 0.5 - Math.random());
  
  // Split images into roughly equal groups for each row
  const imagesPerRow = Math.ceil(shuffledImages.length / ROWS);
  const rowImages = [];
  
  for (let i = 0; i < ROWS; i++) {
    const startIdx = i * imagesPerRow;
    const endIdx = Math.min(startIdx + imagesPerRow, shuffledImages.length);
    rowImages.push(shuffledImages.slice(startIdx, endIdx));
  }
  
  /**
   * Generate a random animation duration within specified range
   * @returns {number} Random duration in seconds
   */
  const getRandomDuration = () => {
    return Math.floor(Math.random() * (MAX_SPEED - MIN_SPEED + 1)) + MIN_SPEED;
  };
  
  // Track number of successfully loaded images
  let loadedImageCount = 0;
  let failedImageCount = 0;
  const minRequiredImages = 10; // Minimum number of images needed for a good visual effect
  
  // For each row, add the images to the scroll-track (duplicating them for seamless looping)
  rows.forEach((row, idx) => {
    // Get the scroll track container
    const track = row.querySelector('.scroll-track');
    if (!track) {
      console.error('Scroll track not found in row', idx);
      return;
    }
    
    // Get the track direction
    const direction = row.getAttribute('data-direction') || 'left';
    
    // Generate random animation duration
    const duration = getRandomDuration();
    
    // Apply the animation with random duration
    track.style.animation = `scroll-${direction} ${duration}s linear infinite`;
    
    // Log the animation details
    console.log(`Row ${idx + 1}: scrolling ${direction} at ${duration}s duration`);
    
    // Get images for this row
    const images = rowImages[idx];
    
    // Double the images for seamless infinite scrolling
    const allImages = [...images, ...images];
    
    // Create image elements and add to track
    allImages.forEach(imgPath => {
      const img = document.createElement('img');
      img.alt = 'Role model';
      img.className = 'collage-img';
      img.loading = 'lazy';
      img.decoding = 'async';
      
      // Set up error handling before setting src
      img.onerror = function() {
        console.warn(`Image not found: ${imgPath}`);
        if (img.parentNode) {
          img.parentNode.removeChild(img); // Ensure the broken image is removed from the DOM
        }
        failedImageCount++;
        
        // Check if we have enough images for a good effect
        if (failedImageCount > TOTAL_IMAGES - minRequiredImages) {
          console.warn('Too many missing images in carousel. Consider repopulating the collage folder.');
        }
      };
      
      // Set up success handling
      img.onload = function() {
        loadedImageCount++;
        if (loadedImageCount % 10 === 0) {
          console.log(`Loaded ${loadedImageCount} collage images successfully`);
        }
      };
      
      // Add image to the scroll track first, then set src
      track.appendChild(img);
      
      // Set src after error handler is defined and element is in DOM
      img.src = `${IMAGE_PATH}${imgPath}`;
    });
  });

  // Log success message
  console.log(`Role models gallery initialized with ${TOTAL_IMAGES} WebP images in ${ROWS} rows`);
});
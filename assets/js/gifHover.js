document.addEventListener('DOMContentLoaded', () => {
  // Original implementation for containers with static-img and gif-img
  const gifContainers = document.querySelectorAll('.gif-container');

  gifContainers.forEach(container => {
    const staticImg = container.querySelector('.static-img');
    const gifImg = container.querySelector('.gif-img');

    container.addEventListener('mouseenter', () => {
      staticImg.style.opacity = '0';
      gifImg.style.opacity = '1';
    });

    container.addEventListener('mouseleave', () => {
      staticImg.style.opacity = '1';
      gifImg.style.opacity = '0';
    });
  });

  // New implementation for project cards with PNG placeholders
  const projectCards = document.querySelectorAll('#projects a');
  
  projectCards.forEach(card => {
    const img = card.querySelector('img');
    if (!img) return; // Skip if no image found
    
    // Save original image state
    const originalSrc = img.src;
    const originalFilter = img.style.filter || 'none';
    
    // Store darkened state
    img.style.filter = 'brightness(0.8)';
    img.style.transition = 'filter 0.3s ease, transform 0.3s ease';
    
    // Add hover effects
    card.addEventListener('mouseenter', () => {
      img.style.filter = 'brightness(1)';
      img.style.transform = 'scale(1.05)';
    });
    
    card.addEventListener('mouseleave', () => {
      img.style.filter = 'brightness(0.8)';
      img.style.transform = 'scale(1)';
    });
  });
});
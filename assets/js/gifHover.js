document.addEventListener('DOMContentLoaded', () => {
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
});
document.addEventListener('DOMContentLoaded', () => {
    // Background images rotation
    const bgImages = [
        document.getElementById('bg-image-1'),
        document.getElementById('bg-image-2'),
        document.getElementById('bg-image-3'),
        document.getElementById('bg-image-4')
    ];
    
    let currentBgIndex = 0;
    const bgRotationInterval = 8000; // Change background every 8 seconds
    
    // Set longer transition duration for gentler crossfade
    bgImages.forEach(img => {
        img.style.transitionDuration = '3000ms'; // 3 second transition for smoother crossfade
        img.style.transitionTimingFunction = 'ease-in-out';
    });
    
    // Function to rotate background images with gentle crossfade
    function rotateBackgroundImages() {
        // Hide current image
        bgImages[currentBgIndex].classList.add('opacity-0');
        
        // Move to next image
        currentBgIndex = (currentBgIndex + 1) % bgImages.length;
        
        // Show next image
        bgImages[currentBgIndex].classList.remove('opacity-0');
    }
    
    // Start background rotation with initial delay
    setTimeout(() => {
        setInterval(rotateBackgroundImages, bgRotationInterval);
    }, 2000); // Initial delay before starting rotation
});
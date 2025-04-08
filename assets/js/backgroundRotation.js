document.addEventListener('DOMContentLoaded', () => {
    // Hero Background images rotation
    const bgImages = [
        document.getElementById('bg-image-1'),
        document.getElementById('bg-image-2'),
        document.getElementById('bg-image-3'),
        document.getElementById('bg-image-4')
    ];
    
    // Contact Background images rotation
    const contactBgImages = [
        document.getElementById('contact-bg-image-1'),
        document.getElementById('contact-bg-image-2'),
        document.getElementById('contact-bg-image-3'),
        document.getElementById('contact-bg-image-4')
    ];
    
    let currentBgIndex = 0;
    let currentContactBgIndex = 0;
    const bgRotationInterval = 8000; // Change background every 8 seconds
    
    // Set longer transition duration for gentler crossfade - Hero section
    bgImages.forEach(img => {
        if (img) {
            img.style.transitionDuration = '3000ms'; // 3 second transition for smoother crossfade
            img.style.transitionTimingFunction = 'ease-in-out';
        }
    });
    
    // Set longer transition duration for gentler crossfade - Contact section
    contactBgImages.forEach(img => {
        if (img) {
            img.style.transitionDuration = '3000ms'; // 3 second transition for smoother crossfade
            img.style.transitionTimingFunction = 'ease-in-out';
        }
    });
    
    // Function to rotate hero background images with gentle crossfade
    function rotateBackgroundImages() {
        // Make sure elements exist before manipulating them
        if (bgImages.every(img => img)) {
            // Hide current image
            bgImages[currentBgIndex].classList.add('opacity-0');
            
            // Move to next image
            currentBgIndex = (currentBgIndex + 1) % bgImages.length;
            
            // Show next image
            bgImages[currentBgIndex].classList.remove('opacity-0');
        }
    }
    
    // Function to rotate contact background images with gentle crossfade
    function rotateContactBackgroundImages() {
        // Make sure elements exist before manipulating them
        if (contactBgImages.every(img => img)) {
            // Hide current image
            contactBgImages[currentContactBgIndex].classList.add('opacity-0');
            
            // Move to next image
            currentContactBgIndex = (currentContactBgIndex + 1) % contactBgImages.length;
            
            // Show next image
            contactBgImages[currentContactBgIndex].classList.remove('opacity-0');
        }
    }
    
    // Start background rotation with initial delay
    setTimeout(() => {
        // Start hero background rotation
        setInterval(rotateBackgroundImages, bgRotationInterval);
        
        // Start contact background rotation with a slight offset
        setTimeout(() => {
            setInterval(rotateContactBackgroundImages, bgRotationInterval);
        }, 4000); // Offset the contact background rotation by 4 seconds for visual variety
    }, 2000); // Initial delay before starting rotation
});
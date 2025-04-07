document.addEventListener('DOMContentLoaded', () => {
  // Configuration - Static image only (no rotation)
  const imageFolder = '/assets/images/profile/portraits/';
  
  // Elements
  const profileImage = document.getElementById('profile-image');
  
  // Set static image (photo1.webp)
  profileImage.src = imageFolder + 'photo1.webp';
});
/**
 * Skills section animation with anime.js
 * Loads skills data from JSON and creates animated skills display
 */

document.addEventListener('DOMContentLoaded', () => {
  // Get the skills container
  const skillsContainer = document.getElementById('skills-container');
  const skillsSection = document.getElementById('skills');
  
  if (!skillsContainer || !skillsSection) return;

  // Load skills data from JSON
  fetch('/data/skill.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Error loading skills data');
      }
      return response.json();
    })
    .then(skills => {
      // Create elements for each skill
      skills.forEach(skill => {
        const skillElement = document.createElement('div');
        skillElement.className = 'skill-item opacity-0 transform translate-y-4 py-3 px-4 rounded-lg text-center relative overflow-hidden';
        skillElement.dataset.level = skill.level;
        skillElement.dataset.skill = skill.skill;
        
        // Initially set background to white for smooth transition
        skillElement.style.backgroundColor = '#FFFFFF';
        
        // Add skill name
        const skillText = document.createElement('span');
        skillText.className = 'relative z-10 font-semibold text-sm md:text-lg';
        skillText.textContent = skill.skill;
        
        // Add asterisk for learning skills
        if (skill.level === 'learning') {
          const asterisk = document.createElement('span');
          asterisk.textContent = '*';
          asterisk.className = 'ml-1 text-gray-400';
          skillText.appendChild(asterisk);
        }
        
        skillElement.appendChild(skillText);
        skillsContainer.appendChild(skillElement);
      });
      
      // Setup Intersection Observer to trigger animations when section comes into view
      setupAnimations();
    })
    .catch(error => {
      console.error('Failed to load skills:', error);
      skillsContainer.innerHTML = '<p class="col-span-3 text-center text-red-600">Failed to load skills data.</p>';
    });
  
  function setupAnimations() {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateSkills();
        observer.disconnect();
      }
    }, {
      threshold: 0.2
    });
    
    observer.observe(skillsSection);
  }
  
  function animateSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    // First animation: Typewriter effect (appear one by one)
    anime({
      targets: '.skill-item',
      opacity: [0, 1],
      translateY: [20, 0],
      easing: 'easeOutExpo',
      duration: 800,
      delay: anime.stagger(80),
      complete: function() {
        // After all skills are visible, start the color transitions for each skill
        animateSkillColors();
      }
    });
    
    function animateSkillColors() {
      // Animate each skill with staggered delay for more visual interest
      skillItems.forEach((item, index) => {
        const isCurrentSkill = item.dataset.level === 'current';
        
        // Initial color transition from white to base color
        anime({
          targets: item,
          backgroundColor: isCurrentSkill ? '#3B82F6' : '#D1D5DB', // Blue for current, light gray for learning
          easing: 'easeOutQuad',
          duration: 600,
          delay: index * 40, // Stagger the initial color transition
          complete: function() {
            // Start the continuous color oscillation after initial transition
            anime({
              targets: item,
              backgroundColor: isCurrentSkill 
                ? ['#3B82F6', '#2563EB', '#1E40AF', '#2563EB', '#3B82F6'] // Blue variations for current skills
                : ['#D1D5DB', '#9CA3AF', '#6B7280', '#9CA3AF', '#D1D5DB'], // Brighter gray variations for learning skills
              easing: 'easeInOutSine',
              duration: () => 500 + Math.random() * 2000, // Random duration between 500ms and 2500ms
              delay: () => Math.random() * 200, // Random start time
              direction: 'alternate',
              loop: true
            });
          }
        });
      });
    }
  }
});
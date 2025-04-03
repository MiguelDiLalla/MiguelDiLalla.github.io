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
        skillElement.dataset.category = skill.visualize_as || 'tech_skill';
        
        // Initially set background to white for smooth transition
        skillElement.style.backgroundColor = '#FFFFFF';
        
        // Add skill name
        const skillText = document.createElement('span');
        skillText.className = 'relative z-10 font-semibold text-sm md:text-lg';
        skillText.textContent = skill.skill;
        
        // Add asterisk for about_to_learn skills
        if (skill.level === 'about_to_learn') {
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
        const level = item.dataset.level;
        const category = item.dataset.category;
        
        // Get base color based on level and category
        const baseColor = getBaseColor(level, category);
        const colorVariations = getColorVariations(level, category);
        
        // Initial color transition from white to base color
        anime({
          targets: item,
          backgroundColor: baseColor,
          easing: 'easeOutQuad',
          duration: 600,
          delay: index * 40, // Stagger the initial color transition
          complete: function() {
            // Start the continuous color oscillation after initial transition
            anime({
              targets: item,
              backgroundColor: colorVariations,
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
    
    // Helper functions to get colors based on level and category
    function getBaseColor(level, category) {
      // Define colors based on skill level
      switch(level) {
        case 'avanzado':
          return category === 'core_skill' ? '#ffcf00' : // Changed from #000000 to page yellow #ffcf00
                 category === 'ml_tool' ? '#1E3A8A' : 
                 category === 'soft_skill' ? '#065F46' : '#18181B';
          
        case 'intermedio':
          return category === 'core_skill' ? '#2563EB' : 
                 category === 'ml_tool' ? '#3B82F6' : 
                 category === 'soft_skill' ? '#10B981' : '#4F46E5';
          
        case 'básico':
          return category === 'core_skill' ? '#60A5FA' : 
                 category === 'ml_tool' ? '#93C5FD' : 
                 category === 'soft_skill' ? '#6EE7B7' : '#818CF8';
          
        case 'about_to_learn':
          return category === 'core_skill' ? '#BFDBFE' : 
                 category === 'ml_tool' ? '#DBEAFE' : 
                 category === 'soft_skill' ? '#A7F3D0' : '#C7D2FE';
          
        default:
          return '#9CA3AF'; // Default gray
      }
    }
    
    function getColorVariations(level, category) {
      // Define color variations for animation based on level and category
      switch(level) {
        case 'avanzado':
          return category === 'core_skill' ? 
                 ['#ffcf00', '#ffd633', '#ffdc4d', '#ffd633', '#ffcf00'] : // Changed from black to yellow variations
                 category === 'ml_tool' ? 
                 ['#1E3A8A', '#1E40AF', '#1E3A8A'] : 
                 category === 'soft_skill' ? 
                 ['#065F46', '#047857', '#065F46'] : 
                 ['#18181B', '#27272A', '#18181B'];
          
        case 'intermedio':
          return category === 'core_skill' ? 
                 ['#2563EB', '#3B82F6', '#2563EB'] : 
                 category === 'ml_tool' ? 
                 ['#3B82F6', '#60A5FA', '#3B82F6'] : 
                 category === 'soft_skill' ? 
                 ['#10B981', '#34D399', '#10B981'] : 
                 ['#4F46E5', '#6366F1', '#4F46E5'];
          
        case 'básico':
          return category === 'core_skill' ? 
                 ['#60A5FA', '#93C5FD', '#60A5FA'] : 
                 category === 'ml_tool' ? 
                 ['#93C5FD', '#BFDBFE', '#93C5FD'] : 
                 category === 'soft_skill' ? 
                 ['#6EE7B7', '#A7F3D0', '#6EE7B7'] : 
                 ['#818CF8', '#A5B4FC', '#818CF8'];
          
        case 'about_to_learn':
          return category === 'core_skill' ? 
                 ['#BFDBFE', '#DBEAFE', '#BFDBFE'] : 
                 category === 'ml_tool' ? 
                 ['#DBEAFE', '#EFF6FF', '#DBEAFE'] : 
                 category === 'soft_skill' ? 
                 ['#A7F3D0', '#D1FAE5', '#A7F3D0'] : 
                 ['#C7D2FE', '#E0E7FF', '#C7D2FE'];
          
        default:
          return ['#9CA3AF', '#D1D5DB', '#9CA3AF']; // Default gray variations
      }
    }
  }
});
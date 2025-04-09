/**
 * Skills section animation with anime.js
 * Loads skills data from JSON and creates animated skills display
 */

document.addEventListener('DOMContentLoaded', async function() {
  try {
    // Fetch skills data
    const response = await fetch('/data/skill_profile_minimal.json');
    const skillsData = await response.json();

    // Group skills by category
    const skillsByCategory = {};
    skillsData.forEach(skill => {
      if (!skillsByCategory[skill.category]) {
        skillsByCategory[skill.category] = [];
      }
      skillsByCategory[skill.category].push(skill);
    });

    // Clear existing content
    const container = document.getElementById('skills-categories-container');
    container.innerHTML = '';
    // Adding more gap and making container narrower with mx-auto for breathing space
    container.className = 'grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto'; 

    // Create panels for each category
    Object.keys(skillsByCategory).forEach((category, index) => {
      const categoryPanel = document.createElement('div');
      // Reduced padding and added hover effect for better interaction
      categoryPanel.className = `category-panel bg-white rounded-xl p-4 shadow-lg opacity-0 transition-all duration-300 hover:shadow-xl`;

      // Category header
      const header = document.createElement('h3');
      header.className = `text-xl font-semibold mb-3 pb-2 border-b-2 ${getCategoryBorderClass(category)}`;
      header.textContent = category;
      categoryPanel.appendChild(header);

      // Skills container
      const skillsContainer = document.createElement('div');
      skillsContainer.className = 'flex flex-col gap-2';
      skillsContainer.dataset.category = category;

      // Add each skill in this category
      skillsByCategory[category].forEach(skill => {
        const skillElement = createSkillElement(skill, category);
        // Hide skills initially for typewriter effect
        skillElement.classList.add('opacity-0', 'transform', 'translate-y-4');
        skillElement.dataset.level = skill.level;
        skillElement.dataset.category = category;
        skillsContainer.appendChild(skillElement);
      });

      categoryPanel.appendChild(skillsContainer);
      container.appendChild(categoryPanel);
    });

    // Setup Intersection Observer to trigger animations when section comes into view
    setupAnimations();
    
  } catch (error) {
    console.error('Error loading skills:', error);
  }
});

// Create individual skill element 
function createSkillElement(skill, category) {
  const skillElement = document.createElement('div');
  skillElement.className = 'skill-item py-2 px-3 rounded-lg flex justify-between items-center';

  // Apply background color based on level and category
  const colorClass = getLevelColorForCategory(skill.level, category);
  skillElement.classList.add(colorClass);

  // Skill name
  const skillName = document.createElement('span');
  skillName.className = 'font-medium';
  skillName.textContent = skill.skill;

  // Add asterisk for "about_to_learn" skills
  if (skill.level === 'about_to_learn') {
    const asterisk = document.createElement('span');
    asterisk.textContent = '*';
    asterisk.className = 'ml-1 text-gray-500';
    skillName.appendChild(asterisk);
  }

  skillElement.appendChild(skillName);

  return skillElement;
}

// Get color class for skill level based on category
function getLevelColorForCategory(level, category) {
  // Keep original yellow colors for "Programación" category
  if (category === "Programación") {
    switch(level) {
      case 'avanzado': return 'bg-yellow-400';
      case 'intermedio': return 'bg-yellow-200';
      case 'básico': return 'bg-yellow-100';
      case 'about_to_learn': return 'bg-gray-100';
      default: return 'bg-gray-100';
    }
  }

  // For other categories, apply their specific color scheme
  const categoryColorMap = {
    "Desarrollo Web": {
      avanzado: 'bg-purple-400',
      intermedio: 'bg-purple-200',
      básico: 'bg-purple-100',
      about_to_learn: 'bg-gray-100'
    },
    "Data Tools": {
      avanzado: 'bg-green-400',
      intermedio: 'bg-green-200',
      básico: 'bg-green-100',
      about_to_learn: 'bg-gray-100'
    },
    "Herramientas Técnicas": {
      avanzado: 'bg-orange-400',
      intermedio: 'bg-orange-200',
      básico: 'bg-orange-100',
      about_to_learn: 'bg-gray-100'
    },
    "Prácticas Profesionales": {
      avanzado: 'bg-indigo-400',
      intermedio: 'bg-indigo-200',
      básico: 'bg-indigo-100',
      about_to_learn: 'bg-gray-100'
    },
    "Creatividad y Otras Disciplinas": {
      avanzado: 'bg-pink-400',
      intermedio: 'bg-pink-200',
      básico: 'bg-pink-100',
      about_to_learn: 'bg-gray-100'
    }
  };

  // Return the appropriate color or fallback to gray if category not found
  return categoryColorMap[category] ? 
    categoryColorMap[category][level] || 'bg-gray-100' : 
    'bg-gray-100';
}

// Get border color class based on category
function getCategoryBorderClass(category) {
  const categoryColorMap = {
    "Programación": "border-blue-500",
    "Desarrollo Web": "border-purple-500",
    "Data Tools": "border-green-500",
    "Herramientas Técnicas": "border-orange-500",
    "Prácticas Profesionales": "border-indigo-500",
    "Creatividad y Otras Disciplinas": "border-pink-500"
  };

  return categoryColorMap[category] || "border-gray-500";
}

// Get color variations for animation
function getColorVariations(level, category) {
  // Keep original yellow colors for "Programación" category
  if (category === "Programación") {
    switch(level) {
      case 'avanzado': 
        return ['#facc15', '#fcd34d', '#fbbf24', '#facc15']; // yellow-400 variations
      case 'intermedio': 
        return ['#fef08a', '#fde68a', '#fde047', '#fef08a']; // yellow-200 variations
      case 'básico': 
        return ['#fef9c3', '#fef3c7', '#fef08a', '#fef9c3']; // yellow-100 variations
      default: 
        return ['#f3f4f6', '#f9fafb', '#f3f4f6']; // gray-100 variations
    }
  }

  // For other categories
  const categoryColorVariations = {
    "Desarrollo Web": {
      avanzado: ['#c084fc', '#a855f7', '#9333ea', '#c084fc'], // purple variations
      intermedio: ['#e9d5ff', '#d8b4fe', '#c084fc', '#e9d5ff'],
      básico: ['#f3e8ff', '#e9d5ff', '#d8b4fe', '#f3e8ff'],
      about_to_learn: ['#f3f4f6', '#f9fafb', '#f3f4f6']
    },
    "Data Tools": {
      avanzado: ['#4ade80', '#22c55e', '#16a34a', '#4ade80'], // green variations
      intermedio: ['#bbf7d0', '#86efac', '#4ade80', '#bbf7d0'],
      básico: ['#dcfce7', '#bbf7d0', '#86efac', '#dcfce7'],
      about_to_learn: ['#f3f4f6', '#f9fafb', '#f3f4f6']
    },
    "Herramientas Técnicas": {
      avanzado: ['#fb923c', '#f97316', '#ea580c', '#fb923c'], // orange variations
      intermedio: ['#fed7aa', '#fdba74', '#fb923c', '#fed7aa'],
      básico: ['#ffedd5', '#fed7aa', '#fdba74', '#ffedd5'],
      about_to_learn: ['#f3f4f6', '#f9fafb', '#f3f4f6']
    },
    "Prácticas Profesionales": {
      avanzado: ['#818cf8', '#6366f1', '#4f46e5', '#818cf8'], // indigo variations
      intermedio: ['#c7d2fe', '#a5b4fc', '#818cf8', '#c7d2fe'],
      básico: ['#e0e7ff', '#c7d2fe', '#a5b4fc', '#e0e7ff'],
      about_to_learn: ['#f3f4f6', '#f9fafb', '#f3f4f6']
    },
    "Creatividad y Otras Disciplinas": {
      avanzado: ['#f472b6', '#ec4899', '#db2777', '#f472b6'], // pink variations
      intermedio: ['#fbcfe8', '#f9a8d4', '#f472b6', '#fbcfe8'],
      básico: ['#fce7f3', '#fbcfe8', '#f9a8d4', '#fce7f3'],
      about_to_learn: ['#f3f4f6', '#f9fafb', '#f3f4f6']
    }
  };

  return categoryColorVariations[category] ? 
    categoryColorVariations[category][level] || ['#f3f4f6', '#f9fafb', '#f3f4f6'] : 
    ['#f3f4f6', '#f9fafb', '#f3f4f6'];
}

// Setup animations when skills section comes into view
function setupAnimations() {
  const skillsSection = document.getElementById('skills');
  const categoryPanels = document.querySelectorAll('.category-panel');
  
  if (!skillsSection || !categoryPanels.length) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      // Animate category panels appearing
      animateCategoryPanels();
      observer.disconnect();
    }
  }, {
    threshold: 0.2
  });
  
  observer.observe(skillsSection);
}

// Animate category panels appearing
function animateCategoryPanels() {
  const categoryPanels = document.querySelectorAll('.category-panel');
  
  // First animation: Panels appear one by one
  anime({
    targets: '.category-panel',
    opacity: [0, 1],
    translateY: [20, 0],
    easing: 'easeOutExpo',
    duration: 800,
    delay: anime.stagger(150),
    complete: function() {
      // After all panels are visible, start typewriter for skills
      animateSkillsTypewriter();
    }
  });
}

// Animate skills with typewriter effect
function animateSkillsTypewriter() {
  const skillItems = document.querySelectorAll('.skill-item');
  
  // Typewriter effect: skills appear one by one within each category
  anime({
    targets: '.skill-item',
    opacity: [0, 1],
    translateY: [20, 0],
    easing: 'easeOutExpo',
    duration: 600,
    delay: anime.stagger(80),
    complete: function() {
      // After all skills are visible, start the color transitions
      animateSkillColors();
    }
  });
}

// Animate skill colors with continuous variations
function animateSkillColors() {
  const skillItems = document.querySelectorAll('.skill-item');
  
  skillItems.forEach((item, index) => {
    const level = item.dataset.level;
    const category = item.dataset.category;
    
    if (!level || !category) return;
    
    // Get color variations based on category and level
    const colorVariations = getColorVariations(level, category);
    
    // Start continuous color oscillation
    anime({
      targets: item,
      backgroundColor: colorVariations,
      easing: 'easeInOutSine',
      duration: () => 2000 + Math.random() * 3000, // Random duration between 2-5s
      delay: () => Math.random() * 400, // Random start time
      direction: 'alternate',
      loop: true
    });
  });
}
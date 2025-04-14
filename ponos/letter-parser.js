/**
 * Cover Letter Parser and Animation Controller
 * 
 * This script:
 * 1. Parses markdown files with HTML comment section delimiters
 * 2. Controls the typewriter animation sequence for cover letter sections
 * 3. Manages section styling and button display
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize skip animation button
  setupSkipAnimationButton();

  // Wait for template.js to complete its work before starting animations
  window.addEventListener('template-loaded', function(e) {
    const companyData = e.detail;
    initializeCoverLetter(companyData);
  });

  // Setup skip animation button functionality
  function setupSkipAnimationButton() {
    const skipButton = document.getElementById('skip-animation-button');
    
    if (skipButton) {
      // Check for company color to style the button
      skipButton.addEventListener('click', function() {
        // Create and dispatch a custom event to skip animations
        window.dispatchEvent(new CustomEvent('skip-animations'));
        
        // Hide the skip button after clicking
        skipButton.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => {
          skipButton.style.display = 'none';
        }, 300);
      });
    }
  }

  function initializeCoverLetter(companyData) {
    // Parse the URL to get the company key
    const urlParams = new URLSearchParams(window.location.search);
    const companyKey = urlParams.get('to');
    
    if (!companyKey) {
      console.error('No company specified in URL');
      return;
    }

    // Style the skip button with company colors if available
    const skipButton = document.getElementById('skip-animation-button');
    if (skipButton && companyData && companyData.color_secondary) {
      skipButton.style.backgroundColor = companyData.color_secondary;
      skipButton.style.color = companyData.font_color === '#ffffff' ? '#ffffff' : '#000000';
    }

    // Font settings for different sections
    const fontSettings = {
      SALUDO: 'font-title text-2xl md:text-3xl font-bold',
      INTRODUCCIÓN: 'font-title text-xl md:text-2xl font-semibold',
      CUERPO: 'font-sans text-lg md:text-xl',
      DESPEDIDA: 'font-sans text-lg md:text-xl'
    };

    // Create the main letter container with proper spacing
    const letterContainer = document.getElementById('letter-content');
    letterContainer.innerHTML = '';
    
    // Create containers for each section
    const sections = {
      SALUDO: document.createElement('div'),
      INTRODUCCIÓN: document.createElement('div'),
      CUERPO: document.createElement('div'),
      DESPEDIDA: document.createElement('div')
    };
    
    // Style the sections
    Object.keys(sections).forEach(sectionName => {
      sections[sectionName].classList.add(
        'mb-6',
        'opacity-0', // Start hidden
        'animate-fade-in'
      );
      
      // Add the font classes
      fontSettings[sectionName].split(' ').forEach(cls => {
        sections[sectionName].classList.add(cls);
      });
      
      letterContainer.appendChild(sections[sectionName]);
    });
    
    // Create container for buttons (hidden initially)
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('mt-10', 'flex', 'flex-wrap', 'justify-between', 'gap-4', 'opacity-0');
    buttonContainer.id = 'button-container';
    
    // Create the buttons
    buttonContainer.innerHTML = `
      <a href="/" class="px-6 py-2 bg-red-400 text-white rounded-full font-semibold hover:bg-red-500 transition shadow-md hover-effect">
        <i class="fas fa-arrow-left mr-2"></i> Pagina Principal
      </a>
      <div class="relative" id="share-dropdown-container-dynamic">
        <button id="share-button-dynamic" class="px-6 py-2 bg-red-400 text-white rounded-full font-semibold hover:bg-red-500 transition shadow-md flex items-center hover-effect">
          <i class="fas fa-share-alt mr-2"></i> Compartir
        </button>
        <div id="share-dropdown-dynamic" class="absolute right-0 bottom-full mb-2 w-64 bg-red-400 text-white shadow-lg rounded-md py-2 z-10 hidden">
          <a href="#" id="email-share-dynamic" class="flex items-center px-4 py-2 hover:bg-red-500 transition">
            <i class="fas fa-envelope mr-3 text-blue-500"></i>
            <span>Compartir por email</span>
          </a>
          <a href="#" id="whatsapp-share-dynamic" class="flex items-center px-4 py-2 hover:bg-red-500 transition">
            <i class="fab fa-whatsapp mr-3 text-green-500"></i>
            <span>Compartir por WhatsApp</span>
          </a>
          <button id="copy-link-dynamic" class="w-full text-left flex items-center px-4 py-2 hover:bg-red-500 transition">
            <i class="fas fa-link mr-3 text-gray-300"></i>
            <span>Copiar enlace</span>
          </button>
        </div>
      </div>
    `;
    
    // Apply company colors to buttons
    if (companyData && companyData.color_secondary) {
      const mainButtons = buttonContainer.querySelectorAll('a:not([id]), button#share-button-dynamic');
      mainButtons.forEach(button => {
        button.classList.remove('bg-red-400', 'hover:bg-red-500');
        button.style.backgroundColor = companyData.color_secondary;
        button.style.color = companyData.font_color === '#ffffff' ? '#ffffff' : '#000000';
        
        // Add hover effect that will change text color to primary color on hover
        button.addEventListener('mouseenter', () => {
          button.style.color = companyData.color_primary || '#000000';
        });
        
        // Reset color on mouse leave
        button.addEventListener('mouseleave', () => {
          button.style.color = companyData.font_color === '#ffffff' ? '#ffffff' : '#000000';
        });
      });
      
      // Apply company colors to the share dropdown menu
      const shareDropdown = buttonContainer.querySelector('#share-dropdown-dynamic');
      if (shareDropdown) {
        shareDropdown.classList.remove('bg-red-400');
        shareDropdown.style.backgroundColor = companyData.color_secondary;
        shareDropdown.style.color = companyData.color_primary || '#000000';
        
        // Apply hover colors to dropdown items
        const dropdownItems = shareDropdown.querySelectorAll('a, button');
        dropdownItems.forEach(item => {
          item.classList.remove('hover:bg-red-500');
          item.classList.add('hover:opacity-80');
          
          // Add hover effect with primary color
          item.addEventListener('mouseenter', () => {
            const textSpan = item.querySelector('span');
            if (textSpan) {
              textSpan.style.color = companyData.color_primary || '#000000';
              textSpan.style.fontWeight = 'bold';
            }
          });
          
          // Reset on mouse leave
          item.addEventListener('mouseleave', () => {
            const textSpan = item.querySelector('span');
            if (textSpan) {
              textSpan.style.color = companyData.color_primary || '#000000';
              textSpan.style.fontWeight = 'normal';
            }
          });
        });
        
        // Set the link icon color to the primary color
        const linkIcon = shareDropdown.querySelector('.fa-link');
        if (linkIcon) {
          linkIcon.style.color = companyData.color_primary || '#000000';
        }
      }
    }
    
    letterContainer.appendChild(buttonContainer);
    
    // NO ocultamos los botones originales, ya que todavía los necesitamos para interacción directa
    // Los botones generados dinámicamente se mostrarán cuando termine la animación
    
    // Fetch and parse the markdown content
    const markdownPath = companyData && companyData.markdown ? 
      companyData.markdown : 
      `/assets/coverletters/${companyKey}.md`;
    
    fetch(markdownPath)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch cover letter content.');
        }
        return response.text();
      })
      .then(markdown => {
        // Parse the markdown into sections based on HTML comments
        const sectionContents = parseMarkdownSections(markdown);
        
        // Start the typewriter animation sequence
        startTypewriterSequence(sectionContents, sections, buttonContainer, companyData);
      })
      .catch(error => {
        console.error('Error loading cover letter content:', error);
        letterContainer.innerHTML = `
          <div class="p-6 text-center">
            <h2 class="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
            <p class="mb-4">Failed to load the cover letter. Please try again later.</p>
          </div>
        `;
      });
  }
});

/**
 * Parse a markdown string into sections based on HTML comments
 * @param {string} markdown - The markdown content
 * @return {object} - Object with section contents
 */
function parseMarkdownSections(markdown) {
  const sections = {};
  const sectionNames = ['SALUDO', 'INTRODUCCIÓN', 'CUERPO', 'DESPEDIDA'];
  
  // First, split the content by the HTML comment markers
  const splitRegex = /<!--\s*(SALUDO|INTRODUCCIÓN|CUERPO|DESPEDIDA)\s*-->/gi;
  const parts = markdown.split(splitRegex);
  
  // The parts array will have the section names and content alternating
  // Starting at index 1 (first element is empty or text before first marker)
  for (let i = 1; i < parts.length; i += 2) {
    if (i + 1 < parts.length) {
      const sectionName = parts[i].trim().toUpperCase();
      const content = parts[i + 1].trim();
      
      // Process the content for this section
      let processedContent = content;
      
      // Convert line breaks to <br> tags
      processedContent = processedContent.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
      
      // Convert markdown links to HTML
      processedContent = processedContent.replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
        '<a href="$2" target="_blank" class="underline hover:text-red-400 transition-colors">$1</a>');
      
      // Convert emojis
      processedContent = processedContent.replace(/🔗/g, '<span class="emoji">🔗</span>');
      
      sections[sectionName] = processedContent;
    }
  }
  
  // Ensure all sections exist (even if empty)
  sectionNames.forEach(name => {
    if (!sections[name]) {
      sections[name] = '';
    }
  });
  
  return sections;
}

/**
 * Calculates the brightness of a color and returns a contrasting color
 * @param {string} primaryColor - The primary color in hex format
 * @param {string} secondaryColor - The secondary color in hex format
 * @return {string} - A color with contrasting brightness based on the secondary color
 */
function getContrastingColor(primaryColor, secondaryColor) {
  // Add debugging to find issues
  console.log('Calculating contrast for:', {primaryColor, secondaryColor});
  
  // Check and normalize inputs (handle potential null values or format issues)
  if (!primaryColor || !secondaryColor) {
    console.error('Missing color input:', {primaryColor, secondaryColor});
    return secondaryColor || '#ffcf00'; // Fallback to default if missing
  }
  
  // Ensure colors have # prefix
  primaryColor = primaryColor.startsWith('#') ? primaryColor : '#' + primaryColor;
  secondaryColor = secondaryColor.startsWith('#') ? secondaryColor : '#' + secondaryColor;
  
  // Convert hex to RGB
  const hexToRgb = (hex) => {
    try {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    } catch (e) {
      console.error('Error parsing color:', hex, e);
      return { r: 0, g: 0, b: 0 };
    }
  };

  // Calculate brightness (0-255) using common formula
  const getBrightness = (color) => {
    const rgb = hexToRgb(color);
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  };

  // Convert RGB to hex
  const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  // Calculate brightness of primary color
  const primaryBrightness = getBrightness(primaryColor);
  
  // Get the RGB values of secondary color
  const secondaryRgb = hexToRgb(secondaryColor);
  
  // Calculate the brightness of the secondary color
  const secondaryBrightness = getBrightness(secondaryColor);
  
  console.log('Brightness values:', {primaryBrightness, secondaryBrightness});

  // Determine the brightness adjustment factor
  // If primary is bright, darken the secondary. If primary is dark, lighten it.
  const isBright = primaryBrightness > 128;
  
  // For coarco specific fix - the red secondary color needs more adjustment
  let brightnessAdjustment = 100;
  if (secondaryColor.toLowerCase() === '#ff0000' && primaryColor.toLowerCase() === '#084881') {
    brightnessAdjustment = 150; // Use stronger adjustment for this specific case
    console.log('Applying special adjustment for coarco colors');
  }
  
  const targetBrightness = isBright ? 
    Math.max(0, secondaryBrightness - brightnessAdjustment) : 
    Math.min(255, secondaryBrightness + brightnessAdjustment);
  
  console.log('Target brightness:', targetBrightness);
  
  // Better calculation for adjustment factor to prevent division by zero
  const adjustmentFactor = secondaryBrightness === 0 ? 
    (isBright ? 0 : 1) : 
    targetBrightness / secondaryBrightness;
  
  // Create new RGB values with adjusted brightness
  let r = Math.min(255, Math.max(0, Math.round(secondaryRgb.r * adjustmentFactor)));
  let g = Math.min(255, Math.max(0, Math.round(secondaryRgb.g * adjustmentFactor)));
  let b = Math.min(255, Math.max(0, Math.round(secondaryRgb.b * adjustmentFactor)));
  
  const resultColor = rgbToHex(r, g, b);
  console.log('Result color:', resultColor);
  
  return resultColor;
}

/**
 * Start the sequence of typewriter animations
 * @param {object} sectionContents - Object with section contents
 * @param {object} sectionElements - Object with section DOM elements
 * @param {HTMLElement} buttonContainer - Container for the buttons
 * @param {object} companyData - Company data from template.js
 */
async function startTypewriterSequence(sectionContents, sections, buttonContainer, companyData) {
  // Create a new instance of our Typewriter class
  const typewriter = new Typewriter({
    typingSpeed: 17, // 3x faster than the original 50ms
    eraseSpeed: 10  // 3x faster than the original 30ms
  });
  
  // Initial wait for page to load completely
  await typewriter.wait(2000);
  
  // 1. Type the SALUDO section and wait
  await typewriter.type(sections.SALUDO, sectionContents.SALUDO, 17, true);
  await typewriter.wait(2000);
  
  // 2. Style and type the INTRODUCCIÓN section with the secondary color
  const secondaryColor = companyData?.color_secondary || '#ffcf00'; // Default to yellow if not set
  const primaryColor = companyData?.color_primary || '#ffffff'; // Default text color
  const fontColor = companyData?.font_color || '#000000'; // Default font color
  
  // Use the secondary color directly for the INTRODUCCIÓN section
  sections.INTRODUCCIÓN.innerHTML = `<span style="color: ${secondaryColor};"></span>`;
  sections.INTRODUCCIÓN.classList.remove('opacity-0');
  
  // Get the span element to type into
  const introSpan = sections.INTRODUCCIÓN.querySelector('span');
  
  // Type the INTRODUCCIÓN text inside the colored span
  await typewriter.type(introSpan, sectionContents.INTRODUCCIÓN, 17);
  await typewriter.wait(5000);
  await typewriter.erase(sections.INTRODUCCIÓN);
  
  // 3. Type the CUERPO section and wait (with specific typing speed)
  await typewriter.type(sections.CUERPO, sectionContents.CUERPO, 34);
  await typewriter.wait(2000); // Reduced from 7000ms to 2000ms
  
  // 4. Prepare the DESPEDIDA section with dynamic styling based on company colors
  // Use primaryColor for font and secondaryColor for background highlight
  sections.DESPEDIDA.innerHTML = `<mark style="background-color: ${secondaryColor}; color: ${primaryColor}; padding: 0 0.25rem;"></mark>`;
  sections.DESPEDIDA.classList.remove('opacity-0');
  
  // Get the mark element to type into
  const despedidaMark = sections.DESPEDIDA.querySelector('mark');
  
  // Type the DESPEDIDA text inside the mark element (using 30ms speed)
  await typewriter.type(despedidaMark, sectionContents.DESPEDIDA, 30);
  
  // Wait a moment before showing buttons
  await typewriter.wait(500);
  
  // Show the buttons with fade effect
  await typewriter.fade(buttonContainer, true);
  
  // Disparar un evento personalizado para indicar que la animación ha terminado
  const animationCompletedEvent = new Event('letter-animation-completed');
  window.dispatchEvent(animationCompletedEvent);
}
/**
 * Cover Letter Parser and Animation Controller
 * 
 * This script:
 * 1. Parses markdown files with HTML comment section delimiters
 * 2. Controls the typewriter animation sequence for cover letter sections
 * 3. Manages section styling and button display
 */

document.addEventListener('DOMContentLoaded', function() {
  // Wait for template.js to complete its work before starting animations
  window.addEventListener('template-loaded', function(e) {
    const companyData = e.detail;
    initializeCoverLetter(companyData);
  });

  function initializeCoverLetter(companyData) {
    // Parse the URL to get the company key
    const urlParams = new URLSearchParams(window.location.search);
    const companyKey = urlParams.get('to');
    
    if (!companyKey) {
      console.error('No company specified in URL');
      return;
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
      <a href="/" class="px-6 py-2 bg-red-400 text-white rounded-full font-semibold hover:bg-red-500 transition shadow-md">
        <i class="fas fa-arrow-left mr-2"></i> Back to Home
      </a>
      <a href="/content/resume.pdf" target="_blank" class="px-6 py-2 bg-red-400 text-white rounded-full font-semibold hover:bg-red-500 transition shadow-md">
        <i class="fas fa-file-pdf mr-2"></i> View Resume
      </a>
    `;
    
    // Apply company colors to buttons
    if (companyData && companyData.color_secondary) {
      const buttons = buttonContainer.querySelectorAll('a');
      buttons.forEach(button => {
        button.classList.remove('bg-red-400', 'hover:bg-red-500');
        button.style.backgroundColor = companyData.color_secondary;
        button.style.color = companyData.font_color === '#ffffff' ? '#ffffff' : '#000000';
      });
    }
    
    letterContainer.appendChild(buttonContainer);
    
    // Hide the original buttons
    const originalButtonsContainer = document.querySelector('main > div > div.mt-10');
    if (originalButtonsContainer) {
      originalButtonsContainer.style.display = 'none';
    }
    
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
        startTypewriterSequence(sectionContents, sections, buttonContainer);
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
 * Start the sequence of typewriter animations
 * @param {object} sectionContents - Object with section contents
 * @param {object} sectionElements - Object with section DOM elements
 * @param {HTMLElement} buttonContainer - Container for the buttons
 */
async function startTypewriterSequence(sectionContents, sections, buttonContainer) {
  // Create a new instance of our Typewriter class
  const typewriter = new Typewriter({
    typingSpeed: 50,
    eraseSpeed: 30
  });
  
  // Initial wait for page to load completely
  await typewriter.wait(2000);
  
  // 1. Type the SALUDO section and wait
  await typewriter.type(sections.SALUDO, sectionContents.SALUDO, 50, true);
  await typewriter.wait(2000);
  
  // 2. Type the INTRODUCCIÓN section, wait, then erase it
  await typewriter.type(sections.INTRODUCCIÓN, sectionContents.INTRODUCCIÓN, 50);
  await typewriter.wait(2000);
  await typewriter.erase(sections.INTRODUCCIÓN);
  
  // 3. Type the CUERPO section and wait
  await typewriter.type(sections.CUERPO, sectionContents.CUERPO, 40);
  await typewriter.wait(7000);
  
  // 4. Prepare the DESPEDIDA section with styling but empty content
  sections.DESPEDIDA.innerHTML = '<mark style="background-color: black; color: #ffcf00; padding: 0 0.25rem;"></mark>';
  sections.DESPEDIDA.classList.remove('opacity-0');
  
  // Get the mark element to type into
  const despedidaMark = sections.DESPEDIDA.querySelector('mark');
  
  // Type the DESPEDIDA text inside the mark element
  await typewriter.type(despedidaMark, sectionContents.DESPEDIDA, 50);
  
  // Wait a moment before showing buttons
  await typewriter.wait(500);
  
  // Show the buttons with fade effect
  await typewriter.fade(buttonContainer, true);
}
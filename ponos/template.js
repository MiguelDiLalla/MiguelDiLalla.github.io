document.addEventListener('DOMContentLoaded', function() {
  // 1. Extract 'to' parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const companyKey = urlParams.get('to');
  
  // Check if we have a company parameter
  if (!companyKey) {
    showFallbackMessage('No company specified. Please add a company parameter to the URL (e.g., ?to=gmv).');
    return;
  }
  
  // 2. Fetch the company configuration from config.json
  fetch('/ponos/config.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch company configuration.');
      }
      return response.json();
    })
    .then(config => {
      // Check if the company exists in our config
      if (!config[companyKey]) {
        showFallbackMessage(`Company "${companyKey}" not found in our database.`);
        return;
      }
      
      // 3. Apply the company style and content
      applyCompanySettings(config[companyKey]);
      
      // 4. Dispatch event for letter-parser.js to start animations
      window.dispatchEvent(new CustomEvent('template-loaded', { 
        detail: config[companyKey]
      }));
    })
    .catch(error => {
      console.error('Error loading company configuration:', error);
      showFallbackMessage('Error loading configuration. Please try again later.');
    });
  
  // Function to apply company-specific settings
  function applyCompanySettings(company) {
    // Store company data in window object for access by other scripts
    window.companyData = company;
    
    // 1. Set page background and text colors
    const pageBody = document.getElementById('page-body');
    const pageHeader = document.getElementById('page-header');
    
    // Apply primary color as background
    pageBody.style.backgroundColor = company.color_primary;
    pageHeader.style.backgroundColor = company.color_primary;
    
    // Apply font color
    if (company.font_color) {
      pageBody.style.color = company.font_color;
      
      // Set hover colors to secondary color for links
      const styleSheet = document.createElement('style');
      styleSheet.textContent = `
        a:hover {
          color: ${company.color_secondary} !important;
        }
        .hover\\:bg-red-500:hover {
          background-color: ${company.color_secondary} !important;
        }
        
        .letter-content blockquote {
          border-left-color: ${company.color_secondary};
          color: ${company.font_color};
        }
      `;
      document.head.appendChild(styleSheet);
      
      // Update footer to use company secondary color
      const footer = document.querySelector('footer');
      footer.style.backgroundColor = company.color_secondary;
      footer.style.color = company.font_color === '#ffffff' ? '#ffffff' : '#000000';
    }
    
    // 2. Set company logo in the navigation if available
    if (company.logo) {
      // Helper function to handle logo loading with fallback
      const setupLogo = (logoElement, fallbackContainer) => {
        logoElement.src = company.logo;
        logoElement.alt = `${company.empresa} Logo`;
        
        // Handle image load error
        logoElement.onerror = function() {
          logoElement.classList.add('hidden'); // Keep the logo hidden if it fails to load
          if (fallbackContainer) {
            fallbackContainer.classList.add('hidden'); // Also hide the fallback container
          }
        };
        
        // Show the logo if it loads successfully
        logoElement.onload = function() {
          logoElement.classList.remove('hidden');
          if (fallbackContainer) {
            fallbackContainer.classList.remove('hidden');
          }
        };
      };
      
      // Set up navigation logos with error handling
      setupLogo(document.getElementById('nav-logo-desktop'), document.getElementById('desktop-logo-container'));
      setupLogo(document.getElementById('nav-logo-mobile'), document.getElementById('mobile-logo-container'));
    }
    
    // Clear the loading animation
    const letterContent = document.getElementById('letter-content');
    // Don't clear the content here - let letter-parser.js handle it
  }
  
  // Function to display fallback message when something goes wrong
  function showFallbackMessage(message) {
    // Set the body and header background to yellow (#ffcf00) and text to black
    const pageBody = document.getElementById('page-body');
    const pageHeader = document.getElementById('page-header');
    pageBody.style.backgroundColor = '#ffcf00';
    pageHeader.style.backgroundColor = '#ffcf00';
    pageBody.style.color = '#000000';
    
    // Set up the footer to use black background
    const footer = document.querySelector('footer');
    if (footer) {
      footer.style.backgroundColor = '#000000';
      footer.style.color = '#ffffff';
    }
    
    document.getElementById('letter-content').innerHTML = `
      <div class="p-6 text-center">
        <h2 class="text-2xl font-bold mb-4 font-title">Oops! Something went wrong</h2>
        <p class="mb-4">${message}</p>
        <p class="mb-4">If you believe this is an error, please contact me directly.</p>
        <div class="mt-6 flex justify-center gap-4">
          <a href="https://www.linkedin.com/in/MiguelDiLalla" target="_blank" class="px-6 py-2 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition">
            <i class="fab fa-linkedin mr-2"></i> LinkedIn
          </a>
          <a href="mailto:migueljdilallap@gmail.com" class="px-6 py-2 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition">
            <i class="fas fa-envelope mr-2"></i> Email
          </a>
        </div>
      </div>
    `;
  }
});
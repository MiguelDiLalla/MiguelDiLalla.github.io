/**
 * Sharing Functions for Cover Letters
 * 
 * This script handles sharing through various channels:
 * - Email sharing with proper subject and body
 * - WhatsApp sharing with formatted message
 * - Copy link to clipboard with proper URL parameters
 * - Structured data management for better SEO
 */

document.addEventListener('DOMContentLoaded', function() {
  // Wait until letter animation is complete to set up share functionality
  window.addEventListener('letter-animation-completed', setupSharing);
  
  // Also set up the original share dropdown toggle
  setupShareDropdown();
  
  // Set up the original share dropdown functionality
  function setupShareDropdown() {
    const shareButton = document.getElementById('share-button');
    const shareDropdown = document.getElementById('share-dropdown');
    
    if (shareButton && shareDropdown) {
      // Toggle dropdown visibility
      shareButton.addEventListener('click', function(e) {
        e.preventDefault();
        shareDropdown.classList.toggle('hidden');
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', function(e) {
        if (!shareButton.contains(e.target) && !shareDropdown.contains(e.target)) {
          shareDropdown.classList.add('hidden');
        }
      });
    }
  }
  
  // Setup sharing functionality for dynamically created buttons
  function setupSharing() {
    // Get company data from window object (set by template.js)
    const companyData = window.companyData || {};
    const companyName = companyData.empresa || 'the company';
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const companyKey = urlParams.get('to');
    
    if (!companyKey) return; // Exit if no company key
    
    // 1. Setup dynamically created share button
    const shareButtonDynamic = document.getElementById('share-button-dynamic');
    const shareDropdownDynamic = document.getElementById('share-dropdown-dynamic');
    
    if (shareButtonDynamic && shareDropdownDynamic) {
      // Toggle dropdown visibility
      shareButtonDynamic.addEventListener('click', function(e) {
        e.preventDefault();
        shareDropdownDynamic.classList.toggle('hidden');
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', function(e) {
        if (!shareButtonDynamic.contains(e.target) && !shareDropdownDynamic.contains(e.target)) {
          shareDropdownDynamic.classList.add('hidden');
        }
      });
    }
    
    // 2. Setup email sharing
    setupEmailShare('email-share', companyData, companyKey);
    setupEmailShare('email-share-dynamic', companyData, companyKey);
    
    // 3. Setup WhatsApp sharing
    setupWhatsAppShare('whatsapp-share', companyData, companyKey);
    setupWhatsAppShare('whatsapp-share-dynamic', companyData, companyKey);
    
    // 4. Setup copy link functionality
    setupCopyLink('copy-link', companyKey);
    setupCopyLink('copy-link-dynamic', companyKey);
    
    // 5. Generate and add social-specific meta tags for better sharing
    generateSocialMetaTags(companyData, companyKey);
  }
  
  /**
   * Setup the email share link with company-specific content
   */
  function setupEmailShare(elementId, companyData, companyKey) {
    const emailLink = document.getElementById(elementId);
    if (!emailLink) return;
    
    const companyName = companyData.empresa || companyKey.charAt(0).toUpperCase() + companyKey.slice(1);
    const recipient = companyData.contact_email || '';
    
    // Create email subject and body
    const emailSubject = `Cover Letter from Miguel Di Lalla for ${companyName}`;
    const emailBody = `Hello ${companyName} team,\n\n`
                    + `I'm sharing my cover letter for your consideration.\n\n`
                    + `You can view it online at: ${window.location.href}\n\n`
                    + `Best regards,\nMiguel Di Lalla`;
    
    // Create the mailto link
    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Set the href attribute and click handler
    emailLink.href = mailtoLink;
    emailLink.addEventListener('click', function(e) {
      // Track sharing event if analytics is available
      if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
          method: 'email',
          content_type: 'cover_letter',
          item_id: companyKey
        });
      }
      
      // Close dropdown after clicking
      const dropdown = this.closest('#share-dropdown, #share-dropdown-dynamic');
      if (dropdown) {
        dropdown.classList.add('hidden');
      }
    });
  }
  
  /**
   * Setup WhatsApp share with company-specific content
   */
  function setupWhatsAppShare(elementId, companyData, companyKey) {
    const whatsappLink = document.getElementById(elementId);
    if (!whatsappLink) return;
    
    const companyName = companyData.empresa || companyKey.charAt(0).toUpperCase() + companyKey.slice(1);
    
    // Create WhatsApp text
    const whatsappText = `Check out Miguel Di Lalla's cover letter for ${companyName}: ${window.location.href}`;
    
    // Create the WhatsApp link
    const whatsappShareLink = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
    
    // Set the href attribute and click handler
    whatsappLink.href = whatsappShareLink;
    whatsappLink.target = '_blank';
    whatsappLink.addEventListener('click', function(e) {
      // Track sharing event if analytics is available
      if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
          method: 'whatsapp',
          content_type: 'cover_letter',
          item_id: companyKey
        });
      }
      
      // Close dropdown after clicking
      const dropdown = this.closest('#share-dropdown, #share-dropdown-dynamic');
      if (dropdown) {
        dropdown.classList.add('hidden');
      }
    });
  }
  
  /**
   * Setup copy link functionality with better UX
   */
  function setupCopyLink(elementId, companyKey) {
    const copyButton = document.getElementById(elementId);
    if (!copyButton) return;
    
    copyButton.addEventListener('click', function() {
      // Create a canonical URL - use absolute paths for better sharing
      const canonicalUrl = `${window.location.origin}${window.location.pathname}?to=${companyKey}`;
      
      // Copy to clipboard with fallback
      navigator.clipboard.writeText(canonicalUrl).then(
        function() {
          // Success - Update button text temporarily
          const originalText = copyButton.innerHTML;
          copyButton.innerHTML = '<i class="fas fa-check mr-3 text-green-500"></i><span>Link copied!</span>';
          
          // Revert after 2 seconds
          setTimeout(function() {
            copyButton.innerHTML = originalText;
          }, 2000);
          
          // Track copy event if analytics is available
          if (typeof gtag !== 'undefined') {
            gtag('event', 'copy', {
              content_type: 'cover_letter_url',
              item_id: companyKey
            });
          }
        },
        function() {
          // Fallback for browsers that don't support clipboard API
          const textArea = document.createElement('textarea');
          textArea.value = canonicalUrl;
          document.body.appendChild(textArea);
          textArea.select();
          
          try {
            document.execCommand('copy');
            const originalText = copyButton.innerHTML;
            copyButton.innerHTML = '<i class="fas fa-check mr-3 text-green-500"></i><span>Link copied!</span>';
            setTimeout(function() {
              copyButton.innerHTML = originalText;
            }, 2000);
          } catch (err) {
            console.error('Could not copy text: ', err);
            alert('Could not copy link. Please copy the URL manually from your browser address bar.');
          }
          
          document.body.removeChild(textArea);
        }
      );
      
      // Close dropdown after clicking
      const dropdown = this.closest('#share-dropdown, #share-dropdown-dynamic');
      if (dropdown) {
        dropdown.classList.add('hidden');
      }
    });
  }
  
  /**
   * Generate social-specific meta tags for better sharing
   */
  function generateSocialMetaTags(companyData, companyKey) {
    const companyName = companyData.empresa || companyKey.charAt(0).toUpperCase() + companyKey.slice(1);
    
    // Add LinkedIn-specific meta tags
    addMetaTag('property', 'linkedin:owner', 'MiguelDiLalla');
    
    // Add article tags for better sharing
    addMetaTag('property', 'og:article:author', 'Miguel Di Lalla');
    addMetaTag('property', 'og:article:published_time', new Date().toISOString());
    addMetaTag('property', 'og:article:tag', 'cover letter, portfolio, data science, machine learning');
    
    // Add Twitter creator tags
    addMetaTag('name', 'twitter:creator', '@MiguelDiLalla');
    
    // Update Facebook app ID if you have one
    // addMetaTag('property', 'fb:app_id', 'YOUR_FACEBOOK_APP_ID');
  }
  
  /**
   * Helper to create and add meta tags to the document head
   */
  function addMetaTag(attrName, attrValue, content) {
    // Check if the meta tag already exists
    const existingTag = document.querySelector(`meta[${attrName}="${attrValue}"]`);
    
    if (existingTag) {
      // Update existing tag
      existingTag.setAttribute('content', content);
    } else {
      // Create new tag
      const metaTag = document.createElement('meta');
      metaTag.setAttribute(attrName, attrValue);
      metaTag.setAttribute('content', content);
      document.head.appendChild(metaTag);
    }
  }
});
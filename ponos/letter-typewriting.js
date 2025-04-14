/**
 * Advanced Typewriter Animation System for Cover Letters
 * 
 * This script provides sophisticated typewriter animations with:
 * - Character-by-character typing with configurable speed
 * - HTML tag preservation during typing/fading
 * - Support for markdown formatting (**bold**, *italic*, etc.)
 * - Cursor blinking effect
 * - Pause/wait capability between animations
 * - Text graceful fade out animation
 * - Automatic smooth scrolling to keep typed text in view
 */

class Typewriter {
  /**
   * Initialize the typewriter
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.options = {
      typingSpeed: options.typingSpeed || 50,
      fadeOutSpeed: options.fadeOutSpeed || 30, // Renamed from eraseSpeed
      fadeDuration: options.fadeDuration || 500, // Duration for fade animations
      blinkCursorClass: options.blinkCursorClass || 'blinking-cursor',
      scrollPadding: options.scrollPadding || 150, // Padding for auto-scrolling
      ...options
    };
    
    // Flag to track if animations should be skipped
    this.skipAnimations = false;
    
    // Listen for the skip-animations event
    window.addEventListener('skip-animations', () => {
      this.skipAnimations = true;
    });
  }

  /**
   * Type text into an element character by character
   * @param {HTMLElement} element - The element to type into
   * @param {string} text - The text to type
   * @param {number} speed - Optional override typing speed
   * @param {boolean} lineBreak - Whether to add a line break at the end
   * @return {Promise} - Resolves when typing is complete
   */
  type(element, text, speed = this.options.typingSpeed, lineBreak = false) {
    return new Promise(resolve => {
      let i = 0;
      element.classList.remove('opacity-0');
      element.classList.add(this.options.blinkCursorClass);
      element.innerHTML = '';
      
      // Process markdown formatting before typing
      const processedText = this._processMarkdown(text);
      
      // If animations should be skipped, immediately show the full text
      if (this.skipAnimations) {
        element.innerHTML = processedText;
        if (lineBreak) {
          element.innerHTML += '<br><br>';
        }
        element.classList.remove(this.options.blinkCursorClass);
        resolve();
        return;
      }
      
      const type = () => {
        if (i < processedText.length) {
          // Check if the skip flag was set during typing
          if (this.skipAnimations) {
            element.innerHTML = processedText;
            if (lineBreak) {
              element.innerHTML += '<br><br>';
            }
            element.classList.remove(this.options.blinkCursorClass);
            resolve();
            return;
          }
          
          // Check if we're typing an HTML tag
          if (processedText.charAt(i) === '<') {
            // Find the end of the tag
            const closeTag = processedText.indexOf('>', i);
            if (closeTag !== -1) {
              element.innerHTML += processedText.substring(i, closeTag + 1);
              i = closeTag + 1;
            } else {
              element.innerHTML += processedText.charAt(i);
              i++;
            }
          } else {
            element.innerHTML += processedText.charAt(i);
            i++;
          }
          
          // Auto-scroll to keep the typing area in view
          this._scrollIntoView(element);
          
          setTimeout(type, speed);
        } else {
          if (lineBreak) {
            element.innerHTML += '<br><br>';
          }
          element.classList.remove(this.options.blinkCursorClass);
          resolve();
        }
      };
      
      type();
    });
  }

  /**
   * Process markdown formatting to convert to HTML
   * @param {string} text - The text to process
   * @return {string} - The processed text with HTML tags
   * @private
   */
  _processMarkdown(text) {
    // Process bold text: **text** or __text__
    let processedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    processedText = processedText.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Process italic text: *text* or _text_
    processedText = processedText.replace(/\*([^\*]+)\*/g, '<em>$1</em>');
    processedText = processedText.replace(/_([^_]+)_/g, '<em>$1</em>');
    
    // Process strikethrough: ~~text~~
    processedText = processedText.replace(/~~(.*?)~~/g, '<del>$1</del>');
    
    return processedText;
  }

  /**
   * Auto-scroll to keep the typing element in view
   * @param {HTMLElement} element - The element to keep in view
   * @private
   */
  _scrollIntoView(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementBottom = rect.bottom;
    
    // If the bottom of the element is below or near the viewport bottom,
    // smoothly scroll to keep it in view with some padding
    if (elementBottom > windowHeight - this.options.scrollPadding) {
      const scrollAmount = elementBottom - windowHeight + this.options.scrollPadding;
      window.scrollBy({
        top: scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Gracefully fade out text from an element
   * @param {HTMLElement} element - The element to fade text from
   * @param {number} speed - Optional override fade speed
   * @return {Promise} - Resolves when fading is complete
   */
  erase(element, speed = this.options.fadeOutSpeed) {
    return new Promise(resolve => {
      // If animations should be skipped, skip the fade out
      if (this.skipAnimations) {
        element.innerHTML = '';
        element.classList.remove(this.options.blinkCursorClass);
        resolve();
        return;
      }
      
      const text = element.innerHTML;
      
      // Create a temporary container
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'relative';
      tempContainer.style.display = 'inline-block';
      tempContainer.innerHTML = text;
      tempContainer.style.transition = `opacity ${this.options.fadeDuration}ms ease`;
      tempContainer.style.opacity = '1';
      
      // Replace the element's content with the container
      element.innerHTML = '';
      element.appendChild(tempContainer);
      element.classList.add(this.options.blinkCursorClass);
      
      // Add a half-second delay before starting the fade out
      setTimeout(() => {
        // Check again if animations should be skipped
        if (this.skipAnimations) {
          element.innerHTML = '';
          element.classList.remove(this.options.blinkCursorClass);
          resolve();
          return;
        }
        
        // Start the fade out animation
        tempContainer.style.opacity = '0';
        
        // Remove the container after the animation completes
        setTimeout(() => {
          element.innerHTML = '';
          element.classList.remove(this.options.blinkCursorClass);
          resolve();
        }, this.options.fadeDuration);
      }, 500); // Half-second delay before the fade begins
    });
  }

  /**
   * Wait for a specified time
   * @param {number} ms - Milliseconds to wait
   * @return {Promise} - Resolves after waiting
   */
  wait(ms) {
    return new Promise(resolve => {
      // If animations should be skipped, don't wait
      if (this.skipAnimations) {
        resolve();
        return;
      }
      
      setTimeout(resolve, ms);
    });
  }

  /**
   * Show or remove an element with fade animation
   * @param {HTMLElement} element - The element to show/hide
   * @param {boolean} show - Whether to show (true) or hide (false)
   * @param {string} animationClass - The CSS class for animation
   * @return {Promise} - Resolves when animation is complete
   */
  fade(element, show = true, animationClass = 'animate-fade-in') {
    return new Promise(resolve => {
      // If animations should be skipped, immediately show/hide
      if (this.skipAnimations) {
        if (show) {
          element.classList.remove('opacity-0');
        } else {
          element.classList.add('opacity-0');
        }
        resolve();
        return;
      }
      
      if (show) {
        element.classList.remove('opacity-0');
        element.classList.add(animationClass);
        setTimeout(resolve, 600); // Match the CSS animation duration
      } else {
        element.classList.add('opacity-0');
        element.classList.remove(animationClass);
        setTimeout(resolve, 600);
      }
    });
  }
}

// Export for use in other scripts
window.Typewriter = Typewriter;
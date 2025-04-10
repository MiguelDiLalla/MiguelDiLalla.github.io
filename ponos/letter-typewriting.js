/**
 * Advanced Typewriter Animation System for Cover Letters
 * 
 * This script provides sophisticated typewriter animations with:
 * - Character-by-character typing with configurable speed
 * - HTML tag preservation during typing/erasing
 * - Cursor blinking effect
 * - Pause/wait capability between animations
 * - Text erasing animation
 */

class Typewriter {
  /**
   * Initialize the typewriter
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.options = {
      typingSpeed: options.typingSpeed || 50,
      eraseSpeed: options.eraseSpeed || 30,
      blinkCursorClass: options.blinkCursorClass || 'blinking-cursor',
      ...options
    };
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
      
      const type = () => {
        if (i < text.length) {
          // Check if we're typing an HTML tag
          if (text.charAt(i) === '<') {
            // Find the end of the tag
            const closeTag = text.indexOf('>', i);
            if (closeTag !== -1) {
              element.innerHTML += text.substring(i, closeTag + 1);
              i = closeTag + 1;
            } else {
              element.innerHTML += text.charAt(i);
              i++;
            }
          } else {
            element.innerHTML += text.charAt(i);
            i++;
          }
          
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
   * Erase text from an element with typewriter effect
   * @param {HTMLElement} element - The element to erase from
   * @param {number} speed - Optional override erasing speed
   * @return {Promise} - Resolves when erasing is complete
   */
  erase(element, speed = this.options.eraseSpeed) {
    return new Promise(resolve => {
      let text = element.innerHTML;
      let i = text.length;
      
      element.classList.add(this.options.blinkCursorClass);
      
      const erase = () => {
        if (i > 0) {
          // Handle HTML tags during erasure
          if (text.charAt(i - 1) === '>') {
            // Find the opening tag
            const openTag = text.lastIndexOf('<', i);
            if (openTag !== -1) {
              text = text.substring(0, openTag);
              element.innerHTML = text;
              i = openTag;
            } else {
              text = text.substring(0, i - 1);
              element.innerHTML = text;
              i--;
            }
          } else {
            text = text.substring(0, i - 1);
            element.innerHTML = text;
            i--;
          }
          
          setTimeout(erase, speed);
        } else {
          element.innerHTML = '';
          element.classList.remove(this.options.blinkCursorClass);
          resolve();
        }
      };
      
      erase();
    });
  }

  /**
   * Wait for a specified time
   * @param {number} ms - Milliseconds to wait
   * @return {Promise} - Resolves after waiting
   */
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
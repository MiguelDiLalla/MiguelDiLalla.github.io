// Typewriter animation with language support
class Typewriter {
  constructor(element, options = {}) {
    this.element = element;
    this.speed = options.speed || 100;
    this.lineDelay = options.lineDelay || 1000;
    this.emoticonsDelay = options.emoticonsDelay || 400;
    this.fadeDuration = options.fadeDuration || 500; // Duration for fade animations
    this.queue = [];
    this.isRunning = false;
    this.language = options.language || 'en';
    
    // Actions that can be scheduled
    this.actions = {
      TYPE: 'type',
      DELETE: 'delete',
      FADE_OUT: 'fade_out', // New action for fading out text
      WAIT: 'wait',
      NEXT_LINE: 'next_line',
      REPLACE_LINE: 'replace_line',
      SET_EMOTICON: 'set_emoticon'
    };
  }

  // Add text typing to the queue
  type(text, speedMultiplier = 1) {
    this.queue.push({
      action: this.actions.TYPE,
      value: text,
      speedMultiplier: speedMultiplier
    });
    return this;
  }

  // Add text deletion to the queue (can specify number of characters)
  // This is maintained for backwards compatibility
  delete(charCount = null) {
    this.queue.push({
      action: this.actions.FADE_OUT, // Changed to use fade_out instead
      value: charCount
    });
    return this;
  }

  // Add text fade out to the queue (gracefully fade out text)
  fadeOut(charCount = null) {
    this.queue.push({
      action: this.actions.FADE_OUT,
      value: charCount
    });
    return this;
  }

  // Add a wait period to the queue
  wait(ms) {
    this.queue.push({
      action: this.actions.WAIT,
      value: ms
    });
    return this;
  }

  // Add a new line
  nextLine() {
    this.queue.push({
      action: this.actions.NEXT_LINE
    });
    return this;
  }

  // Delete current line and replace with another
  replaceLine(text) {
    this.queue.push({
      action: this.actions.REPLACE_LINE,
      value: text
    });
    return this;
  }

  // Display a specific emoticon
  setEmoticon(emoticon) {
    this.queue.push({
      action: this.actions.SET_EMOTICON,
      value: emoticon
    });
    return this;
  }

  // Execute the next action in the queue
  async executeNextAction() {
    if (!this.queue.length) {
      this.isRunning = false;
      return;
    }

    const action = this.queue.shift();
    const lines = this.element.innerHTML.split('<br>');
    let currentLine = lines.length - 1;

    switch (action.action) {
      case this.actions.TYPE:
        await this.executeTypeAction(action, lines, currentLine);
        break;
      case this.actions.DELETE: // Legacy support redirects to fade out
      case this.actions.FADE_OUT:
        await this.executeFadeOutAction(action, lines, currentLine);
        break;
      case this.actions.WAIT:
        await new Promise(resolve => setTimeout(resolve, action.value));
        break;
      case this.actions.NEXT_LINE:
        lines.push('');
        this.element.innerHTML = lines.join('<br>');
        break;
      case this.actions.REPLACE_LINE:
        if (lines.length > 0) {
          lines.pop();
          lines.push(action.value);
          this.element.innerHTML = lines.join('<br>');
        }
        break;
      case this.actions.SET_EMOTICON:
        if (lines.length > 0) {
          if (lines[lines.length - 1].includes('(„•')) {
            const textWithoutEmoticon = lines[lines.length - 1].replace(/\s*\(„•.*?„\)$/, '');
            lines[lines.length - 1] = textWithoutEmoticon + ' ' + action.value;
          } else {
            lines[lines.length - 1] += ' ' + action.value;
          }
          this.element.innerHTML = lines.join('<br>');
        }
        break;
    }

    // Continue with the next action in the queue
    this.executeNextAction();
  }

  // Execute a TYPE action
  async executeTypeAction(action, lines, currentLine) {
    const text = action.value;
    const typingSpeed = this.speed / (action.speedMultiplier || 1);
    
    for (let i = 0; i < text.length; i++) {
      // Use setTimeout inside a promise to create delay between characters
      await new Promise(resolve => {
        setTimeout(() => {
          if (lines[currentLine]) {
            lines[currentLine] += text[i];
          } else {
            lines[currentLine] = text[i];
          }
          this.element.innerHTML = lines.join('<br>');
          resolve();
        }, typingSpeed);
      });
    }
  }

  // Execute a FADE_OUT action
  async executeFadeOutAction(action, lines, currentLine) {
    const charCount = action.value === null ? lines[currentLine].length : action.value;
    
    if (lines[currentLine] && lines[currentLine].length > 0) {
      // Create a temporary span for the text to be faded out
      const textToFade = lines[currentLine].substring(lines[currentLine].length - charCount);
      const remainingText = lines[currentLine].substring(0, lines[currentLine].length - charCount);
      
      // Create a temporary span for the fading effect
      const fadeSpan = document.createElement('span');
      fadeSpan.textContent = textToFade;
      fadeSpan.style.transition = `opacity ${this.fadeDuration}ms ease`;
      fadeSpan.style.opacity = '1';
      
      // Update the line with the remaining text and the fade span
      lines[currentLine] = remainingText;
      this.element.innerHTML = lines.join('<br>');
      this.element.appendChild(fadeSpan);
      
      // Add a half-second delay before starting the fade out
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Trigger the fade out animation
      await new Promise(resolve => {
        setTimeout(() => {
          fadeSpan.style.opacity = '0';
          setTimeout(() => {
            // Remove the fade span after the animation completes
            if (fadeSpan.parentNode) {
              fadeSpan.parentNode.removeChild(fadeSpan);
            }
            resolve();
          }, this.fadeDuration);
        }, 10); // Small delay to ensure the transition applies
      });
    }
  }

  // Start the typewriter animation
  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.executeNextAction();
    }
    return this;
  }

  // Clear the animation queue
  clear() {
    this.queue = [];
    this.isRunning = false;
    this.element.innerHTML = '';
    return this;
  }
}

// Extend the Typewriter class to dispatch an event when the animation completes
const typewriterComplete = new Event('typewriterComplete');

const originalExecuteNextAction = Typewriter.prototype.executeNextAction;
Typewriter.prototype.executeNextAction = async function () {
  if (!this.queue.length) {
    this.isRunning = false;
    this.element.dispatchEvent(typewriterComplete); // Dispatch the event when the queue is empty
    return;
  }
  await originalExecuteNextAction.call(this);
};

// Global variables for typewriter
let currentTypewriter = null;

// Initialize or reset typewriter with language-specific text
function initTypewriter(lang = null) {
  // Get language from parameter or use the current language from window
  const language = lang || window.currentLanguage || 'en';
  // Update the global language state maintained by the language manager
  if (window.currentLanguage !== language) {
    window.currentLanguage = language;
  }
  
  const typewriterElement = document.getElementById('typewriter');
  
  if (!typewriterElement) {
    console.error('Typewriter element not found.');
    return;
  }
  
  // Reset any existing typewriter
  if (currentTypewriter) {
    currentTypewriter.clear();
  }
  
  // Create a new typewriter instance
  currentTypewriter = new Typewriter(typewriterElement, {
    speed: 70,
    language: language
  });
  
  // Default greetings in case translations aren't available
  let greetings = {
    initial: 'Hi!',
    intro: "This is Miguel:",
    jobSearch: "He is looking for his first IT job!",
    scholarship: "And he's got a 3 months Full Scholarship for that",
    callToAction: "find out more down below.",
    welcome: "welcome..."
  };
  
  // Check if translations are available globally and override defaults
  if (window.translations && window.translations[language]) {
    const t = window.translations[language];
    
    // Use translations if available, otherwise keep defaults
    greetings.initial = t['hero_greeting_initial'] || greetings.initial;
    greetings.intro = t['hero_greeting_intro'] || greetings.intro;
    greetings.jobSearch = t['hero_greeting_jobSearch'] || greetings.jobSearch;
    greetings.scholarship = t['hero_greeting_scholarship'] || greetings.scholarship;
    greetings.callToAction = t['hero_greeting_callToAction'] || greetings.callToAction;
    greetings.welcome = t['hero_greeting_welcome'] || greetings.welcome;
  } else {
    console.warn('Translations not available, using defaults');
  }
  
  // Clear the element to prevent duplication
  typewriterElement.textContent = '';
  
  // Define the animation sequence with improved spacing
  currentTypewriter
    // Step 1: Type initial greeting, wait, then erase
    .type(greetings.initial, 3)
    .wait(800)
    .delete()
    .wait(300)
    
    // Type intro and stay, add two line breaks for better spacing
    .type(greetings.intro, 3)
    .wait(500)
    .nextLine()
    .nextLine()
    
    // Step 2: Type job search message and stay, add two line breaks
    .type(greetings.jobSearch, 3)
    .wait(1000)
    .nextLine()
    .nextLine()
    
    // Step 3: Type scholarship info, wait longer, then erase
    .type(greetings.scholarship, 3)
    .wait(1500)
    .delete()
    
    // Step 4: Type call to action, wait, erase
    .type(greetings.callToAction, 3)
    .wait(1200)
    .delete()
    
    // Then welcome message
    .type(greetings.welcome, 3)
    .wait(800)
    // Add a line break before emoticon so it appears on its own line
    .nextLine()
    
    // Emoticon animation with proper pauses - keeping this one-time animation
    .setEmoticon('(„• ᴗ •„)')
    .wait(600)
    .setEmoticon('(„• ᴗ ᵔ„)')
    .wait(600)
    .setEmoticon('(„• ᴗ •„)')
    .wait(1200)
    // Delete the emoticon at the end
    .delete(10)
    .wait(300)
    
    // Start the animation
    .start();

  // Listen for the typewriter completion event
  typewriterElement.addEventListener('typewriterComplete', () => {
    // Show quotes and subtitle when typewriter animation completes
    const quoteFlipperElem = document.getElementById('quote-flipper');
    const roleSubtitleElem = document.querySelector('.role-subtitle');
    
    if (quoteFlipperElem) quoteFlipperElem.classList.add('visible');
    if (roleSubtitleElem) roleSubtitleElem.classList.add('visible');
  });
}

// Make initTypewriter available globally
window.initTypewriter = initTypewriter;

// Modified: Remove automatic initialization on DOMContentLoaded
// Now the typewriter will only start when explicitly called by startHeroAnimations
// This prevents the typewriter from running when the loading screen is still visible
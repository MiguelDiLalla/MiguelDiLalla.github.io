class Typewriter {
  constructor(element, options = {}) {
    this.element = element;
    this.speed = options.speed || 100;
    this.lineDelay = options.lineDelay || 1000;
    this.emoticonsDelay = options.emoticonsDelay || 400;
    this.queue = [];
    this.isRunning = false;
    
    // Actions that can be scheduled
    this.actions = {
      TYPE: 'type',
      DELETE: 'delete',
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
  delete(charCount = null) {
    this.queue.push({
      action: this.actions.DELETE,
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
      case this.actions.DELETE:
        await this.executeDeleteAction(action, lines, currentLine);
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

  // Execute a DELETE action
  async executeDeleteAction(action, lines, currentLine) {
    const charCount = action.value === null ? lines[currentLine].length : action.value;
    
    for (let i = 0; i < charCount; i++) {
      await new Promise(resolve => {
        setTimeout(() => {
          if (lines[currentLine] && lines[currentLine].length > 0) {
            lines[currentLine] = lines[currentLine].substring(0, lines[currentLine].length - 1);
            this.element.innerHTML = lines.join('<br>');
          }
          resolve();
        }, this.speed / 2); // Deleting is typically faster
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

// Initialize typewriter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const typewriterElement = document.getElementById('typewriter');
  
  if (typewriterElement) {
    // Create typewriter with the custom animation sequence
    const typewriter = new Typewriter(typewriterElement, {
      speed: 70
    });
    
    // Define the animation sequence
    typewriter
      .type('Hola!')
      .wait(600)
      .delete()
      .wait(100)
      .type('This is Miguel,')
      .nextLine()
      .nextLine()
      .wait(400)
      .type('Él quiere trabajar!', 3) // Type this text twice as fast
      .wait(900)
      .delete(19) // Delete the second line
      .type('Please, take a look... ')
      .wait(400)
      .setEmoticon('(„• ᴗ •„)')
      .wait(600)
      .setEmoticon('(„• ᴗ ᵔ„)')
      .wait(600)
      .setEmoticon('(„• ᴗ •„)')
      .wait(700)
      .delete(10) // Delete the emoticon
      .start();

    // Listen for the typewriter completion event
    typewriterElement.addEventListener('typewriterComplete', () => {
      // Show quotes and subtitle when typewriter animation completes
      const quoteFlipperElem = document.getElementById('quote-flipper');
      const roleSubtitleElem = document.querySelector('.role-subtitle');
      
      quoteFlipperElem.classList.add('visible');
      roleSubtitleElem.classList.add('visible');
      
      // This function will now be called from the main index.html script
      // where quotes are preloaded - no need to fetch quotes here
    });
  } else {
    console.error('Typewriter element not found.');
  }
});
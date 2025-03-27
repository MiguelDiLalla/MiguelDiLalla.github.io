class Typewriter {
  constructor(element, texts, options = {}) {
    this.element = element;
    this.texts = texts;
    this.speed = options.speed || 100;
    this.delay = options.delay || 1000;
    this.index = 0;
    this.char = 0;
    this.deleting = false;
  }

  type() {
    const currentText = this.texts[this.index];

    if (!this.deleting) {
      this.element.textContent = currentText.substring(0, this.char + 1);
      this.char++;

      if (this.char === currentText.length) {
        if (this.index === 0) {
          setTimeout(() => {
            this.deleting = true;
            this.type();
          }, this.delay);
          return;
        }
        return; // stop on final message
      }
    } else {
      this.element.textContent = currentText.substring(0, this.char - 1);
      this.char--;
      if (this.char === 0) {
        this.deleting = false;
        this.index++;
      }
    }

    setTimeout(() => this.type(), this.deleting ? this.speed / 2 : this.speed);
  }

  start() {
    this.type();
  }
}
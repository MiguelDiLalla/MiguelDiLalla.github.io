document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a');

  function onScroll() {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (section.getAttribute('id') === link.getAttribute('href').substring(1)) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll);

  // Intersection Observer for Contact Section Animation
  const contactSection = document.getElementById('contact');
  const typingTextElements = document.querySelectorAll('.typing-text');

  if (contactSection) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        typingTextElements.forEach(el => el.classList.add('animate-main'));
        observer.disconnect();
      }
    }, {
      threshold: 0.25 // Trigger when 25% of the section is visible
    });

    observer.observe(contactSection);
  }
});
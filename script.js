// Navigation scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Scroll reveal
const revealElements = document.querySelectorAll(
  '.timeline-item, .project-card, .skill-group, .highlight-card, .about-text, .about-highlights'
);
revealElements.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
revealElements.forEach(el => observer.observe(el));

// Animate language bars on scroll
const langObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.lang-fill').forEach(bar => {
          const width = bar.style.width;
          bar.style.width = '0';
          requestAnimationFrame(() => {
            bar.style.width = width;
          });
        });
        langObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
const langSection = document.querySelector('.skill-languages');
if (langSection) langObserver.observe(langSection);

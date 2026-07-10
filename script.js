let currentSlide = 0;
const totalSlides = 3;
let autoSlide;

const slideElements = Array.from(document.querySelectorAll('.slide'));
const dotElements = Array.from(document.querySelectorAll('.dot'));
const navLinks = document.getElementById('navLinks');
const hamburger = document.getElementById('hamburger');
const scrollTopButton = document.getElementById('scrollTop');
const navbar = document.getElementById('navbar');
const tabButtons = Array.from(document.querySelectorAll('.tab-btn'));
const tabPanels = Array.from(document.querySelectorAll('.tab-panel'));

function goToSlide(index) {
  slideElements[currentSlide].classList.remove('active');
  dotElements[currentSlide].classList.remove('active');

  currentSlide = (index + totalSlides) % totalSlides;

  slideElements[currentSlide].classList.add('active');
  dotElements[currentSlide].classList.add('active');

  resetAuto();
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function prevSlide() {
  goToSlide(currentSlide - 1);
}

function resetAuto() {
  clearInterval(autoSlide);
  autoSlide = setInterval(nextSlide, 5500);
}

function toggleMenu() {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
  hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
}

function closeMenu() {
  navLinks.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Open menu');
}

function openTab(tabId, activeButton) {
  tabButtons.forEach((button) => button.classList.remove('active'));
  tabPanels.forEach((panel) => panel.classList.remove('active'));

  activeButton.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

function handleSubmit(button) {
  button.textContent = "✓ Message Sent! We'll contact you soon.";
  button.style.background = 'var(--green)';
  button.style.color = 'white';

  setTimeout(() => {
    button.textContent = '✦ Send Message & Get Free Consultation';
    button.style.background = '';
    button.style.color = '';
  }, 4000);
}

document.addEventListener('DOMContentLoaded', () => {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const element = entry.target.querySelector('.stat-num');
      if (element && element.dataset.target) {
        const target = Number(element.dataset.target);
        let current = 0;
        const increment = Math.max(1, Math.ceil(target / 50));
        const timer = setInterval(() => {
          current = Math.min(current + increment, target);
          element.textContent = current + '+';
          if (current >= target) {
            clearInterval(timer);
          }
        }, 30);
      }

      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-item').forEach((element) => counterObserver.observe(element));

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.querySelectorAll('.dot').forEach((dot, index) => {
    dot.addEventListener('click', () => goToSlide(index));
  });

  document.querySelectorAll('.arrow-btn').forEach((button, index) => {
    button.addEventListener('click', () => {
      if (index === 0) {
        prevSlide();
        return;
      }
      nextSlide();
    });
  });

  hamburger.addEventListener('click', toggleMenu);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      closeMenu();
    }
  });

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => openTab(button.dataset.tab, button));
  });

  document.getElementById('submitMessage').addEventListener('click', () => {
    handleSubmit(document.getElementById('submitMessage'));
  });

  scrollTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', () => {
    scrollTopButton.classList.toggle('visible', window.scrollY > 400);
    navbar.style.boxShadow = window.scrollY > 50 ? '0 4px 30px rgba(0,0,0,0.12)' : '0 2px 20px rgba(0,0,0,0.08)';
  });

  resetAuto();
});

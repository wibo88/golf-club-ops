document.addEventListener('DOMContentLoaded', () => {
  // --- Theme Toggle ---
  const toggleButton = document.getElementById('theme-toggle');
  const body = document.body;
  
  // Icon HTML for Font Awesome
  const sunIcon = '<i class="fa-regular fa-sun"></i>';
  const moonIcon = '<i class="fa-regular fa-moon"></i>';
  
  // Check for saved user preference, if any, on load of the website
  const currentTheme = localStorage.getItem('theme');
  
  if (currentTheme) {
    body.classList.add(currentTheme);
  }
  
  // Set initial icon based on current state
  if (body.classList.contains('light-mode')) {
    toggleButton.innerHTML = moonIcon;
    toggleButton.setAttribute('aria-label', 'Switch to dark mode');
  } else {
    toggleButton.innerHTML = sunIcon;
    toggleButton.setAttribute('aria-label', 'Switch to light mode');
  }

  toggleButton.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const isLightMode = body.classList.contains('light-mode');
    
    if (isLightMode) {
      localStorage.setItem('theme', 'light-mode');
      toggleButton.innerHTML = moonIcon;
      toggleButton.setAttribute('aria-label', 'Switch to dark mode');
    } else {
      localStorage.removeItem('theme');
      toggleButton.innerHTML = sunIcon;
      toggleButton.setAttribute('aria-label', 'Switch to light mode');
    }
  });

  // --- Hamburger Menu ---
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('is-active');
      navLinks.classList.toggle('is-open');
    });

    // Close menu when a nav link is clicked
    navLinks.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('is-active');
        navLinks.classList.remove('is-open');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('is-active');
        navLinks.classList.remove('is-open');
      }
    });
  }
});

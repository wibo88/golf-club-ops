document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('theme-toggle');
  const body = document.body;
  
  // Check for saved user preference, if any, on load of the website
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme) {
    body.classList.add(currentTheme);
    if (currentTheme === 'light-mode') {
      toggleButton.textContent = '🌙'; // Switch to moon icon for dark mode option
    }
  }

  toggleButton.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    
    let theme = 'dark-mode';
    if (body.classList.contains('light-mode')) {
      theme = 'light-mode';
      toggleButton.textContent = '🌙';
    } else {
      toggleButton.textContent = '☀️';
    }
    
    localStorage.setItem('theme', theme);
  });
});

document.addEventListener('DOMContentLoaded', () => {
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
  
  // Set initial icon based on current state (default is dark, so if light-mode class is present, we are in light mode)
  // If light mode -> Show Moon (to switch to dark)
  // If dark mode (default) -> Show Sun (to switch to light)
  if (body.classList.contains('light-mode')) {
    toggleButton.innerHTML = moonIcon;
    toggleButton.setAttribute('aria-label', 'Switch to dark mode');
  } else {
    toggleButton.innerHTML = sunIcon;
    toggleButton.setAttribute('aria-label', 'Switch to light mode');
  }

  toggleButton.addEventListener('click', () => {
    // Toggle the class
    body.classList.toggle('light-mode');
    
    // Determine the new theme state
    const isLightMode = body.classList.contains('light-mode');
    
    // Update local storage
    if (isLightMode) {
      localStorage.setItem('theme', 'light-mode');
      toggleButton.innerHTML = moonIcon;
      toggleButton.setAttribute('aria-label', 'Switch to dark mode');
    } else {
      localStorage.removeItem('theme'); // Removing item reverts to default (dark)
      toggleButton.innerHTML = sunIcon;
      toggleButton.setAttribute('aria-label', 'Switch to light mode');
    }
  });
});

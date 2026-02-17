'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light-mode') {
      document.body.classList.add('light-mode');
      setIsLight(true);
    }
  }, []);

  const toggle = () => {
    const next = !isLight;
    setIsLight(next);
    if (next) {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light-mode');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.removeItem('theme');
    }
  };

  return (
    <button
      id="theme-toggle"
      className="nav__toggle"
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      onClick={toggle}
    >
      <i className={isLight ? 'fa-regular fa-moon' : 'fa-regular fa-sun'} />
    </button>
  );
}

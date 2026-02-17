'use client';

import { useEffect, useRef, useState } from 'react';

export default function HamburgerMenu({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        hamburgerRef.current &&
        navRef.current &&
        !hamburgerRef.current.contains(e.target as Node) &&
        !navRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <button
        ref={hamburgerRef}
        className={`nav__hamburger ${isOpen ? 'is-active' : ''}`}
        aria-label="Toggle menu"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <ul
        ref={navRef}
        className={`nav__links ${isOpen ? 'is-open' : ''}`}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('.nav__link')) {
            setIsOpen(false);
          }
        }}
      >
        {children}
      </ul>
    </>
  );
}

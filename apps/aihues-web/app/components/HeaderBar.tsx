'use client';

import { useEffect, useState, type ReactNode } from 'react';

export default function HeaderBar({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-[100] border-b transition-[background-color,backdrop-filter,box-shadow,border-color] duration-300 ${
        scrolled
          ? 'border-border bg-[rgba(250,249,245,0.72)] shadow-[0_6px_28px_rgba(26,26,25,0.07)] backdrop-blur-xl'
          : 'border-transparent bg-[rgba(250,249,245,0.3)] backdrop-blur-md'
      }`}
    >
      {children}
    </header>
  );
}

'use client';

import { useEffect, useState, type MouseEvent } from 'react';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

/* Sticky table-of-contents with scroll-spy, mirroring the resources detail
   sidebar: the heading nearest the top of the viewport is highlighted, clicks
   smooth-scroll and update the hash. */
export default function ArticleToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState('');

  useEffect(() => {
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const top = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActive(top.target.id);
      },
      { rootMargin: '-90px 0px -66% 0px', threshold: 0 }
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  function handleClick(e: MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: y, behavior: 'smooth' });
    history.replaceState(null, '', `#${id}`);
  }

  return (
    <nav aria-label='Table of contents'>
      <p className='mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted'>
        On this page
      </p>
      <ul className='border-l border-border'>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={`-ml-px block border-l-2 py-1 text-[13px] leading-snug transition-colors ${
                item.level >= 3 ? 'pl-6' : 'pl-3'
              } ${
                active === item.id
                  ? 'border-accent font-semibold text-accent'
                  : 'border-transparent text-secondary hover:text-foreground'
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

'use client';

import { useState, type ReactNode } from 'react';
import { Check, Link2 } from 'lucide-react';

interface Platform {
  key: string;
  label: string;
  href: (url: string, title: string) => string;
  icon: ReactNode;
}

const PLATFORMS: Platform[] = [
  {
    key: 'x',
    label: 'Share on X',
    href: (url, title) =>
      `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
    icon: (
      <svg viewBox='0 0 24 24' width='15' height='15' fill='currentColor'>
        <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
      </svg>
    ),
  },
  {
    key: 'reddit',
    label: 'Share on Reddit',
    href: (url, title) =>
      `https://www.reddit.com/submit?url=${url}&title=${title}`,
    icon: (
      <svg viewBox='0 0 24 24' width='17' height='17' fill='currentColor'>
        <path d='M12 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 01-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 01.042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 014.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 01.14-.197.35.35 0 01.238-.042l2.906.617a1.214 1.214 0 011.108-.701zM9.25 12c-.688 0-1.25.561-1.25 1.249 0 .688.562 1.25 1.25 1.25.687 0 1.248-.562 1.248-1.25 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.249 0 .688.561 1.25 1.249 1.25.688 0 1.249-.562 1.249-1.25 0-.688-.561-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 00-.232.095.33.33 0 000 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 00.029-.463.33.33 0 00-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 00-.231-.095z' />
      </svg>
    ),
  },
  {
    key: 'linkedin',
    label: 'Share on LinkedIn',
    href: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    icon: (
      <svg viewBox='0 0 24 24' width='16' height='16' fill='currentColor'>
        <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
      </svg>
    ),
  },
  {
    key: 'facebook',
    label: 'Share on Facebook',
    href: (url) => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    icon: (
      <svg viewBox='0 0 24 24' width='16' height='16' fill='currentColor'>
        <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
      </svg>
    ),
  },
];

/* Social share row — X / LinkedIn / Facebook + copy-link, mirroring the
   resources detail sidebar share. Client-only (reads window.location). */
export default function ShareButtons({
  title,
  className = '',
  variant = 'light',
}: {
  title?: string;
  className?: string;
  variant?: 'light' | 'dark';
}) {
  const [copied, setCopied] = useState(false);

  function openShare(build: Platform['href']) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(title || document.title);
    window.open(
      build(url, text),
      '_blank',
      'noopener,noreferrer,width=600,height=540'
    );
  }

  function copyLink() {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  }

  const btn =
    variant === 'dark'
      ? 'flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition-colors hover:border-white hover:text-white'
      : 'flex h-9 w-9 items-center justify-center rounded-full border border-border bg-bg text-secondary transition-colors hover:border-accent hover:text-accent';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {PLATFORMS.map((p) => (
        <button
          key={p.key}
          type='button'
          aria-label={p.label}
          title={p.label}
          onClick={() => openShare(p.href)}
          className={btn}
        >
          {p.icon}
        </button>
      ))}
      <button
        type='button'
        aria-label='Copy link'
        title={copied ? 'Copied!' : 'Copy link'}
        onClick={copyLink}
        className={btn}
      >
        {copied ? <Check size={16} /> : <Link2 size={16} />}
      </button>
    </div>
  );
}

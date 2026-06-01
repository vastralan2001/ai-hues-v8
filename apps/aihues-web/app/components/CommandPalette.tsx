'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Item {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  type: 'tool' | 'blog' | 'page';
}

const ALL_ITEMS: Item[] = [
  { id: 'home', title: 'Home', href: '/', type: 'page' },
  { id: 'tools', title: 'Tools', href: '/tools', type: 'page' },
  { id: 'games', title: 'Games', href: '/games', type: 'page' },
  { id: 'blog', title: 'Blog', href: '/blog', type: 'page' },
  { id: 'pricing', title: 'Pricing', href: '/pricing', type: 'page' },
  { id: 'showcase', title: 'Showcase', href: '/showcase', type: 'page' },

  {
    id: 'word-count',
    title: 'Word Counter',
    href: '/tools/word-count',
    type: 'tool',
  },
  {
    id: 'base64',
    title: 'Base64 Encoder/Decoder',
    href: '/tools/base64',
    type: 'tool',
  },
  {
    id: 'url-encode',
    title: 'URL Encoder/Decoder',
    href: '/tools/url-encode',
    type: 'tool',
  },
  { id: 'uuid', title: 'UUID Generator', href: '/tools/uuid', type: 'tool' },
  { id: 'jwt', title: 'JWT Decoder', href: '/tools/jwt', type: 'tool' },
  { id: 'json', title: 'JSON Formatter', href: '/tools/json', type: 'tool' },
  { id: 'sha256', title: 'SHA256 Hash', href: '/tools/sha256', type: 'tool' },
  {
    id: 'lorem-ipsum',
    title: 'Lorem Ipsum Generator',
    href: '/tools/lorem-ipsum',
    type: 'tool',
  },
  {
    id: 'timestamp',
    title: 'Timestamp Converter',
    href: '/tools/timestamp',
    type: 'tool',
  },
  {
    id: 'html-entity',
    title: 'HTML Entity Encoder',
    href: '/tools/html-entity',
    type: 'tool',
  },
  {
    id: 'fullwidth',
    title: 'Fullwidth Converter',
    href: '/tools/fullwidth',
    type: 'tool',
  },
  {
    id: 'password-gen',
    title: 'Password Generator',
    href: '/tools/password-gen',
    type: 'tool',
  },
  { id: 'regex', title: 'Regex Tester', href: '/tools/regex', type: 'tool' },
  { id: 'diff', title: 'Text Diff', href: '/tools/diff', type: 'tool' },
  {
    id: 'csv-json',
    title: 'CSV ↔ JSON',
    href: '/tools/csv-json',
    type: 'tool',
  },
  {
    id: 'color-convert',
    title: 'Color Converter',
    href: '/tools/color-convert',
    type: 'tool',
  },
  {
    id: 'title-case',
    title: 'Title Case Converter',
    href: '/tools/title-case',
    type: 'tool',
  },
  {
    id: 'git-commit',
    title: 'Git Commit Message',
    href: '/tools/git-commit',
    type: 'tool',
  },
  {
    id: 'readability',
    title: 'Readability Score',
    href: '/tools/readability',
    type: 'tool',
  },
  {
    id: 'pomodoro',
    title: 'Pomodoro Timer',
    href: '/tools/pomodoro',
    type: 'tool',
  },
  {
    id: 'curl-gen',
    title: 'cURL Generator',
    href: '/tools/curl-gen',
    type: 'tool',
  },
  {
    id: 'http-status',
    title: 'HTTP Status Codes',
    href: '/tools/http-status',
    type: 'tool',
  },
  {
    id: 'unit-convert',
    title: 'Unit Converter',
    href: '/tools/unit-convert',
    type: 'tool',
  },
  {
    id: 'markdown',
    title: 'Markdown Preview',
    href: '/tools/markdown',
    type: 'tool',
  },
  {
    id: 'meta',
    title: 'Meta Tag Generator',
    href: '/tools/meta',
    type: 'tool',
  },
  { id: 'tldr', title: 'TL;DR Generator', href: '/tools/tldr', type: 'tool' },
  {
    id: 'image-to-base64',
    title: 'Image to Base64',
    href: '/tools/image-to-base64',
    type: 'tool',
  },
  {
    id: 'pr-desc',
    title: 'PR Description',
    href: '/tools/pr-desc',
    type: 'tool',
  },
  {
    id: 'code-review',
    title: 'Code Review',
    href: '/tools/code-review',
    type: 'tool',
  },
  {
    id: 'changelog',
    title: 'Changelog Generator',
    href: '/tools/changelog',
    type: 'tool',
  },
  {
    id: 'seo-title',
    title: 'SEO Title Optimizer',
    href: '/tools/seo-title',
    type: 'tool',
  },
  {
    id: 'push',
    title: 'Push Notification Generator',
    href: '/tools/push',
    type: 'tool',
  },
  {
    id: 'base-convert',
    title: 'Base Converter',
    href: '/tools/base-convert',
    type: 'tool',
  },
  {
    id: 'cron-parser',
    title: 'Cron Parser',
    href: '/tools/cron-parser',
    type: 'tool',
  },
  { id: 'faq', title: 'FAQ Generator', href: '/tools/faq', type: 'tool' },
  { id: 'sql', title: 'SQL Formatter', href: '/tools/sql', type: 'tool' },
  {
    id: 'tagline',
    title: 'Tagline Generator',
    href: '/tools/tagline',
    type: 'tool',
  },
  {
    id: 'cold-email',
    title: 'Cold Email Generator',
    href: '/tools/cold-email',
    type: 'tool',
  },
  {
    id: 'newsletter',
    title: 'Newsletter Formatter',
    href: '/tools/newsletter',
    type: 'tool',
  },
  {
    id: 'x-post',
    title: 'X Post Generator',
    href: '/tools/x-post',
    type: 'tool',
  },
  {
    id: 'video-title',
    title: 'Video Title Generator',
    href: '/tools/video-title',
    type: 'tool',
  },
  {
    id: 'yt-script',
    title: 'YouTube Script Generator',
    href: '/tools/yt-script',
    type: 'tool',
  },
  {
    id: 'ad-copy',
    title: 'Ad Copy Generator',
    href: '/tools/ad-copy',
    type: 'tool',
  },
  { id: 'shell', title: 'Shell Explainer', href: '/tools/shell', type: 'tool' },
  {
    id: 'code-explain',
    title: 'Code Explainer',
    href: '/tools/code-explain',
    type: 'tool',
  },
  {
    id: 'humanize',
    title: 'AI Text Humanizer',
    href: '/tools/humanize',
    type: 'tool',
  },
  {
    id: 'ip-lookup',
    title: 'IP Lookup',
    href: '/tools/ip-lookup',
    type: 'tool',
  },
  {
    id: 'docs',
    title: 'Docstring Generator',
    href: '/tools/docs',
    type: 'tool',
  },
  {
    id: 'alt-text',
    title: 'Alt Text Generator',
    href: '/tools/alt-text',
    type: 'tool',
  },
  {
    id: 'blog-outline',
    title: 'Blog Outline Generator',
    href: '/tools/blog-outline',
    type: 'tool',
  },
  {
    id: 'linkedin',
    title: 'LinkedIn Post Generator',
    href: '/tools/linkedin',
    type: 'tool',
  },
  {
    id: 'lp-hero',
    title: 'Landing Page Hero',
    href: '/tools/lp-hero',
    type: 'tool',
  },
  {
    id: 'css-gradient',
    title: 'CSS Gradient Generator',
    href: '/tools/css-gradient',
    type: 'tool',
  },
  {
    id: 'pseudo',
    title: 'Pseudocode Generator',
    href: '/tools/pseudo',
    type: 'tool',
  },
  {
    id: 'diff-pro',
    title: 'Advanced Diff',
    href: '/tools/diff-pro',
    type: 'tool',
  },
  {
    id: 'qrcode',
    title: 'QR Code Generator',
    href: '/tools/qrcode',
    type: 'tool',
  },
  {
    id: 'chi-squared',
    title: 'Chi-Squared Calculator',
    href: '/tools/chi-squared',
    type: 'tool',
  },

  {
    id: 'growth-tools-2026',
    title: '2026 Growth Toolkit',
    subtitle: 'Blog',
    href: '/blog/growth-tools-2026',
    type: 'blog',
  },
  {
    id: 'reddit-marketing',
    title: 'Reddit Marketing Playbook',
    subtitle: 'Blog',
    href: '/blog/reddit-marketing',
    type: 'blog',
  },
  {
    id: 'kol-marketing',
    title: 'KOL Marketing Guide',
    subtitle: 'Blog',
    href: '/blog/kol-marketing',
    type: 'blog',
  },
  {
    id: 'ai-content-strategy',
    title: 'AI Content Strategy',
    subtitle: 'Blog',
    href: '/blog/ai-content-strategy',
    type: 'blog',
  },
  {
    id: 'seo-2026-trends',
    title: '2026 SEO Trends',
    subtitle: 'Blog',
    href: '/blog/seo-2026-trends',
    type: 'blog',
  },
  {
    id: 'twitter-growth',
    title: 'Twitter/X Growth Playbook',
    subtitle: 'Blog',
    href: '/blog/twitter-growth',
    type: 'blog',
  },
  {
    id: 'no-code-mvp',
    title: 'No-Code MVP Guide',
    subtitle: 'Blog',
    href: '/blog/no-code-mvp',
    type: 'blog',
  },
  {
    id: 'ai-productivity-stack',
    title: 'AI Productivity Stack',
    subtitle: 'Blog',
    href: '/blog/ai-productivity-stack',
    type: 'blog',
  },
  {
    id: 'indie-dev-monetization',
    title: 'Indie Dev Monetization',
    subtitle: 'Blog',
    href: '/blog/indie-dev-monetization',
    type: 'blog',
  },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_ITEMS.slice(0, 8);
    return ALL_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setSelectedIndex(0));
    return () => cancelAnimationFrame(id);
  }, [query]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
    if (e.key === 'Escape') {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const onSelect = useCallback(
    (item: Item) => {
      setOpen(false);
      setQuery('');
      router.push(item.href);
    },
    [router]
  );

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        onSelect(filtered[selectedIndex]);
      }
    }
  };

  if (!open) return null;

  return (
    <div
      className='fixed inset-0 z-[300] flex items-start justify-center bg-black/40 pt-[15vh] backdrop-blur-sm'
      onClick={() => setOpen(false)}
    >
      <div
        className='w-full max-w-[560px] overflow-hidden rounded-[16px] border border-[#e8e2d9] bg-white shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className='flex items-center gap-3 border-b border-[#e8e2d9] px-4 py-3'>
          <svg
            className='h-5 w-5 text-[#a8a29e]'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            viewBox='0 0 24 24'
          >
            <circle cx='11' cy='11' r='8' />
            <path d='m21 21-4.35-4.35' />
          </svg>
          <input
            ref={inputRef}
            className='flex-1 bg-transparent text-[15px] text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none'
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder='Search tools, blog posts, pages...'
            type='text'
            value={query}
          />
          <kbd className='hidden rounded-[6px] border border-[#e8e2d9] bg-[#f5f0e8] px-2 py-0.5 text-[11px] font-medium text-[#78716c] sm:block'>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className='max-h-[400px] overflow-y-auto py-2'>
          {filtered.length > 0 ? (
            filtered.map((item, index) => (
              <button
                key={item.id}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  index === selectedIndex
                    ? 'bg-[#b45309]/8'
                    : 'hover:bg-[#f5f0e8]'
                }`}
                onClick={() => onSelect(item)}
                onMouseEnter={() => setSelectedIndex(index)}
                type='button'
              >
                <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[#f5f0e8] text-sm'>
                  {item.type === 'tool'
                    ? '🔧'
                    : item.type === 'blog'
                      ? '📝'
                      : '📄'}
                </span>
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-medium text-[#1c1917]'>
                    {item.title}
                  </p>
                  {item.subtitle && (
                    <p className='text-xs text-[#a8a29e]'>{item.subtitle}</p>
                  )}
                </div>
                {index === selectedIndex && (
                  <kbd className='rounded-[4px] bg-[#f5f0e8] px-1.5 py-0.5 text-[10px] text-[#78716c]'>
                    ↵
                  </kbd>
                )}
              </button>
            ))
          ) : (
            <p className='px-4 py-8 text-center text-sm text-[#a8a29e]'>
              No results found for &quot;{query}&quot;
            </p>
          )}
        </div>

        {/* Footer */}
        <div className='flex items-center gap-4 border-t border-[#e8e2d9] px-4 py-2 text-[11px] text-[#a8a29e]'>
          <span className='flex items-center gap-1'>
            <kbd className='rounded-[4px] border border-[#e8e2d9] bg-[#f5f0e8] px-1 py-0.5'>
              ↑↓
            </kbd>
            Navigate
          </span>
          <span className='flex items-center gap-1'>
            <kbd className='rounded-[4px] border border-[#e8e2d9] bg-[#f5f0e8] px-1 py-0.5'>
              ↵
            </kbd>
            Select
          </span>
        </div>
      </div>
    </div>
  );
}

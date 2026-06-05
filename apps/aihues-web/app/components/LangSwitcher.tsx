'use client';

import { useState, useRef, useEffect } from 'react';

import { useI18n } from '@/lib/i18n';

export function LangSwitcher() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    { code: 'en' as const, label: 'English' },
    { code: 'zh' as const, label: '中文' },
  ];

  return (
    <div ref={ref} className='relative'>
      <button
        className='flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-secondary transition-colors hover:text-foreground'
        onClick={() => setOpen(!open)}
        type='button'
      >
        <svg
          fill='none'
          height='14'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          viewBox='0 0 24 24'
          width='14'
        >
          <circle cx='12' cy='12' r='10' />
          <line x1='2' x2='22' y1='12' y2='12' />
          <path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' />
        </svg>
        <span>{locale === 'en' ? 'English' : '中文'}</span>
      </button>
      {open && (
        <div className='absolute right-0 top-full mt-2 min-w-[140px] overflow-hidden rounded-lg border border-border bg-white py-1 shadow-[0_4px_12px_rgba(0,0,0,0.08)]'>
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`w-full px-4 py-2 text-left text-[13px] transition-colors hover:bg-surface ${locale === lang.code ? 'font-semibold text-foreground' : 'text-secondary'}`}
              onClick={() => {
                setLocale(lang.code);
                setOpen(false);
              }}
              type='button'
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

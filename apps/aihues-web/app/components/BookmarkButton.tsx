'use client';

import { useCallback, useState } from 'react';

export function BookmarkButton() {
  const [showTip, setShowTip] = useState(false);

  const handleClick = useCallback(() => {
    try {
      const ext = (window as unknown as Record<string, unknown>).external;
      if (ext && typeof ext === 'object' && 'AddFavorite' in ext) {
        (
          ext as { AddFavorite: (url: string, title: string) => void }
        ).AddFavorite(window.location.href, document.title);
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <div
      className='relative'
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
      onFocus={() => setShowTip(true)}
      onBlur={() => setShowTip(false)}
    >
      <button
        aria-label='Bookmark this site'
        className='flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-secondary transition-colors hover:bg-surface hover:text-foreground'
        onClick={handleClick}
        type='button'
      >
        <svg
          fill='none'
          height='16'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
          viewBox='0 0 24 24'
          width='16'
        >
          <path d='m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z' />
        </svg>
        <span className='hidden md:inline'>Bookmark</span>
      </button>

      {showTip && (
        <div className='absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-border bg-white p-3 shadow-lg'>
          <p className='mb-1 text-[13px] font-semibold text-foreground'>
            Add AIHues to your bookmarks
          </p>
          <p className='text-[12px] text-muted'>
            Press{' '}
            <kbd className='rounded bg-surface px-1.5 py-0.5 text-[11px] font-semibold text-foreground'>
              {navigator.platform?.includes('Mac') ? 'Cmd' : 'Ctrl'}
            </kbd>{' '}
            +{' '}
            <kbd className='rounded bg-surface px-1.5 py-0.5 text-[11px] font-semibold text-foreground'>
              D
            </kbd>{' '}
            to save this page.
          </p>
        </div>
      )}
    </div>
  );
}

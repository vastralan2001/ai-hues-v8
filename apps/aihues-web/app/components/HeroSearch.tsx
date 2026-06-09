'use client';

import { useState } from 'react';

interface HeroSearchProps {
  searchPlaceholder: string;
  askAILabel: string;
}

export default function HeroSearch({
  searchPlaceholder,
  askAILabel,
}: HeroSearchProps) {
  const [query, setQuery] = useState('');

  return (
    <form action='/tools' className='mx-auto w-full max-w-[580px]' method='get'>
      <div className='flex items-center rounded-[16px] border border-border bg-surface px-2 py-2 transition-colors hover:border-border-strong'>
        <input
          className='min-w-0 flex-1 border-0 bg-transparent px-4 text-[15px] text-foreground outline-none placeholder:text-muted'
          style={{ fontFamily: 'var(--font-sans)' }}
          name='q'
          placeholder={searchPlaceholder}
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className='rounded-[12px] bg-accent px-6 py-2.5 text-[14px] font-medium text-white transition-all hover:bg-accent-light'
          type='submit'
        >
          {askAILabel}
        </button>
      </div>
    </form>
  );
}

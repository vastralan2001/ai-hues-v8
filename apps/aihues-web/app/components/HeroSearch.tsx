'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

import { useAgentChat } from '@/components/AgentChat';

interface HeroSearchProps {
  searchPlaceholder: string;
  askAILabel: string;
}

export default function HeroSearch({
  searchPlaceholder,
  askAILabel,
}: HeroSearchProps) {
  const [query, setQuery] = useState('');
  const { openWithMessage } = useAgentChat();

  return (
    <form action='/tools' className='mx-auto w-full max-w-[620px]' method='get'>
      <div className='group flex items-center gap-2 rounded-[20px] border border-border bg-white px-2 py-2 shadow-[0_2px_24px_rgba(26,26,25,0.06)] transition-all duration-300 hover:border-border-strong hover:shadow-[0_8px_32px_rgba(26,26,25,0.1)] focus-within:border-accent/40 focus-within:shadow-[0_8px_32px_rgba(217,119,87,0.14)]'>
        <span className='pl-3 text-muted transition-colors group-focus-within:text-accent'>
          <Search size={18} strokeWidth={2} />
        </span>
        <input
          className='min-w-0 flex-1 border-0 bg-transparent px-2 text-[16px] text-foreground outline-none placeholder:text-muted'
          name='q'
          placeholder={searchPlaceholder}
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className='rounded-[14px] bg-accent px-6 py-2.5 text-[14px] font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-accent-light hover:shadow-md active:translate-y-0'
          type='button'
          onClick={() => openWithMessage(query)}
        >
          {askAILabel}
        </button>
      </div>
    </form>
  );
}

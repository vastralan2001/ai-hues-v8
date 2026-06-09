'use client';

import { useState } from 'react';
import { useAgentChat } from './AgentChatContext';

interface HeroSearchProps {
  locale: string;
  searchPlaceholder: string;
  askAILabel: string;
}

export default function HeroSearch({
  locale,
  searchPlaceholder,
  askAILabel,
}: HeroSearchProps) {
  const [query, setQuery] = useState('');
  const { openChat } = useAgentChat();
  const isZh = locale === 'zh';

  const handleAskAI = (e: React.MouseEvent) => {
    e.preventDefault();
    const text = query.trim();
    if (!text) {
      // Open chat without message if input is empty
      openChat();
      return;
    }
    openChat(text);
    setQuery('');
  };

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
          type='button'
          onClick={handleAskAI}
          title={isZh ? '向 HuesBot 提问' : 'Ask HuesBot'}
        >
          {askAILabel}
        </button>
      </div>
    </form>
  );
}

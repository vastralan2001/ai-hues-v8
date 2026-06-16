'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AgentHeroInput() {
  const [prompt, setPrompt] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    router.push(`/agent?prompt=${encodeURIComponent(prompt.trim())}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='mx-auto flex max-w-[640px] flex-col gap-3 sm:flex-row'
    >
      <input
        type='text'
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder='Launch my remote team SaaS on Product Hunt...'
        className='flex-1 rounded-[14px] border border-border bg-surface px-5 py-3.5 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent'
      />
      <button
        type='submit'
        disabled={!prompt.trim()}
        className='rounded-[14px] bg-accent px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-accent-light disabled:opacity-50'
      >
        Ask Agent
      </button>
    </form>
  );
}

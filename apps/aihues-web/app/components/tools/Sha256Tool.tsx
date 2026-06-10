'use client';

import { useState } from 'react';
import { event, GA_EVENTS } from '@/lib/gtag';

import { t, type Locale } from '@/lib/dict';

interface Sha256ToolProps {
  locale: Locale;
}

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function Sha256Tool({ locale }: Sha256ToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleHash = async () => {
    try {
      setError('');
      const hash = await sha256(input);
      setOutput(hash);
    } catch {
      setError('Failed to compute hash');
    }
  };

  const handleCopy = async () => {
    try {
      await event(GA_EVENTS.toolCopy, { tool: 'sha256' });
      navigator.clipboard.writeText(output);
    } catch {
      // ignore
    }
  };

  return (
    <div className='mx-auto max-w-[900px] px-6 py-12'>
      <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
        {t(locale, 'tool.sha256.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.sha256.desc')}
      </p>

      <textarea
        className='h-[200px] w-full resize-none rounded-[14px] border border-border bg-surface p-5 text-[15px] leading-relaxed text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
        onChange={(e) => setInput(e.target.value)}
        placeholder={t(locale, 'tool.sha256.placeholder')}
        value={input}
      />

      <div className='mt-4 flex gap-3'>
        <button
          className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
          onClick={handleHash}
          type='button'
        >
          {t(locale, 'tool.sha256.hash')}
        </button>
      </div>

      {error && (
        <p className='mt-3 rounded-[10px] border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400'>
          {error}
        </p>
      )}

      {output && (
        <div className='mt-5'>
          <div className='mb-2 flex items-center justify-between'>
            <span className='text-sm font-semibold text-foreground'>
              {t(locale, 'tool.sha256.result')}
            </span>
            <button
              className='rounded-[8px] border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
              onClick={handleCopy}
              type='button'
            >
              {t(locale, 'tool.wordCount.copy')}
            </button>
          </div>
          <div className='min-h-[80px] w-full break-all rounded-[14px] border border-border bg-surface p-5 font-mono text-sm text-foreground'>
            {output}
          </div>
        </div>
      )}
    </div>
  );
}

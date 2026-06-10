'use client';

import { useState } from 'react';
import { event, GA_EVENTS } from '@/lib/gtag';

import { t, type Locale } from '@/lib/dict';

interface UrlEncodeToolProps {
  locale: Locale;
}

export default function UrlEncodeTool({ locale }: UrlEncodeToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleEncode = () => {
    try {
      setError('');
      setOutput(encodeURIComponent(input));
    } catch {
      setError('Invalid input for encoding');
    }
  };

  const handleDecode = () => {
    try {
      setError('');
      setOutput(decodeURIComponent(input));
    } catch {
      setError('Invalid URL-encoded input');
    }
  };

  const handleCopy = async () => {
    try {
      await event(GA_EVENTS.toolCopy, { tool: 'url-encode' });
      navigator.clipboard.writeText(output);
    } catch {
      // ignore
    }
  };

  return (
    <div className='mx-auto max-w-[900px] px-6 py-12'>
      <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
        {t(locale, 'tool.urlEncode.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.urlEncode.desc')}
      </p>

      <textarea
        className='h-[200px] w-full resize-none rounded-[14px] border border-border bg-surface p-5 text-[15px] leading-relaxed text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
        onChange={(e) => setInput(e.target.value)}
        placeholder={t(locale, 'tool.urlEncode.placeholder')}
        value={input}
      />

      <div className='mt-4 flex flex-wrap items-center gap-3'>
        <button
          className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
          onClick={handleEncode}
          type='button'
        >
          {t(locale, 'tool.urlEncode.encode')}
        </button>
        <button
          className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
          onClick={handleDecode}
          type='button'
        >
          {t(locale, 'tool.urlEncode.decode')}
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
              {t(locale, 'tool.urlEncode.result')}
            </span>
            <button
              className='rounded-[8px] border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
              onClick={handleCopy}
              type='button'
            >
              {t(locale, 'tool.wordCount.copy')}
            </button>
          </div>
          <div className='min-h-[120px] w-full rounded-[14px] border border-border bg-surface p-5 text-[15px] leading-relaxed text-foreground'>
            <pre className='whitespace-pre-wrap break-all font-mono text-sm'>
              {output}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

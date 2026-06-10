'use client';

import { useState } from 'react';
import { event, GA_EVENTS } from '@/lib/gtag';

import { t, type Locale } from '@/lib/dict';

interface HtmlEntityToolProps {
  locale: Locale;
}

function encodeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function decodeHtml(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

export default function HtmlEntityTool({ locale }: HtmlEntityToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleEncode = () => {
    setOutput(encodeHtml(input));
  };

  const handleDecode = () => {
    setOutput(decodeHtml(input));
  };

  const handleCopy = async () => {
    try {
      await event(GA_EVENTS.toolCopy, { tool: 'html-entity' });
      navigator.clipboard.writeText(output);
    } catch {
      // ignore
    }
  };

  return (
    <div className='mx-auto max-w-[900px] px-6 py-12'>
      <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
        {t(locale, 'tool.htmlEntity.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.htmlEntity.desc')}
      </p>

      <textarea
        className='h-[200px] w-full resize-none rounded-[14px] border border-border bg-surface p-5 text-[15px] leading-relaxed text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
        onChange={(e) => setInput(e.target.value)}
        placeholder={t(locale, 'tool.htmlEntity.placeholder')}
        value={input}
      />

      <div className='mt-4 flex gap-3'>
        <button
          className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
          onClick={handleEncode}
          type='button'
        >
          {t(locale, 'tool.htmlEntity.encode')}
        </button>
        <button
          className='rounded-[10px] border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
          onClick={handleDecode}
          type='button'
        >
          {t(locale, 'tool.htmlEntity.decode')}
        </button>
      </div>

      {output && (
        <div className='mt-5'>
          <div className='mb-2 flex items-center justify-between'>
            <span className='text-sm font-semibold text-foreground'>
              {t(locale, 'tool.htmlEntity.result')}
            </span>
            <button
              className='rounded-[8px] border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
              onClick={handleCopy}
              type='button'
            >
              {t(locale, 'tool.wordCount.copy')}
            </button>
          </div>
          <div className='min-h-[120px] w-full rounded-[14px] border border-border bg-surface p-5 font-mono text-sm text-foreground'>
            {output}
          </div>
        </div>
      )}
    </div>
  );
}

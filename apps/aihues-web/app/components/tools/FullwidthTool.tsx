'use client';

import { useState } from 'react';

import { t, type Locale } from '@/lib/dict';

interface FullwidthToolProps {
  locale: Locale;
}

function toFullwidth(text: string): string {
  return text
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code === 0x20) return '\u3000'; // space → fullwidth space
      if (code >= 0x21 && code <= 0x7e) {
        return String.fromCharCode(code + 0xfee0);
      }
      return char;
    })
    .join('');
}

function toHalfwidth(text: string): string {
  return text
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code === 0x3000) return ' '; // fullwidth space → space
      if (code >= 0xff01 && code <= 0xff5e) {
        return String.fromCharCode(code - 0xfee0);
      }
      return char;
    })
    .join('');
}

export default function FullwidthTool({ locale }: FullwidthToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleToFull = () => {
    setOutput(toFullwidth(input));
  };

  const handleToHalf = () => {
    setOutput(toHalfwidth(input));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      // ignore
    }
  };

  return (
    <div className='mx-auto max-w-4xl px-6 py-12'>
      <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
        {t(locale, 'tool.fullwidth.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.fullwidth.desc')}
      </p>

      <textarea
        className='h-[200px] w-full resize-none rounded-2xl border border-border bg-surface p-5 text-[15px] leading-relaxed text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
        onChange={(e) => setInput(e.target.value)}
        placeholder={t(locale, 'tool.fullwidth.placeholder')}
        value={input}
      />

      <div className='mt-4 flex gap-3'>
        <button
          className='rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-light'
          onClick={handleToFull}
          type='button'
        >
          {t(locale, 'tool.fullwidth.toFull')}
        </button>
        <button
          className='rounded-lg border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
          onClick={handleToHalf}
          type='button'
        >
          {t(locale, 'tool.fullwidth.toHalf')}
        </button>
      </div>

      {output && (
        <div className='mt-5'>
          <div className='mb-2 flex items-center justify-between'>
            <span className='text-sm font-semibold text-foreground'>
              {t(locale, 'tool.fullwidth.result')}
            </span>
            <button
              className='rounded-[8px] border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
              onClick={handleCopy}
              type='button'
            >
              {t(locale, 'tool.wordCount.copy')}
            </button>
          </div>
          <div className='min-h-[120px] w-full rounded-2xl border border-border bg-surface p-5 text-[15px] leading-relaxed text-foreground'>
            {output}
          </div>
        </div>
      )}
    </div>
  );
}

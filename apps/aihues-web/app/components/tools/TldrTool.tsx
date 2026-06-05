'use client';

import { useState } from 'react';

import { aiGenerate } from '@/lib/ai-generate-client';
import { t, type Locale } from '@/lib/dict';

interface TldrToolProps {
  locale: Locale;
}

export default function TldrTool({ locale }: TldrToolProps) {
  const [text, setText] = useState('');
  const [sentences, setSentences] = useState(3);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSummarize = async () => {
    setLoading(true);
    setError('');
    try {
      const generated = await aiGenerate({
        tool: 'tldr',
        locale,
        inputs: { text },
      });
      setSummary(generated);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
    } catch {
      // ignore
    }
  };

  const originalLength = text.length;
  const summaryLength = summary.length;
  const compression =
    originalLength > 0
      ? Math.round((1 - summaryLength / originalLength) * 100)
      : 0;

  return (
    <div className='mx-auto max-w-[900px] px-6 py-12'>
      <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
        {t(locale, 'tool.tldr.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.tldr.desc')}
      </p>

      <textarea
        className='h-[200px] w-full resize-none rounded-[14px] border border-border bg-surface p-5 text-[15px] leading-relaxed text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
        onChange={(e) => setText(e.target.value)}
        placeholder={t(locale, 'tool.tldr.placeholder')}
        value={text}
      />

      <div className='mt-4 flex flex-wrap items-center gap-4'>
        <label className='flex items-center gap-3 text-sm text-foreground'>
          <span>{t(locale, 'tool.tldr.sentences')}</span>
          <input
            className='h-10 w-20 rounded-[10px] border border-border bg-surface px-3 text-center text-sm focus:border-accent focus:outline-none'
            max={10}
            min={1}
            onChange={(e) => setSentences(Number(e.target.value))}
            type='number'
            value={sentences}
          />
        </label>
        <button
          className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light disabled:opacity-50'
          disabled={loading}
          onClick={handleSummarize}
          type='button'
        >
          {loading ? '...' : t(locale, 'tool.tldr.summarize')}
        </button>
      </div>

      {error && <p className='mt-4 text-sm text-red-500'>{error}</p>}

      {summary && (
        <div className='mt-6'>
          <div className='mb-2 flex items-center justify-between'>
            <span className='text-sm font-semibold text-foreground'>
              {t(locale, 'tool.tldr.summary')}
            </span>
            <button
              className='rounded-[8px] border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
              onClick={handleCopy}
              type='button'
            >
              {t(locale, 'tool.wordCount.copy')}
            </button>
          </div>
          <div className='min-h-[80px] rounded-[14px] border border-border bg-surface p-5 text-[15px] leading-relaxed text-foreground'>
            {summary}
          </div>

          <div className='mt-3 flex gap-4 text-xs text-secondary'>
            <span>
              {t(locale, 'tool.tldr.originalLength')}:{' '}
              {originalLength.toLocaleString()} chars
            </span>
            <span>
              {t(locale, 'tool.tldr.summaryLength')}:{' '}
              {summaryLength.toLocaleString()} chars
            </span>
            <span>
              {t(locale, 'tool.tldr.compression')}: {compression}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

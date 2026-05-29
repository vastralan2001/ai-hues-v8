'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface TldrToolProps {
  locale: Locale;
}

function extractSentences(text: string, count: number): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  return sentences
    .slice(0, count)
    .map((s) => s.trim())
    .join(' ');
}

export default function TldrTool({ locale }: TldrToolProps) {
  const [text, setText] = useState('');
  const [sentences, setSentences] = useState(3);
  const [summary, setSummary] = useState('');

  const handleSummarize = () => {
    setSummary(extractSentences(text, sentences));
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
    originalLength > 0 ? Math.round((1 - summaryLength / originalLength) * 100) : 0;

  return (
    <PageShell variant='default' locale={locale}>
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
            className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
            onClick={handleSummarize}
            type='button'
          >
            {t(locale, 'tool.tldr.summarize')}
          </button>
        </div>

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
                {t(locale, 'tool.tldr.originalLength')}: {originalLength.toLocaleString()} chars
              </span>
              <span>
                {t(locale, 'tool.tldr.summaryLength')}: {summaryLength.toLocaleString()} chars
              </span>
              <span>
                {t(locale, 'tool.tldr.compression')}: {compression}%
              </span>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}

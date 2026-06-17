'use client';

import { useMemo, useState } from 'react';

import { countWords } from '@/lib/word-count';
import { t, type Locale } from '@/lib/dict';

interface WordCountToolProps {
  locale: Locale;
}

export default function WordCountTool({ locale }: WordCountToolProps) {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = countWords(text);
    return {
      chars: text.length,
      charsNoSpace: text.replace(/\s/g, '').length,
      words,
      lines: text === '' ? 0 : text.split(/\r\n|\r|\n/).length,
      paragraphs:
        trimmed === ''
          ? 0
          : trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length,
      readingTime: Math.max(1, Math.ceil(words / 200)),
    };
  }, [text]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  };

  return (
    <div className='mx-auto max-w-4xl px-6 py-12'>
      <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
        {t(locale, 'tool.wordCount.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.wordCount.desc')}
      </p>

      <textarea
        className='h-[320px] w-full resize-none rounded-2xl border border-border bg-surface p-5 text-[15px] leading-relaxed text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
        data-testid='word-count-input'
        onChange={(e) => setText(e.target.value)}
        placeholder={t(locale, 'tool.wordCount.placeholder')}
        value={text}
      />

      <div
        className='mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6'
        data-testid='word-count-stats'
      >
        <StatCard
          label={t(locale, 'tool.wordCount.chars')}
          value={stats.chars}
        />
        <StatCard
          label={t(locale, 'tool.wordCount.charsNoSpace')}
          value={stats.charsNoSpace}
        />
        <StatCard
          label={t(locale, 'tool.wordCount.words')}
          value={stats.words}
        />
        <StatCard
          label={t(locale, 'tool.wordCount.lines')}
          value={stats.lines}
        />
        <StatCard
          label={t(locale, 'tool.wordCount.paragraphs')}
          value={stats.paragraphs}
        />
        <StatCard
          label={t(locale, 'tool.wordCount.readTime')}
          value={`${stats.readingTime} min`}
        />
      </div>

      <div className='mt-5 flex gap-3'>
        <button
          className='rounded-lg border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
          onClick={() => setText('')}
          type='button'
        >
          {t(locale, 'tool.wordCount.clear')}
        </button>
        <button
          className='rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-light'
          onClick={handleCopy}
          type='button'
        >
          {t(locale, 'tool.wordCount.copy')}
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className='rounded-2xl border border-border bg-surface p-4 text-center transition-colors'>
      <div className='text-[22px] font-extrabold text-accent'>{value}</div>
      <div className='mt-1 text-[11px] font-semibold uppercase tracking-wider text-secondary'>
        {label}
      </div>
    </div>
  );
}

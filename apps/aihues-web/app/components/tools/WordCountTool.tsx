'use client';

import { useMemo, useState, type ReactNode } from 'react';

import { countWords } from '@/lib/word-count';
import { t, type Locale } from '@/lib/dict';

import { CopyButton, Panel, ToolHeader, TOOL_WRAP } from './_kit';

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

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={t(locale, 'cat.utility')}
        title={t(locale, 'tool.wordCount.title')}
        desc={t(locale, 'tool.wordCount.desc')}
      />

      <ToolGridLike>
        <Panel
          label={locale === 'zh' ? '文本' : 'Text'}
          action={
            <div className='flex items-center gap-2'>
              <button
                type='button'
                onClick={() => setText('')}
                className='h-8 rounded-[8px] border border-border bg-bg px-3 text-[12px] font-semibold text-secondary transition-colors hover:border-accent hover:text-accent'
              >
                {t(locale, 'tool.wordCount.clear')}
              </button>
              <CopyButton
                text={text}
                label={t(locale, 'tool.wordCount.copy')}
              />
            </div>
          }
        >
          <textarea
            className='min-h-[360px] w-full flex-1 resize-y border-0 bg-transparent p-4 text-[15px] leading-relaxed text-foreground outline-none placeholder:text-muted'
            data-testid='word-count-input'
            onChange={(e) => setText(e.target.value)}
            placeholder={t(locale, 'tool.wordCount.placeholder')}
            value={text}
          />
        </Panel>

        <div className='grid grid-cols-2 gap-3' data-testid='word-count-stats'>
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
      </ToolGridLike>
    </div>
  );
}

function ToolGridLike({ children }: { children: ReactNode }) {
  return (
    <div className='grid grid-cols-1 items-start gap-5 lg:grid-cols-[1.4fr_1fr]'>
      {children}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className='card-lift rounded-[14px] border border-border bg-surface p-5 text-center'>
      <div className='text-[28px] font-extrabold leading-none text-accent'>
        {value}
      </div>
      <div className='mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-secondary'>
        {label}
      </div>
    </div>
  );
}

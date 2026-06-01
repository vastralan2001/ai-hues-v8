'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface VideoTitleToolProps {
  locale: Locale;
}

const TEMPLATES: Record<string, string[]> = {
  howTo: [
    'How to {topic} (Step-by-Step Guide)',
    'How I Learned to {topic} in 30 Days',
    'How to {topic} Like a Pro',
    'The Easiest Way to {topic}',
    'How to {topic} — Beginner to Advanced',
  ],
  list: [
    '5 Things I Wish I Knew Before {topic}',
    '10 {topic} Tips That Actually Work',
    '7 Mistakes Everyone Makes with {topic}',
    'Top 3 {topic} Tools You Need',
    "15 {topic} Hacks You Can't Miss",
  ],
  question: [
    'Is {topic} Worth It in 2026?',
    'What No One Tells You About {topic}',
    'Why Is {topic} So Hard?',
    "Can You Really {topic}? Here's the Truth",
    'Does {topic} Actually Work?',
  ],
  bold: [
    '{topic} Changed Everything for Me',
    "I Tried {topic} for 30 Days — Here's What Happened",
    'The Truth About {topic} No One Talks About',
    'Stop Doing {topic} Wrong',
    '{topic} Is Not What You Think',
  ],
};

export default function VideoTitleTool({ locale }: VideoTitleToolProps) {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState<'howTo' | 'list' | 'question' | 'bold'>(
    'howTo'
  );
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  function generate() {
    const templates = TEMPLATES[style];
    const generated = templates.map((tmpl) =>
      tmpl.replace(/\{topic\}/g, topic || 'this topic')
    );
    setResults(generated);
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const styles: { key: typeof style; label: string }[] = [
    { key: 'howTo', label: t(locale, 'tool.videoTitle.styleHowTo') },
    { key: 'list', label: t(locale, 'tool.videoTitle.styleList') },
    { key: 'question', label: t(locale, 'tool.videoTitle.styleQuestion') },
    { key: 'bold', label: t(locale, 'tool.videoTitle.styleBold') },
  ];

  return (
    <PageShell variant='default' locale={locale}>
      <div className='mx-auto max-w-[800px] px-6 py-12'>
        <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
          {t(locale, 'tool.videoTitle.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.videoTitle.desc')}
        </p>

        <div className='space-y-4'>
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.videoTitle.topic')}
            </label>
            <input
              className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setTopic(e.target.value)}
              type='text'
              value={topic}
            />
          </div>

          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.videoTitle.style')}
            </label>
            <div className='flex flex-wrap gap-2'>
              {styles.map((s) => (
                <button
                  key={s.key}
                  className={`rounded-[10px] border px-4 py-2 text-sm font-medium transition-all ${
                    style === s.key
                      ? 'border-accent bg-accent text-white'
                      : 'border-border bg-surface text-foreground hover:border-accent'
                  }`}
                  onClick={() => setStyle(s.key)}
                  type='button'
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <button
            className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
            onClick={generate}
            type='button'
          >
            {t(locale, 'tool.videoTitle.generate')}
          </button>

          {results.length > 0 && (
            <div className='space-y-3'>
              <p className='text-sm font-semibold text-foreground'>
                {t(locale, 'tool.videoTitle.result')}
              </p>
              {results.map((r, i) => (
                <div
                  key={i}
                  className='flex items-center justify-between rounded-[14px] border border-border bg-surface p-4'
                >
                  <p className='text-sm text-foreground'>{r}</p>
                  <button
                    className='ml-4 shrink-0 rounded-[8px] border border-border bg-white dark:bg-gray-900 px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
                    onClick={() => copy(r)}
                    type='button'
                  >
                    {copied
                      ? t(locale, 'tool.copy.copied')
                      : t(locale, 'tool.wordCount.copy')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

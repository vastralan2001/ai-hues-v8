'use client';

import { useState } from 'react';

import { aiGenerate } from '@/lib/ai-generate-client';
import { t, type Locale } from '@/lib/dict';

interface VideoTitleToolProps {
  locale: Locale;
}

export default function VideoTitleTool({ locale }: VideoTitleToolProps) {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState<'howTo' | 'list' | 'question' | 'bold'>(
    'howTo'
  );
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function generate() {
    setLoading(true);
    setError('');
    try {
      const generated = await aiGenerate({
        tool: 'video-title',
        locale,
        inputs: { topic, style },
      });
      setResults(generated.split('\n').filter(Boolean));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate');
    } finally {
      setLoading(false);
    }
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
    <div className='mx-auto max-w-[800px] px-6 py-12'>
      <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
        {t(locale, 'tool.videoTitle.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.videoTitle.desc')}
      </p>

      <div className='space-y-4'>
        <div>
          <label className='mb-2 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.videoTitle.topic')}
          </label>
          <input
            className='h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
            onChange={(e) => setTopic(e.target.value)}
            type='text'
            value={topic}
          />
        </div>

        <div>
          <label className='mb-2 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.videoTitle.style')}
          </label>
          <div className='flex flex-wrap gap-2'>
            {styles.map((s) => (
              <button
                key={s.key}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
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
          className='rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-light disabled:opacity-50'
          disabled={loading}
          onClick={generate}
          type='button'
        >
          {loading ? '...' : t(locale, 'tool.videoTitle.generate')}
        </button>

        {error && <p className='text-sm text-red-500'>{error}</p>}

        {results.length > 0 && (
          <div className='space-y-3'>
            <p className='text-sm font-semibold text-foreground'>
              {t(locale, 'tool.videoTitle.result')}
            </p>
            {results.map((r, i) => (
              <div
                key={i}
                className='flex items-center justify-between rounded-2xl border border-border bg-surface p-4'
              >
                <p className='text-sm text-foreground'>{r}</p>
                <button
                  className='ml-4 shrink-0 rounded-[8px] border border-border bg-white px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent dark:bg-gray-900'
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
  );
}

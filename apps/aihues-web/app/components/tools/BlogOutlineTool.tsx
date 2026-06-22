'use client';

import { useState } from 'react';

import { aiGenerate } from '@/lib/ai-generate-client';
import { t, type Locale } from '@/lib/dict';

interface BlogOutlineToolProps {
  locale: Locale;
}

export default function BlogOutlineTool({ locale }: BlogOutlineToolProps) {
  const [topic, setTopic] = useState('');
  const [sections, setSections] = useState('5');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    setLoading(true);
    setError('');
    try {
      const generated = await aiGenerate({
        tool: 'blog-outline',
        locale,
        inputs: { topic, audience: '' },
      });
      setResult(generated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className='max-w-[800px] py-10'>
      <h1 className='mb-2 text-[clamp(28px,3.4vw,40px)] font-extrabold tracking-[-0.02em] text-foreground'>
        {t(locale, 'tool.blogOutline.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.blogOutline.desc')}
      </p>

      <div className='space-y-4'>
        <div className='grid gap-4 sm:grid-cols-2'>
          <div>
            <label className='mb-2 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.blogOutline.topic')}
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
              {t(locale, 'tool.blogOutline.sections')}
            </label>
            <input
              className='h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              min='2'
              max='10'
              onChange={(e) => setSections(e.target.value)}
              type='number'
              value={sections}
            />
          </div>
        </div>

        <button
          className='rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-light disabled:opacity-50'
          disabled={loading}
          onClick={handleGenerate}
          type='button'
        >
          {loading
            ? locale === 'zh'
              ? '生成中...'
              : 'Generating...'
            : t(locale, 'tool.blogOutline.generate')}
        </button>

        {error && (
          <p className='mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400'>
            {error}
          </p>
        )}

        {result && (
          <div className='mt-2'>
            <div className='mb-2 flex items-center justify-between'>
              <span className='text-sm font-semibold text-foreground'>
                {t(locale, 'tool.blogOutline.result')}
              </span>
              <button
                className='rounded-[8px] border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
                onClick={copy}
                type='button'
              >
                {copied
                  ? t(locale, 'tool.copy.copied')
                  : t(locale, 'tool.wordCount.copy')}
              </button>
            </div>
            <div className='min-h-[200px] w-full rounded-2xl border border-border bg-surface p-5'>
              <pre className='whitespace-pre-wrap font-mono text-sm text-foreground'>
                {result}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

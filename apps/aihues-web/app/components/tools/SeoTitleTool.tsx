'use client';

import { useState } from 'react';

import { aiGenerate } from '@/lib/ai-generate-client';
import { t, type Locale } from '@/lib/dict';

interface SeoTitleToolProps {
  locale: Locale;
}

export default function SeoTitleTool({ locale }: SeoTitleToolProps) {
  const [title, setTitle] = useState('');
  const [keyword, setKeyword] = useState('');
  const [brand, setBrand] = useState('');
  const [result, setResult] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    try {
      const generated = await aiGenerate({
        tool: 'seo-title',
        locale,
        inputs: { keyword, topic: title },
      });
      setResult(generated.split('\n').filter(Boolean));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(title);
    } catch {
      // ignore
    }
  };

  return (
    <div className='mx-auto max-w-[800px] px-6 py-12'>
      <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
        {t(locale, 'tool.seoTitle.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.seoTitle.desc')}
      </p>

      <div className='flex flex-col gap-4'>
        <div>
          <label className='mb-1.5 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.seoTitle.inputTitle')}
          </label>
          <input
            className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
            onChange={(e) => setTitle(e.target.value)}
            type='text'
            value={title}
          />
        </div>
        <div>
          <label className='mb-1.5 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.seoTitle.keyword')}
          </label>
          <input
            className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
            onChange={(e) => setKeyword(e.target.value)}
            type='text'
            value={keyword}
          />
        </div>
        <div>
          <label className='mb-1.5 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.seoTitle.brand')}
          </label>
          <input
            className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
            onChange={(e) => setBrand(e.target.value)}
            type='text'
            value={brand}
          />
        </div>
      </div>

      <div className='mt-4 flex gap-3'>
        <button
          className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light disabled:opacity-50'
          disabled={loading}
          onClick={handleAnalyze}
          type='button'
        >
          {loading ? '...' : t(locale, 'tool.seoTitle.analyze')}
        </button>
        <button
          className='rounded-[10px] border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
          onClick={handleCopy}
          type='button'
        >
          {t(locale, 'tool.wordCount.copy')}
        </button>
      </div>

      {error && <p className='mt-4 text-sm text-red-500'>{error}</p>}

      {result.length > 0 && (
        <div className='mt-6 space-y-3'>
          <p className='text-sm font-semibold text-foreground'>
            {t(locale, 'tool.seoTitle.result')}
          </p>
          {result.map((r, i) => (
            <div
              key={i}
              className='flex items-center justify-between rounded-[14px] border border-border bg-surface p-4'
            >
              <p className='text-sm text-foreground'>{r}</p>
              <button
                className='ml-4 shrink-0 rounded-[8px] border border-border bg-white px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent dark:bg-gray-900'
                onClick={() => navigator.clipboard.writeText(r)}
                type='button'
              >
                {t(locale, 'tool.wordCount.copy')}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

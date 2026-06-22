'use client';

import { useState } from 'react';

import { aiGenerate } from '@/lib/ai-generate-client';
import { t, type Locale } from '@/lib/dict';

interface AltTextToolProps {
  locale: Locale;
}

export default function AltTextTool({ locale }: AltTextToolProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    setLoading(true);
    setError('');
    try {
      const res = await aiGenerate({
        tool: 'alt-text',
        locale,
        inputs: { description: input },
      });
      setResult(res);
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
        {t(locale, 'tool.altText.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.altText.desc')}
      </p>

      <div className='space-y-4'>
        <div>
          <label className='mb-2 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.altText.input')}
          </label>
          <textarea
            className='h-[120px] w-full resize-none rounded-lg border border-border bg-surface p-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              locale === 'zh'
                ? '一只橙色的猫坐在窗台上'
                : 'An orange cat sitting on a windowsill'
            }
            value={input}
          />
        </div>

        <button
          className='rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-light disabled:opacity-50'
          disabled={loading}
          onClick={handleGenerate}
          type='button'
        >
          {loading ? '...' : t(locale, 'tool.altText.generate')}
        </button>

        {error && (
          <div className='mt-2 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600'>
            {error}
          </div>
        )}

        {result && (
          <div className='mt-2'>
            <div className='mb-2 flex items-center justify-between'>
              <span className='text-sm font-semibold text-foreground'>
                {t(locale, 'tool.altText.result')}
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
            <div className='min-h-[60px] w-full rounded-2xl border border-border bg-surface p-5'>
              <p className='text-[15px] leading-relaxed text-foreground'>
                {result}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

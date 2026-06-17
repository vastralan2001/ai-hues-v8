'use client';

import { useState } from 'react';

import { aiGenerate } from '@/lib/ai-generate-client';
import { t, type Locale } from '@/lib/dict';

interface HumanizeToolProps {
  locale: Locale;
}

export default function HumanizeTool({ locale }: HumanizeToolProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleHumanize() {
    setError('');
    if (!input.trim()) {
      setError(t(locale, 'tool.humanize.empty'));
      return;
    }
    setLoading(true);
    try {
      const generated = await aiGenerate({
        tool: 'humanize',
        locale,
        inputs: { text: input },
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
    <div className='mx-auto max-w-4xl px-6 py-12'>
      <h1 className='hero-title mb-4 text-foreground'>
        {t(locale, 'tool.humanize.title')}
      </h1>
      <p className='mb-8 text-[16px] leading-relaxed text-secondary'>
        {t(locale, 'tool.humanize.desc')}
      </p>

      <div className='space-y-6'>
        <div>
          <label className='mb-2 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.humanize.input')}
          </label>
          <textarea
            className='h-[200px] w-full resize-none rounded-lg border border-border bg-surface p-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
            onChange={(e) => setInput(e.target.value)}
            placeholder={t(locale, 'tool.humanize.placeholder')}
            value={input}
          />
        </div>

        <button
          className='inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-light disabled:opacity-60'
          disabled={loading}
          onClick={handleHumanize}
          type='button'
        >
          {loading && (
            <span className='inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white' />
          )}
          {loading
            ? locale === 'zh'
              ? '生成中...'
              : 'Generating...'
            : t(locale, 'tool.humanize.humanize')}
        </button>

        {error && (
          <p className='rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400'>
            {error}
          </p>
        )}

        <div>
          <div className='mb-2 flex items-center justify-between'>
            <span className='text-sm font-semibold text-foreground'>
              {t(locale, 'tool.humanize.result')}
            </span>
            {result && (
              <button
                className='rounded-[8px] border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
                onClick={copy}
                type='button'
              >
                {copied
                  ? t(locale, 'tool.copy.copied')
                  : t(locale, 'tool.wordCount.copy')}
              </button>
            )}
          </div>
          <div className='min-h-[120px] w-full rounded-2xl border border-border bg-surface p-5'>
            {result ? (
              <p className='whitespace-pre-wrap text-[15px] leading-relaxed text-foreground'>
                {result}
              </p>
            ) : (
              <p className='text-[15px] leading-relaxed text-muted'>
                {locale === 'zh'
                  ? '人性化后的文本将显示在这里。'
                  : 'Humanized text will appear here.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

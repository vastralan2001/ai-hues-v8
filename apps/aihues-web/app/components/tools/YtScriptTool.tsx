'use client';

import { useState } from 'react';

import { aiGenerate } from '@/lib/ai-generate-client';
import { t, type Locale } from '@/lib/dict';

interface YtScriptToolProps {
  locale: Locale;
}

export default function YtScriptTool({ locale }: YtScriptToolProps) {
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('10');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    setLoading(true);
    setError('');
    try {
      const generated = await aiGenerate({
        tool: 'yt-script',
        locale,
        inputs: { topic, duration },
      });
      setResult(generated);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate');
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
    <div className='mx-auto max-w-[800px] px-6 py-12'>
      <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
        {t(locale, 'tool.ytScript.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.ytScript.desc')}
      </p>

      <div className='space-y-4'>
        <div className='grid gap-4 sm:grid-cols-2'>
          <div>
            <label className='mb-2 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.ytScript.topic')}
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
              {t(locale, 'tool.ytScript.duration')}
            </label>
            <input
              className='h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              min='1'
              onChange={(e) => setDuration(e.target.value)}
              type='number'
              value={duration}
            />
          </div>
        </div>

        <button
          className='rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-light disabled:opacity-50'
          disabled={loading}
          onClick={handleGenerate}
          type='button'
        >
          {loading ? '...' : t(locale, 'tool.ytScript.generate')}
        </button>

        {error && <p className='text-sm text-red-500'>{error}</p>}

        {result && (
          <div className='mt-2'>
            <div className='mb-2 flex items-center justify-between'>
              <span className='text-sm font-semibold text-foreground'>
                {t(locale, 'tool.ytScript.result')}
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

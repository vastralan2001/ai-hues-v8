'use client';

import { useState } from 'react';

import { aiGenerate } from '@/lib/ai-generate-client';
import { t, type Locale } from '@/lib/dict';

interface PseudoToolProps {
  locale: Locale;
}

export default function PseudoTool({ locale }: PseudoToolProps) {
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
        tool: 'pseudo',
        locale,
        inputs: { code: input },
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
    <div className='mx-auto max-w-[800px] px-6 py-12'>
      <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
        {t(locale, 'tool.pseudo.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.pseudo.desc')}
      </p>

      <div className='space-y-4'>
        <div>
          <label className='mb-2 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.pseudo.input')}
          </label>
          <textarea
            className='h-[120px] w-full resize-none rounded-lg border border-border bg-surface p-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
            onChange={(e) => setInput(e.target.value)}
            placeholder={locale === 'zh' ? '排序一个数组' : 'Sort an array'}
            value={input}
          />
        </div>

        <button
          className='rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-light disabled:opacity-50'
          disabled={loading}
          onClick={handleGenerate}
          type='button'
        >
          {loading ? '...' : t(locale, 'tool.pseudo.generate')}
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
                {t(locale, 'tool.pseudo.result')}
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

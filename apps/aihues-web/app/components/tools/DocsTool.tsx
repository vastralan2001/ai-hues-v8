'use client';

import { useState } from 'react';

import { aiGenerate } from '@/lib/ai-generate-client';
import { t, type Locale } from '@/lib/dict';

interface DocsToolProps {
  locale: Locale;
}

export default function DocsTool({ locale }: DocsToolProps) {
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    setLoading(true);
    setError('');
    try {
      const output = await aiGenerate({
        tool: 'docs',
        locale,
        inputs: { product: input, params: language },
      });
      setResult(output);
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
    <div className='max-w-[800px] py-10'>
      <h1 className='mb-2 text-[clamp(28px,3.4vw,40px)] font-extrabold tracking-[-0.02em] text-foreground'>
        {t(locale, 'tool.docs.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.docs.desc')}
      </p>

      <div className='space-y-4'>
        <div>
          <label className='mb-2 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.docs.language')}
          </label>
          <select
            className='h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm text-foreground focus:border-accent focus:outline-none'
            onChange={(e) => setLanguage(e.target.value)}
            value={language}
          >
            <option value='javascript'>JavaScript / TypeScript</option>
            <option value='python'>Python</option>
          </select>
        </div>

        <div>
          <label className='mb-2 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.docs.input')}
          </label>
          <input
            className='h-12 w-full rounded-lg border border-border bg-surface px-4 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
            onChange={(e) => setInput(e.target.value)}
            placeholder='function calculateTotal(price, quantity, tax = 0.1)'
            type='text'
            value={input}
          />
        </div>

        {error && <p className='text-sm text-red-500'>{error}</p>}

        <button
          className={`rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-light ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
          onClick={handleGenerate}
          type='button'
        >
          {t(locale, 'tool.docs.generate')}
        </button>

        {result && (
          <div className='mt-2'>
            <div className='mb-2 flex items-center justify-between'>
              <span className='text-sm font-semibold text-foreground'>
                {t(locale, 'tool.docs.result')}
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
            <div className='min-h-[120px] w-full rounded-2xl border border-border bg-surface p-5'>
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

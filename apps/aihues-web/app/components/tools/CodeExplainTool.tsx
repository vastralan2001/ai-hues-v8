'use client';

import { useState } from 'react';

import { aiGenerate } from '@/lib/ai-generate-client';
import { t, type Locale } from '@/lib/dict';

interface CodeExplainToolProps {
  locale: Locale;
}

export default function CodeExplainTool({ locale }: CodeExplainToolProps) {
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleExplain() {
    setLoading(true);
    setError('');
    try {
      const res = await aiGenerate({
        tool: 'code-explain',
        locale,
        inputs: { code: input, language },
      });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='mx-auto max-w-4xl px-6 py-12'>
      <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
        {t(locale, 'tool.codeExplain.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.codeExplain.desc')}
      </p>

      <div className='space-y-4'>
        <div>
          <label className='mb-2 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.codeExplain.language')}
          </label>
          <select
            className='h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm text-foreground focus:border-accent focus:outline-none'
            onChange={(e) => setLanguage(e.target.value)}
            value={language}
          >
            <option value='javascript'>JavaScript / TypeScript</option>
            <option value='python'>Python</option>
            <option value='sql'>SQL</option>
          </select>
        </div>

        <div>
          <label className='mb-2 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.codeExplain.input')}
          </label>
          <textarea
            className='h-[200px] w-full resize-none rounded-lg border border-border bg-surface p-4 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
        </div>

        <button
          className='rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-light disabled:opacity-50'
          disabled={loading}
          onClick={handleExplain}
          type='button'
        >
          {loading ? '...' : t(locale, 'tool.codeExplain.explain')}
        </button>

        {error && (
          <div className='rounded-2xl border border-red-300 bg-red-50 p-5'>
            <p className='text-sm text-red-600'>{error}</p>
          </div>
        )}

        {result && (
          <div className='rounded-2xl border border-border bg-surface p-5'>
            <p className='text-xs font-semibold uppercase tracking-wider text-secondary'>
              {t(locale, 'tool.codeExplain.result')}
            </p>
            <div className='mt-2 space-y-3'>
              {result.split('\n\n').map((line, i) => (
                <p
                  key={i}
                  className='text-[15px] leading-relaxed text-foreground'
                >
                  • {line}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

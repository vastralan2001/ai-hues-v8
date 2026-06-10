'use client';

import { useState } from 'react';
import { event, GA_EVENTS } from '@/lib/gtag';

import { aiGenerate } from '@/lib/ai-generate-client';
import { t, type Locale } from '@/lib/dict';

interface LinkedinToolProps {
  locale: Locale;
}

export default function LinkedinTool({ locale }: LinkedinToolProps) {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<'thoughtful' | 'success' | 'opinion'>(
    'thoughtful'
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
        tool: 'linkedin',
        locale,
        inputs: { topic, tone },
      });
      setResults(generated.split('\n').filter(Boolean));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate');
    } finally {
      setLoading(false);
    }
  }

  function copy(text: string) {
    event(GA_EVENTS.toolCopy, { tool: 'linkedin' });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const tones: { key: typeof tone; label: string }[] = [
    { key: 'thoughtful', label: t(locale, 'tool.linkedin.toneThoughtful') },
    { key: 'success', label: t(locale, 'tool.linkedin.toneSuccess') },
    { key: 'opinion', label: t(locale, 'tool.linkedin.toneOpinion') },
  ];

  return (
    <div className='mx-auto max-w-[800px] px-6 py-12'>
      <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
        {t(locale, 'tool.linkedin.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.linkedin.desc')}
      </p>

      <div className='space-y-4'>
        <div>
          <label className='mb-1.5 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.linkedin.topic')}
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
            {t(locale, 'tool.linkedin.tone')}
          </label>
          <div className='flex flex-wrap gap-2'>
            {tones.map((t) => (
              <button
                key={t.key}
                className={`rounded-[10px] border px-4 py-2 text-sm font-medium transition-all ${
                  tone === t.key
                    ? 'border-accent bg-accent text-white'
                    : 'border-border bg-surface text-foreground hover:border-accent'
                }`}
                onClick={() => setTone(t.key)}
                type='button'
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <button
          className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light disabled:opacity-50'
          disabled={loading}
          onClick={generate}
          type='button'
        >
          {loading ? '...' : t(locale, 'tool.linkedin.generate')}
        </button>

        {error && <p className='text-sm text-red-500'>{error}</p>}

        {results.length > 0 && (
          <div className='space-y-3'>
            <p className='text-sm font-semibold text-foreground'>
              {t(locale, 'tool.linkedin.result')}
            </p>
            {results.map((r, i) => (
              <div
                key={i}
                className='rounded-[14px] border border-border bg-surface p-4'
              >
                <p className='whitespace-pre-wrap text-sm text-foreground'>
                  {r}
                </p>
                <button
                  className='mt-3 rounded-[8px] border border-border bg-white px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent dark:bg-gray-900'
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

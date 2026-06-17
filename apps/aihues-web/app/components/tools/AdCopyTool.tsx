'use client';

import { useState } from 'react';

import { aiGenerate } from '@/lib/ai-generate-client';
import { t, type Locale } from '@/lib/dict';

interface AdCopyToolProps {
  locale: Locale;
}

export default function AdCopyTool({ locale }: AdCopyToolProps) {
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [platform, setPlatform] = useState<'google' | 'meta' | 'linkedin'>(
    'google'
  );
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function generate() {
    setLoading(true);
    setError('');
    try {
      const result = await aiGenerate({
        tool: 'ad-copy',
        locale,
        inputs: { product, audience },
      });
      setResults([result]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const platforms: { key: typeof platform; label: string }[] = [
    { key: 'google', label: t(locale, 'tool.adCopy.platformGoogle') },
    { key: 'meta', label: t(locale, 'tool.adCopy.platformMeta') },
    { key: 'linkedin', label: t(locale, 'tool.adCopy.platformLinkedIn') },
  ];

  return (
    <div className='mx-auto max-w-[800px] px-6 py-12'>
      <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
        {t(locale, 'tool.adCopy.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.adCopy.desc')}
      </p>

      <div className='space-y-4'>
        <div className='grid gap-4 sm:grid-cols-2'>
          <div>
            <label className='mb-2 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.adCopy.product')}
            </label>
            <input
              className='h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setProduct(e.target.value)}
              type='text'
              value={product}
            />
          </div>
          <div>
            <label className='mb-2 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.adCopy.audience')}
            </label>
            <input
              className='h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setAudience(e.target.value)}
              type='text'
              value={audience}
            />
          </div>
        </div>

        <div>
          <label className='mb-2 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.adCopy.platform')}
          </label>
          <div className='flex flex-wrap gap-2'>
            {platforms.map((p) => (
              <button
                key={p.key}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                  platform === p.key
                    ? 'border-accent bg-accent text-white'
                    : 'border-border bg-surface text-foreground hover:border-accent'
                }`}
                onClick={() => setPlatform(p.key)}
                type='button'
              >
                {p.label}
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
          {loading
            ? locale === 'zh'
              ? '生成中...'
              : 'Generating...'
            : t(locale, 'tool.adCopy.generate')}
        </button>

        {error && (
          <p className='mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400'>
            {error}
          </p>
        )}

        {results.length > 0 && (
          <div className='space-y-3'>
            <p className='text-sm font-semibold text-foreground'>
              {t(locale, 'tool.adCopy.result')}
            </p>
            {results.map((r, i) => (
              <div
                key={i}
                className='flex items-center justify-between rounded-2xl border border-border bg-surface p-4'
              >
                <p className='text-sm text-foreground'>{r}</p>
                <button
                  className='ml-4 shrink-0 rounded-[8px] border border-border bg-white dark:bg-gray-900 px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
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

'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface AdCopyToolProps {
  locale: Locale;
}

const TEMPLATES: Record<string, string[]> = {
  google: [
    'Headline: {product} — Built for {audience}',
    'Description 1: Save time and get better results with {product}. Start your free trial today.',
    'Description 2: Join thousands of {audience} who trust {product}. See why.',
    'CTA: Try {product} Free →',
  ],
  meta: [
    'Primary Text: Tired of struggling with {product}? We built the solution {audience} have been waiting for.',
    'Headline: {product} — Made for {audience}',
    'Description: Discover why {audience} love {product}. Free trial available.',
    'CTA: Learn More',
  ],
  linkedin: [
    'Intro: As a {audience}, you know the challenges of {product}. Here\'s how we solve them.',
    'Body: {product} helps {audience} achieve more with less effort. Trusted by industry leaders.',
    'CTA: Book a Demo',
  ],
};

export default function AdCopyTool({ locale }: AdCopyToolProps) {
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [platform, setPlatform] = useState<'google' | 'meta' | 'linkedin'>('google');
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  function generate() {
    const templates = TEMPLATES[platform];
    const p = product || (locale === 'zh' ? '您的产品' : 'Your Product');
    const a = audience || (locale === 'zh' ? '专业人士' : 'professionals');
    const generated = templates.map((tmpl) =>
      tmpl.replace(/\{product\}/g, p).replace(/\{audience\}/g, a)
    );
    setResults(generated);
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
    <PageShell variant='default' locale={locale}>
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
              <label className='mb-1.5 block text-sm font-semibold text-foreground'>
                {t(locale, 'tool.adCopy.product')}
              </label>
              <input
                className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
                onChange={(e) => setProduct(e.target.value)}
                type='text'
                value={product}
              />
            </div>
            <div>
              <label className='mb-1.5 block text-sm font-semibold text-foreground'>
                {t(locale, 'tool.adCopy.audience')}
              </label>
              <input
                className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
                onChange={(e) => setAudience(e.target.value)}
                type='text'
                value={audience}
              />
            </div>
          </div>

          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.adCopy.platform')}
            </label>
            <div className='flex flex-wrap gap-2'>
              {platforms.map((p) => (
                <button
                  key={p.key}
                  className={`rounded-[10px] border px-4 py-2 text-sm font-medium transition-all ${
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
            className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
            onClick={generate}
            type='button'
          >
            {t(locale, 'tool.adCopy.generate')}
          </button>

          {results.length > 0 && (
            <div className='space-y-3'>
              <p className='text-sm font-semibold text-foreground'>
                {t(locale, 'tool.adCopy.result')}
              </p>
              {results.map((r, i) => (
                <div
                  key={i}
                  className='flex items-center justify-between rounded-[14px] border border-border bg-surface p-4'
                >
                  <p className='text-sm text-foreground'>{r}</p>
                  <button
                    className='ml-4 shrink-0 rounded-[8px] border border-border bg-white dark:bg-gray-900 px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
                    onClick={() => copy(r)}
                    type='button'
                  >
                    {copied ? t(locale, 'tool.copy.copied') : t(locale, 'tool.wordCount.copy')}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

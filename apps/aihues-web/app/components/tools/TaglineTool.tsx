'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface TaglineToolProps {
  locale: Locale;
}

const TEMPLATES: Record<string, string[]> = {
  professional: [
    '{product}: Excellence in every detail.',
    'Trusted by professionals. Powered by {product}.',
    '{product} — Where innovation meets reliability.',
    'The smart choice for {category}.',
    'Elevate your {category} with {product}.',
  ],
  fun: [
    '{product}: Because {category} should be fun!',
    'Make {category} awesome with {product}.',
    '{product} — Your {category} superpower.',
    "Life's too short for boring {category}. Try {product}.",
    '{product}: The {category} tool you actually enjoy using.',
  ],
  bold: [
    '{product}. No compromises.',
    'Dominate {category} with {product}.',
    '{product}: Built for those who demand more.',
    "The future of {category} is here. It's called {product}.",
    '{product} — Unapologetically powerful.',
  ],
  minimal: [
    '{product}. Simply better.',
    '{category}, refined.',
    '{product} — Less noise, more results.',
    'Clean. Focused. {product}.',
    '{product} for modern {category}.',
  ],
};

export default function TaglineTool({ locale }: TaglineToolProps) {
  const [product, setProduct] = useState('');
  const [category, setCategory] = useState('');
  const [tone, setTone] = useState<'professional' | 'fun' | 'bold' | 'minimal'>(
    'professional'
  );
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  function generate() {
    const templates = TEMPLATES[tone];
    const generated = templates.map((tmpl) =>
      tmpl
        .replace(/\{product\}/g, product || 'Your Product')
        .replace(/\{category\}/g, category || 'business')
    );
    setResults(generated);
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const tones: { key: typeof tone; label: string }[] = [
    { key: 'professional', label: t(locale, 'tool.tagline.toneProfessional') },
    { key: 'fun', label: t(locale, 'tool.tagline.toneFun') },
    { key: 'bold', label: t(locale, 'tool.tagline.toneBold') },
    { key: 'minimal', label: t(locale, 'tool.tagline.toneMinimal') },
  ];

  return (
    <PageShell variant='default' locale={locale}>
      <div className='mx-auto max-w-[800px] px-6 py-12'>
        <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
          {t(locale, 'tool.tagline.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.tagline.desc')}
        </p>

        <div className='space-y-4'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <label className='mb-1.5 block text-sm font-semibold text-foreground'>
                {t(locale, 'tool.tagline.product')}
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
                {t(locale, 'tool.tagline.category')}
              </label>
              <input
                className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
                onChange={(e) => setCategory(e.target.value)}
                placeholder='SaaS, coffee, fitness...'
                type='text'
                value={category}
              />
            </div>
          </div>

          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.tagline.tone')}
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
            className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
            onClick={generate}
            type='button'
          >
            {t(locale, 'tool.tagline.generate')}
          </button>

          {results.length > 0 && (
            <div className='space-y-3'>
              <p className='text-sm font-semibold text-foreground'>
                {t(locale, 'tool.tagline.result')}
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
    </PageShell>
  );
}

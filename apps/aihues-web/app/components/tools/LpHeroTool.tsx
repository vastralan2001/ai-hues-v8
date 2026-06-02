'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { aiGenerate } from '@/lib/ai-generate-client';
import { t, type Locale } from '@/lib/dict';

interface LpHeroToolProps {
  locale: Locale;
}

interface HeroResult {
  headline: string;
  subheadline: string;
  cta: string;
}

function parseHeroOutput(text: string): HeroResult {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  let headline = '';
  let subheadline = '';
  let cta = '';

  for (const line of lines) {
    const hl = line.match(/^headline[：:]\s*(.+)$/i);
    if (hl) headline = hl[1].trim();
    const sh = line.match(/^subheadline[：:]\s*(.+)$/i);
    if (sh) subheadline = sh[1].trim();
    const ct = line.match(/^(?:cta|call to action)[：:]\s*(.+)$/i);
    if (ct) cta = ct[1].trim();
  }

  if (!headline && lines[0]) headline = lines[0];
  if (!subheadline && lines[1]) subheadline = lines[1];
  if (!cta && lines[2]) cta = lines[2];

  return { headline, subheadline, cta };
}

export default function LpHeroTool({ locale }: LpHeroToolProps) {
  const [product, setProduct] = useState('');
  const [benefit, setBenefit] = useState('');
  const [audience, setAudience] = useState('');
  const [result, setResult] = useState<HeroResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    setLoading(true);
    setError('');
    try {
      const generated = await aiGenerate({
        tool: 'lp-hero',
        locale,
        inputs: { product, benefit },
      });
      setResult(parseHeroOutput(generated));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate');
    } finally {
      setLoading(false);
    }
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <PageShell variant='default' locale={locale}>
      <div className='mx-auto max-w-[800px] px-6 py-12'>
        <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
          {t(locale, 'tool.lpHero.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.lpHero.desc')}
        </p>

        <div className='space-y-4'>
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.lpHero.product')}
            </label>
            <input
              className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setProduct(e.target.value)}
              type='text'
              value={product}
            />
          </div>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div>
              <label className='mb-1.5 block text-sm font-semibold text-foreground'>
                {t(locale, 'tool.lpHero.benefit')}
              </label>
              <input
                className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
                onChange={(e) => setBenefit(e.target.value)}
                placeholder={locale === 'zh' ? '节省时间' : 'save time'}
                type='text'
                value={benefit}
              />
            </div>
            <div>
              <label className='mb-1.5 block text-sm font-semibold text-foreground'>
                {t(locale, 'tool.lpHero.audience')}
              </label>
              <input
                className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
                onChange={(e) => setAudience(e.target.value)}
                placeholder={locale === 'zh' ? '专业人士' : 'professionals'}
                type='text'
                value={audience}
              />
            </div>
          </div>

          <button
            className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light disabled:opacity-50'
            disabled={loading}
            onClick={handleGenerate}
            type='button'
          >
            {loading ? '...' : t(locale, 'tool.lpHero.generate')}
          </button>

          {error && <p className='text-sm text-red-500'>{error}</p>}

          {result && (
            <div className='space-y-4'>
              <div className='rounded-[14px] border border-border bg-surface p-5'>
                <p className='text-xs font-semibold uppercase tracking-wider text-secondary'>
                  {t(locale, 'tool.lpHero.headline')}
                </p>
                <div className='mt-2 flex items-center justify-between gap-4'>
                  <p className='text-xl font-extrabold text-foreground'>
                    {result.headline}
                  </p>
                  <button
                    className='shrink-0 rounded-[8px] border border-border bg-white px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent dark:bg-gray-900'
                    onClick={() => copy(result.headline)}
                    type='button'
                  >
                    {copied
                      ? t(locale, 'tool.copy.copied')
                      : t(locale, 'tool.wordCount.copy')}
                  </button>
                </div>
              </div>

              <div className='rounded-[14px] border border-border bg-surface p-5'>
                <p className='text-xs font-semibold uppercase tracking-wider text-secondary'>
                  {t(locale, 'tool.lpHero.subheadline')}
                </p>
                <div className='mt-2 flex items-center justify-between gap-4'>
                  <p className='text-[15px] leading-relaxed text-foreground'>
                    {result.subheadline}
                  </p>
                  <button
                    className='shrink-0 rounded-[8px] border border-border bg-white px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent dark:bg-gray-900'
                    onClick={() => copy(result.subheadline)}
                    type='button'
                  >
                    {copied
                      ? t(locale, 'tool.copy.copied')
                      : t(locale, 'tool.wordCount.copy')}
                  </button>
                </div>
              </div>

              <div className='rounded-[14px] border border-border bg-surface p-5'>
                <p className='text-xs font-semibold uppercase tracking-wider text-secondary'>
                  {t(locale, 'tool.lpHero.cta')}
                </p>
                <div className='mt-2 flex items-center justify-between gap-4'>
                  <p className='text-lg font-semibold text-accent'>
                    {result.cta}
                  </p>
                  <button
                    className='shrink-0 rounded-[8px] border border-border bg-white px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent dark:bg-gray-900'
                    onClick={() => copy(result.cta)}
                    type='button'
                  >
                    {copied
                      ? t(locale, 'tool.copy.copied')
                      : t(locale, 'tool.wordCount.copy')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

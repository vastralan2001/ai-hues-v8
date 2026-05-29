'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface SeoTitleToolProps {
  locale: Locale;
}

interface AnalysisResult {
  length: number;
  lengthStatus: 'short' | 'optimal' | 'long';
  hasKeyword: boolean;
  hasBrand: boolean;
  specialChars: number;
}

function analyzeTitle(title: string, keyword: string, brand: string): AnalysisResult {
  const length = title.length;
  let lengthStatus: 'short' | 'optimal' | 'long' = 'optimal';
  if (length < 30) lengthStatus = 'short';
  else if (length > 60) lengthStatus = 'long';

  const hasKeyword =
    !keyword || title.toLowerCase().includes(keyword.toLowerCase());
  const hasBrand =
    !brand || title.toLowerCase().includes(brand.toLowerCase());
  const specialChars = (title.match(/[^a-zA-Z0-9\s\u4e00-\u9fa5]/g) || []).length;

  return { length, lengthStatus, hasKeyword, hasBrand, specialChars };
}

export default function SeoTitleTool({ locale }: SeoTitleToolProps) {
  const [title, setTitle] = useState('');
  const [keyword, setKeyword] = useState('');
  const [brand, setBrand] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = () => {
    setResult(analyzeTitle(title, keyword, brand));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(title);
    } catch {
      // ignore
    }
  };

  const lengthLabels: Record<string, string> = {
    short: t(locale, 'tool.seoTitle.tooShort'),
    optimal: t(locale, 'tool.seoTitle.optimal'),
    long: t(locale, 'tool.seoTitle.tooLong'),
  };

  const lengthColors: Record<string, string> = {
    short: 'text-orange-500',
    optimal: 'text-green-500',
    long: 'text-red-500',
  };

  return (
    <PageShell variant='default' locale={locale}>
      <div className='mx-auto max-w-[800px] px-6 py-12'>
        <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
          {t(locale, 'tool.seoTitle.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.seoTitle.desc')}
        </p>

        <div className='flex flex-col gap-4'>
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.seoTitle.inputTitle')}
            </label>
            <input
              className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setTitle(e.target.value)}
              type='text'
              value={title}
            />
          </div>
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.seoTitle.keyword')}
            </label>
            <input
              className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setKeyword(e.target.value)}
              type='text'
              value={keyword}
            />
          </div>
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.seoTitle.brand')}
            </label>
            <input
              className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setBrand(e.target.value)}
              type='text'
              value={brand}
            />
          </div>
        </div>

        <div className='mt-4 flex gap-3'>
          <button
            className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
            onClick={handleAnalyze}
            type='button'
          >
            {t(locale, 'tool.seoTitle.analyze')}
          </button>
          <button
            className='rounded-[10px] border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
            onClick={handleCopy}
            type='button'
          >
            {t(locale, 'tool.wordCount.copy')}
          </button>
        </div>

        {result && (
          <div className='mt-6 grid gap-3 sm:grid-cols-2'>
            <div className='rounded-[14px] border border-border bg-surface p-4 text-center'>
              <p className='text-xs font-semibold uppercase tracking-wider text-secondary'>
                {t(locale, 'tool.seoTitle.length')}
              </p>
              <p className={`mt-1 text-2xl font-extrabold ${lengthColors[result.lengthStatus]}`}>
                {result.length}
              </p>
              <p className='mt-0.5 text-xs text-secondary'>
                {lengthLabels[result.lengthStatus]}
              </p>
            </div>
            <div className='rounded-[14px] border border-border bg-surface p-4 text-center'>
              <p className='text-xs font-semibold uppercase tracking-wider text-secondary'>
                {t(locale, 'tool.seoTitle.specialChars')}
              </p>
              <p className='mt-1 text-2xl font-extrabold text-accent'>
                {result.specialChars}
              </p>
            </div>
            <div
              className={`rounded-[14px] border p-4 text-center ${
                result.hasKeyword
                  ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30'
                  : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30'
              }`}
            >
              <p className='text-sm font-semibold'>
                {result.hasKeyword
                  ? t(locale, 'tool.seoTitle.hasKeyword')
                  : t(locale, 'tool.seoTitle.missingKeyword')}
              </p>
            </div>
            <div
              className={`rounded-[14px] border p-4 text-center ${
                result.hasBrand
                  ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30'
                  : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30'
              }`}
            >
              <p className='text-sm font-semibold'>
                {result.hasBrand
                  ? t(locale, 'tool.seoTitle.hasBrand')
                  : t(locale, 'tool.seoTitle.missingBrand')}
              </p>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}

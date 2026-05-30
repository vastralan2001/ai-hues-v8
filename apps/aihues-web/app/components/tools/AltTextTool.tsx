'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface AltTextToolProps {
  locale: Locale;
}

function generateAltText(description: string, locale: Locale): string {
  const isZh = locale === 'zh';
  const d = description.trim();
  if (!d) return '';

  // Simple templates based on description length and content
  if (d.length < 20) {
    return isZh ? `图片显示了${d}` : `Image showing ${d}`;
  }

  if (d.includes('chart') || d.includes('graph') || d.includes('图') || d.includes('图表')) {
    return isZh
      ? `图表展示了${d.replace(/chart|graph|图|图表/g, '')}的数据趋势`
      : `Chart showing data trends for ${d.replace(/chart|graph/gi, '')}`;
  }

  if (d.includes('logo') || d.includes('标志') || d.includes('Logo')) {
    return isZh ? `${d}的品牌标志` : `Brand logo of ${d}`;
  }

  if (d.includes('screenshot') || d.includes('截图')) {
    return isZh ? `界面截图：${d.replace(/截图/g, '')}` : `Screenshot of ${d.replace(/screenshot/gi, '')}`;
  }

  return isZh
    ? `一张展示${d}的图片`
    : `A photograph showing ${d}`;
}

export default function AltTextTool({ locale }: AltTextToolProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  function handleGenerate() {
    setResult(generateAltText(input, locale));
  }

  function copy() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <PageShell variant='default' locale={locale}>
      <div className='mx-auto max-w-[800px] px-6 py-12'>
        <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
          {t(locale, 'tool.altText.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.altText.desc')}
        </p>

        <div className='space-y-4'>
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.altText.input')}
            </label>
            <textarea
              className='h-[120px] w-full resize-none rounded-[10px] border border-border bg-surface p-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setInput(e.target.value)}
              placeholder={locale === 'zh' ? '一只橙色的猫坐在窗台上' : 'An orange cat sitting on a windowsill'}
              value={input}
            />
          </div>

          <button
            className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
            onClick={handleGenerate}
            type='button'
          >
            {t(locale, 'tool.altText.generate')}
          </button>

          {result && (
            <div className='mt-2'>
              <div className='mb-2 flex items-center justify-between'>
                <span className='text-sm font-semibold text-foreground'>
                  {t(locale, 'tool.altText.result')}
                </span>
                <button
                  className='rounded-[8px] border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
                  onClick={copy}
                  type='button'
                >
                  {copied ? t(locale, 'tool.copy.copied') : t(locale, 'tool.wordCount.copy')}
                </button>
              </div>
              <div className='min-h-[60px] w-full rounded-[14px] border border-border bg-surface p-5'>
                <p className='text-[15px] leading-relaxed text-foreground'>
                  {result}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface FaqToolProps {
  locale: Locale;
}

interface QAPair {
  id: number;
  question: string;
  answer: string;
}

export default function FaqTool({ locale }: FaqToolProps) {
  const [pairs, setPairs] = useState<QAPair[]>([
    { id: 1, question: '', answer: '' },
  ]);
  const [format, setFormat] = useState<'html' | 'jsonld'>('html');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  let nextId = 2;

  function addPair() {
    setPairs([...pairs, { id: nextId++, question: '', answer: '' }]);
  }

  function removePair(id: number) {
    setPairs(pairs.filter((p) => p.id !== id));
  }

  function updatePair(id: number, field: 'question' | 'answer', value: string) {
    setPairs(pairs.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  }

  function generate() {
    const validPairs = pairs.filter(
      (p) => p.question.trim() && p.answer.trim()
    );
    if (format === 'html') {
      const items = validPairs
        .map(
          (p) =>
            `  <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">\n` +
            `    <h3 itemprop="name">${escapeHtml(p.question)}</h3>\n` +
            `    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">\n` +
            `      <div itemprop="text">${escapeHtml(p.answer)}</div>\n` +
            `    </div>\n` +
            `  </div>`
        )
        .join('\n');
      setResult(
        `<div itemscope itemtype="https://schema.org/FAQPage">\n${items}\n</div>`
      );
    } else {
      const json = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: validPairs.map((p) => ({
          '@type': 'Question',
          name: p.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: p.answer,
          },
        })),
      };
      setResult(JSON.stringify(json, null, 2));
    }
  }

  function escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
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
          {t(locale, 'tool.faq.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.faq.desc')}
        </p>

        <div className='space-y-4'>
          {pairs.map((pair) => (
            <div
              key={pair.id}
              className='rounded-[14px] border border-border bg-surface p-4 space-y-3'
            >
              <div>
                <label className='mb-1.5 block text-sm font-semibold text-foreground'>
                  {t(locale, 'tool.faq.question')}
                </label>
                <input
                  className='h-11 w-full rounded-[10px] border border-border bg-white dark:bg-gray-900 px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
                  onChange={(e) =>
                    updatePair(pair.id, 'question', e.target.value)
                  }
                  type='text'
                  value={pair.question}
                />
              </div>
              <div>
                <label className='mb-1.5 block text-sm font-semibold text-foreground'>
                  {t(locale, 'tool.faq.answer')}
                </label>
                <textarea
                  className='h-[100px] w-full resize-none rounded-[10px] border border-border bg-white dark:bg-gray-900 px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
                  onChange={(e) =>
                    updatePair(pair.id, 'answer', e.target.value)
                  }
                  value={pair.answer}
                />
              </div>
              {pairs.length > 1 && (
                <button
                  className='text-sm text-red-500 hover:text-red-600'
                  onClick={() => removePair(pair.id)}
                  type='button'
                >
                  {t(locale, 'tool.faq.remove')}
                </button>
              )}
            </div>
          ))}

          <button
            className='rounded-[10px] border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
            onClick={addPair}
            type='button'
          >
            {t(locale, 'tool.faq.add')}
          </button>

          <div className='flex flex-wrap gap-2'>
            {(['html', 'jsonld'] as const).map((f) => (
              <button
                key={f}
                className={`rounded-[10px] border px-4 py-2 text-sm font-medium transition-all ${
                  format === f
                    ? 'border-accent bg-accent text-white'
                    : 'border-border bg-surface text-foreground hover:border-accent'
                }`}
                onClick={() => setFormat(f)}
                type='button'
              >
                {f === 'html'
                  ? t(locale, 'tool.faq.html')
                  : t(locale, 'tool.faq.jsonLd')}
              </button>
            ))}
          </div>

          <button
            className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
            onClick={generate}
            type='button'
          >
            {t(locale, 'tool.faq.format')}
          </button>

          {result && (
            <div className='mt-2'>
              <div className='mb-2 flex items-center justify-between'>
                <span className='text-sm font-semibold text-foreground'>
                  {t(locale, 'tool.faq.result')}
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
              <div className='min-h-[120px] w-full rounded-[14px] border border-border bg-surface p-5'>
                <pre className='whitespace-pre-wrap break-all font-mono text-sm text-foreground'>
                  {result}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

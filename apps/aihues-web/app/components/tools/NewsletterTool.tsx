'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface NewsletterToolProps {
  locale: Locale;
}

export default function NewsletterTool({ locale }: NewsletterToolProps) {
  const [subject, setSubject] = useState('');
  const [preview, setPreview] = useState('');
  const [body, setBody] = useState('');
  const [cta, setCta] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  function format() {
    const isZh = locale === 'zh';
    const output = `${subject}\n${'─'.repeat(Math.max(subject.length, 20))}\n\n${preview ? `Preview: ${preview}\n\n` : ''}${body}\n\n${cta ? `[ ${cta} ]` : ''}`;
    setResult(output);
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
          {t(locale, 'tool.newsletter.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.newsletter.desc')}
        </p>

        <div className='space-y-4'>
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.newsletter.subject')}
            </label>
            <input
              className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setSubject(e.target.value)}
              type='text'
              value={subject}
            />
          </div>

          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.newsletter.preview')}
            </label>
            <input
              className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setPreview(e.target.value)}
              type='text'
              value={preview}
            />
          </div>

          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.newsletter.body')}
            </label>
            <textarea
              className='h-[200px] w-full resize-none rounded-[10px] border border-border bg-surface p-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setBody(e.target.value)}
              value={body}
            />
          </div>

          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.newsletter.cta')}
            </label>
            <input
              className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setCta(e.target.value)}
              type='text'
              value={cta}
            />
          </div>

          <button
            className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
            onClick={format}
            type='button'
          >
            {t(locale, 'tool.newsletter.format')}
          </button>

          {result && (
            <div className='mt-2'>
              <div className='mb-2 flex items-center justify-between'>
                <span className='text-sm font-semibold text-foreground'>
                  {t(locale, 'tool.newsletter.result')}
                </span>
                <button
                  className='rounded-[8px] border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
                  onClick={copy}
                  type='button'
                >
                  {copied ? t(locale, 'tool.copy.copied') : t(locale, 'tool.wordCount.copy')}
                </button>
              </div>
              <div className='min-h-[120px] w-full rounded-[14px] border border-border bg-surface p-5'>
                <pre className='whitespace-pre-wrap font-mono text-sm text-foreground'>
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

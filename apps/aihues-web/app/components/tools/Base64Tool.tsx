'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface Base64ToolProps {
  locale: Locale;
}

export default function Base64Tool({ locale }: Base64ToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [urlSafe, setUrlSafe] = useState(false);
  const [error, setError] = useState('');

  const handleEncode = () => {
    try {
      setError('');
      let encoded = btoa(unescape(encodeURIComponent(input)));
      if (urlSafe) {
        encoded = encoded
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');
      }
      setOutput(encoded);
    } catch {
      setError('Invalid input for encoding');
    }
  };

  const handleDecode = () => {
    try {
      setError('');
      let decoded = input;
      if (urlSafe) {
        decoded = decoded.replace(/-/g, '+').replace(/_/g, '/');
        while (decoded.length % 4) decoded += '=';
      }
      setOutput(decodeURIComponent(escape(atob(decoded))));
    } catch {
      setError('Invalid Base64 input');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      // ignore
    }
  };

  return (
    <PageShell variant='default' locale={locale}>
      <div className='mx-auto max-w-[900px] px-6 py-12'>
        <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
          {t(locale, 'tool.base64.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.base64.desc')}
        </p>

        <textarea
          className='h-[200px] w-full resize-none rounded-[14px] border border-border bg-surface p-5 text-[15px] leading-relaxed text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
          onChange={(e) => setInput(e.target.value)}
          placeholder={t(locale, 'tool.base64.placeholder')}
          value={input}
        />

        <div className='mt-4 flex flex-wrap items-center gap-3'>
          <button
            className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
            onClick={handleEncode}
            type='button'
          >
            {t(locale, 'tool.base64.encode')}
          </button>
          <button
            className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
            onClick={handleDecode}
            type='button'
          >
            {t(locale, 'tool.base64.decode')}
          </button>
          <label className='flex cursor-pointer items-center gap-2 text-sm text-secondary'>
            <input
              checked={urlSafe}
              className='h-4 w-4 accent-accent'
              onChange={(e) => setUrlSafe(e.target.checked)}
              type='checkbox'
            />
            {t(locale, 'tool.base64.urlSafe')}
          </label>
        </div>

        {error && (
          <p className='mt-3 rounded-[10px] border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400'>
            {error}
          </p>
        )}

        {output && (
          <div className='mt-5'>
            <div className='mb-2 flex items-center justify-between'>
              <span className='text-sm font-semibold text-foreground'>
                {t(locale, 'tool.base64.result')}
              </span>
              <button
                className='rounded-[8px] border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
                onClick={handleCopy}
                type='button'
              >
                {t(locale, 'tool.wordCount.copy')}
              </button>
            </div>
            <div className='min-h-[120px] w-full rounded-[14px] border border-border bg-surface p-5 text-[15px] leading-relaxed text-foreground'>
              <pre className='whitespace-pre-wrap break-all font-mono text-sm'>
                {output}
              </pre>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}

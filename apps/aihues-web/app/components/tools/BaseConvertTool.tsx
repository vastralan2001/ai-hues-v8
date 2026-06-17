'use client';

import { useState } from 'react';

import { t, type Locale } from '@/lib/dict';

interface BaseConvertToolProps {
  locale: Locale;
}

const BASES = [
  { label: 'Binary', value: 2, prefix: '0b' },
  { label: 'Octal', value: 8, prefix: '0o' },
  { label: 'Decimal', value: 10, prefix: '' },
  { label: 'Hexadecimal', value: 16, prefix: '0x' },
];

export default function BaseConvertTool({ locale }: BaseConvertToolProps) {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(16);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  function convert() {
    setError('');
    setResult('');
    try {
      const trimmed = input.trim();
      if (!trimmed) return;
      const decimal = parseInt(trimmed, fromBase);
      if (isNaN(decimal)) {
        setError('Invalid number for selected base');
        return;
      }
      const base = BASES.find((b) => b.value === toBase);
      setResult((base?.prefix || '') + decimal.toString(toBase).toUpperCase());
    } catch {
      setError('Conversion error');
    }
  }

  function copy() {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className='mx-auto max-w-3xl px-6 py-12'>
      <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
        {t(locale, 'tool.baseConvert.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.baseConvert.desc')}
      </p>

      <div className='space-y-4'>
        <div>
          <label className='mb-2 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.baseConvert.input')}
          </label>
          <input
            className='h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
            onChange={(e) => setInput(e.target.value)}
            type='text'
            value={input}
          />
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          <div>
            <label className='mb-2 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.baseConvert.from')}
            </label>
            <select
              className='h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm text-foreground focus:border-accent focus:outline-none'
              onChange={(e) => setFromBase(parseInt(e.target.value))}
              value={fromBase}
            >
              {BASES.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label} ({b.value})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='mb-2 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.baseConvert.to')}
            </label>
            <select
              className='h-12 w-full rounded-lg border border-border bg-surface px-4 text-sm text-foreground focus:border-accent focus:outline-none'
              onChange={(e) => setToBase(parseInt(e.target.value))}
              value={toBase}
            >
              {BASES.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label} ({b.value})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          className='rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-light'
          onClick={convert}
          type='button'
        >
          {t(locale, 'tool.baseConvert.convert')}
        </button>

        {error && (
          <p className='rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400'>
            {error}
          </p>
        )}

        {result && (
          <div className='mt-2'>
            <div className='mb-2 flex items-center justify-between'>
              <span className='text-sm font-semibold text-foreground'>
                {t(locale, 'tool.baseConvert.result')}
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
            <div className='min-h-[60px] w-full rounded-2xl border border-border bg-surface p-5'>
              <pre className='whitespace-pre-wrap break-all font-mono text-sm text-foreground'>
                {result}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

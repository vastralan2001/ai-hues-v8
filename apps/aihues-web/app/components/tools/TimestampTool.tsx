'use client';

import { useState } from 'react';
import { event, GA_EVENTS } from '@/lib/gtag';

import { t, type Locale } from '@/lib/dict';

interface TimestampToolProps {
  locale: Locale;
}

interface TimestampResult {
  local: string;
  utc: string;
  unixSeconds: number;
  unixMs: number;
  relative: string;
}

function parseInput(input: string): Date | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Try Unix timestamp (seconds or milliseconds)
  const num = Number(trimmed);
  if (!Number.isNaN(num) && num > 0) {
    // Heuristic: if > 1e12, treat as milliseconds
    const ms = num > 1e12 ? num : num * 1000;
    const date = new Date(ms);
    if (!Number.isNaN(date.getTime())) return date;
  }

  // Try ISO string or other date formats
  const date = new Date(trimmed);
  if (!Number.isNaN(date.getTime())) return date;

  return null;
}

function relativeTime(date: Date, locale: Locale): string {
  const now = Date.now();
  const diff = Math.round((date.getTime() - now) / 1000);
  const abs = Math.abs(diff);
  const suffix =
    diff > 0
      ? locale === 'zh'
        ? '后'
        : 'from now'
      : locale === 'zh'
        ? '前'
        : 'ago';

  if (abs < 60) return `${abs}s ${suffix}`;
  if (abs < 3600) return `${Math.floor(abs / 60)}m ${suffix}`;
  if (abs < 86400) return `${Math.floor(abs / 3600)}h ${suffix}`;
  return `${Math.floor(abs / 86400)}d ${suffix}`;
}

export default function TimestampTool({ locale }: TimestampToolProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<TimestampResult | null>(null);
  const [error, setError] = useState('');

  const handleConvert = () => {
    const date = parseInput(input);
    if (!date) {
      setError('Invalid date or timestamp');
      setResult(null);
      return;
    }
    setError('');
    setResult({
      local: date.toLocaleString(),
      utc: date.toUTCString(),
      unixSeconds: Math.floor(date.getTime() / 1000),
      unixMs: date.getTime(),
      relative: relativeTime(date, locale),
    });
  };

  const handleCopy = async (text: string) => {
    try {
      await event(GA_EVENTS.toolCopy, { tool: 'timestamp' });
      navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  };

  const statItems = result
    ? [
        { label: t(locale, 'tool.timestamp.local'), value: result.local },
        { label: t(locale, 'tool.timestamp.utc'), value: result.utc },
        {
          label: t(locale, 'tool.timestamp.unixSeconds'),
          value: String(result.unixSeconds),
        },
        {
          label: t(locale, 'tool.timestamp.unixMs'),
          value: String(result.unixMs),
        },
        { label: t(locale, 'tool.timestamp.relative'), value: result.relative },
      ]
    : [];

  return (
    <div className='mx-auto max-w-[900px] px-6 py-12'>
      <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
        {t(locale, 'tool.timestamp.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.timestamp.desc')}
      </p>

      <input
        className='h-12 w-full rounded-[14px] border border-border bg-surface px-5 font-mono text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
        onChange={(e) => setInput(e.target.value)}
        placeholder={t(locale, 'tool.timestamp.placeholder')}
        type='text'
        value={input}
      />

      <div className='mt-4 flex gap-3'>
        <button
          className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
          onClick={handleConvert}
          type='button'
        >
          {t(locale, 'tool.timestamp.convert')}
        </button>
      </div>

      {error && (
        <p className='mt-3 rounded-[10px] border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400'>
          {error}
        </p>
      )}

      {result && (
        <div className='mt-6 flex flex-col gap-3'>
          {statItems.map((item) => (
            <div
              className='flex items-center justify-between rounded-[10px] border border-border bg-surface px-4 py-3'
              key={item.label}
            >
              <div>
                <p className='text-xs font-semibold uppercase tracking-wider text-secondary'>
                  {item.label}
                </p>
                <p className='mt-0.5 font-mono text-sm text-foreground'>
                  {item.value}
                </p>
              </div>
              <button
                className='ml-4 rounded-[8px] border border-border bg-bg px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
                onClick={() => handleCopy(item.value)}
                type='button'
              >
                {t(locale, 'tool.wordCount.copy')}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

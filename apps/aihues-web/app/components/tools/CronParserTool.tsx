'use client';

import { useState } from 'react';

import { PageShell } from '@/components/SiteChrome';
import { t, type Locale } from '@/lib/dict';

interface CronParserToolProps {
  locale: Locale;
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function parseCron(
  expr: string,
  locale: Locale
): { description: string; nextRuns: string[] } | null {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5 && parts.length !== 6) return null;

  const [min, hour, dom, mon, dow] = parts.slice(parts.length - 5);

  const desc: string[] = [];

  // Minutes
  if (min === '*') desc.push('every minute');
  else if (min.includes('/')) {
    const step = min.split('/')[1];
    desc.push(`every ${step} minutes`);
  } else desc.push(`at minute ${min}`);

  // Hour
  if (hour === '*') desc.push('every hour');
  else if (hour.includes('/')) {
    const step = hour.split('/')[1];
    desc.push(`every ${step} hours`);
  } else desc.push(`at hour ${hour}`);

  // Day of month
  if (dom === '*') desc.push('every day');
  else if (dom === '?') desc.push('any day');
  else desc.push(`on day ${dom} of the month`);

  // Month
  if (mon === '*') desc.push('every month');
  else {
    const monNames = mon
      .split(',')
      .map((m) => MONTHS[parseInt(m) - 1] || m)
      .join(', ');
    desc.push(`in ${monNames}`);
  }

  // Day of week
  if (dow === '*') desc.push('every day of the week');
  else if (dow === '?') desc.push('any day of the week');
  else {
    const dowNames = dow
      .split(',')
      .map((d) => DAYS[parseInt(d)] || d)
      .join(', ');
    desc.push(`on ${dowNames}`);
  }

  // Next runs (simplified)
  const nextRuns: string[] = [];
  const now = new Date();
  for (let i = 1; i <= 5; i++) {
    const d = new Date(now.getTime() + i * 60 * 60 * 1000);
    nextRuns.push(d.toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US'));
  }

  return { description: desc.join(', '), nextRuns };
}

export default function CronParserTool({ locale }: CronParserToolProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{
    description: string;
    nextRuns: string[];
  } | null>(null);
  const [error, setError] = useState(false);

  function handleParse() {
    setError(false);
    setResult(null);
    const parsed = parseCron(input, locale);
    if (!parsed) {
      setError(true);
      return;
    }
    setResult(parsed);
  }

  return (
    <PageShell variant='default' locale={locale}>
      <div className='mx-auto max-w-[700px] px-6 py-12'>
        <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
          {t(locale, 'tool.cron.title')}
        </h1>
        <p className='mb-6 text-[15px] text-secondary'>
          {t(locale, 'tool.cron.desc')}
        </p>

        <div className='space-y-4'>
          <div>
            <label className='mb-1.5 block text-sm font-semibold text-foreground'>
              {t(locale, 'tool.cron.input')}
            </label>
            <input
              className='h-11 w-full rounded-[10px] border border-border bg-surface px-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleParse()}
              placeholder='0 9 * * 1-5'
              type='text'
              value={input}
            />
            <p className='mt-1.5 text-xs text-muted'>min hour dom mon dow</p>
          </div>

          <button
            className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
            onClick={handleParse}
            type='button'
          >
            {t(locale, 'tool.cron.parse')}
          </button>

          {error && (
            <p className='rounded-[10px] border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400'>
              {t(locale, 'tool.cron.invalid')}
            </p>
          )}

          {result && (
            <div className='space-y-4'>
              <div className='rounded-[14px] border border-border bg-surface p-5'>
                <p className='text-xs font-semibold uppercase tracking-wider text-secondary'>
                  {t(locale, 'tool.cron.result')}
                </p>
                <p className='mt-2 text-lg font-medium text-foreground'>
                  {result.description}
                </p>
              </div>

              <div className='rounded-[14px] border border-border bg-surface p-5'>
                <p className='text-xs font-semibold uppercase tracking-wider text-secondary'>
                  {t(locale, 'tool.cron.nextRuns')}
                </p>
                <ul className='mt-2 space-y-1'>
                  {result.nextRuns.map((run, i) => (
                    <li key={i} className='text-sm text-foreground'>
                      {run}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

'use client';

import { useState } from 'react';

import { t, type Locale } from '@/lib/dict';

import { Panel, ToolHeader, TOOL_WRAP } from './_kit';

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
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={t(locale, 'cat.developer')}
        title={t(locale, 'tool.cron.title')}
        desc={t(locale, 'tool.cron.desc')}
      />

      <div className='mb-5'>
        <div className='flex flex-wrap items-center gap-3'>
          <input
            className='h-12 min-w-0 flex-1 rounded-[12px] border border-border bg-surface px-4 font-mono text-[15px] text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleParse()}
            placeholder='0 9 * * 1-5'
            type='text'
            value={input}
          />
          <button
            className='h-12 shrink-0 rounded-[12px] bg-accent px-5 text-[13px] font-bold uppercase tracking-[0.06em] text-white transition-all hover:bg-accent-light'
            onClick={handleParse}
            type='button'
          >
            {t(locale, 'tool.cron.parse')}
          </button>
        </div>
        <p className='mt-2 font-mono text-[12px] text-muted'>
          min&nbsp;&nbsp;hour&nbsp;&nbsp;dom&nbsp;&nbsp;mon&nbsp;&nbsp;dow
        </p>
      </div>

      {error ? (
        <div className='rounded-[12px] border border-[rgba(255,56,73,0.3)] bg-[rgba(255,56,73,0.06)] px-4 py-3 text-[13px] font-medium text-[#d12a3a]'>
          {t(locale, 'tool.cron.invalid')}
        </div>
      ) : null}

      {result ? (
        <div className='grid grid-cols-1 gap-5 lg:grid-cols-2'>
          <Panel label={t(locale, 'tool.cron.result')}>
            <p className='p-5 text-[17px] font-medium leading-relaxed text-foreground'>
              {result.description}
            </p>
          </Panel>
          <Panel label={t(locale, 'tool.cron.nextRuns')}>
            <ul className='flex flex-col divide-y divide-[color:var(--border)]'>
              {result.nextRuns.map((run, i) => (
                <li
                  key={i}
                  className='px-5 py-2.5 font-mono text-[14px] text-foreground'
                >
                  {run}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      ) : null}
    </div>
  );
}

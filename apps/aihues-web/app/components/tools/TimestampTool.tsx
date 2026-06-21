'use client';

import { useEffect, useMemo, useState } from 'react';

import { t, type Locale } from '@/lib/dict';

import { CopyButton, Panel, ToolHeader, TOOL_WRAP } from './_kit';

interface TimestampToolProps {
  locale: Locale;
}

function parseInput(input: string): Date | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const num = Number(trimmed);
  if (!Number.isNaN(num) && num > 0) {
    const ms = num > 1e12 ? num : num * 1000;
    const date = new Date(ms);
    if (!Number.isNaN(date.getTime())) return date;
  }
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

/** Format a Date as the value a datetime-local input expects (local time). */
function toLocalInput(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export default function TimestampTool({ locale }: TimestampToolProps) {
  const zh = locale === 'zh';
  const [input, setInput] = useState('');
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const raf = requestAnimationFrame(tick);
    const id = setInterval(tick, 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);

  const nowSeconds = now !== null ? Math.floor(now / 1000) : null;

  const { rows, invalid } = useMemo(() => {
    if (!input.trim()) return { rows: [], invalid: false };
    const date = parseInput(input);
    if (!date) return { rows: [], invalid: true };
    return {
      invalid: false,
      rows: [
        {
          label: t(locale, 'tool.timestamp.local'),
          value: date.toLocaleString(),
        },
        { label: t(locale, 'tool.timestamp.utc'), value: date.toUTCString() },
        { label: 'ISO 8601', value: date.toISOString() },
        {
          label: t(locale, 'tool.timestamp.unixSeconds'),
          value: String(Math.floor(date.getTime() / 1000)),
        },
        {
          label: t(locale, 'tool.timestamp.unixMs'),
          value: String(date.getTime()),
        },
        {
          label: t(locale, 'tool.timestamp.relative'),
          value: relativeTime(date, locale),
        },
      ],
    };
  }, [input, locale]);

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={t(locale, 'cat.developer')}
        title={t(locale, 'tool.timestamp.title')}
        desc={t(locale, 'tool.timestamp.desc')}
      />

      {/* Live current timestamp */}
      <div className='mb-6 flex items-center justify-between gap-4 rounded-[16px] border border-border bg-surface px-5 py-4'>
        <div className='min-w-0'>
          <div className='text-[11px] font-bold uppercase tracking-[0.14em] text-secondary'>
            {zh ? '当前 Unix 时间戳' : 'Current Unix time'}
          </div>
          <div className='mt-1 font-mono text-[30px] font-extrabold leading-none tabular-nums text-foreground'>
            {nowSeconds !== null ? nowSeconds : '—'}
          </div>
          <div className='mt-1.5 h-4 font-mono text-[12px] text-muted'>
            {now !== null
              ? `${now} ms · ${new Date(now).toLocaleString()}`
              : ''}
          </div>
        </div>
        <div className='flex shrink-0 items-center gap-2'>
          <CopyButton
            text={nowSeconds !== null ? String(nowSeconds) : ''}
            label={zh ? '复制秒' : 'Copy s'}
          />
          <button
            type='button'
            onClick={() =>
              setInput(String(nowSeconds ?? Math.floor(Date.now() / 1000)))
            }
            className='inline-flex h-8 items-center rounded-[8px] bg-accent px-3 text-[12px] font-semibold text-white transition-colors hover:bg-accent-light'
          >
            {zh ? '用作输入' : 'Use'}
          </button>
        </div>
      </div>

      {/* Input row */}
      <div className='mb-5 flex flex-wrap items-stretch gap-3'>
        <input
          className='h-12 min-w-0 flex-1 rounded-[12px] border border-border bg-surface px-4 font-mono text-[14px] text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
          onChange={(e) => setInput(e.target.value)}
          placeholder={t(locale, 'tool.timestamp.placeholder')}
          type='text'
          value={input}
        />
        <input
          aria-label={zh ? '选择日期时间' : 'Pick date & time'}
          className='h-12 shrink-0 rounded-[12px] border border-border bg-surface px-4 font-mono text-[13px] text-secondary focus:border-accent focus:outline-none'
          onChange={(e) => setInput(e.target.value ? e.target.value : '')}
          step='1'
          type='datetime-local'
        />
        <button
          type='button'
          onClick={() => setInput(toLocalInput(new Date()))}
          className='h-12 shrink-0 rounded-[12px] border border-border bg-bg px-4 text-[13px] font-semibold text-secondary transition-colors hover:border-accent hover:text-accent'
        >
          {zh ? '此刻' : 'Now'}
        </button>
      </div>

      {invalid ? (
        <div className='rounded-[12px] border border-[rgba(255,56,73,0.3)] bg-[rgba(255,56,73,0.06)] px-4 py-3 text-[13px] font-medium text-[#d12a3a]'>
          {zh ? '无效的日期或时间戳' : 'Invalid date or timestamp'}
        </div>
      ) : rows.length > 0 ? (
        <Panel>
          <div className='flex flex-col divide-y divide-[color:var(--border)]'>
            {rows.map((row) => (
              <div
                key={row.label}
                className='flex items-center justify-between gap-4 px-4 py-3.5'
              >
                <div className='min-w-0'>
                  <div className='text-[11px] font-bold uppercase tracking-[0.12em] text-secondary'>
                    {row.label}
                  </div>
                  <div className='mt-1 break-all font-mono text-[14px] text-foreground'>
                    {row.value}
                  </div>
                </div>
                <CopyButton text={row.value} />
              </div>
            ))}
          </div>
        </Panel>
      ) : (
        <div className='rounded-[16px] border border-dashed border-border bg-surface px-4 py-12 text-center text-[14px] text-muted'>
          {zh
            ? '输入 Unix 时间戳或日期，或点击上方“用作输入”'
            : 'Enter a Unix timestamp or date, or click “Use” above'}
        </div>
      )}
    </div>
  );
}

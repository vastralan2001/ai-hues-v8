'use client';

import { useMemo, useState } from 'react';

import { t, type Locale } from '@/lib/dict';

import { CopyButton, Panel, ToolGrid, ToolHeader, TOOL_WRAP } from './_kit';

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

  const { result, error, all } = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed)
      return { result: '', error: '', all: [] as { b: number; v: string }[] };
    const decimal = parseInt(trimmed, fromBase);
    if (isNaN(decimal)) {
      return { result: '', error: 'Invalid number for selected base', all: [] };
    }
    const base = BASES.find((b) => b.value === toBase);
    const result =
      (base?.prefix || '') + decimal.toString(toBase).toUpperCase();
    const all = BASES.map((b) => ({
      b: b.value,
      v: (b.prefix || '') + decimal.toString(b.value).toUpperCase(),
    }));
    return { result, error: '', all };
  }, [input, fromBase, toBase]);

  const select =
    'h-11 w-full rounded-[10px] border border-border bg-surface px-3 text-[14px] text-foreground focus:border-accent focus:outline-none';

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={t(locale, 'cat.developer')}
        title={t(locale, 'tool.baseConvert.title')}
        desc={t(locale, 'tool.baseConvert.desc')}
      />

      <ToolGrid>
        <Panel label={t(locale, 'tool.baseConvert.input')}>
          <div className='space-y-4 p-4'>
            <input
              className='h-12 w-full rounded-[10px] border border-border bg-bg px-4 font-mono text-[15px] text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
              onChange={(e) => setInput(e.target.value)}
              placeholder='e.g. 255'
              type='text'
              value={input}
            />
            <div className='grid grid-cols-2 gap-3'>
              <label className='block'>
                <span className='mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.1em] text-secondary'>
                  {t(locale, 'tool.baseConvert.from')}
                </span>
                <select
                  className={select}
                  onChange={(e) => setFromBase(parseInt(e.target.value))}
                  value={fromBase}
                >
                  {BASES.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label} ({b.value})
                    </option>
                  ))}
                </select>
              </label>
              <label className='block'>
                <span className='mb-1.5 block text-[12px] font-semibold uppercase tracking-[0.1em] text-secondary'>
                  {t(locale, 'tool.baseConvert.to')}
                </span>
                <select
                  className={select}
                  onChange={(e) => setToBase(parseInt(e.target.value))}
                  value={toBase}
                >
                  {BASES.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label} ({b.value})
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {error ? (
              <p className='text-[13px] font-medium text-[#ff3849]'>{error}</p>
            ) : null}
          </div>
        </Panel>

        <Panel
          label={t(locale, 'tool.baseConvert.result')}
          action={result ? <CopyButton text={result} /> : null}
        >
          <div className='p-4'>
            <div className='mb-4 break-all rounded-[10px] bg-bg p-4 font-mono text-[18px] font-bold text-accent'>
              {result || '—'}
            </div>
            {all.length > 0 ? (
              <div className='flex flex-col divide-y divide-[color:var(--border)]'>
                {all.map((a) => (
                  <div
                    key={a.b}
                    className='flex items-center justify-between gap-4 py-2.5'
                  >
                    <span className='text-[12px] font-semibold uppercase tracking-[0.1em] text-secondary'>
                      {BASES.find((b) => b.value === a.b)?.label}
                    </span>
                    <code className='break-all font-mono text-[14px] text-foreground'>
                      {a.v}
                    </code>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </Panel>
      </ToolGrid>
    </div>
  );
}

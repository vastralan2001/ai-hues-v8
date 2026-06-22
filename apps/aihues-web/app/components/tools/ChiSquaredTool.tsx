'use client';

import { useState } from 'react';

import { t, type Locale } from '@/lib/dict';

import { ToolHeader, TOOL_WRAP } from './_kit';

interface ChiSquaredToolProps {
  locale: Locale;
}

interface DataRow {
  id: number;
  observed: string;
  expected: string;
}

// Wilson-Hilferty transformation for chi-squared tail probability.
function approximatePValue(chi2: number, df: number): number {
  if (chi2 <= 0 || df <= 0) return 1;
  const z = Math.pow(chi2 / df, 1 / 3) - (1 - 2 / (9 * df));
  const denom = Math.sqrt(2 / (9 * df));
  const zScore = z / denom;
  const absZ = Math.abs(zScore);
  const p = absZ > 6 ? 0 : Math.exp(-0.717 * absZ - 0.416 * absZ * absZ);
  return Math.min(1, Math.max(0, p));
}

export default function ChiSquaredTool({ locale }: ChiSquaredToolProps) {
  const zh = locale === 'zh';
  const [rows, setRows] = useState<DataRow[]>([
    { id: 1, observed: '', expected: '' },
    { id: 2, observed: '', expected: '' },
    { id: 3, observed: '', expected: '' },
  ]);
  const [result, setResult] = useState<{
    chi2: number;
    df: number;
    pValue: number;
  } | null>(null);
  let nextId = 4;

  function addRow() {
    setRows([...rows, { id: nextId++, observed: '', expected: '' }]);
  }

  function removeRow(id: number) {
    if (rows.length <= 2) return;
    setRows(rows.filter((r) => r.id !== id));
  }

  function updateRow(
    id: number,
    field: 'observed' | 'expected',
    value: string
  ) {
    setRows(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  function calculate() {
    let chi2 = 0;
    let validRows = 0;
    for (const row of rows) {
      const o = parseFloat(row.observed);
      const e = parseFloat(row.expected);
      if (!isNaN(o) && !isNaN(e) && e > 0) {
        chi2 += Math.pow(o - e, 2) / e;
        validRows++;
      }
    }
    const df = Math.max(1, validRows - 1);
    const pValue = approximatePValue(chi2, df);
    setResult({ chi2, df, pValue });
  }

  const inputCls =
    'h-9 w-full rounded-[8px] border border-border bg-bg px-3 text-[14px] text-foreground focus:border-accent focus:outline-none';

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={zh ? '统计工具' : 'Statistics'}
        title={t(locale, 'tool.chiSquared.title')}
        desc={t(locale, 'tool.chiSquared.desc')}
      />

      <div className='overflow-hidden rounded-[16px] border border-border bg-surface'>
        <div className='grid grid-cols-[1fr_1fr_auto] border-b border-border bg-bg text-[11px] font-bold uppercase tracking-[0.12em] text-secondary'>
          <div className='px-4 py-2.5'>
            {t(locale, 'tool.chiSquared.observed')}
          </div>
          <div className='px-4 py-2.5'>
            {t(locale, 'tool.chiSquared.expected')}
          </div>
          <div className='w-16 px-4 py-2.5' />
        </div>
        {rows.map((row) => (
          <div
            className='grid grid-cols-[1fr_1fr_auto] items-center border-b border-border last:border-b-0'
            key={row.id}
          >
            <div className='px-3 py-2'>
              <input
                className={inputCls}
                onChange={(e) => updateRow(row.id, 'observed', e.target.value)}
                type='number'
                value={row.observed}
              />
            </div>
            <div className='px-3 py-2'>
              <input
                className={inputCls}
                onChange={(e) => updateRow(row.id, 'expected', e.target.value)}
                type='number'
                value={row.expected}
              />
            </div>
            <div className='flex w-16 items-center justify-center px-3 py-2'>
              {rows.length > 2 && (
                <button
                  className='text-[12px] font-semibold text-muted transition-colors hover:text-[#d12a3a]'
                  onClick={() => removeRow(row.id)}
                  type='button'
                >
                  {t(locale, 'tool.chiSquared.remove')}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className='mt-4 flex flex-wrap gap-3'>
        <button
          className='h-10 rounded-[10px] border border-border bg-surface px-5 text-[14px] font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
          onClick={addRow}
          type='button'
        >
          {t(locale, 'tool.chiSquared.addRow')}
        </button>
        <button
          className='h-10 rounded-[10px] bg-accent px-5 text-[14px] font-semibold text-white transition-colors hover:bg-accent-light'
          onClick={calculate}
          type='button'
        >
          {t(locale, 'tool.chiSquared.calculate')}
        </button>
      </div>

      {result && (
        <div className='mt-6 grid gap-3 sm:grid-cols-3'>
          {[
            {
              label: t(locale, 'tool.chiSquared.statistic'),
              value: result.chi2.toFixed(4),
            },
            {
              label: t(locale, 'tool.chiSquared.df'),
              value: String(result.df),
            },
            {
              label: t(locale, 'tool.chiSquared.pValue'),
              value:
                result.pValue < 0.0001 ? '< 0.0001' : result.pValue.toFixed(4),
            },
          ].map((stat) => (
            <div
              className='rounded-[14px] border border-border bg-surface p-4 text-center'
              key={stat.label}
            >
              <p className='text-[11px] font-bold uppercase tracking-[0.12em] text-secondary'>
                {stat.label}
              </p>
              <p className='mt-1.5 font-mono text-[26px] font-extrabold text-accent'>
                {stat.value}
              </p>
            </div>
          ))}
          <div
            className={`rounded-[14px] border p-4 text-center sm:col-span-3 ${
              result.pValue < 0.05
                ? 'border-[rgba(22,163,74,0.3)] bg-[rgba(22,163,74,0.08)] text-[#15803d]'
                : 'border-border bg-bg text-secondary'
            }`}
          >
            <p className='text-[14px] font-semibold'>
              {result.pValue < 0.05
                ? t(locale, 'tool.chiSquared.significant')
                : t(locale, 'tool.chiSquared.notSignificant')}{' '}
              (p {'<'} 0.05)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

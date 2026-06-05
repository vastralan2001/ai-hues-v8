'use client';

import { useState } from 'react';

import { t, type Locale } from '@/lib/dict';

interface ChiSquaredToolProps {
  locale: Locale;
}

interface DataRow {
  id: number;
  observed: string;
  expected: string;
}

// Simplified p-value approximation using chi-squared CDF
// Using Wilson-Hilferty transformation for approximation
function approximatePValue(chi2: number, df: number): number {
  if (chi2 <= 0 || df <= 0) return 1;
  // Wilson-Hilferty: (chi2/df)^(1/3) ~ N(1 - 2/(9df), 2/(9df))
  const z = Math.pow(chi2 / df, 1 / 3) - (1 - 2 / (9 * df));
  const denom = Math.sqrt(2 / (9 * df));
  const zScore = z / denom;
  // Approximate standard normal tail probability
  const absZ = Math.abs(zScore);
  const p = absZ > 6 ? 0 : Math.exp(-0.717 * absZ - 0.416 * absZ * absZ);
  return Math.min(1, Math.max(0, p));
}

export default function ChiSquaredTool({ locale }: ChiSquaredToolProps) {
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

  return (
    <div className='mx-auto max-w-[700px] px-6 py-12'>
      <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
        {t(locale, 'tool.chiSquared.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.chiSquared.desc')}
      </p>

      <div className='space-y-4'>
        <div className='rounded-[14px] border border-border bg-surface overflow-hidden'>
          <div className='grid grid-cols-[1fr_1fr_auto] border-b border-border bg-gray-50 dark:bg-gray-900 text-xs font-semibold text-secondary'>
            <div className='px-4 py-2'>
              {t(locale, 'tool.chiSquared.observed')}
            </div>
            <div className='px-4 py-2'>
              {t(locale, 'tool.chiSquared.expected')}
            </div>
            <div className='px-4 py-2'></div>
          </div>
          {rows.map((row) => (
            <div
              key={row.id}
              className='grid grid-cols-[1fr_1fr_auto] border-b border-border last:border-b-0'
            >
              <div className='px-2 py-2'>
                <input
                  className='h-9 w-full rounded-[8px] border border-border bg-white dark:bg-gray-900 px-3 text-sm text-foreground focus:border-accent focus:outline-none'
                  onChange={(e) =>
                    updateRow(row.id, 'observed', e.target.value)
                  }
                  type='number'
                  value={row.observed}
                />
              </div>
              <div className='px-2 py-2'>
                <input
                  className='h-9 w-full rounded-[8px] border border-border bg-white dark:bg-gray-900 px-3 text-sm text-foreground focus:border-accent focus:outline-none'
                  onChange={(e) =>
                    updateRow(row.id, 'expected', e.target.value)
                  }
                  type='number'
                  value={row.expected}
                />
              </div>
              <div className='flex items-center px-2 py-2'>
                {rows.length > 2 && (
                  <button
                    className='text-xs text-red-500 hover:text-red-600'
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

        <button
          className='rounded-[10px] border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent hover:text-accent'
          onClick={addRow}
          type='button'
        >
          {t(locale, 'tool.chiSquared.addRow')}
        </button>

        <button
          className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
          onClick={calculate}
          type='button'
        >
          {t(locale, 'tool.chiSquared.calculate')}
        </button>

        {result && (
          <div className='grid gap-3 sm:grid-cols-3'>
            <div className='rounded-[14px] border border-border bg-surface p-4 text-center'>
              <p className='text-xs font-semibold uppercase tracking-wider text-secondary'>
                {t(locale, 'tool.chiSquared.statistic')}
              </p>
              <p className='mt-1 text-2xl font-extrabold text-accent'>
                {result.chi2.toFixed(4)}
              </p>
            </div>
            <div className='rounded-[14px] border border-border bg-surface p-4 text-center'>
              <p className='text-xs font-semibold uppercase tracking-wider text-secondary'>
                {t(locale, 'tool.chiSquared.df')}
              </p>
              <p className='mt-1 text-2xl font-extrabold text-accent'>
                {result.df}
              </p>
            </div>
            <div className='rounded-[14px] border border-border bg-surface p-4 text-center'>
              <p className='text-xs font-semibold uppercase tracking-wider text-secondary'>
                {t(locale, 'tool.chiSquared.pValue')}
              </p>
              <p className='mt-1 text-2xl font-extrabold text-accent'>
                {result.pValue < 0.0001 ? '< 0.0001' : result.pValue.toFixed(4)}
              </p>
            </div>
            <div
              className={`sm:col-span-3 rounded-[14px] border p-4 text-center ${
                result.pValue < 0.05
                  ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30'
                  : 'border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30'
              }`}
            >
              <p className='text-sm font-semibold'>
                {result.pValue < 0.05
                  ? t(locale, 'tool.chiSquared.significant')
                  : t(locale, 'tool.chiSquared.notSignificant')}{' '}
                (p {'<'} 0.05)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

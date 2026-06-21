'use client';

import { useState } from 'react';

import { t, type Locale } from '@/lib/dict';

interface DiffProToolProps {
  locale: Locale;
}

type DiffLine = {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
  leftNum?: number;
  rightNum?: number;
};

function computeDiff(left: string, right: string): DiffLine[] {
  const leftLines = left.split('\n');
  const rightLines = right.split('\n');
  const result: DiffLine[] = [];

  let i = 0;
  let j = 0;
  let leftNum = 1;
  let rightNum = 1;

  while (i < leftLines.length || j < rightLines.length) {
    const l = leftLines[i];
    const r = rightLines[j];

    if (i < leftLines.length && j < rightLines.length && l === r) {
      result.push({ type: 'unchanged', text: l, leftNum, rightNum });
      i++;
      j++;
      leftNum++;
      rightNum++;
    } else if (
      j < rightLines.length &&
      (i >= leftLines.length || leftLines.indexOf(r, i) === -1)
    ) {
      result.push({ type: 'added', text: r, rightNum });
      j++;
      rightNum++;
    } else if (
      i < leftLines.length &&
      (j >= rightLines.length || rightLines.indexOf(l, j) === -1)
    ) {
      result.push({ type: 'removed', text: l, leftNum });
      i++;
      leftNum++;
    } else {
      // Both differ but exist in the other - treat as removed then added
      result.push({ type: 'removed', text: l, leftNum });
      result.push({ type: 'added', text: r, rightNum });
      i++;
      j++;
      leftNum++;
      rightNum++;
    }
  }

  return result;
}

export default function DiffProTool({ locale }: DiffProToolProps) {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [diff, setDiff] = useState<DiffLine[]>([]);

  function handleCompare() {
    setDiff(computeDiff(left, right));
  }

  const stats = {
    added: diff.filter((d) => d.type === 'added').length,
    removed: diff.filter((d) => d.type === 'removed').length,
    unchanged: diff.filter((d) => d.type === 'unchanged').length,
  };

  return (
    <div className='max-w-[900px] py-10'>
      <h1 className='mb-2 text-[clamp(28px,3.4vw,40px)] font-extrabold tracking-[-0.02em] text-foreground'>
        {t(locale, 'tool.diffPro.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.diffPro.desc')}
      </p>

      <div className='grid gap-4 sm:grid-cols-2'>
        <div>
          <label className='mb-1.5 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.diffPro.left')}
          </label>
          <textarea
            className='h-[200px] w-full resize-none rounded-[10px] border border-border bg-surface p-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
            onChange={(e) => setLeft(e.target.value)}
            value={left}
          />
        </div>
        <div>
          <label className='mb-1.5 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.diffPro.right')}
          </label>
          <textarea
            className='h-[200px] w-full resize-none rounded-[10px] border border-border bg-surface p-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
            onChange={(e) => setRight(e.target.value)}
            value={right}
          />
        </div>
      </div>

      <button
        className='mt-4 rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
        onClick={handleCompare}
        type='button'
      >
        {t(locale, 'tool.diffPro.compare')}
      </button>

      {diff.length > 0 && (
        <div className='mt-6 space-y-4'>
          <div className='flex gap-4 text-xs'>
            <span className='text-green-600 dark:text-green-400'>
              {t(locale, 'tool.diffPro.added')}: {stats.added}
            </span>
            <span className='text-red-600 dark:text-red-400'>
              {t(locale, 'tool.diffPro.removed')}: {stats.removed}
            </span>
            <span className='text-muted'>
              {t(locale, 'tool.diffPro.unchanged')}: {stats.unchanged}
            </span>
          </div>

          <div className='rounded-[14px] border border-border bg-surface overflow-hidden'>
            <div className='grid grid-cols-[40px_40px_1fr] border-b border-border bg-gray-50 dark:bg-gray-900 text-xs font-semibold text-secondary'>
              <div className='px-2 py-2 text-right'>-</div>
              <div className='px-2 py-2 text-right'>+</div>
              <div className='px-3 py-2'></div>
            </div>
            {diff.map((line, i) => (
              <div
                key={i}
                className={`grid grid-cols-[40px_40px_1fr] text-sm font-mono ${
                  line.type === 'added'
                    ? 'bg-green-50 dark:bg-green-950/20'
                    : line.type === 'removed'
                      ? 'bg-red-50 dark:bg-red-950/20'
                      : ''
                }`}
              >
                <div className='px-2 py-1 text-right text-muted border-r border-border'>
                  {line.leftNum || ''}
                </div>
                <div className='px-2 py-1 text-right text-muted border-r border-border'>
                  {line.rightNum || ''}
                </div>
                <div
                  className={`px-3 py-1 ${
                    line.type === 'added'
                      ? 'text-green-700 dark:text-green-400'
                      : line.type === 'removed'
                        ? 'text-red-700 dark:text-red-400'
                        : 'text-foreground'
                  }`}
                >
                  {line.type === 'added'
                    ? '+'
                    : line.type === 'removed'
                      ? '-'
                      : ' '}{' '}
                  {line.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

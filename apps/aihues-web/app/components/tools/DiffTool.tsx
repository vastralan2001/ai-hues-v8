'use client';

import { useState } from 'react';

import { t, type Locale } from '@/lib/dict';

interface DiffToolProps {
  locale: Locale;
}

type DiffLine =
  | { type: 'same'; text: string }
  | { type: 'removed'; text: string }
  | { type: 'added'; text: string };

function computeDiff(a: string, b: string): DiffLine[] {
  const linesA = a.split('\n');
  const linesB = b.split('\n');
  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;

  while (i < linesA.length || j < linesB.length) {
    if (i >= linesA.length) {
      result.push({ type: 'added', text: linesB[j] });
      j++;
    } else if (j >= linesB.length) {
      result.push({ type: 'removed', text: linesA[i] });
      i++;
    } else if (linesA[i] === linesB[j]) {
      result.push({ type: 'same', text: linesA[i] });
      i++;
      j++;
    } else {
      // Simple heuristic: check if next line in B matches current A
      const nextBMatch = j + 1 < linesB.length && linesA[i] === linesB[j + 1];
      const nextAMatch = i + 1 < linesA.length && linesA[i + 1] === linesB[j];

      if (nextBMatch && !nextAMatch) {
        result.push({ type: 'added', text: linesB[j] });
        j++;
      } else if (nextAMatch && !nextBMatch) {
        result.push({ type: 'removed', text: linesA[i] });
        i++;
      } else {
        result.push({ type: 'removed', text: linesA[i] });
        result.push({ type: 'added', text: linesB[j] });
        i++;
        j++;
      }
    }
  }

  return result;
}

export default function DiffTool({ locale }: DiffToolProps) {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [diff, setDiff] = useState<DiffLine[]>([]);

  const handleCompare = () => {
    setDiff(computeDiff(textA, textB));
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  };

  const addedLines = diff.filter((d) => d.type === 'added').length;
  const removedLines = diff.filter((d) => d.type === 'removed').length;

  return (
    <div className='mx-auto max-w-[1100px] px-6 py-12'>
      <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
        {t(locale, 'tool.diff.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.diff.desc')}
      </p>

      <div className='mb-4 grid gap-4 sm:grid-cols-2'>
        <div>
          <label className='mb-1.5 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.diff.textA')}
          </label>
          <textarea
            className='h-[200px] w-full resize-none rounded-[10px] border border-border bg-surface p-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
            onChange={(e) => setTextA(e.target.value)}
            value={textA}
          />
        </div>
        <div>
          <label className='mb-1.5 block text-sm font-semibold text-foreground'>
            {t(locale, 'tool.diff.textB')}
          </label>
          <textarea
            className='h-[200px] w-full resize-none rounded-[10px] border border-border bg-surface p-4 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none'
            onChange={(e) => setTextB(e.target.value)}
            value={textB}
          />
        </div>
      </div>

      <button
        className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
        onClick={handleCompare}
        type='button'
      >
        {t(locale, 'tool.diff.compare')}
      </button>

      {diff.length > 0 && (
        <div className='mt-6'>
          <div className='mb-3 flex gap-4 text-xs font-semibold'>
            <span className='text-secondary'>
              {t(locale, 'tool.diff.unchanged')}:{' '}
              {diff.filter((d) => d.type === 'same').length}
            </span>
            <span className='text-red-500'>
              {t(locale, 'tool.diff.removed')}: {removedLines}
            </span>
            <span className='text-green-500'>
              {t(locale, 'tool.diff.added')}: {addedLines}
            </span>
          </div>

          <div className='rounded-[14px] border border-border bg-surface overflow-hidden'>
            <div className='max-h-[500px] overflow-auto'>
              {diff.map((line, i) => (
                <div
                  className={`flex items-start gap-2 px-4 py-1.5 font-mono text-sm ${
                    line.type === 'removed'
                      ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                      : line.type === 'added'
                        ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                        : 'text-foreground'
                  }`}
                  key={i}
                >
                  <span className='w-6 shrink-0 text-center text-xs text-muted select-none'>
                    {line.type === 'removed'
                      ? '-'
                      : line.type === 'added'
                        ? '+'
                        : ' '}
                  </span>
                  <span className='break-all'>{line.text || ' '}</span>
                </div>
              ))}
            </div>
          </div>

          <div className='mt-3 flex gap-3'>
            <button
              className='rounded-[8px] border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
              onClick={() =>
                handleCopy(
                  diff
                    .filter((d) => d.type !== 'removed')
                    .map((d) => d.text)
                    .join('\n')
                )
              }
              type='button'
            >
              {t(locale, 'tool.diff.copy')} B
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

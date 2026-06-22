'use client';

import { useMemo, useState } from 'react';

import { t, type Locale } from '@/lib/dict';

import { CopyButton, Panel, ToolGrid, ToolHeader, TOOL_WRAP } from './_kit';

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

  const diff = useMemo(() => {
    if (!textA && !textB) return [];
    return computeDiff(textA, textB);
  }, [textA, textB]);

  const added = diff.filter((d) => d.type === 'added').length;
  const removed = diff.filter((d) => d.type === 'removed').length;
  const same = diff.filter((d) => d.type === 'same').length;

  const ta =
    'min-h-[240px] w-full flex-1 resize-y border-0 bg-transparent p-4 font-mono text-[13px] leading-relaxed text-foreground outline-none placeholder:text-muted';

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={t(locale, 'cat.utility')}
        title={t(locale, 'tool.diff.title')}
        desc={t(locale, 'tool.diff.desc')}
      />

      <ToolGrid>
        <Panel label={t(locale, 'tool.diff.textA')} accent='#ff3849'>
          <textarea
            className={ta}
            onChange={(e) => setTextA(e.target.value)}
            value={textA}
            spellCheck={false}
          />
        </Panel>
        <Panel label={t(locale, 'tool.diff.textB')} accent='#16c456'>
          <textarea
            className={ta}
            onChange={(e) => setTextB(e.target.value)}
            value={textB}
            spellCheck={false}
          />
        </Panel>
      </ToolGrid>

      {diff.length > 0 ? (
        <div className='mt-5'>
          <Panel
            label={locale === 'zh' ? '差异' : 'Diff'}
            hint={`+${added} · -${removed} · =${same}`}
            action={
              <CopyButton
                text={diff
                  .filter((d) => d.type !== 'removed')
                  .map((d) => d.text)
                  .join('\n')}
                label={`${t(locale, 'tool.diff.copy')} B`}
              />
            }
          >
            <div className='max-h-[460px] overflow-auto'>
              {diff.map((line, i) => (
                <div
                  className={`flex items-start gap-2 px-4 py-1 font-mono text-[13px] ${
                    line.type === 'removed'
                      ? 'bg-[rgba(255,56,73,0.08)] text-[#c4283a]'
                      : line.type === 'added'
                        ? 'bg-[rgba(22,196,86,0.08)] text-[#138a3e]'
                        : 'text-foreground'
                  }`}
                  key={i}
                >
                  <span className='w-5 shrink-0 select-none text-center text-muted'>
                    {line.type === 'removed'
                      ? '−'
                      : line.type === 'added'
                        ? '+'
                        : ''}
                  </span>
                  <span className='break-all'>{line.text || ' '}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      ) : null}
    </div>
  );
}

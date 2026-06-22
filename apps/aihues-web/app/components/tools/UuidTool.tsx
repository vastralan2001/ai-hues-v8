'use client';

import { useCallback, useState } from 'react';

import { t, type Locale } from '@/lib/dict';

import { CopyButton, Panel, ToolHeader, TOOL_WRAP } from './_kit';

interface UuidToolProps {
  locale: Locale;
}

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function UuidTool({ locale }: UuidToolProps) {
  const [history, setHistory] = useState<string[]>([]);

  const generate = useCallback((count: number) => {
    const newUUIDs = Array.from({ length: count }, generateUUID);
    setHistory((prev) => [...newUUIDs, ...prev].slice(0, 20));
  }, []);

  const copyOne = async (uuid: string) => {
    try {
      await navigator.clipboard.writeText(uuid);
    } catch {
      /* ignore */
    }
  };

  const secondaryBtn =
    'h-10 rounded-[10px] border border-border bg-bg px-4 text-[13px] font-semibold text-secondary transition-colors hover:border-accent hover:text-accent';

  return (
    <div className={TOOL_WRAP}>
      <ToolHeader
        eyebrow={t(locale, 'cat.developer')}
        title={t(locale, 'tool.uuid.title')}
        desc={t(locale, 'tool.uuid.desc')}
      />

      <div className='mb-6 flex flex-wrap gap-3'>
        <button
          type='button'
          data-testid='uuid-generate'
          onClick={() => generate(1)}
          className='h-10 rounded-[10px] bg-accent px-5 text-[13px] font-bold uppercase tracking-[0.06em] text-white transition-all hover:bg-accent-light'
        >
          {t(locale, 'tool.uuid.generate')}
        </button>
        <button
          type='button'
          onClick={() => generate(5)}
          className={secondaryBtn}
        >
          {t(locale, 'tool.uuid.generate5')}
        </button>
        <button
          type='button'
          onClick={() => generate(10)}
          className={secondaryBtn}
        >
          {t(locale, 'tool.uuid.generate10')}
        </button>
        {history.length > 0 ? (
          <CopyButton
            text={history.join('\n')}
            label={t(locale, 'tool.uuid.copyAll')}
            className='h-10 px-4 text-[13px]'
          />
        ) : null}
      </div>

      {history.length > 0 ? (
        <Panel label={t(locale, 'tool.uuid.history')}>
          <div className='flex flex-col divide-y divide-[color:var(--border)]'>
            {history.map((uuid, index) => (
              <div
                key={`${uuid}-${index}`}
                className='flex items-center justify-between gap-4 px-4 py-3'
              >
                <code
                  className='font-mono text-[14px] text-foreground'
                  data-testid='uuid-item'
                >
                  {uuid}
                </code>
                <button
                  type='button'
                  onClick={() => copyOne(uuid)}
                  className='shrink-0 rounded-[8px] border border-border bg-bg px-3 py-1 text-[12px] font-semibold text-secondary transition-colors hover:border-accent hover:text-accent'
                >
                  {t(locale, 'tool.uuid.copy')}
                </button>
              </div>
            ))}
          </div>
        </Panel>
      ) : (
        <div className='rounded-[16px] border border-dashed border-border bg-surface px-4 py-12 text-center text-[14px] text-muted'>
          {locale === 'zh'
            ? '点击上方按钮生成 UUID'
            : 'Generate UUIDs with the buttons above'}
        </div>
      )}
    </div>
  );
}

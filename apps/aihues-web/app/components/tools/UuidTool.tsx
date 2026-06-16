'use client';

import { useCallback, useState } from 'react';

import { t, type Locale } from '@/lib/dict';

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
      // ignore
    }
  };

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(history.join('\n'));
    } catch {
      // ignore
    }
  };

  return (
    <div className='mx-auto max-w-[800px] px-6 py-12'>
      <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
        {t(locale, 'tool.uuid.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.uuid.desc')}
      </p>

      <div className='flex flex-wrap gap-3'>
        <button
          className='rounded-[10px] bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
          data-testid='uuid-generate'
          onClick={() => generate(1)}
          type='button'
        >
          {t(locale, 'tool.uuid.generate')}
        </button>
        <button
          className='rounded-[10px] border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
          onClick={() => generate(5)}
          type='button'
        >
          {t(locale, 'tool.uuid.generate5')}
        </button>
        <button
          className='rounded-[10px] border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
          onClick={() => generate(10)}
          type='button'
        >
          {t(locale, 'tool.uuid.generate10')}
        </button>
        {history.length > 0 && (
          <button
            className='rounded-[10px] border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
            onClick={copyAll}
            type='button'
          >
            {t(locale, 'tool.uuid.copyAll')}
          </button>
        )}
      </div>

      {history.length > 0 && (
        <div className='mt-6'>
          <h2 className='mb-3 text-sm font-semibold text-foreground'>
            {t(locale, 'tool.uuid.history')}
          </h2>
          <div className='flex flex-col gap-2'>
            {history.map((uuid, index) => (
              <div
                key={`${uuid}-${index}`}
                className='flex items-center justify-between rounded-[10px] border border-border bg-surface px-4 py-3'
              >
                <code
                  className='font-mono text-sm text-foreground'
                  data-testid='uuid-item'
                >
                  {uuid}
                </code>
                <button
                  className='ml-4 rounded-[8px] border border-border bg-bg px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
                  onClick={() => copyOne(uuid)}
                  type='button'
                >
                  {t(locale, 'tool.uuid.copy')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

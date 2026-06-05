'use client';

import { useMemo, useState } from 'react';

import { t, type Locale } from '@/lib/dict';

interface CodeReviewToolProps {
  locale: Locale;
}

const ITEM_KEYS = [
  'itemQuality1',
  'itemQuality2',
  'itemQuality3',
  'itemQuality4',
  'itemQuality5',
  'itemSecurity1',
  'itemSecurity2',
  'itemSecurity3',
  'itemPerformance1',
  'itemPerformance2',
  'itemPerformance3',
  'itemMaintainability1',
  'itemMaintainability2',
  'itemMaintainability3',
  'itemMaintainability4',
];

const CATEGORIES = [
  {
    key: 'quality',
    items: [
      'itemQuality1',
      'itemQuality2',
      'itemQuality3',
      'itemQuality4',
      'itemQuality5',
    ],
  },
  {
    key: 'security',
    items: ['itemSecurity1', 'itemSecurity2', 'itemSecurity3'],
  },
  {
    key: 'performance',
    items: ['itemPerformance1', 'itemPerformance2', 'itemPerformance3'],
  },
  {
    key: 'maintainability',
    items: [
      'itemMaintainability1',
      'itemMaintainability2',
      'itemMaintainability3',
      'itemMaintainability4',
    ],
  },
];

export default function CodeReviewTool({ locale }: CodeReviewToolProps) {
  const [items, setItems] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const key of ITEM_KEYS) {
      init[key] = false;
    }
    return init;
  });

  const toggleItem = (key: string) => {
    setItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const checkedCount = useMemo(
    () => Object.values(items).filter(Boolean).length,
    [items]
  );
  const total = ITEM_KEYS.length;
  const progress = Math.round((checkedCount / total) * 100);

  return (
    <div className='mx-auto max-w-[800px] px-6 py-12'>
      <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
        {t(locale, 'tool.codeReview.title')}
      </h1>
      <p className='mb-6 text-[15px] text-secondary'>
        {t(locale, 'tool.codeReview.desc')}
      </p>

      {/* Progress bar */}
      <div className='mb-8 rounded-[14px] border border-border bg-surface p-4'>
        <div className='mb-2 flex items-center justify-between text-sm'>
          <span className='font-semibold text-foreground'>
            {t(locale, 'tool.codeReview.progress')}
          </span>
          <span className='font-bold text-accent'>
            {checkedCount}/{total} ({progress}%)
          </span>
        </div>
        <div className='h-3 w-full overflow-hidden rounded-full bg-border'>
          <div
            className='h-full rounded-full bg-accent transition-all duration-300'
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Categories */}
      <div className='flex flex-col gap-6'>
        {CATEGORIES.map((cat) => (
          <div
            className='rounded-[14px] border border-border bg-surface p-5'
            key={cat.key}
          >
            <h2 className='mb-4 text-lg font-bold text-foreground'>
              {t(locale, `tool.codeReview.${cat.key}`)}
            </h2>
            <div className='flex flex-col gap-3'>
              {cat.items.map((itemKey) => (
                <label
                  className='flex cursor-pointer items-start gap-3 text-sm text-foreground'
                  key={itemKey}
                >
                  <input
                    checked={items[itemKey]}
                    className='mt-0.5 h-4 w-4 accent-accent'
                    onChange={() => toggleItem(itemKey)}
                    type='checkbox'
                  />
                  <span
                    className={
                      items[itemKey] ? 'text-secondary line-through' : ''
                    }
                  >
                    {t(locale, `tool.codeReview.${itemKey}`)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

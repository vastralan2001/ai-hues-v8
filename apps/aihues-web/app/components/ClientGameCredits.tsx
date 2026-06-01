'use client';

import { useState } from 'react';
import { t, type Locale } from '@/lib/dict';

export function ClientGameCredits({ locale }: { locale: Locale }) {
  // TODO(上线前): 替换为后端 API 读取真实积分
  const [credits] = useState<number | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('aihues-credits');
    return stored ? parseInt(stored, 10) : 0;
  });

  return (
    <div className='mt-4 inline-flex items-center gap-3 rounded-full border border-border bg-bg px-5 py-2.5 text-sm font-semibold text-foreground shadow-[0_1px_3px_rgba(0,0,0,0.04)]'>
      <span className='text-lg'>🪙</span>
      <span>{t(locale, 'credit.yourCredits')}</span>
      <span className='rounded-full bg-accent px-3 py-0.5 text-sm font-bold text-white'>
        {credits === null ? '—' : credits}
      </span>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { t, type Locale } from '@/lib/dict';

export function GameCreditBadge({ locale }: { locale: Locale }) {
  // TODO(上线前): 替换为后端 API 读取真实积分
  const [credits] = useState<number | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('aihues-credits');
    if (stored) return parseInt(stored, 10);
    localStorage.setItem('aihues-credits', '100');
    return 100;
  });

  return (
    <div className='flex items-center gap-2 rounded-full border border-border bg-bg px-4 py-2 text-[13px] font-semibold text-foreground shadow-[0_1px_3px_rgba(0,0,0,0.04)]'>
      <span className='text-[16px]'>🪙</span>
      <span>{t(locale, 'section.creditBalance')}</span>
      <span className='rounded-full bg-accent px-2.5 py-0.5 text-white'>
        {credits === null ? '—' : credits}
      </span>
    </div>
  );
}

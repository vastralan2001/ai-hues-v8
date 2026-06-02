'use client';

import { useState } from 'react';

export function CreditDisplay() {
  // TODO(上线前): 替换为后端 API 读取真实积分（/api/v1/user/credits）
  const [credits] = useState<number | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('aihues-credits');
    if (stored) return parseInt(stored, 10);
    localStorage.setItem('aihues-credits', '100');
    return 100;
  });

  return (
    <div className='flex items-center gap-1.5 rounded-full border border-border bg-bg px-3 py-1.5 text-[13px] font-semibold text-foreground'>
      <span className='text-[16px]'>🪙</span>
      <span>{credits === null ? '—' : credits}</span>
    </div>
  );
}

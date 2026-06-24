'use client';

import { useEffect, useReducer } from 'react';

import { BrandWord } from '@/components/Logo';
import { HERO_SLOGAN_LINES } from '@/lib/category-brand';

export default function HeroSloganRotator({
  locale = 'en',
}: {
  locale?: 'en' | 'zh';
}) {
  const [idx, next] = useReducer(
    (i: number) => (i + 1) % HERO_SLOGAN_LINES.length,
    0
  );

  useEffect(() => {
    const t = setInterval(next, 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className='relative h-[2em] overflow-hidden'>
      {HERO_SLOGAN_LINES.map((line, i) => (
        <p
          key={line.cat}
          className='absolute inset-0 m-0 text-[19px] font-semibold leading-[2em] text-foreground'
          style={{
            opacity: i === idx ? 1 : 0,
            transition: 'opacity 700ms ease',
            pointerEvents: i === idx ? 'auto' : 'none',
          }}
        >
          <BrandWord>{locale === 'zh' ? line.zh : line.en}</BrandWord>
        </p>
      ))}
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

export type SpotlightSlide = {
  eyebrow: string;
  title: string;
  description: string;
  metrics?: string;
  href: string;
  cta: string;
};

const EASE = 'cubic-bezier(0.77, 0, 0.175, 1)';

export default function SpotlightCarousel({
  slides,
  compact = false,
  onIndexChange,
}: {
  slides: SpotlightSlide[];
  compact?: boolean;
  onIndexChange?: (i: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => {
    onIndexChange?.(index);
  }, [index, onIndexChange]);

  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count]
  );

  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (paused || count <= 1) return;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), 5200);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, count]);

  return (
    <div
      className='relative'
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Viewport */}
      <div
        className={`overflow-hidden rounded-[24px] ${
          compact ? '' : 'border border-border bg-surface'
        }`}
      >
        <div
          className='flex'
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: `transform 600ms ${EASE}`,
          }}
        >
          {slides.map((s, i) => (
            <div key={s.href + i} className='w-full shrink-0'>
              {compact ? (
                <div className='relative flex min-h-[430px] flex-col justify-center px-1 py-6'>
                  <div className='relative'>
                    <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent backdrop-blur-md'>
                      {s.eyebrow}
                    </div>
                    <h3 className='mb-3 text-[28px] font-extrabold leading-[1.12] tracking-[-0.02em] text-foreground'>
                      {s.title}
                    </h3>
                    <p className='mb-5 max-w-[400px] text-[15px] leading-relaxed text-secondary'>
                      {s.description}
                    </p>
                    {s.metrics ? (
                      <p className='mb-7 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted'>
                        {s.metrics}
                      </p>
                    ) : null}
                    <Link className='btn-cta btn-cta--sm' href={s.href}>
                      {s.cta}
                    </Link>
                  </div>
                </div>
              ) : (
                <div className='grid grid-cols-1 items-center gap-8 p-10 md:grid-cols-[1.1fr_0.9fr] md:p-14'>
                  {/* Text */}
                  <div>
                    <div className='mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent backdrop-blur-md'>
                      {s.eyebrow}
                    </div>
                    <h3 className='mb-4 text-[32px] font-extrabold leading-[1.1] tracking-[-0.02em] text-foreground md:text-[40px]'>
                      {s.title}
                    </h3>
                    <p className='mb-6 max-w-[440px] text-[16px] leading-relaxed text-secondary'>
                      {s.description}
                    </p>
                    {s.metrics ? (
                      <p className='mb-7 text-[13px] font-semibold uppercase tracking-[0.12em] text-muted'>
                        {s.metrics}
                      </p>
                    ) : null}
                    <Link className='btn-cta' href={s.href}>
                      {s.cta}
                    </Link>
                  </div>

                  {/* Feature visual */}
                  <div
                    aria-hidden='true'
                    className='relative hidden aspect-[4/3] overflow-hidden rounded-[18px] border border-border md:block'
                    style={{
                      background:
                        'radial-gradient(120% 100% at 30% 10%, rgba(194,80,46,0.16), transparent 60%), radial-gradient(120% 120% at 90% 100%, rgba(199,162,76,0.14), transparent 55%), var(--color-bg)',
                    }}
                  >
                    <span className='absolute bottom-4 right-6 text-[160px] font-extrabold leading-none tracking-[-0.04em] text-foreground/[0.06]'>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className='mt-5 flex items-center justify-between'>
        <div className='flex gap-2'>
          {slides.map((s, i) => (
            <button
              key={'dot' + s.href + i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => go(i)}
              className='h-2 rounded-full transition-all duration-300'
              style={{
                width: i === index ? 28 : 8,
                background:
                  i === index ? 'var(--accent)' : 'var(--color-border-strong)',
              }}
            />
          ))}
        </div>
        <div className='flex gap-2'>
          <button
            aria-label='Previous'
            onClick={() => go(index - 1)}
            className='flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md active:scale-95'
          >
            <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
              <path
                d='M15 18l-6-6 6-6'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
          <button
            aria-label='Next'
            onClick={() => go(index + 1)}
            className='flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-md active:scale-95'
          >
            <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
              <path
                d='M9 6l6 6-6 6'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

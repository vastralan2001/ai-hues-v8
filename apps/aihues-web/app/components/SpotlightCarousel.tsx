'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ToolIcon } from '@/components/ToolIcon';

export type SpotlightSlide = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  metrics?: string;
  href: string;
  cta: string;
};

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const DURATION = 650;
const SHIFT = 40; // px of horizontal drift — small, so slides fade rather than hard-clip

export default function SpotlightCarousel({
  slides,
  compact = false,
  onIndexChange,
}: {
  slides: SpotlightSlide[];
  compact?: boolean;
  onIndexChange?: (i: number) => void;
}) {
  const count = slides.length;

  // Slides are stacked; only the active one is visible. Each transition fades
  // + drifts the outgoing slide out (in the travel direction) and the incoming
  // slide in from the opposite side — so there is no sliding viewport edge and
  // wrapping last→first reads the same as any other forward step.
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState(-1);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const lock = useRef(false);

  useEffect(() => {
    onIndexChange?.(index);
  }, [index, onIndexChange]);

  const go = useCallback(
    (target: number, d: number) => {
      if (lock.current || target === index || count <= 1) return;
      lock.current = true;
      setDir(d);
      setPrev(index);
      setIndex(target);
    },
    [index, count]
  );

  const next = useCallback(
    () => go((index + 1) % count, 1),
    [go, index, count]
  );
  const back = useCallback(
    () => go((index - 1 + count) % count, -1),
    [go, index, count]
  );

  // Autoplay — always forward.
  useEffect(() => {
    if (paused || count <= 1) return;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const t = setInterval(() => next(), 5200);
    return () => clearInterval(t);
  }, [paused, count, next]);

  function onSlidesTransitionEnd(e: React.TransitionEvent) {
    if (e.propertyName === 'transform') lock.current = false;
  }

  if (count === 0) return null;

  return (
    <div
      className='relative'
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Stacked viewport — no overflow clip, so there is no edge to feel. */}
      <div
        className={`relative ${compact ? 'min-h-[430px]' : 'min-h-[460px]'}`}
        onTransitionEnd={onSlidesTransitionEnd}
      >
        {slides.map((s, i) => {
          const isActive = i === index;
          const isPrev = i === prev;
          const x = isActive
            ? 0
            : isPrev
              ? dir > 0
                ? -SHIFT
                : SHIFT
              : dir > 0
                ? SHIFT
                : -SHIFT;
          return (
            <div
              key={s.slug + i}
              aria-hidden={!isActive}
              className='absolute inset-0'
              style={{
                opacity: isActive ? 1 : 0,
                transform: `translateX(${x}px)`,
                transition: `opacity ${DURATION}ms ${EASE}, transform ${DURATION}ms ${EASE}`,
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              {compact ? (
                <div className='flex h-full flex-col justify-center px-1'>
                  <div className='mb-4 flex items-center gap-3'>
                    <span className='flex h-11 w-11 items-center justify-center rounded-[13px] bg-accent-bg text-accent'>
                      <ToolIcon slug={s.slug} size={22} />
                    </span>
                    <span className='inline-flex items-center rounded-full border border-border bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent backdrop-blur-md'>
                      {s.eyebrow}
                    </span>
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
                  <Link className='btn-cta btn-cta--sm w-fit' href={s.href}>
                    {s.cta}
                  </Link>
                </div>
              ) : (
                <div className='grid h-full grid-cols-1 items-center gap-8 p-10 md:grid-cols-[1.1fr_0.9fr] md:p-14'>
                  <div>
                    <div className='mb-4 flex items-center gap-3'>
                      <span className='flex h-12 w-12 items-center justify-center rounded-[14px] bg-accent-bg text-accent'>
                        <ToolIcon slug={s.slug} size={24} />
                      </span>
                      <span className='inline-flex items-center rounded-full border border-border bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent backdrop-blur-md'>
                        {s.eyebrow}
                      </span>
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
                    <Link className='btn-cta w-fit' href={s.href}>
                      {s.cta}
                    </Link>
                  </div>
                  <div
                    aria-hidden='true'
                    className='relative hidden aspect-[4/3] items-center justify-center overflow-hidden rounded-[18px] border border-border md:flex'
                    style={{
                      background:
                        'radial-gradient(120% 100% at 30% 10%, rgba(194,80,46,0.16), transparent 60%), radial-gradient(120% 120% at 90% 100%, rgba(199,162,76,0.14), transparent 55%), var(--color-bg)',
                    }}
                  >
                    <span className='text-accent/70'>
                      <ToolIcon slug={s.slug} size={96} />
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className='mt-5 flex items-center justify-between'>
        <div className='flex gap-2'>
          {slides.map((s, i) => (
            <button
              key={'dot' + s.slug + i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => go(i, i >= index ? 1 : -1)}
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
            onClick={back}
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
            onClick={next}
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

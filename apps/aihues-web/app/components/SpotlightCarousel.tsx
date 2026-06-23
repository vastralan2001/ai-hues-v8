'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { GameDemo } from '@/components/games/GameDemos';
import { ResourceCover } from '@/components/resources/ResourceCover';
import { TestDemo } from '@/components/tests/TestDemos';
import { ToolIcon } from '@/components/ToolIcon';
import { ToolDemo } from '@/components/tools/ToolDemos';

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
const DURATION = 520;
const FADE_OUT = 200;
const SHIFT = 22;

function SlideText({ s, full }: { s: SpotlightSlide; full: boolean }) {
  return (
    <>
      <div className='mb-3 flex items-center gap-3'>
        <span className='flex h-10 w-10 items-center justify-center rounded-[12px] bg-accent-bg text-accent'>
          <ToolIcon size={20} slug={s.slug} />
        </span>
        <span className='inline-flex items-center rounded-full border border-border bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent backdrop-blur-md'>
          {s.eyebrow}
        </span>
      </div>
      <h3 className='mb-2 text-[26px] font-extrabold leading-[1.12] tracking-[-0.02em] text-foreground'>
        {s.title}
      </h3>
      <p
        className={`mb-4 text-[15px] leading-relaxed text-secondary ${full ? '' : 'line-clamp-3'}`}
      >
        {s.description}
      </p>
      {s.metrics ? (
        <p className='mb-5 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted'>
          {s.metrics}
        </p>
      ) : null}
      <Link className='btn-cta btn-cta--sm w-fit' href={s.href}>
        {s.cta}
      </Link>
    </>
  );
}

export default function SpotlightCarousel({
  slides,
  compact = false,
  onIndexChange,
  demo,
}: {
  slides: SpotlightSlide[];
  compact?: boolean;
  onIndexChange?: (i: number) => void;
  demo?: 'tool' | 'game' | 'test' | 'resource';
}) {
  const count = slides.length;

  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState(-1);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const lock = useRef(false);
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    onIndexChange?.(index);
  }, [index, onIndexChange]);

  useEffect(
    () => () => {
      if (lockTimer.current) clearTimeout(lockTimer.current);
    },
    []
  );

  const go = useCallback(
    (target: number, d: number) => {
      if (lock.current || target === index || count <= 1) return;
      lock.current = true;
      setDir(d);
      setPrev(index);
      setIndex(target);
      // Release on a timer rather than transitionend — the active slide's
      // transform doesn't always change, so transitionend can never fire.
      if (lockTimer.current) clearTimeout(lockTimer.current);
      lockTimer.current = setTimeout(() => {
        lock.current = false;
      }, DURATION + 80);
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

  useEffect(() => {
    if (paused || count <= 1) return;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const t = setInterval(() => next(), 5600);
    return () => clearInterval(t);
  }, [paused, count, next]);

  if (count === 0) return null;

  const hasDemo = !!demo;
  const boxH = hasDemo
    ? 'min-h-[300px]'
    : compact
      ? 'min-h-[300px]'
      : 'min-h-[420px]';

  return (
    <div
      className='relative'
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={`relative overflow-hidden ${boxH}`}>
        {slides.map((s, i) => {
          const isActive = i === index;
          const isPrev = i === prev;
          const enterX = dir > 0 ? SHIFT : -SHIFT;
          const x = isActive ? 0 : isPrev ? 0 : enterX;
          const transition = isActive
            ? `opacity ${DURATION}ms ${EASE}, transform ${DURATION}ms ${EASE}`
            : isPrev
              ? `opacity ${FADE_OUT}ms ease`
              : 'none';
          return (
            <div
              key={s.slug + i}
              aria-hidden={!isActive}
              className='absolute inset-0'
              style={{
                opacity: isActive ? 1 : 0,
                transform: `translateX(${x}px)`,
                transition,
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              {hasDemo ? (
                <div className='grid h-full items-center gap-7 md:grid-cols-2'>
                  <div className='order-2 min-w-0 md:order-1'>
                    <SlideText full={false} s={s} />
                  </div>
                  <div className='order-1 min-w-0 md:order-2'>
                    {demo === 'game' ? (
                      <GameDemo slug={s.slug} />
                    ) : demo === 'test' ? (
                      <TestDemo slug={s.slug} />
                    ) : demo === 'resource' ? (
                      <ResourceCover
                        readTime={s.metrics}
                        tag={s.eyebrow}
                        title={s.title}
                      />
                    ) : (
                      <ToolDemo slug={s.slug} />
                    )}
                  </div>
                </div>
              ) : (
                <div className='mx-auto flex h-full max-w-[460px] flex-col justify-center px-1'>
                  <SlideText full s={s} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className='mt-4 flex items-center justify-between'>
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

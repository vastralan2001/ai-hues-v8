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

const EASE = 'cubic-bezier(0.77, 0, 0.175, 1)';
const DURATION = 600;

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

  // `pos` indexes into the cloned track [last, ...slides, first]; real slide
  // i sits at pos i+1. We only ever move forward (pos+1); when we slide onto
  // the trailing first-clone we snap back to the real first with no transition
  // — so last→first always travels rightward and the loop has no visible seam.
  const [pos, setPos] = useState(1);
  const [anim, setAnim] = useState(true);
  const [paused, setPaused] = useState(false);
  // Locked while a slide transition is in flight — prevents overshooting the
  // cloned track (which would flash a blank slide) on rapid input.
  const lock = useRef(false);

  const logical = count > 0 ? (pos - 1 + count) % count : 0;

  useEffect(() => {
    onIndexChange?.(logical);
  }, [logical, onIndexChange]);

  // Re-enable the transition one frame after a no-transition snap so the
  // jump itself is instant but the next move animates.
  useEffect(() => {
    if (anim) return;
    const raf = requestAnimationFrame(() => setAnim(true));
    return () => cancelAnimationFrame(raf);
  }, [anim]);

  const step = useCallback((dir: number) => {
    if (lock.current) return;
    lock.current = true;
    setAnim(true);
    setPos((p) => p + dir);
  }, []);

  const goTo = useCallback((logicalIdx: number) => {
    if (lock.current) return;
    lock.current = true;
    setAnim(true);
    setPos(logicalIdx + 1);
  }, []);

  // Autoplay — always forward (through `step`, so it respects the lock).
  useEffect(() => {
    if (paused || count <= 1) return;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const t = setInterval(() => step(1), 5200);
    return () => clearInterval(t);
  }, [paused, count, step]);

  function onTrackTransitionEnd(e: React.TransitionEvent) {
    if (e.propertyName !== 'transform' || e.target !== e.currentTarget) return;
    if (pos === count + 1) {
      setAnim(false);
      setPos(1);
    } else if (pos === 0) {
      setAnim(false);
      setPos(count);
    }
    lock.current = false;
  }

  if (count === 0) return null;

  // Cloned track: a copy of the last slide up front, the first slide at the end.
  const track = [slides[count - 1], ...slides, slides[0]];

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
          onTransitionEnd={onTrackTransitionEnd}
          style={{
            transform: `translateX(-${pos * 100}%)`,
            transition: anim ? `transform ${DURATION}ms ${EASE}` : 'none',
          }}
        >
          {track.map((s, i) =>
            compact ? (
              <div key={'t' + i} className='w-full shrink-0'>
                <div className='relative flex min-h-[430px] flex-col justify-center px-1 py-6'>
                  <div className='relative'>
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
                    <Link className='btn-cta btn-cta--sm' href={s.href}>
                      {s.cta}
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div key={'t' + i} className='w-full shrink-0'>
                <div className='grid grid-cols-1 items-center gap-8 p-10 md:grid-cols-[1.1fr_0.9fr] md:p-14'>
                  {/* Text */}
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
                    <Link className='btn-cta' href={s.href}>
                      {s.cta}
                    </Link>
                  </div>

                  {/* Feature visual */}
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
              </div>
            )
          )}
        </div>
      </div>

      {/* Controls */}
      <div className='mt-5 flex items-center justify-between'>
        <div className='flex gap-2'>
          {slides.map((s, i) => (
            <button
              key={'dot' + s.slug + i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className='h-2 rounded-full transition-all duration-300'
              style={{
                width: i === logical ? 28 : 8,
                background:
                  i === logical
                    ? 'var(--accent)'
                    : 'var(--color-border-strong)',
              }}
            />
          ))}
        </div>
        <div className='flex gap-2'>
          <button
            aria-label='Previous'
            onClick={() => step(-1)}
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
            onClick={() => step(1)}
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

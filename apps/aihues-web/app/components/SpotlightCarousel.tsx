'use client';

import Link from 'next/link';
import { createElement, useCallback, useEffect, useRef, useState } from 'react';

import { GameDemo } from '@/components/games/GameDemos';
import { StoryArt } from '@/components/StoryArt';
import { TestDemo } from '@/components/tests/TestDemos';
import { ToolIcon } from '@/components/ToolIcon';
import { ToolDemo } from '@/components/tools/ToolDemos';
import { storyTagIcon } from '@/lib/story-scenes';

export type SpotlightSlide = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  metrics?: string;
  href: string;
  cta: string;
  /** Per-slide demo type — overrides the carousel-level `demo` prop. */
  kind?: 'tool' | 'game' | 'test' | 'story';
};

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const DURATION = 520;
const FADE_OUT = 200;
const SHIFT = 22;

// Secondary-CTA target per slide kind — the family's aggregation page.
const AGG: Record<string, { href: string; label: string }> = {
  tool: { href: '/tools', label: 'All tools' },
  game: { href: '/games', label: 'All games' },
  test: { href: '/tests', label: 'All tests' },
  story: { href: '/stories', label: 'All stories' },
};

function SlideText({
  s,
  full,
  secondary = false,
}: {
  s: SpotlightSlide;
  full: boolean;
  secondary?: boolean;
}) {
  const agg = secondary && s.kind ? AGG[s.kind] : undefined;
  return (
    <>
      <div className='mb-3 flex items-center gap-3'>
        <span className='flex h-10 w-10 items-center justify-center rounded-[12px] bg-accent-bg text-accent'>
          {s.kind === 'story' ? (
            createElement(storyTagIcon(s.eyebrow), { size: 20 })
          ) : (
            <ToolIcon size={20} slug={s.slug} />
          )}
        </span>
        <span className='inline-flex items-center rounded-full border border-border bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent backdrop-blur-md'>
          {s.eyebrow}
        </span>
      </div>
      <h3 className='mb-2 line-clamp-2 min-h-[2.24em] text-[26px] font-extrabold leading-[1.12] tracking-[-0.02em] text-foreground'>
        {s.title}
      </h3>
      <p
        className={`mb-4 text-[15px] leading-relaxed text-secondary ${full ? '' : 'line-clamp-3 min-h-[4.9em]'}`}
      >
        {s.description}
      </p>
      <p className='mb-5 min-h-[1.5em] text-[12px] font-semibold uppercase tracking-[0.12em] text-muted'>
        {s.metrics ?? ' '}
      </p>
      <div className='flex flex-wrap items-center gap-3'>
        <Link className='btn-cta btn-cta--sm w-fit' href={s.href}>
          {s.cta}
        </Link>
        {agg ? (
          <Link
            className='inline-flex w-fit items-center gap-1 rounded-[10px] border border-border-strong px-4 py-2 text-[12px] font-bold uppercase tracking-[0.1em] text-secondary transition-colors hover:border-accent hover:text-accent'
            href={agg.href}
          >
            {agg.label}
          </Link>
        ) : null}
      </div>
    </>
  );
}

export default function SpotlightCarousel({
  slides,
  compact = false,
  onIndexChange,
  demo,
  stack = false,
  controlledIndex,
  controls = true,
  secondaryCta = false,
}: {
  slides: SpotlightSlide[];
  compact?: boolean;
  onIndexChange?: (i: number) => void;
  demo?: 'tool' | 'game' | 'test';
  stack?: boolean;
  /** When set, the carousel is driven externally (no auto-advance). */
  controlledIndex?: number;
  /** Show the dots + prev/next arrows (default true). */
  controls?: boolean;
  /** Show a secondary CTA to the family aggregation page (hero only). */
  secondaryCta?: boolean;
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

  // Externally-driven mode: follow the controlled index, no auto-advance.
  useEffect(() => {
    if (controlledIndex == null) return;
    if (controlledIndex !== index) {
      go(controlledIndex, controlledIndex >= index ? 1 : -1);
    }
  }, [controlledIndex, index, go]);

  useEffect(() => {
    if (controlledIndex != null || paused || count <= 1) return;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const t = setInterval(() => next(), 5600);
    return () => clearInterval(t);
  }, [controlledIndex, paused, count, next]);

  if (count === 0) return null;

  const hasDemo = !!demo || slides.some((s) => s.kind);
  const boxH =
    hasDemo && stack
      ? 'min-h-[460px]'
      : hasDemo || compact
        ? 'min-h-[300px]'
        : 'min-h-[420px]';

  const renderDemo = (s: SpotlightSlide, active: boolean) => {
    const k = s.kind ?? demo;
    // Games get the same framed card as the tool/test demos for visual parity.
    if (k === 'game')
      return (
        <div className='relative h-[244px] w-full overflow-hidden rounded-[16px] border border-border bg-bg shadow-sm'>
          <GameDemo active={active} slug={s.slug} />
        </div>
      );
    if (k === 'test') return <TestDemo slug={s.slug} />;
    return <ToolDemo slug={s.slug} />;
  };

  // A slide shows its demo panel only if it has a real demo kind; story / plain
  // slides fall back to the shared full-width text card (icon + badge included),
  // the same card the home Stories band uses.
  const slideHasDemo = (s: SpotlightSlide) => {
    const k = s.kind ?? demo;
    return !!k && k !== 'story';
  };

  return (
    <div
      className='relative'
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* No overflow-hidden here: the hero + FeatureBand sections already clip
          horizontally (overflow-x-clip) with vertical padding, so the CTA hover
          glow can breathe instead of being cropped by this box. */}
      <div className={`relative ${boxH}`}>
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
          const showDemo = slideHasDemo(s);
          const k = s.kind ?? demo;
          const visual = showDemo ? (
            renderDemo(s, isActive)
          ) : k === 'story' ? (
            <StoryArt
              slug={s.slug}
              tag={s.eyebrow}
              animated
              className='h-[244px] w-full rounded-[16px] border border-border bg-bg shadow-sm'
            />
          ) : null;
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
              {visual ? (
                stack ? (
                  <div className='flex h-full flex-col justify-center gap-4'>
                    <SlideText full={false} s={s} secondary={secondaryCta} />
                    {visual}
                  </div>
                ) : (
                  <div className='grid h-full items-center gap-7 md:grid-cols-2'>
                    <div className='order-2 min-w-0 md:order-1'>
                      <SlideText full={false} s={s} secondary={secondaryCta} />
                    </div>
                    <div className='order-1 min-w-0 md:order-2'>{visual}</div>
                  </div>
                )
              ) : (
                <div className='flex h-full flex-col justify-center'>
                  <div className='max-w-[620px]'>
                    <SlideText full s={s} secondary={secondaryCta} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Controls — goto dots only (cleaner, matches the kimi aesthetic) */}
      {controls ? (
        <div className='mt-4 flex items-center justify-start'>
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
                    i === index
                      ? 'var(--accent)'
                      : 'var(--color-border-strong)',
                }}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

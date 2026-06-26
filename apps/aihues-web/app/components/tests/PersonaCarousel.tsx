'use client';

import { useEffect, useState } from 'react';

import { PersonaImage } from './PersonaImage';
import { getMbtiSummary } from '@/lib/tests/mbti';
import { getSbtiSummary } from '@/lib/tests/sbti';
import {
  MBTI_PERSONA_CODES,
  SBTI_PERSONA_CODES,
} from '@/lib/tests/persona-art';

const DURATION = 520;
const SHIFT = 22;

interface PersonaSlide {
  code: string;
  name: string;
  accent: string;
}

function buildSlides(slug: string): PersonaSlide[] {
  if (slug === 'mbti') {
    return MBTI_PERSONA_CODES.map((code) => {
      const s = getMbtiSummary(code);
      return {
        code,
        name: s?.name ?? code,
        accent: s?.accent ?? '#7e5aa6',
      };
    });
  }
  if (slug === 'sbti') {
    return SBTI_PERSONA_CODES.map((code) => {
      const s = getSbtiSummary(code);
      return {
        code,
        name: s?.name ?? code,
        accent: s?.accent ?? '#c2502e',
      };
    });
  }
  return [];
}

export function PersonaCarousel({ slug }: { slug: string }) {
  const slides = buildSlides(slug);
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState(-1);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || count <= 1) return;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const t = setInterval(() => {
      setDir(1);
      setPrev(index);
      setIndex((i) => (i + 1) % count);
    }, 3600);
    return () => clearInterval(t);
  }, [paused, count, index]);

  if (count === 0) return null;

  return (
    <div
      className='relative mx-auto mb-8 w-full max-w-[640px]'
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className='relative h-[200px] overflow-hidden rounded-[20px] border border-border bg-surface'>
        {slides.map((s, i) => {
          const isActive = i === index;
          const isPrev = i === prev;
          const enterX = dir > 0 ? SHIFT : -SHIFT;
          const x = isActive ? 0 : isPrev ? 0 : enterX;
          const transition = isActive
            ? `opacity ${DURATION}ms cubic-bezier(0.22, 1, 0.36, 1), transform ${DURATION}ms cubic-bezier(0.22, 1, 0.36, 1)`
            : isPrev
              ? `opacity 200ms ease`
              : 'none';
          return (
            <div
              key={s.code}
              className='absolute inset-0 flex items-center justify-center gap-6 px-8'
              style={{
                opacity: isActive ? 1 : 0,
                transform: `translateX(${x}px)`,
                transition,
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              <div
                className='relative h-[160px] w-[120px] overflow-hidden rounded-[16px] border-[3px] border-white bg-bg shadow-lg'
                style={{ borderColor: s.accent }}
              >
                <PersonaImage
                  src={`/personas/${slug}/${s.code.toLowerCase()}.png`}
                  alt={`${s.code} — ${s.name}`}
                  accent={s.accent}
                  width={120}
                  height={160}
                  placeholderLabel={s.code}
                  className='h-full w-full'
                />
              </div>
              <div className='min-w-0 text-left'>
                <div
                  className='text-[clamp(34px,6vw,48px)] font-black leading-none tracking-[-0.02em]'
                  style={{ color: s.accent }}
                >
                  {s.code.toUpperCase()}
                </div>
                <div className='mt-1 text-[15px] font-semibold text-foreground'>
                  {s.name}
                </div>
                <p className='mt-2 max-w-[280px] text-[13px] leading-relaxed text-secondary'>
                  Meet the {slides.length} characters you could become.
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className='mt-3 flex items-center justify-center gap-2'>
        {slides.map((s, i) => (
          <button
            key={`dot-${s.code}`}
            type='button'
            aria-label={`Go to ${s.code}`}
            onClick={() => {
              setDir(i >= index ? 1 : -1);
              setPrev(index);
              setIndex(i);
            }}
            className='h-2 rounded-full transition-all duration-300'
            style={{
              width: i === index ? 28 : 8,
              background:
                i === index
                  ? 'var(--color-accent)'
                  : 'var(--color-border-strong)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

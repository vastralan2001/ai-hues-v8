'use client';

import { useEffect, useState } from 'react';

/* Per-test demos, owned by the tests domain. A short two-beat loop: render a
   sample question, then cross-fade into a miniature of the shareable result
   poster (see lib/tests/poster.ts). The homepage retrieves one by slug. */

interface PosterPreview {
  code: string;
  title: string;
  bars: { label: string; pct: number }[];
}

interface Question {
  q: string;
  opts: string[];
  pick: number;
}

const QUESTIONS: Record<string, Question> = {
  sbti: {
    q: 'It’s 2am. You are…',
    opts: ['Doomscrolling', 'Shipping a side project', 'Asleep, somehow'],
    pick: 1,
  },
  mbti: {
    q: 'At a party, you usually…',
    opts: ['Work the whole room', 'Find one good convo', 'Plot your exit'],
    pick: 1,
  },
  mensa: {
    q: 'Next in the series: 2, 6, 12, 20, …',
    opts: ['28', '30', '32'],
    pick: 1,
  },
  sbinet: {
    q: 'Which value completes the pattern?',
    opts: ['IV', 'VI', 'IX'],
    pick: 2,
  },
};

const RESULTS: Record<string, PosterPreview> = {
  sbti: {
    code: 'GOBLIN',
    title: 'The Goblin',
    bars: [
      { label: 'Chaos', pct: 86 },
      { label: 'Cope', pct: 64 },
      { label: 'Vibe', pct: 72 },
      { label: 'Doom', pct: 40 },
    ],
  },
  mbti: {
    code: 'INTJ-A',
    title: 'The Architect',
    bars: [
      { label: 'Mind', pct: 78 },
      { label: 'Energy', pct: 64 },
      { label: 'Nature', pct: 71 },
      { label: 'Tactics', pct: 83 },
    ],
  },
  mensa: {
    code: 'IQ 132',
    title: 'Top 2% range',
    bars: [
      { label: 'Numerical', pct: 90 },
      { label: 'Verbal', pct: 75 },
      { label: 'Logic', pct: 82 },
      { label: 'Pattern', pct: 68 },
    ],
  },
  sbinet: {
    code: 'IQ 124',
    title: 'Superior',
    bars: [
      { label: 'Fluid', pct: 80 },
      { label: 'Quant', pct: 88 },
      { label: 'Spatial', pct: 66 },
      { label: 'Memory', pct: 74 },
    ],
  },
};

export function TestDemo({ slug }: { slug: string }) {
  const r = RESULTS[slug] ?? RESULTS.mbti;
  const question = QUESTIONS[slug] ?? QUESTIONS.mbti;
  // Two-beat loop: question (answering) → result poster → back.
  const [phase, setPhase] = useState<'q' | 'poster'>('q');
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timers: ReturnType<typeof setTimeout>[] = [];
    if (reduce) {
      timers.push(setTimeout(() => setPhase('poster'), 0));
      return () => timers.forEach(clearTimeout);
    }
    const cycle = () => {
      setPhase('q');
      setAnswered(false);
      timers.push(setTimeout(() => setAnswered(true), 900));
      timers.push(setTimeout(() => setPhase('poster'), 2200));
      timers.push(setTimeout(cycle, 5200));
    };
    timers.push(setTimeout(cycle, 50));
    return () => timers.forEach(clearTimeout);
  }, [slug]);

  return (
    <div className='relative h-[244px] w-full overflow-hidden rounded-[16px] border border-border bg-bg shadow-sm'>
      {/* Question beat */}
      <div
        className='absolute inset-0 flex flex-col justify-center gap-3 px-5 transition-opacity duration-500'
        style={{ opacity: phase === 'q' ? 1 : 0 }}
      >
        <div className='text-[10px] font-bold uppercase tracking-[0.16em] text-accent'>
          {slug.toUpperCase()} · question
        </div>
        <div className='text-[16px] font-bold leading-snug text-foreground'>
          {question.q}
        </div>
        <div className='mt-1 flex flex-col gap-2'>
          {question.opts.map((o, i) => {
            const chosen = answered && i === question.pick;
            return (
              <div
                key={o}
                className={`flex items-center gap-2.5 rounded-[10px] border px-3 py-2 text-[13px] font-medium transition-all duration-300 ${
                  chosen
                    ? 'border-accent bg-accent-bg text-accent'
                    : 'border-border bg-surface text-secondary'
                }`}
              >
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[9px] ${
                    chosen
                      ? 'border-accent bg-accent text-white'
                      : 'border-border-strong text-muted'
                  }`}
                >
                  {chosen ? '✓' : String.fromCharCode(65 + i)}
                </span>
                {o}
              </div>
            );
          })}
        </div>
      </div>

      {/* Result poster beat */}
      <div
        className='absolute inset-0 flex flex-col transition-opacity duration-500'
        style={{ opacity: phase === 'poster' ? 1 : 0 }}
      >
        <div
          className='px-4 py-3'
          style={{
            background:
              'color-mix(in srgb, var(--color-accent) 12%, transparent)',
          }}
        >
          <div className='text-[10px] font-bold uppercase tracking-[0.16em] text-accent'>
            {slug.toUpperCase()} · result
          </div>
          <div className='text-[30px] font-black leading-none text-accent'>
            {r.code}
          </div>
          <div className='mt-0.5 text-[13px] font-bold text-foreground'>
            {r.title}
          </div>
        </div>
        <div className='flex flex-1 flex-col justify-center gap-2.5 px-4'>
          {r.bars.map((b, n) => (
            <div key={b.label} className='flex items-center gap-2'>
              <span className='w-[64px] shrink-0 text-[10px] text-secondary'>
                {b.label}
              </span>
              <div className='h-1.5 flex-1 overflow-hidden rounded-full bg-border'>
                <div
                  className='h-full rounded-full bg-accent transition-[width] duration-700 ease-out'
                  style={{
                    width: phase === 'poster' ? `${b.pct}%` : '0%',
                    transitionDelay: `${n * 0.12}s`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className='flex items-center gap-1.5 border-t border-border px-4 py-2 text-[10px] font-medium text-muted'>
          <span className='h-2 w-2 rounded-full bg-accent' />
          AIHues · shareable poster
        </div>
      </div>
    </div>
  );
}

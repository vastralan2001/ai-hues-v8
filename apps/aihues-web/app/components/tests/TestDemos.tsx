'use client';

/* Per-test demos, owned by the tests domain — a miniature of the shareable
   result poster (see lib/tests/poster.ts). The homepage retrieves one by
   slug via TestDemo. */

interface PosterPreview {
  code: string;
  title: string;
  bars: { label: string; pct: number }[];
}

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
  return (
    <div className='flex h-[244px] w-full flex-col overflow-hidden rounded-[16px] border border-border bg-bg shadow-sm'>
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
                className='demo-grow h-full rounded-full bg-accent'
                style={{ width: `${b.pct}%`, animationDelay: `${n * 0.14}s` }}
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
  );
}

'use client';

import { type ReactNode } from 'react';

import { DemoFrame, Label } from '@/components/demos/DemoKit';

/* Per-game demos, owned by the games domain. The homepage retrieves one by
   slug via GameDemo. */

function Reel({ symbols, dur }: { symbols: string[]; dur: number }) {
  const strip = [...symbols, ...symbols];
  return (
    <div className='relative h-full flex-1 overflow-hidden rounded-[8px] border border-border bg-surface'>
      <div
        className='demo-reel flex flex-col items-center'
        style={{ animationDuration: `${dur}s` }}
      >
        {strip.map((s, i) => (
          <div
            key={i}
            className='flex h-[44px] shrink-0 items-center justify-center text-[26px]'
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

function SlotDemo() {
  return (
    <div className='flex h-full flex-col'>
      <Label>Spin · match three</Label>
      <div className='relative flex flex-1 gap-2'>
        <Reel dur={1.0} symbols={['🍒', '🔔', '7️⃣', '⭐', '🍋']} />
        <Reel dur={1.3} symbols={['7️⃣', '🍋', '⭐', '🍒', '🔔']} />
        <Reel dur={1.6} symbols={['⭐', '🍒', '🔔', '7️⃣', '🍋']} />
        <div className='pointer-events-none absolute inset-x-0 top-1/2 h-[44px] -translate-y-1/2 rounded-[6px] border-2 border-accent/60' />
      </div>
    </div>
  );
}

function DailyLuckDemo() {
  return (
    <div className='flex h-full items-center justify-center [perspective:900px]'>
      <div className='demo-flip relative h-[150px] w-[110px]'>
        <div
          className='absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[14px] border border-border text-white [backface-visibility:hidden]'
          style={{
            background:
              'radial-gradient(120% 100% at 30% 0%, #c2502e, #9a3d24)',
          }}
        >
          <span className='text-[30px]'>✦</span>
          <span className='text-[10px] font-bold uppercase tracking-[0.18em]'>
            Draw
          </span>
        </div>
        <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[14px] border border-border bg-surface p-3 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]'>
          <span className='text-[22px]'>🍀</span>
          <span className='text-[12px] font-bold text-foreground'>
            Good fortune
          </span>
          <span className='text-[10px] leading-snug text-muted'>
            Bold moves pay off today
          </span>
        </div>
      </div>
    </div>
  );
}

function SnakeDemo() {
  return (
    <div
      className='relative h-full overflow-hidden rounded-[8px] bg-surface'
      style={{
        backgroundImage:
          'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      <div
        className='absolute h-3.5 w-3.5 rounded-full bg-accent'
        style={{ left: '76%', top: '42%' }}
      />
      <div
        className='demo-slide absolute flex items-center gap-1'
        style={{ left: '8%', top: 'calc(42% - 2px)' }}
      >
        {[0, 1, 2, 3, 4].map((n) => (
          <span
            key={n}
            className='h-4 w-4 rounded-[5px]'
            style={{
              background: n === 0 ? '#5b8c4f' : '#7faf6b',
              opacity: 1 - n * 0.13,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function DoodleJumpDemo() {
  const plats = [
    { x: '14%', y: 5 },
    { x: '58%', y: 15 },
    { x: '30%', y: 27 },
    { x: '66%', y: 39 },
  ];
  const all = [...plats, ...plats.map((p) => ({ x: p.x, y: p.y + 50 }))];
  return (
    <div
      className='relative h-full overflow-hidden rounded-[8px]'
      style={{ background: 'linear-gradient(180deg, #1b2440, #0e1424)' }}
    >
      <div
        className='demo-fall absolute inset-x-0 top-0'
        style={{ height: '200%' }}
      >
        {all.map((p, n) => (
          <div
            key={n}
            className='absolute h-2 w-12 rounded-full bg-[#6f9e5a]'
            style={{ left: p.x, top: `${p.y}%` }}
          />
        ))}
      </div>
      <div className='demo-hop absolute left-1/2 top-[44%] flex h-7 w-7 -translate-x-1/2 items-center justify-center gap-[3px] rounded-[9px] bg-[#7faf6b]'>
        <span className='h-1 w-1 rounded-full bg-[#0e1424]' />
        <span className='h-1 w-1 rounded-full bg-[#0e1424]' />
      </div>
    </div>
  );
}

const GAME_DEMOS: Record<string, () => ReactNode> = {
  snake: SnakeDemo,
  'doodle-jump': DoodleJumpDemo,
  'slot-machine': SlotDemo,
  'daily-luck': DailyLuckDemo,
};

export function GameDemo({ slug }: { slug: string }) {
  const D = GAME_DEMOS[slug];
  return <DemoFrame>{D ? <D /> : null}</DemoFrame>;
}

export const GAME_DEMO_SLUGS = Object.keys(GAME_DEMOS);

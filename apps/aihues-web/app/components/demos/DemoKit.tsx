'use client';

import { type ReactNode, useEffect, useState } from 'react';

/* Shared building blocks for the per-item homepage demos. Each Tools / Games
   / Tests domain defines its own demos with these and exposes a lookup; the
   homepage spotlight just retrieves them by slug. */

export const mono =
  "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace";

export const code = {
  key: '#9a6b3f',
  str: '#788c5d',
  num: '#3f7d8c',
  punct: '#8f8b82',
};

export function Label({ children }: { children: ReactNode }) {
  return (
    <div className='mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted'>
      {children}
    </div>
  );
}

/* Full-bleed dark stage for the per-game auto-play demos. */
export function GameStage({
  bg,
  children,
}: {
  bg: string;
  children: ReactNode;
}) {
  return (
    <div
      className='relative h-[244px] w-full overflow-hidden rounded-[16px] border border-white/10 shadow-sm'
      style={{ background: bg }}
    >
      {children}
    </div>
  );
}

/* A little browser-chrome window the demo content sits inside. */
export function DemoFrame({ children }: { children: ReactNode }) {
  return (
    <div className='relative h-[244px] w-full overflow-hidden rounded-[16px] border border-border bg-bg shadow-sm'>
      <div className='flex h-7 items-center gap-1.5 border-b border-border bg-surface px-3'>
        <span className='h-2 w-2 rounded-full bg-border-strong' />
        <span className='h-2 w-2 rounded-full bg-border-strong' />
        <span className='h-2 w-2 rounded-full bg-border-strong' />
      </div>
      <div className='relative h-[calc(100%-28px)] overflow-hidden p-3'>
        {children}
      </div>
    </div>
  );
}

/* Cross-fades through a list of frames — a gentle dissolve, not a flicker. */
export function Frames({
  frames,
  interval = 2600,
}: {
  frames: ReactNode[];
  interval?: number;
}) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % frames.length), interval);
    return () => clearInterval(t);
  }, [frames.length, interval]);
  return (
    <div className='relative h-full'>
      {frames.map((f, n) => (
        <div
          key={n}
          className='absolute inset-0'
          style={{
            opacity: n === i ? 1 : 0,
            transition: 'opacity 650ms ease',
            pointerEvents: n === i ? 'auto' : 'none',
          }}
        >
          {f}
        </div>
      ))}
    </div>
  );
}

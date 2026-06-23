'use client';

import { type ReactNode, useEffect, useState } from 'react';

/* Looping, code-faithful previews shown on the right of the homepage
   spotlight cards — each mimics what the real tool/game actually does. */

function DemoFrame({ children }: { children: ReactNode }) {
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

/* Cross-fades through a list of frames on a timer (cheap — no canvas). */
function Frames({
  frames,
  interval = 2100,
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
    <div className='h-full' key={i}>
      <div className='demo-fade h-full'>{frames[i]}</div>
    </div>
  );
}

const mono = "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace";
const C = {
  key: '#9a6b3f',
  str: '#788c5d',
  num: '#3f7d8c',
  punct: '#8f8b82',
};

function Label({ children }: { children: ReactNode }) {
  return (
    <div className='mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted'>
      {children}
    </div>
  );
}

/* ── Tool demos ── */
function JwtDemo() {
  return (
    <Frames
      frames={[
        <div key='t'>
          <Label>Paste a JWT</Label>
          <div
            className='break-all rounded-[8px] border border-border bg-surface p-2.5 text-[12px] leading-relaxed'
            style={{ fontFamily: mono }}
          >
            <span style={{ color: C.key }}>eyJhbGciOiJIUzI1NiJ9</span>
            <span style={{ color: C.punct }}>.</span>
            <span style={{ color: C.num }}>
              eyJzdWIiOiIxIiwibmFtZSI6IkFJSHVlcyJ9
            </span>
            <span style={{ color: C.punct }}>.</span>
            <span style={{ color: C.str }}>SflKxwRJSMeKKF2QT4</span>
          </div>
        </div>,
        <div key='d' style={{ fontFamily: mono }} className='text-[12px]'>
          <Label>Decoded payload</Label>
          <div className='rounded-[8px] border border-border bg-surface p-2.5 leading-relaxed'>
            <div>
              <span style={{ color: C.punct }}>{'{'}</span>
            </div>
            <div className='pl-3'>
              <span style={{ color: C.key }}>&quot;sub&quot;</span>
              <span style={{ color: C.punct }}>: </span>
              <span style={{ color: C.str }}>&quot;1&quot;</span>,
            </div>
            <div className='pl-3'>
              <span style={{ color: C.key }}>&quot;name&quot;</span>
              <span style={{ color: C.punct }}>: </span>
              <span style={{ color: C.str }}>&quot;AIHues&quot;</span>,
            </div>
            <div className='pl-3'>
              <span style={{ color: C.key }}>&quot;exp&quot;</span>
              <span style={{ color: C.punct }}>: </span>
              <span style={{ color: C.num }}>1924905600</span>
            </div>
            <div>
              <span style={{ color: C.punct }}>{'}'}</span>
            </div>
          </div>
        </div>,
      ]}
    />
  );
}

function JsonDemo() {
  return (
    <Frames
      frames={[
        <div key='m'>
          <Label>Minified input</Label>
          <div
            className='break-all rounded-[8px] border border-border bg-surface p-2.5 text-[12px] text-secondary'
            style={{ fontFamily: mono }}
          >
            {'{"user":{"id":7,"name":"AIHues","tags":["ai","tools"]}}'}
          </div>
        </div>,
        <div key='f' style={{ fontFamily: mono }} className='text-[12px]'>
          <Label>Formatted</Label>
          <div className='rounded-[8px] border border-border bg-surface p-2.5 leading-[1.5]'>
            <div>
              <span style={{ color: C.key }}>&quot;user&quot;</span>: {'{'}
            </div>
            <div className='pl-3'>
              <span style={{ color: C.key }}>&quot;id&quot;</span>:{' '}
              <span style={{ color: C.num }}>7</span>,
            </div>
            <div className='pl-3'>
              <span style={{ color: C.key }}>&quot;name&quot;</span>:{' '}
              <span style={{ color: C.str }}>&quot;AIHues&quot;</span>,
            </div>
            <div className='pl-3'>
              <span style={{ color: C.key }}>&quot;tags&quot;</span>: [
              <span style={{ color: C.str }}>&quot;ai&quot;</span>,{' '}
              <span style={{ color: C.str }}>&quot;tools&quot;</span>]
            </div>
            <div>{'}'}</div>
          </div>
        </div>,
      ]}
    />
  );
}

function Base64Demo() {
  return (
    <Frames
      frames={[
        <div key='p'>
          <Label>Plain text</Label>
          <div
            className='rounded-[8px] border border-border bg-surface p-2.5 text-[13px] text-foreground'
            style={{ fontFamily: mono }}
          >
            Hello, AIHues 👋
          </div>
          <div className='mt-2 text-center text-[18px] text-accent'>↓</div>
        </div>,
        <div key='e'>
          <Label>Base64 encoded</Label>
          <div
            className='break-all rounded-[8px] border border-border bg-surface p-2.5 text-[13px]'
            style={{ fontFamily: mono, color: C.num }}
          >
            SGVsbG8sIEFJSHVlcyDwn5GL
          </div>
          <div className='mt-2 text-center text-[18px] text-accent'>↑</div>
        </div>,
      ]}
    />
  );
}

function UuidDemo() {
  const ids = [
    'b1f2c3d4-5e6f-4a8b-9c0d-1e2f3a4b5c6d',
    '7a9c2e10-4d3b-4f1a-8e2c-6b5d4c3a2f1e',
    'f0e1d2c3-b4a5-4968-8776-5a4b3c2d1e0f',
  ];
  return (
    <Frames
      interval={1500}
      frames={ids.map((id, n) => (
        <div key={n}>
          <Label>uuid v4 · generated</Label>
          <div
            className='rounded-[8px] border border-border bg-surface p-2.5 text-[13px] text-foreground'
            style={{ fontFamily: mono }}
          >
            {id}
          </div>
          <div className='mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent-bg px-2.5 py-1 text-[11px] font-semibold text-accent'>
            ✶ New ID
          </div>
        </div>
      ))}
    />
  );
}

const TOOL_DEMOS: Record<string, () => ReactNode> = {
  jwt: JwtDemo,
  json: JsonDemo,
  base64: Base64Demo,
  uuid: UuidDemo,
};

export function ToolDemo({ slug }: { slug: string }) {
  const D = TOOL_DEMOS[slug];
  return <DemoFrame>{D ? <D /> : null}</DemoFrame>;
}

/* ── Game demos ── */
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
        <Reel symbols={['🍒', '🔔', '7️⃣', '⭐', '🍋']} dur={1.0} />
        <Reel symbols={['7️⃣', '🍋', '⭐', '🍒', '🔔']} dur={1.3} />
        <Reel symbols={['⭐', '🍒', '🔔', '7️⃣', '🍋']} dur={1.6} />
        <div className='pointer-events-none absolute inset-x-0 top-1/2 h-[44px] -translate-y-1/2 rounded-[6px] border-2 border-accent/60' />
      </div>
    </div>
  );
}

function FlappyDemo() {
  return (
    <div
      className='relative h-full overflow-hidden rounded-[8px]'
      style={{
        background:
          'linear-gradient(180deg, #cfe6f2 0%, #e8f3f7 60%, #d8ead0 100%)',
      }}
    >
      <div className='absolute left-0 top-0 flex h-full demo-pipes'>
        {[0, 1, 2].map((n) => (
          <div
            key={n}
            className='relative'
            style={{ width: 150, height: '100%' }}
          >
            <div
              className='absolute left-12 top-0 w-7 rounded-b-[4px] bg-[#6f9e5a]'
              style={{ height: 56 }}
            />
            <div
              className='absolute bottom-0 left-12 w-7 rounded-t-[4px] bg-[#6f9e5a]'
              style={{ height: 70 }}
            />
          </div>
        ))}
      </div>
      <div
        className='demo-bird absolute left-[34%] top-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-[#e0b341] text-[14px] shadow'
        style={{ marginTop: -14 }}
      >
        🐤
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

const GAME_DEMOS: Record<string, () => ReactNode> = {
  'slot-machine': SlotDemo,
  flappy: FlappyDemo,
  'daily-luck': DailyLuckDemo,
};

export function GameDemo({ slug }: { slug: string }) {
  const D = GAME_DEMOS[slug];
  return <DemoFrame>{D ? <D /> : null}</DemoFrame>;
}

export const TOOL_DEMO_SLUGS = Object.keys(TOOL_DEMOS);
export const GAME_DEMO_SLUGS = Object.keys(GAME_DEMOS);

'use client';

import { type ReactNode } from 'react';

import {
  code,
  DemoFrame,
  Frames,
  Label,
  mono,
} from '@/components/demos/DemoKit';

/* Per-tool demos, owned by the tools domain. The homepage retrieves one by
   slug via ToolDemo. */

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
            <span style={{ color: code.key }}>eyJhbGciOiJIUzI1NiJ9</span>
            <span style={{ color: code.punct }}>.</span>
            <span style={{ color: code.num }}>
              eyJzdWIiOiIxIiwibmFtZSI6IkFJSHVlcyJ9
            </span>
            <span style={{ color: code.punct }}>.</span>
            <span style={{ color: code.str }}>SflKxwRJSMeKKF2QT4</span>
          </div>
        </div>,
        <div key='d' className='text-[12px]' style={{ fontFamily: mono }}>
          <Label>Decoded payload</Label>
          <div className='rounded-[8px] border border-border bg-surface p-2.5 leading-relaxed'>
            <div>
              <span style={{ color: code.punct }}>{'{'}</span>
            </div>
            <div className='pl-3'>
              <span style={{ color: code.key }}>&quot;sub&quot;</span>
              <span style={{ color: code.punct }}>: </span>
              <span style={{ color: code.str }}>&quot;1&quot;</span>,
            </div>
            <div className='pl-3'>
              <span style={{ color: code.key }}>&quot;name&quot;</span>
              <span style={{ color: code.punct }}>: </span>
              <span style={{ color: code.str }}>&quot;AIHues&quot;</span>,
            </div>
            <div className='pl-3'>
              <span style={{ color: code.key }}>&quot;exp&quot;</span>
              <span style={{ color: code.punct }}>: </span>
              <span style={{ color: code.num }}>1924905600</span>
            </div>
            <div>
              <span style={{ color: code.punct }}>{'}'}</span>
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
        <div key='f' className='text-[12px]' style={{ fontFamily: mono }}>
          <Label>Formatted</Label>
          <div className='rounded-[8px] border border-border bg-surface p-2.5 leading-[1.5]'>
            <div>
              <span style={{ color: code.key }}>&quot;user&quot;</span>: {'{'}
            </div>
            <div className='pl-3'>
              <span style={{ color: code.key }}>&quot;id&quot;</span>:{' '}
              <span style={{ color: code.num }}>7</span>,
            </div>
            <div className='pl-3'>
              <span style={{ color: code.key }}>&quot;name&quot;</span>:{' '}
              <span style={{ color: code.str }}>&quot;AIHues&quot;</span>,
            </div>
            <div className='pl-3'>
              <span style={{ color: code.key }}>&quot;tags&quot;</span>: [
              <span style={{ color: code.str }}>&quot;ai&quot;</span>,{' '}
              <span style={{ color: code.str }}>&quot;tools&quot;</span>]
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
            style={{ fontFamily: mono, color: code.num }}
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
      interval={2200}
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

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className='rounded-[8px] border border-border bg-surface py-2 text-center'>
      <div className='text-[19px] font-extrabold leading-none text-accent'>
        {n}
      </div>
      <div className='mt-1 text-[10px] uppercase tracking-wide text-muted'>
        {l}
      </div>
    </div>
  );
}

function WordCountDemo() {
  const text =
    'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.';
  return (
    <Frames
      frames={[
        <div key='a' className='flex h-full flex-col'>
          <Label>Paste text</Label>
          <p className='text-[12px] leading-relaxed text-secondary'>{text}</p>
          <div className='mt-auto text-[12px] font-medium text-muted'>
            Counting…
          </div>
        </div>,
        <div key='b' className='flex h-full flex-col'>
          <Label>Live count</Label>
          <p className='line-clamp-3 text-[12px] leading-relaxed text-secondary'>
            {text}
          </p>
          <div className='mt-auto grid grid-cols-3 gap-2'>
            <Stat l='words' n='17' />
            <Stat l='chars' n='84' />
            <Stat l='min read' n='1' />
          </div>
        </div>,
      ]}
    />
  );
}

function XPostDemo() {
  return (
    <Frames
      frames={[
        <div key='a' className='flex h-full flex-col'>
          <Label>Prompt</Label>
          <div className='rounded-[8px] border border-border bg-surface p-2.5 text-[13px] text-foreground'>
            Write an X post about launch-day tips
          </div>
          <div className='mt-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[12px] font-semibold text-white'>
            ✶ Generate
          </div>
        </div>,
        <div key='b'>
          <Label>Generated post</Label>
          <div className='rounded-[10px] border border-border bg-surface p-3'>
            <div className='mb-1.5 flex items-center gap-2'>
              <span className='h-6 w-6 rounded-full bg-accent' />
              <span className='text-[12px] font-bold text-foreground'>
                AIHues
              </span>
              <span className='text-[11px] text-muted'>@aihues</span>
            </div>
            <p className='text-[12px] leading-relaxed text-foreground'>
              Shipping today? 🚀 Reply to every comment in the first hour, post
              your “why”, and pin a 20-second demo.{' '}
              <span className='text-accent'>#buildinpublic</span>
            </p>
          </div>
        </div>,
      ]}
    />
  );
}

const TOOL_DEMOS: Record<string, () => ReactNode> = {
  json: JsonDemo,
  jwt: JwtDemo,
  'word-count': WordCountDemo,
  base64: Base64Demo,
  'x-post': XPostDemo,
  uuid: UuidDemo,
};

export function ToolDemo({ slug }: { slug: string }) {
  const D = TOOL_DEMOS[slug];
  return <DemoFrame>{D ? <D /> : null}</DemoFrame>;
}

export const TOOL_DEMO_SLUGS = Object.keys(TOOL_DEMOS);

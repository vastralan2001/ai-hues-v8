'use client';

import rough from 'roughjs';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/* scene-kit — the shared toolkit every Stories scene is built from. A scene is a
   small atmospheric SVG illustration tied to one article: a soft gradient sky
   for depth, solid shapes drawn with rough.js (sketchy outlines + hachure fills)
   for hand-drawn texture, and Framer Motion for gentle looping life. Fixed
   per-shape seeds keep rough deterministic so SSR and client render identically.
   Coordinate space is a 200×100 landscape, full-bleed.

   See .claude/skills/story-demo/SKILL.md for the authoring guide. */

export const FONT =
  '"Radiance", var(--font-noto-sans), "Noto Sans", sans-serif';
export const INK = '#5b5346'; // muted hand-drawn ink
export const gen = rough.generator();

export const loop = (duration: number, delay = 0) => ({
  duration,
  repeat: Infinity,
  ease: 'easeInOut' as const,
  delay,
});
export const linear = (duration: number) => ({
  duration,
  repeat: Infinity,
  ease: 'linear' as const,
});

export type Opts = Parameters<typeof gen.path>[1];

/* Outline-only rough preset. Pass a unique seed per shape. */
export const stroke = (seed: number, over: Opts = {}): Opts => ({
  stroke: INK,
  strokeWidth: 1.1,
  roughness: 1.3,
  bowing: 1.4,
  seed,
  ...over,
});

/* Filled rough preset (hachure by default; pass fillStyle:'solid' for flat). */
export const filled = (seed: number, fill: string, over: Opts = {}): Opts => ({
  stroke: INK,
  strokeWidth: 1.1,
  roughness: 1.2,
  bowing: 1,
  fill,
  fillStyle: 'hachure',
  fillWeight: 0.7,
  hachureGap: 2.6,
  seed,
  ...over,
});

/* Render a rough drawable's op-sets as plain SVG paths (DOM-free, SSR-safe).
   Wrap in <motion.g> for animation. */
export function Ink({ d }: { d: ReturnType<typeof gen.path> }) {
  const o = d.options;
  return (
    <>
      {d.sets.map((set, i) => {
        const path = gen.opsToPath(set);
        if (set.type === 'fillSketch')
          return (
            <path
              key={i}
              d={path}
              fill='none'
              stroke={o.fill}
              strokeWidth={
                o.fillWeight && o.fillWeight > 0 ? o.fillWeight : 0.8
              }
            />
          );
        if (set.type === 'fillPath')
          return <path key={i} d={path} fill={o.fill} stroke='none' />;
        return (
          <path
            key={i}
            d={path}
            fill='none'
            stroke={o.stroke}
            strokeWidth={o.strokeWidth}
          />
        );
      })}
    </>
  );
}

/* The scene frame: a gradient-sky <div> + a 200×100 <svg>. */
export function Frame({
  sky,
  children,
}: {
  sky: [string, string];
  children: ReactNode;
}) {
  return (
    <div
      className='h-full w-full'
      style={{ background: `linear-gradient(165deg, ${sky[0]}, ${sky[1]})` }}
    >
      <svg
        viewBox='0 0 200 100'
        preserveAspectRatio='xMidYMid slice'
        className='h-full w-full'
        style={{ fontFamily: FONT }}
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        {/* faint hand-drawn paper grain over the gradient sky */}
        <g opacity={0.07}>
          <Ink
            d={gen.rectangle(0, 0, 200, 100, {
              fill: INK,
              fillStyle: 'cross-hatch',
              hachureGap: 7,
              fillWeight: 0.5,
              roughness: 2.6,
              stroke: 'none',
              seed: 7,
            })}
          />
        </g>
        {children}
      </svg>
    </div>
  );
}

/* A twinkling star/spark. */
export function Twinkle({
  x,
  y,
  d = 0,
  r = 1.1,
  c = '#fff',
}: {
  x: number;
  y: number;
  d?: number;
  r?: number;
  c?: string;
}) {
  return (
    <motion.circle
      cx={x}
      cy={y}
      r={r}
      fill={c}
      animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.6, 1.1, 0.6] }}
      transition={loop(2.4, d)}
      style={{ transformOrigin: `${x}px ${y}px` }}
    />
  );
}

/* A soft cloud (plain fill — sits in the sky, behind the rough subject). */
export function Cloud({
  x,
  y,
  s = 1,
  o = 0.5,
}: {
  x: number;
  y: number;
  s?: number;
  o?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill='#fff' opacity={o}>
      <ellipse cx='0' cy='0' rx='15' ry='5' />
      <ellipse cx='10' cy='1.5' rx='9' ry='4' />
      <ellipse cx='-10' cy='2' rx='8' ry='3.5' />
    </g>
  );
}

export { motion };

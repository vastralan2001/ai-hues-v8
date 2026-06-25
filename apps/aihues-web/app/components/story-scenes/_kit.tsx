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
  const seed = Math.round(Math.abs(x) * 5 + Math.abs(y) * 2) + 1;
  const a = r * 2.4;
  return (
    <motion.g
      animate={{ opacity: [0.2, 0.95, 0.2], scale: [0.5, 1.15, 0.5] }}
      transition={loop(2.4, d)}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      <Ink
        d={gen.path(
          `M${x - a} ${y} L${x + a} ${y} M${x} ${y - a} L${x} ${y + a}`,
          { stroke: c, strokeWidth: 1, roughness: 2, bowing: 2, seed }
        )}
      />
    </motion.g>
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
  const seed = Math.round(Math.abs(x) * 7 + Math.abs(y) * 3) + 1;
  const puff = (cx: number, cy: number, w: number, h: number, sd: number) =>
    gen.ellipse(cx, cy, w, h, {
      fill: '#fff',
      fillStyle: 'solid',
      stroke: INK,
      strokeWidth: 0.8,
      roughness: 1.5,
      seed: sd,
    });
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <Ink d={puff(0, 0, 30, 10, seed)} />
      <Ink d={puff(10, 1.5, 18, 8, seed + 1)} />
      <Ink d={puff(-10, 2, 16, 7, seed + 2)} />
    </g>
  );
}

/* A rough, animated dashed trail — use instead of a plain <motion.path> dashed
   line so trails/paths are hand-drawn too. */
export function RoughDash({
  d,
  c = INK,
  w = 1.8,
  dur = 1.7,
  seed = 9,
  dash = '5 7',
  o = 1,
}: {
  d: string;
  c?: string;
  w?: number;
  dur?: number;
  seed?: number;
  dash?: string;
  o?: number;
}) {
  const path = gen.opsToPath(
    gen.path(d, { stroke: c, strokeWidth: w, roughness: 1.4, seed }).sets[0]
  );
  return (
    <motion.path
      d={path}
      fill='none'
      stroke={c}
      strokeWidth={w}
      strokeDasharray={dash}
      opacity={o}
      animate={{ strokeDashoffset: [0, -24] }}
      transition={linear(dur)}
    />
  );
}

/* A rough 5-point star (lucide `star`). Bigger, more characterful accent than a
   Twinkle — use sparingly. */
export function Star({
  x,
  y,
  r = 5,
  c = '#f0b449',
  seed = 1,
  solid = true,
}: {
  x: number;
  y: number;
  r?: number;
  c?: string;
  seed?: number;
  solid?: boolean;
}) {
  const pts: [number, number][] = [];
  for (let i = 0; i < 10; i++) {
    const ang = (Math.PI / 5) * i - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.44;
    pts.push([x + Math.cos(ang) * rad, y + Math.sin(ang) * rad]);
  }
  return (
    <Ink
      d={gen.polygon(pts, filled(seed, c, solid ? { fillStyle: 'solid' } : {}))}
    />
  );
}

/* A rough sun: a disc with radiating strokes (lucide `sun`). */
export function Sun({
  x,
  y,
  r = 8,
  c = '#f6e7bb',
  ray = '#e8c777',
  seed = 1,
}: {
  x: number;
  y: number;
  r?: number;
  c?: string;
  ray?: string;
  seed?: number;
}) {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (Math.PI / 4) * i;
    return [
      x + Math.cos(a) * r * 1.5,
      y + Math.sin(a) * r * 1.5,
      x + Math.cos(a) * r * 2.2,
      y + Math.sin(a) * r * 2.2,
    ];
  });
  return (
    <g>
      {rays.map((p, i) => (
        <Ink
          key={i}
          d={gen.line(p[0], p[1], p[2], p[3], {
            stroke: ray,
            strokeWidth: 1.2,
            roughness: 1.6,
            seed: seed + i + 1,
          })}
        />
      ))}
      <Ink
        d={gen.circle(x, y, r * 2, filled(seed, c, { fillStyle: 'solid' }))}
      />
    </g>
  );
}

/* A row of rough mountain/hill silhouettes for depth (lucide `mountain`). */
export function Mountains({
  peaks,
  base = 92,
  color = '#9ab37f',
  seed = 1,
}: {
  peaks: [number, number, number][]; // [leftX, peakX/peakY via tuple], see below
  base?: number;
  color?: string;
  seed?: number;
}) {
  // peaks: array of [leftX, peakX, peakY]; right edge is the next peak's leftX.
  return (
    <g>
      {peaks.map(([lx, px, py], i) => {
        const rx = peaks[i + 1] ? peaks[i + 1][0] : px + (px - lx);
        return (
          <Ink
            key={i}
            d={gen.polygon(
              [
                [lx, base],
                [px, py],
                [rx, base],
              ],
              filled(seed + i, color, { hachureGap: 3.5 })
            )}
          />
        );
      })}
    </g>
  );
}

/* A rough lightning bolt (lucide `zap`). */
export function Bolt({
  x,
  y,
  s = 1,
  c = '#f0b449',
  seed = 1,
}: {
  x: number;
  y: number;
  s?: number;
  c?: string;
  seed?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Ink
        d={gen.polygon(
          [
            [2, -8],
            [-4, 1],
            [0, 1],
            [-2, 8],
            [5, -2],
            [1, -2],
          ],
          filled(seed, c, { fillStyle: 'solid', strokeWidth: 1 })
        )}
      />
    </g>
  );
}

export { motion };

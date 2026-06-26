'use client';

import rough from 'roughjs';
import { motion } from 'framer-motion';
import { createContext, useContext, useState, type ReactNode } from 'react';

/* When true, scene primitives render their static frame (no running animation).
   StoryArt sets this for the listing grid until a card is hovered. reduced-motion
   only freezes transforms, so opacity (Twinkle) and strokeDashoffset (RoughDash)
   animations are paused through this context instead. */
export const ScenePaused = createContext(false);

/* scene-kit — the shared toolkit every Stories scene is built from. A scene is a
   small atmospheric SVG illustration tied to one article: a soft gradient sky
   for depth, solid shapes drawn with rough.js (sketchy outlines + hachure fills)
   for hand-drawn texture, and Framer Motion for gentle looping life. Fixed
   per-shape seeds keep rough deterministic so SSR and client render identically.
   Coordinate space is a 200×100 landscape, full-bleed.

   See .claude/skills/story-demo/SKILL.md for the authoring guide. */

export const FONT = 'var(--font-display)';
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

/* The scene frame: a 200×100 <svg> with the gradient sky baked in (so the SVG is
   self-contained — needed for the frozen <img> snapshot + image export). The
   gradient id is globally sequential (not useId), so it stays unique even across
   separate renderToStaticMarkup passes that each reset the useId counter. */
let frameSeq = 0;
export function Frame({
  sky,
  children,
}: {
  sky: [string, string];
  children: ReactNode;
}) {
  const [gid] = useState(() => `sky-${frameSeq++}`);
  return (
    <div className='h-full w-full'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 200 100'
        preserveAspectRatio='xMidYMid slice'
        className='h-full w-full'
        style={{ fontFamily: FONT }}
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <defs>
          <linearGradient id={gid} x1='0' y1='0' x2='0.45' y2='1'>
            <stop offset='0%' stopColor={sky[0]} />
            <stop offset='100%' stopColor={sky[1]} />
          </linearGradient>
        </defs>
        <rect x='0' y='0' width='200' height='100' fill={`url(#${gid})`} />
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
  const paused = useContext(ScenePaused);
  const mark = (
    <Ink
      d={gen.path(
        `M${x - a} ${y} L${x + a} ${y} M${x} ${y - a} L${x} ${y + a}`,
        { stroke: c, strokeWidth: 1, roughness: 2, bowing: 2, seed }
      )}
    />
  );
  if (paused) return <g opacity={0.85}>{mark}</g>;
  return (
    <motion.g
      animate={{ opacity: [0.2, 0.95, 0.2], scale: [0.5, 1.15, 0.5] }}
      transition={loop(2.4, d)}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      {mark}
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
  const paused = useContext(ScenePaused);
  if (paused)
    return (
      <path
        d={path}
        fill='none'
        stroke={c}
        strokeWidth={w}
        strokeDasharray={dash}
        opacity={o}
      />
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

/* Render ANY lucide icon as a rough drawing. Import an icon's raw node:
     import { __iconNode as bookNode } from 'lucide-react/dist/esm/icons/book-open.mjs';
   then: <RoughIcon node={bookNode} x={100} y={50} size={44} c={INK} fill='#e2693f' seed={10} />.
   lucide icons are a 24×24 grid; `size` scales the whole icon, centred at (x,y). */
export type IconNode = [string, Record<string, string | number>][];

function iconPts(s: string): [number, number][] {
  return s
    .trim()
    .split(/\s+/)
    .map((p) => p.split(',').map(Number) as [number, number]);
}

export function RoughIcon({
  node,
  x,
  y,
  size = 24,
  c = INK,
  fill,
  sw = 1.2,
  seed = 1,
}: {
  node: IconNode;
  x: number;
  y: number;
  size?: number;
  c?: string;
  fill?: string;
  sw?: number;
  seed?: number;
}) {
  const k = size / 24;
  const opt = (i: number): Opts =>
    fill
      ? filled(seed + i, fill, {
          stroke: c,
          strokeWidth: sw / k,
          fillStyle: 'solid',
        })
      : stroke(seed + i, { stroke: c, strokeWidth: sw / k });
  return (
    <g transform={`translate(${x} ${y}) scale(${k}) translate(-12 -12)`}>
      {node.map(([tag, a], i) => {
        const o = opt(i);
        let d: ReturnType<typeof gen.path> | null = null;
        if (tag === 'path') d = gen.path(String(a.d), o);
        else if (tag === 'line') d = gen.line(+a.x1, +a.y1, +a.x2, +a.y2, o);
        else if (tag === 'circle') d = gen.circle(+a.cx, +a.cy, +a.r * 2, o);
        else if (tag === 'rect')
          d = gen.rectangle(+a.x, +a.y, +a.width, +a.height, o);
        else if (tag === 'ellipse')
          d = gen.ellipse(+a.cx, +a.cy, +a.rx * 2, +a.ry * 2, o);
        else if (tag === 'polyline')
          d = gen.linearPath(iconPts(String(a.points)), o);
        else if (tag === 'polygon')
          d = gen.polygon(iconPts(String(a.points)), o);
        return d ? <Ink key={i} d={d} /> : null;
      })}
    </g>
  );
}

export { motion };

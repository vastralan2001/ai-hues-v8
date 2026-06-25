'use client';
import {
  Frame,
  Ink,
  RoughDash,
  gen,
  filled,
  stroke,
  loop,
  INK,
  motion,
  Bolt,
} from './_kit';

/* The 2026 AI Productivity Stack — the metaphor: a small tiered tower of glowing
   layered slabs (the "stack" of tools/workflows), each layer wider toward the
   base, a steady output beam rising from the crown into a gold star, with input
   sparks streaming up through the layers — many small efforts compounding into
   one bright result (10x). Seeds 90–130; gradient ids prefixed aps_. */

type Slab = {
  cx: number;
  cy: number;
  w: number;
  color: string;
  seed: number;
  ph: number;
};

const SLABS: Slab[] = [
  { cx: 100, cy: 80, w: 34, color: '#94ac78', seed: 92, ph: 0 },
  { cx: 100, cy: 71, w: 28, color: '#6a9bcc', seed: 94, ph: 0.4 },
  { cx: 100, cy: 62, w: 22, color: '#e0a83f', seed: 96, ph: 0.8 },
  { cx: 100, cy: 53, w: 16, color: '#c2502e', seed: 98, ph: 1.2 },
];

function StackSlab({ cx, cy, w, color, seed, ph }: Slab) {
  const h = 6;
  const x = cx - w / 2;
  const y = cy - h / 2;
  const half = w / 2;
  return (
    <motion.g
      animate={{ y: [0, -1.4, 0] }}
      transition={loop(2.8, ph)}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      {/* top face — a thin parallelogram for a touch of 3D depth */}
      <Ink
        d={gen.polygon(
          [
            [x, y],
            [x + w, y],
            [x + w - 4, y - 3],
            [x - 4, y - 3],
          ],
          filled(seed, color, { fillStyle: 'solid', strokeWidth: 1.1 })
        )}
      />
      {/* front face — hachured body of the slab */}
      <Ink
        d={gen.rectangle(
          x,
          y,
          w,
          h,
          filled(seed + 1, color, { hachureGap: 2.2, fillWeight: 0.7 })
        )}
      />
      {/* a faint seam to read as a stacked plate */}
      <Ink
        d={gen.line(
          cx - half + 2,
          cy + 1.6,
          cx + half - 2,
          cy + 1.6,
          stroke(seed + 2, { stroke: '#fff', strokeWidth: 0.6, roughness: 0.8 })
        )}
      />
    </motion.g>
  );
}

export default function Scene() {
  return (
    <Frame sky={['#fbf3e6', '#efe1c6']}>
      <defs>
        <radialGradient id='aps_star' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff1cf' stopOpacity='1' />
          <stop offset='100%' stopColor='#fff1cf' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='aps_beam' x1='0' y1='1' x2='0' y2='0'>
          <stop offset='0%' stopColor='#f0b449' stopOpacity='0' />
          <stop offset='100%' stopColor='#f0b449' stopOpacity='0.85' />
        </linearGradient>
      </defs>

      {/* distant depth */}
      <Bolt x={30} y={40} s={0.9} c='#cf9836' seed={231} />

      {/* soft ground band for the tower to sit on */}
      <Ink
        d={gen.path(
          'M0 88 Q100 83 200 88 L200 100 L0 100 Z',
          filled(90, '#e6d3ab', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />
      <g opacity='0.09'>
        <Ink
          d={gen.ellipse(
            100,
            86,
            48,
            7,
            filled(91, INK, { fillStyle: 'solid', stroke: 'none' })
          )}
        />
      </g>

      {/* the star the stack feeds into */}
      <circle cx='100' cy='28' r='16' fill='url(#aps_star)' />

      {/* a thin dashed conduit threading the layers — flow of work upward */}
      <RoughDash
        d='M100 86 L100 30'
        c='#cf9836'
        w={0.8}
        dur={1.8}
        dash='1.4 4'
        o={0.45}
        seed={93}
      />

      {/* steady output beam from the crown up to the star */}
      <motion.rect
        x='98.4'
        y='30'
        width='3.2'
        height='20'
        rx='1.4'
        fill='url(#aps_beam)'
        animate={{ opacity: [0.4, 0.85, 0.4], scaleY: [0.9, 1, 0.9] }}
        transition={loop(2.2)}
        style={{ transformOrigin: '100px 50px' }}
      />

      {/* input sparks streaming up through the layered stack */}
      {[
        { x: 88, d: 0, seed: 100 },
        { x: 112, d: 0.9, seed: 101 },
        { x: 100, d: 1.7, seed: 102 },
      ].map((s) => (
        <motion.g
          key={s.x}
          animate={{ y: [0, -36], opacity: [0, 0.75, 0] }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: 'easeOut',
            delay: s.d,
          }}
        >
          <Ink
            d={gen.circle(
              s.x,
              86,
              2.6,
              filled(s.seed, '#e2693f', { fillStyle: 'solid', stroke: 'none' })
            )}
          />
        </motion.g>
      ))}

      {/* the tiered stack, base → crown */}
      {SLABS.map((s) => (
        <StackSlab key={s.seed} {...s} />
      ))}

      {/* the gold star — the 10x result */}
      <motion.g
        animate={{ scale: [0.92, 1.08, 0.92], rotate: [0, 6, 0] }}
        transition={loop(2.4)}
        style={{ transformOrigin: '100px 28px' }}
      >
        <Ink
          d={gen.polygon(
            [
              [100, 19],
              [102.6, 24.4],
              [108.6, 25.1],
              [104.3, 29.1],
              [105.4, 35],
              [100, 32],
              [94.6, 35],
              [95.7, 29.1],
              [91.4, 25.1],
              [97.4, 24.4],
            ],
            filled(110, '#f0b449', { fillStyle: 'solid' })
          )}
        />
      </motion.g>
    </Frame>
  );
}

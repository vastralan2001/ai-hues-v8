'use client';

import {
  Frame,
  Ink,
  RoughDash,
  RoughIcon,
  gen,
  filled,
  stroke,
  loop,
  INK,
  motion,
  Bolt,
} from './_kit';
import { __iconNode as cpuNode } from 'lucide-react/dist/esm/icons/cpu.mjs';

/* Kimi K2 — Open Agentic Intelligence at Trillion Scale.
   Metaphor: a vast field of faint expert-stars (the 1T-parameter sparse
   constellation, 384 experts). A central routing core fires, and a routing
   beacon lights only a small ring of them gold — the 8 experts / 32B active per
   token. Beneath it all runs one steady, unbroken horizon line: the MuonClip
   training curve that never spikes. A small rough cpu-chip is the model core
   the sparse network feeds. Seeds: 700-series. Ids prefixed `k2`. */

const ID = 'k2';

// the sparse constellation: many faint experts scattered across the sky
const sparse: Array<[number, number, number]> = [
  [34, 22, 0.8],
  [52, 16, 0.6],
  [70, 26, 0.7],
  [128, 18, 0.7],
  [150, 28, 0.6],
  [168, 20, 0.8],
  [44, 38, 0.5],
  [158, 42, 0.5],
  [88, 14, 0.6],
  [112, 13, 0.6],
];

// the 8 routed (active) experts: a small ring lit gold around the core
const CX = 100;
const CY = 40;
const active = Array.from({ length: 8 }, (_, i) => {
  const a = (Math.PI * 2 * i) / 8 - Math.PI / 2;
  return {
    x: CX + Math.cos(a) * 26,
    y: CY + Math.sin(a) * 15,
    ph: (i % 4) * 0.32,
    seed: 720 + i,
  };
});

export default function Scene() {
  return (
    <Frame sky={['#fdf2e4', '#f1dcc6']}>
      <defs>
        <radialGradient id={`${ID}_core`} cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff3d6' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff3d6' stopOpacity='0' />
        </radialGradient>
        <radialGradient id={`${ID}_lit`} cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#ffe9b0' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#ffe9b0' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* far sky seasoning */}
      <Bolt x={22} y={30} s={0.9} c='#cf9836' seed={171} />

      {/* the sparse trillion — faint, unrouted expert-stars left dim */}
      {sparse.map(([sx, sy, o], i) => (
        <g key={i} opacity={o * 0.6}>
          <Ink
            d={gen.circle(
              sx,
              sy,
              2.4,
              filled(700 + i, '#c9b48c', {
                fillStyle: 'solid',
                strokeWidth: 0.8,
                roughness: 1.4,
              })
            )}
          />
        </g>
      ))}

      {/* soft halo behind the routing core */}
      <circle cx={CX} cy={CY} r='40' fill={`url(#${ID}_core)`} />

      {/* the 8 routed experts — lit gold, gently pulsing (32B active) */}
      {active.map((e, i) => (
        <g key={e.seed}>
          <circle cx={e.x} cy={e.y} r='5.5' fill={`url(#${ID}_lit)`} />
          <motion.g
            animate={{ scale: [0.85, 1.12, 0.85], opacity: [0.7, 1, 0.7] }}
            transition={loop(2.4, e.ph)}
            style={{ transformOrigin: `${e.x}px ${e.y}px` }}
          >
            <Ink
              d={gen.circle(
                e.x,
                e.y,
                4.6,
                filled(e.seed, i % 2 === 0 ? '#e0a83f' : '#e2693f', {
                  fillStyle: 'solid',
                  strokeWidth: 1,
                  roughness: 1.1,
                })
              )}
            />
          </motion.g>
        </g>
      ))}

      {/* routing beams — the router selecting its 8 of 384, sweeping out */}
      {active
        .filter((_, i) => i % 2 === 0)
        .map((e, i) => (
          <RoughDash
            key={i}
            d={`M${CX} ${CY} L${e.x} ${e.y}`}
            c='#cf9836'
            w={1.1}
            dur={1.5 + i * 0.2}
            dash='1.5 5'
            seed={740 + i}
            o={0.55}
          />
        ))}

      {/* the routing core / model heart — a rough cpu chip, slowly breathing */}
      <motion.g
        animate={{ scale: [1, 1.06, 1] }}
        transition={loop(2.8)}
        style={{ transformOrigin: `${CX}px ${CY}px` }}
      >
        <RoughIcon
          node={cpuNode}
          x={CX}
          y={CY}
          size={26}
          c={INK}
          fill='#c2502e'
          seed={760}
        />
      </motion.g>

      {/* the MuonClip training curve — one long, steady, unbroken line that
          rises and never spikes (15.5T tokens, zero loss spikes) */}
      <Ink
        d={gen.path(
          'M6 86 Q40 80 70 78 T132 73 Q166 71 196 70',
          stroke(770, { stroke: '#788c5d', strokeWidth: 1.6, roughness: 0.9 })
        )}
      />
      {/* a faint baseline beneath the curve for ground/depth */}
      <Ink
        d={gen.line(
          6,
          92,
          196,
          92,
          stroke(771, { stroke: '#c9b48c', strokeWidth: 0.8, roughness: 1.1 })
        )}
      />

      {/* a single twinkle riding the steady end of the curve — the stable run */}
    </Frame>
  );
}

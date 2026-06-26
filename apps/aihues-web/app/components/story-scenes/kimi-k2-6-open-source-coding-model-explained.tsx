'use client';
import {
  Frame,
  Ink,
  RoughDash,
  Star,
  RoughIcon,
  gen,
  filled,
  stroke,
  loop,
  motion,
  INK,
} from './_kit';
import { __iconNode as flagNode } from 'lucide-react/dist/esm/icons/flag.mjs';

/* Metaphor: K2.6's coding edge is long-horizon endurance — thousands of tool
   calls over many hours to summit a benchmark it was not supposed to top.
   A lone roped climber ascends a staircase of rising benchmark bars toward a
   summit flag planted above the closed-source frontier line, dawn sky for the
   open-weights-reaching-the-top mood. Seed block: 60..89. ids: k26_*. */

export default function Scene() {
  // rising "scorecard" steps the climber ascends — each taller than the last
  const steps: [number, number][] = [
    [44, 84],
    [72, 76],
    [100, 68],
    [128, 58],
    [156, 46],
  ];
  return (
    <Frame sky={['#fbeede', '#f4d3b0']}>
      <defs>
        <radialGradient id='k26_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff1cf' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff1cf' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='k26_ridge' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#caa985' />
          <stop offset='100%' stopColor='#a8855f' />
        </linearGradient>
      </defs>

      {/* dawn glow behind the summit */}
      <circle cx='168' cy='30' r='30' fill='url(#k26_glow)' />

      {/* the "closed-source frontier" — a faint horizon line the steps rise past */}
      <Ink
        d={gen.path(
          'M0 64 Q60 62 120 63 T200 62',
          stroke(60, { stroke: '#e7c9a4', strokeWidth: 0.9, roughness: 1.3 })
        )}
      />

      {/* rising staircase of benchmark bars (the scorecard, climbed) */}
      {steps.map(([sx, sy], i) => (
        <Ink
          key={i}
          d={gen.rectangle(
            sx - 14,
            sy,
            28,
            100 - sy,
            filled(62 + i, '#caa985', {
              fill: 'url(#k26_ridge)' as unknown as string,
              fillStyle: 'solid',
              hachureGap: 3.4,
            })
          )}
        />
      ))}
      {/* tread highlights on each step edge */}
      {steps.map(([sx, sy], i) => (
        <Ink
          key={`t${i}`}
          d={gen.line(sx - 14, sy, sx + 14, sy, {
            stroke: '#f0dcc0',
            strokeWidth: 1,
            roughness: 1.1,
            seed: 70 + i,
          })}
        />
      ))}

      {/* the long climbing rope — thousands of tool calls, one continuous run */}
      <RoughDash
        d='M40 86 Q66 80 78 74 Q92 67 104 64 Q120 58 132 54 Q146 49 158 44'
        c='#c2502e'
        w={1.6}
        dur={2.2}
        dash='4 6'
        seed={76}
        o={0.85}
      />

      {/* the lone climber, mid-ascent on the third step, leaning into the slope */}
      <motion.g
        animate={{ y: [0, -1.4, 0] }}
        transition={loop(2.4)}
        style={{ transformOrigin: '104px 60px' }}
      >
        {/* pack */}
        <Ink
          d={gen.circle(
            101,
            56,
            6,
            filled(77, '#788c5d', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
        {/* torso */}
        <Ink
          d={gen.path(
            'M104 52 L106 60 L101 60 Z',
            filled(78, '#e2693f', { fillStyle: 'solid', strokeWidth: 1.1 })
          )}
        />
        {/* head */}
        <Ink
          d={gen.circle(
            105,
            49,
            4.4,
            filled(79, '#e8c79a', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
        {/* lead arm reaching uphill toward the rope */}
        <Ink d={gen.line(105, 53, 112, 49, stroke(80, { strokeWidth: 1.2 }))} />
        {/* trailing leg planted on the step */}
        <Ink d={gen.line(102, 60, 99, 67, stroke(81, { strokeWidth: 1.2 }))} />
        <Ink d={gen.line(105, 60, 108, 67, stroke(82, { strokeWidth: 1.2 }))} />
      </motion.g>

      {/* summit flag planted above the frontier — the top score reached */}
      <motion.g
        animate={{ rotate: [-2.5, 2.5, -2.5] }}
        transition={loop(3)}
        style={{ transformOrigin: '157px 45px' }}
      >
        <RoughIcon
          node={flagNode}
          x={160}
          y={37}
          size={20}
          c={INK}
          fill='#e0a83f'
          seed={84}
        />
      </motion.g>

      {/* a single star above the flag — the open-weights model touching the frontier */}
      <Star x={172} y={20} r={4.2} c='#f0b449' seed={88} />

      {/* faint ground texture at the base */}
      <Ink
        d={gen.path(
          'M2 95 Q50 92 100 95 T200 94',
          stroke(89, { stroke: '#e7c9a4', strokeWidth: 0.8, roughness: 1.4 })
        )}
      />
    </Frame>
  );
}

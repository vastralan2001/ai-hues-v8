'use client';
import {
  Frame,
  Ink,
  Cloud,
  RoughDash,
  Mountains,
  gen,
  filled,
  stroke,
  loop,
  motion,
} from './_kit';

/* Kimi K2 Thinking — metaphor: a single climber traverses a long dawn ridge on
   one continuous guide-rope that is clipped through a row of pitons. Each piton
   is a tool call; the unbroken rope threading every one of them is the reasoning
   chain that stays coherent across 200-300 sequential steps. The climber is
   small and steady, far out along the rope, still pointed at the far summit —
   the thread held all the way out. */

const ID = 'k2t';

// anchor points (pitons) the one rope is clipped through, left to right
const anchors: Array<[number, number]> = [
  [26, 66],
  [54, 60],
  [86, 56],
  [120, 52],
  [156, 48],
];

// the single reasoning rope, sagging gently between each anchor
const ROPE =
  'M14 70 ' +
  'Q40 70 54 60 ' +
  'Q70 56 86 56 ' +
  'Q103 56 120 52 ' +
  'Q138 50 156 48 ' +
  'Q176 46 190 40';

export default function Scene() {
  return (
    <Frame sky={['#fdeede', '#f3d6bd']}>
      <defs>
        <radialGradient id={`${ID}_dawn`} cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff1d8' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff1d8' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* low dawn glow rising off the far end of the traverse */}
      <circle cx='176' cy='40' r='46' fill={`url(#${ID}_dawn)`} />

      <Cloud x={64} y={26} s={0.8} o={0.4} />

      {/* distant ranges for depth — the long horizon the model reasons across */}
      <Mountains
        peaks={[
          [-10, 30, 64],
          [40, 86, 50],
          [108, 150, 58],
          [168, 210, 46],
        ]}
        base={82}
        color='#b9c79f'
        seed={60}
      />
      <Mountains
        peaks={[
          [-6, 44, 72],
          [60, 120, 62],
          [150, 220, 70],
        ]}
        base={92}
        color='#94ac78'
        seed={66}
      />

      {/* the ridge line the rope runs along, a touch below the anchors */}
      <Ink
        d={gen.path(
          'M0 88 Q60 80 120 82 Q170 84 200 78 L200 100 L0 100 Z',
          filled(70, '#dcb88a', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />

      {/* the single continuous reasoning rope, threaded through every anchor */}
      <Ink
        d={gen.path(
          ROPE,
          stroke(72, { stroke: '#c2502e', strokeWidth: 1.7, roughness: 1 })
        )}
      />

      {/* travelling pulse along the rope — reasoning advancing step by step */}
      <RoughDash
        d={ROPE}
        c='#e0a83f'
        w={1.2}
        dur={2.6}
        dash='2 9'
        seed={74}
        o={0.8}
      />

      {/* the pitons — each a clipped-in tool call the one rope passes through */}
      {anchors.map(([ax, ay], i) => (
        <g key={i}>
          <Ink
            d={gen.circle(
              ax,
              ay,
              3.6,
              filled(80 + i, '#788c5d', { fillStyle: 'solid', strokeWidth: 1 })
            )}
          />
          <Ink
            d={gen.line(
              ax,
              ay + 1.6,
              ax,
              ay + 8,
              stroke(90 + i, { strokeWidth: 1, stroke: '#9a8a72' })
            )}
          />
        </g>
      ))}

      {/* the climber — small, far out on the rope, still moving toward the
          far summit; the thread held all the way to step 290 */}
      <motion.g
        animate={{ y: [0, -1.4, 0] }}
        transition={loop(2.8)}
        style={{ transformOrigin: '120px 50px' }}
      >
        {/* rope clip up to the nearest anchor */}
        <Ink
          d={gen.line(
            120,
            52,
            120,
            58,
            stroke(100, { strokeWidth: 0.8, stroke: '#c2502e', roughness: 0.8 })
          )}
        />
        {/* head */}
        <Ink
          d={gen.circle(
            120,
            61,
            5.4,
            filled(101, '#e2693f', { fillStyle: 'solid', strokeWidth: 1.1 })
          )}
        />
        {/* body / pack */}
        <Ink
          d={gen.path(
            'M117 64 Q120 63 123 64 L122 73 Q120 74 118 73 Z',
            filled(102, '#cf9836', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
        {/* reaching arm to the rope */}
        <Ink
          d={gen.line(
            121,
            65,
            120,
            58,
            stroke(103, { strokeWidth: 1.2, stroke: '#c2502e' })
          )}
        />
        {/* stride legs */}
        <Ink
          d={gen.line(
            119,
            73,
            116,
            81,
            stroke(104, { strokeWidth: 1.3, stroke: '#788c5d' })
          )}
        />
        <Ink
          d={gen.line(
            121,
            73,
            124,
            80,
            stroke(105, { strokeWidth: 1.3, stroke: '#788c5d' })
          )}
        />
      </motion.g>
    </Frame>
  );
}

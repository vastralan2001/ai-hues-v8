'use client';

import {
  Frame,
  Ink,
  Twinkle,
  Cloud,
  gen,
  filled,
  stroke,
  loop,
  linear,
  INK,
  motion,
} from './_kit';

/* "Build an AI SaaS in 48 hours" → an hourglass of time: idea-sparks drift in
   the upper bulb, a thin sand-stream falls through the neck, and on the lower
   bulb the falling material has piled up into one small finished product — a
   little lit cabin (the SaaS, its window glowing = first paying customer).
   Time itself assembles the thing. */
export default function Scene() {
  return (
    <Frame sky={['#fdf3e2', '#f3dcbb']}>
      <defs>
        <radialGradient id='saas48_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff3d6' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff3d6' stopOpacity='0' />
        </radialGradient>
        <radialGradient id='saas48_win' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#ffe6ad' stopOpacity='1' />
          <stop offset='100%' stopColor='#ffe6ad' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='saas48_sand' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#f0c97a' />
          <stop offset='100%' stopColor='#d99a3f' />
        </linearGradient>
      </defs>

      {/* low sun = the "48h" deadline glow */}
      <circle cx='44' cy='28' r='40' fill='url(#saas48_glow)' />
      <Cloud x={158} y={24} s={0.8} o={0.4} />
      <Cloud x={36} y={70} s={0.7} o={0.32} />

      {/* tick-of-the-clock sparks toward the edges */}
      <Twinkle x={170} y={20} c='#cf9836' />
      <Twinkle x={26} y={44} d={0.7} c='#e0a83f' />
      <Twinkle x={184} y={58} d={1.2} c='#cf9836' r={1.2} />

      {/* far ground band for depth */}
      <Ink
        d={gen.path(
          'M0 90 Q100 85 200 90 L200 100 L0 100 Z',
          filled(301, '#e9caa0', { roughness: 1.5, hachureGap: 3.4 })
        )}
      />

      {/* drifting idea-sparks in the upper bulb, waiting to fall */}
      {[
        [96, 26, 0],
        [104, 30, 0.5],
        [100, 22, 1.0],
      ].map(([sx, sy, d]) => (
        <motion.circle
          key={sx}
          cx={sx}
          cy={sy}
          r='1.1'
          fill='#e2693f'
          animate={{ y: [0, 2, 0], opacity: [0.4, 0.9, 0.4] }}
          transition={loop(2.6, d)}
          style={{ transformOrigin: `${sx}px ${sy}px` }}
        />
      ))}

      {/* hourglass frame: two caps + the glass twin-cones */}
      <Ink d={gen.line(82, 18, 118, 18, stroke(302, { strokeWidth: 1.5 }))} />
      <Ink d={gen.line(82, 82, 118, 82, stroke(303, { strokeWidth: 1.5 }))} />
      {/* upper cone */}
      <Ink
        d={gen.path(
          'M86 19 L114 19 L101 49 L99 49 Z',
          stroke(304, { strokeWidth: 1.2, roughness: 1.1, bowing: 0.8 })
        )}
      />
      {/* lower cone */}
      <Ink
        d={gen.path(
          'M99 51 L101 51 L114 81 L86 81 Z',
          stroke(305, { strokeWidth: 1.2, roughness: 1.1, bowing: 0.8 })
        )}
      />

      {/* sand remaining in the upper bulb (slowly draining look) */}
      <Ink
        d={gen.path(
          'M90 25 L110 25 L101 46 L99 46 Z',
          filled(306, '#f0c97a', { hachureGap: 2.2, fillWeight: 0.7 })
        )}
      />

      {/* the thin falling sand-stream through the neck */}
      <motion.path
        d='M100 49 L100 70'
        fill='none'
        stroke='#e6b85e'
        strokeWidth='1.4'
        strokeDasharray='1 3'
        animate={{ strokeDashoffset: [0, -8] }}
        transition={linear(0.9)}
      />

      {/* accumulated sand pile in the lower bulb */}
      <Ink
        d={gen.path(
          'M88 81 L112 81 Q100 66 100 66 Q100 66 88 81 Z',
          filled(307, '#dca84e', { hachureGap: 2.4, fillWeight: 0.7 })
        )}
      />

      {/* the SaaS the sand built: a small lit cabin rising on the pile */}
      <motion.g
        animate={{ y: [0, -1.4, 0] }}
        transition={loop(2.4)}
        style={{ transformOrigin: '100px 74px' }}
      >
        {/* soft window glow */}
        <circle cx='100' cy='75' r='8' fill='url(#saas48_win)' />
        {/* cabin body */}
        <Ink
          d={gen.rectangle(
            93,
            72,
            14,
            9,
            filled(308, '#fffaf0', { fillStyle: 'solid', strokeWidth: 1.1 })
          )}
        />
        {/* roof */}
        <Ink
          d={gen.polygon(
            [
              [91, 72],
              [100, 65],
              [109, 72],
            ],
            filled(309, '#c2502e', { fillStyle: 'solid', strokeWidth: 1.1 })
          )}
        />
        {/* lit window = first paying customer */}
        <Ink
          d={gen.rectangle(
            97,
            75,
            6,
            4,
            filled(310, '#e0a83f', { fillStyle: 'solid', strokeWidth: 0.9 })
          )}
        />
      </motion.g>

      {/* a couple of settling sand grains by the cabin base */}
      {[
        [94, 80, 0.2],
        [107, 80, 0.8],
      ].map(([gx, gy, d]) => (
        <motion.circle
          key={gx}
          cx={gx}
          cy={gy}
          r='0.9'
          fill='#d99a3f'
          animate={{ y: [-3, 0], opacity: [0, 0.8, 0] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeIn',
            delay: d,
          }}
        />
      ))}
    </Frame>
  );
}

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
  motion,
} from './_kit';

/* Growth — "Why your landing page isn't converting": a conversion funnel.
   Visitors arrive as a wide gold inflow at the top; a leaky funnel lets most of
   them spill sideways through cracks (the page that doesn't convert), while the
   one fixed channel pours a single clean stream into a vessel that fills up —
   the copy/framework change that doubled signups. Seeds in the 300 range. */

export default function Scene() {
  const SLUG = 'lpconv';
  const leakLeft = 'M86 58 Q74 62 66 72';
  const leakRight = 'M114 58 Q126 62 134 72';
  const channel = 'M100 64 L100 84';

  return (
    <Frame sky={['#fdf3e0', '#f4ddb6']}>
      <defs>
        <radialGradient id={`${SLUG}_glow`} cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff4d8' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff4d8' stopOpacity='0' />
        </radialGradient>
        <linearGradient id={`${SLUG}_vessel`} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#f0bf63' />
          <stop offset='100%' stopColor='#cf9836' />
        </linearGradient>
      </defs>

      {/* sky depth */}
      <circle cx='100' cy='22' r='40' fill={`url(#${SLUG}_glow)`} />
      <Twinkle x={36} y={20} c='#e0a83f' />
      <Twinkle x={166} y={26} d={0.7} c='#cf9836' />
      <Twinkle x={150} y={14} d={1.2} c='#e0a83f' r={0.9} />
      <Cloud x={46} y={30} s={0.78} o={0.42} />
      <Cloud x={158} y={40} s={0.62} o={0.34} />

      {/* far hills for ground depth */}
      <Ink
        d={gen.path(
          'M0 88 Q60 80 120 86 T200 88 L200 100 L0 100 Z',
          filled(301, '#e7c98f', { roughness: 1.6, hachureGap: 3.8 })
        )}
      />

      {/* wide inflow of visitors falling toward the funnel mouth */}
      {[
        [84, 30, 0],
        [100, 26, 0.5],
        [116, 30, 1],
        [92, 22, 1.5],
        [108, 22, 0.9],
      ].map(([dx, dy, dl], i) => (
        <motion.circle
          key={`in-${dx}-${dy}`}
          cx={dx}
          cy={dy}
          r={1.4}
          fill='#e2693f'
          opacity={0.8}
          animate={{ y: [0, 24], opacity: [0, 0.85, 0] }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: 'easeIn',
            delay: dl + i * 0.05,
          }}
        />
      ))}

      {/* the funnel — wide mouth narrowing to a spout */}
      <Ink
        d={gen.polygon(
          [
            [70, 46],
            [130, 46],
            [108, 64],
            [92, 64],
          ],
          filled(302, '#f3f0e6', { fillStyle: 'solid', strokeWidth: 1.2 })
        )}
      />
      {/* hairline cracks in the funnel walls (where visitors leak) */}
      <Ink
        d={gen.line(
          96,
          50,
          88,
          60,
          stroke(303, { strokeWidth: 0.9, stroke: '#c2502e' })
        )}
      />
      <Ink
        d={gen.line(
          112,
          49,
          118,
          59,
          stroke(304, { strokeWidth: 0.9, stroke: '#c2502e' })
        )}
      />

      {/* the leaks — droplets escaping sideways and falling away (lost signups) */}
      <motion.path
        d={leakLeft}
        fill='none'
        stroke='#c2502e'
        strokeWidth='1.4'
        strokeDasharray='1.4 5'
        opacity={0.55}
        animate={{ strokeDashoffset: [0, 12] }}
        transition={linear(1.5)}
      />
      <motion.path
        d={leakRight}
        fill='none'
        stroke='#c2502e'
        strokeWidth='1.4'
        strokeDasharray='1.4 5'
        opacity={0.55}
        animate={{ strokeDashoffset: [0, 12] }}
        transition={linear(1.7)}
      />
      {[
        [62, 74, 0],
        [138, 74, 0.6],
      ].map(([lx, ly, dl]) => (
        <motion.circle
          key={`leak-${lx}`}
          cx={lx}
          cy={ly}
          r={1.1}
          fill='#c2502e'
          opacity={0.5}
          animate={{ y: [0, 14], opacity: [0.5, 0] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeIn',
            delay: dl,
          }}
        />
      ))}

      {/* the fixed channel — one clean bright stream pouring straight down */}
      <motion.path
        d={channel}
        fill='none'
        stroke='#e0a83f'
        strokeWidth='2.2'
        strokeDasharray='2 4'
        animate={{ strokeDashoffset: [0, -18] }}
        transition={linear(0.9)}
      />

      {/* collecting vessel, filling toward the brim */}
      <motion.g
        animate={{ y: [0, -1.2, 0] }}
        transition={loop(2.8)}
        style={{ transformOrigin: '100px 90px' }}
      >
        <Ink
          d={gen.path(
            'M88 84 L112 84 L108 96 L92 96 Z',
            filled(305, '#ffffff', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        <motion.g
          animate={{ scaleY: [0.55, 1, 0.55] }}
          transition={loop(2.8)}
          style={{ transformOrigin: '100px 96px' }}
        >
          <Ink
            d={gen.path(
              'M90 90 L110 90 L108 96 L92 96 Z',
              filled(306, `url(#${SLUG}_vessel)`, { fillStyle: 'solid' })
            )}
          />
        </motion.g>
      </motion.g>

      {/* rising sparks of success above the vessel */}
      {[
        [100, 80, 0],
        [95, 78, 0.8],
        [105, 79, 1.4],
      ].map(([sx, sy, dl], i) => (
        <motion.g
          key={`spark-${sx}-${i}`}
          animate={{ y: [0, -6], opacity: [0, 0.9, 0] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeOut',
            delay: dl,
          }}
          style={{ transformOrigin: `${sx}px ${sy}px` }}
        >
          <Ink
            d={gen.polygon(
              [
                [sx, sy - 2],
                [sx + 0.8, sy - 0.6],
                [sx + 2.2, sy - 0.4],
                [sx + 1, sy + 0.6],
                [sx + 1.4, sy + 2],
                [sx, sy + 1],
                [sx - 1.4, sy + 2],
                [sx - 1, sy + 0.6],
                [sx - 2.2, sy - 0.4],
                [sx - 0.8, sy - 0.6],
              ],
              filled(307 + i, '#f0b449', { fillStyle: 'solid' })
            )}
          />
        </motion.g>
      ))}
    </Frame>
  );
}

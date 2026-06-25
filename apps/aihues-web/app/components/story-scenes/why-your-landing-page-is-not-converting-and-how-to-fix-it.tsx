'use client';

import {
  Frame,
  Ink,
  RoughDash,
  gen,
  filled,
  stroke,
  loop,
  motion,
  Bolt,
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
      <Bolt x={36} y={20} s={0.9} c='#e0a83f' seed={221} />

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
        <motion.g
          key={`in-${dx}-${dy}`}
          animate={{ y: [0, 24], opacity: [0, 0.85, 0] }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: 'easeIn',
            delay: dl + i * 0.05,
          }}
        >
          <Ink
            d={gen.circle(
              dx,
              dy,
              2.8,
              filled(310 + i, '#e2693f', {
                fillStyle: 'solid',
                strokeWidth: 0.9,
              })
            )}
          />
        </motion.g>
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
      <Ink
        d={gen.path(
          leakLeft,
          stroke(320, { stroke: '#c2502e', strokeWidth: 1.3, roughness: 1.6 })
        )}
      />
      <Ink
        d={gen.path(
          leakRight,
          stroke(321, { stroke: '#c2502e', strokeWidth: 1.3, roughness: 1.6 })
        )}
      />
      {[
        [62, 74, 0],
        [138, 74, 0.6],
      ].map(([lx, ly, dl], i) => (
        <motion.g
          key={`leak-${lx}`}
          animate={{ y: [0, 14], opacity: [0.5, 0] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeIn',
            delay: dl,
          }}
        >
          <Ink
            d={gen.circle(
              lx,
              ly,
              2.2,
              filled(322 + i, '#c2502e', {
                fillStyle: 'solid',
                strokeWidth: 0.8,
              })
            )}
          />
        </motion.g>
      ))}

      {/* the fixed channel — one clean bright stream pouring straight down */}
      <RoughDash
        d={channel}
        c='#e0a83f'
        w={2.2}
        dur={0.9}
        dash='2 4'
        seed={323}
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

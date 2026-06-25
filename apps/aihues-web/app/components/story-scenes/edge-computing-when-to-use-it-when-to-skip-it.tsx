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

/* Edge computing — when to use it, when to skip it. The metaphor is placement-
   as-distance: a ridge of small lit relay posts hugging the near horizon (the
   "edge", close to the user), versus one taller central core tower far off in
   the haze (the "core"). A bright packet takes the SHORT hop to the nearest
   edge node — the fast path — while a faint dashed line trails all the way back
   to the distant core, the choice you skip when latency matters. Seeds 301+,
   gradient ids prefixed `edge_`. */

export default function Scene() {
  // short hop: packet -> nearest near-edge node
  const hop = 'M150 70 Q140 58 132 56';
  // long path: nearest node all the way back to the far core
  const longPath = 'M132 56 Q104 50 78 46 T40 40';

  return (
    <Frame sky={['#eef3f7', '#dbe6ec']}>
      <defs>
        <radialGradient id='edge_core' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#cfe0f1' stopOpacity='0.85' />
          <stop offset='100%' stopColor='#cfe0f1' stopOpacity='0' />
        </radialGradient>
        <radialGradient id='edge_node' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff0d6' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff0d6' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* sky atmosphere */}
      <Twinkle x={30} y={20} c='#9cb6cf' />
      <Twinkle x={176} y={26} d={0.8} c='#cf9836' />
      <Twinkle x={96} y={16} d={1.4} c='#9cb6cf' />
      <Cloud x={150} y={20} s={0.8} o={0.4} />
      <Cloud x={56} y={30} s={0.6} o={0.32} />

      {/* far haze ridge — the distant ground the core sits on */}
      <Ink
        d={gen.path(
          'M0 48 Q60 42 120 46 T200 46 L200 60 L0 60 Z',
          filled(301, '#c3d4e0', {
            roughness: 1.6,
            hachureGap: 4,
            fillWeight: 0.5,
          })
        )}
      />
      {/* near ridge — the foreground edge where the relay posts stand */}
      <Ink
        d={gen.path(
          'M0 72 Q70 66 130 70 T200 68 L200 100 L0 100 Z',
          filled(302, '#9fb6a4', {
            roughness: 1.5,
            hachureGap: 3.2,
            fillWeight: 0.6,
          })
        )}
      />

      {/* faint long path back to the distant core (the skipped, slow route) */}
      <motion.path
        d={longPath}
        fill='none'
        stroke='#6a9bcc'
        strokeWidth='1'
        opacity='0.45'
        strokeDasharray='2 6'
        animate={{ strokeDashoffset: [0, -16] }}
        transition={linear(2.6)}
      />

      {/* the distant CORE — a single taller tower in the haze, far off */}
      <circle cx='40' cy='40' r='16' fill='url(#edge_core)' />
      <motion.g
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={loop(3)}
        style={{ transformOrigin: '40px 44px' }}
      >
        <Ink
          d={gen.polygon(
            [
              [37, 48],
              [38.5, 30],
              [41.5, 30],
              [43, 48],
            ],
            filled(303, '#7d97b3', {
              fillStyle: 'solid',
              strokeWidth: 1.1,
              roughness: 1,
            })
          )}
        />
        <Ink
          d={gen.circle(
            40,
            29,
            5,
            filled(304, '#6a9bcc', { fillStyle: 'solid', strokeWidth: 1.1 })
          )}
        />
        {/* core signal rings, wide and slow */}
        <Ink
          d={gen.path(
            'M33 27 Q40 22 47 27',
            stroke(305, { stroke: '#6a9bcc', strokeWidth: 0.9, roughness: 0.8 })
          )}
        />
      </motion.g>

      {/* the near EDGE ridge — three small lit relay posts close to the user */}
      {[
        { x: 90, h: 10, seed: 310, d: 0 },
        { x: 132, h: 12, seed: 314, d: 0.5 },
        { x: 170, h: 9, seed: 318, d: 1 },
      ].map((p) => {
        const baseY = 70;
        const topY = baseY - p.h;
        return (
          <g key={p.x}>
            <circle cx={p.x} cy={topY} r='9' fill='url(#edge_node)' />
            {/* mast */}
            <Ink
              d={gen.line(
                p.x,
                baseY,
                p.x,
                topY + 2,
                stroke(p.seed, { strokeWidth: 1.2, roughness: 0.9 })
              )}
            />
            {/* little antenna cross-arm */}
            <Ink
              d={gen.line(
                p.x - 4,
                topY + 4,
                p.x + 4,
                topY + 4,
                stroke(p.seed + 1, { strokeWidth: 1, roughness: 0.8 })
              )}
            />
            {/* glowing node lamp */}
            <motion.g
              animate={{ scale: [0.9, 1.12, 0.9], opacity: [0.85, 1, 0.85] }}
              transition={loop(2.2, p.d)}
              style={{ transformOrigin: `${p.x}px ${topY}px` }}
            >
              <Ink
                d={gen.circle(
                  p.x,
                  topY,
                  4.4,
                  filled(p.seed + 2, '#e0a83f', {
                    fillStyle: 'solid',
                    strokeWidth: 1.1,
                  })
                )}
              />
            </motion.g>
          </g>
        );
      })}

      {/* the short-hop path — bright, near, the fast choice */}
      <motion.path
        d={hop}
        fill='none'
        stroke='#e2693f'
        strokeWidth='1.6'
        strokeDasharray='2 4'
        animate={{ strokeDashoffset: [0, -12] }}
        transition={linear(1)}
      />

      {/* the data packet making the short hop to the nearest edge node */}
      <motion.g
        animate={{
          offsetDistance: ['0%', '100%'],
        }}
        style={{ offsetPath: `path("${hop}")`, offsetRotate: '0deg' }}
        transition={linear(1.4)}
      >
        <Ink
          d={gen.polygon(
            [
              [0, -2.4],
              [2.4, 0],
              [0, 2.4],
              [-2.4, 0],
            ],
            filled(330, '#c2502e', {
              fillStyle: 'solid',
              strokeWidth: 1.1,
              roughness: 0.8,
            })
          )}
        />
      </motion.g>

      {/* the user / origin at the foreground edge of the short hop */}
      <Ink
        d={gen.circle(
          150,
          72,
          3.2,
          filled(332, '#788c5d', { fillStyle: 'solid', strokeWidth: 1.1 })
        )}
      />

      <Twinkle x={118} y={48} d={0.6} c='#e0a83f' r={0.9} />
      <Twinkle x={62} y={50} d={1.1} c='#9cb6cf' r={0.9} />
    </Frame>
  );
}

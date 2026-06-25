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

/* The State of CSS in 2026 — metaphor: a small artisan loom. Many fine atomic
   warp threads (utility classes) are drawn taut on a wooden frame, and a single
   shuttle weaves them into one tidy compiled swatch of fabric (the zero-runtime
   stylesheet) growing row by row. Utility-first composition → woven whole. */

export default function Scene() {
  // unique seed range for this file: 320–360
  const warpX = [78, 86, 94, 102, 110, 118]; // taut atomic threads
  return (
    <Frame sky={['#fdf4e6', '#f2dcc0']}>
      <defs>
        <radialGradient id='css26_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff5e2' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#fff5e2' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='css26_cloth' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#e7c98e' />
          <stop offset='100%' stopColor='#cf9836' />
        </linearGradient>
      </defs>

      {/* warm light pooling behind the loom */}
      <circle cx='98' cy='44' r='40' fill='url(#css26_glow)' />
      <Cloud x={46} y={24} s={0.78} o={0.4} />
      <Cloud x={158} y={30} s={0.62} o={0.32} />
      <Twinkle x={32} y={22} c='#cf9836' />
      <Twinkle x={170} y={20} d={0.8} c='#e0a83f' />
      <Twinkle x={150} y={54} d={1.3} c='#cf9836' r={0.9} />

      {/* distant work-surface for depth */}
      <Ink
        d={gen.path(
          'M0 86 Q100 80 200 86 L200 100 L0 100 Z',
          filled(320, '#e6cda2', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />

      {/* ── the loom frame: two uprights + top and bottom beams ── */}
      <Ink
        d={gen.rectangle(
          70,
          22,
          5,
          60,
          filled(321, '#9a6a3c', { fillStyle: 'solid', strokeWidth: 1.2 })
        )}
      />
      <Ink
        d={gen.rectangle(
          121,
          22,
          5,
          60,
          filled(322, '#9a6a3c', { fillStyle: 'solid', strokeWidth: 1.2 })
        )}
      />
      <Ink
        d={gen.rectangle(
          68,
          20,
          60,
          5,
          filled(323, '#b07f49', { fillStyle: 'solid', strokeWidth: 1.2 })
        )}
      />
      <Ink
        d={gen.rectangle(
          68,
          80,
          60,
          5,
          filled(324, '#b07f49', { fillStyle: 'solid', strokeWidth: 1.2 })
        )}
      />

      {/* atomic warp threads — drawn taut, faintly shimmering one by one */}
      {warpX.map((wx, i) => (
        <motion.g
          key={wx}
          animate={{ opacity: [0.55, 0.95, 0.55] }}
          transition={loop(2.2, i * 0.22)}
        >
          <Ink
            d={gen.line(
              wx,
              25,
              wx,
              79,
              stroke(330 + i, {
                stroke: i % 2 ? '#788c5d' : '#6a9bcc',
                strokeWidth: 0.8,
                roughness: 0.9,
                bowing: 0.5,
              })
            )}
          />
        </motion.g>
      ))}

      {/* the compiled swatch: tidy woven cloth growing up from the bottom beam */}
      <motion.g
        animate={{ scaleY: [0.86, 1, 0.86] }}
        transition={loop(3)}
        style={{ transformOrigin: '98px 79px' }}
      >
        <Ink
          d={gen.path(
            'M77 79 L119 79 L119 56 Q98 52 77 56 Z',
            filled(338, 'url(#css26_cloth)', {
              fillStyle: 'solid',
              strokeWidth: 1.2,
              roughness: 1,
            })
          )}
        />
        {/* weft rows — the finished, ordered output */}
        <Ink
          d={gen.line(
            78,
            62,
            118,
            62,
            stroke(339, { stroke: '#fbe8c8', strokeWidth: 0.7, roughness: 0.6 })
          )}
        />
        <Ink
          d={gen.line(
            78,
            67,
            118,
            67,
            stroke(340, { stroke: '#fbe8c8', strokeWidth: 0.7, roughness: 0.6 })
          )}
        />
        <Ink
          d={gen.line(
            78,
            72,
            118,
            72,
            stroke(341, { stroke: '#fbe8c8', strokeWidth: 0.7, roughness: 0.6 })
          )}
        />
      </motion.g>

      {/* the shuttle: glides across the warp, weaving utilities into the cloth */}
      <motion.g
        animate={{ x: [-19, 19, -19] }}
        transition={loop(2.6)}
        style={{ transformOrigin: '98px 54px' }}
      >
        <Ink
          d={gen.path(
            'M89 54 Q98 50 107 54 Q98 58 89 54 Z',
            filled(342, '#c2502e', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        <Ink
          d={gen.circle(
            98,
            54,
            3,
            filled(343, '#e0a83f', { fillStyle: 'solid' })
          )}
        />
      </motion.g>

      {/* a few loose atomic threads spooling toward the loom from the side */}
      <motion.path
        d='M44 70 Q60 66 70 60'
        fill='none'
        stroke='#788c5d'
        strokeWidth='0.9'
        strokeDasharray='2 5'
        animate={{ strokeDashoffset: [0, -14] }}
        transition={linear(1.8)}
      />
      <motion.path
        d='M40 78 Q58 76 70 70'
        fill='none'
        stroke='#6a9bcc'
        strokeWidth='0.9'
        strokeDasharray='2 5'
        animate={{ strokeDashoffset: [0, -14] }}
        transition={linear(2.2)}
      />
      <Ink
        d={gen.circle(
          40,
          76,
          7,
          filled(344, '#94ac78', { strokeWidth: 1, hachureGap: 2.2 })
        )}
      />
    </Frame>
  );
}

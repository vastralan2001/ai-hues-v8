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

// Imposter syndrome (solo founder): a tiny figure on a low plinth casts a long
// shadow far larger and more capable than they feel — the towering silhouette is
// who others already see. The small self doubts; the giant shadow is the truth.
export default function Scene() {
  return (
    <Frame sky={['#fbf0e0', '#f2d3b4']}>
      <defs>
        <radialGradient id='imp_sun' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff3da' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff3da' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='imp_floor' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#f5dcbb' />
          <stop offset='100%' stopColor='#e8c39a' />
        </linearGradient>
      </defs>

      {/* low warm sun, casting from the left */}
      <circle cx='30' cy='40' r='34' fill='url(#imp_sun)' />
      <Ink
        d={gen.circle(
          30,
          40,
          13,
          filled(301, '#f4dca2', { fillStyle: 'solid' })
        )}
      />

      <Twinkle x={150} y={18} c='#cf9836' />
      <Twinkle x={178} y={34} d={0.8} c='#e0a83f' />
      <Twinkle x={120} y={14} d={1.4} c='#cf9836' />
      <Cloud x={158} y={24} s={0.7} o={0.4} />

      {/* floor plane */}
      <rect x='0' y='74' width='200' height='26' fill='url(#imp_floor)' />
      <Ink
        d={gen.line(
          0,
          74,
          200,
          74,
          stroke(302, { stroke: '#d9b585', strokeWidth: 1 })
        )}
      />

      {/* the long projected shadow on the floor — towering, capable silhouette */}
      <motion.g
        animate={{ scaleX: [1, 1.05, 1], opacity: [0.78, 0.9, 0.78] }}
        transition={loop(3.4)}
        style={{ transformOrigin: '118px 80px' }}
      >
        <Ink
          d={gen.polygon(
            [
              [118, 80],
              [126, 80],
              [176, 34],
              [170, 30],
              [168, 22],
              [160, 18],
              [156, 26],
              [150, 34],
              [142, 58],
            ],
            filled(303, '#b9824a', { hachureGap: 2.4, fillWeight: 0.6 })
          )}
        />
        {/* the giant's raised arm — a builder's silhouette, reaching */}
        <Ink
          d={gen.path(
            'M156 26 L150 12 L146 10',
            stroke(304, { stroke: '#b9824a', strokeWidth: 1.6 })
          )}
        />
      </motion.g>

      {/* the low plinth the small self stands on */}
      <Ink
        d={gen.rectangle(
          110,
          70,
          16,
          5,
          filled(305, '#cf9836', { fillStyle: 'solid', strokeWidth: 1.2 })
        )}
      />

      {/* the small, doubting self — tiny figure, breathing-room around it */}
      <motion.g
        animate={{ y: [0, -1.2, 0] }}
        transition={loop(2.6)}
        style={{ transformOrigin: '118px 64px' }}
      >
        <Ink
          d={gen.circle(
            118,
            62,
            4.4,
            filled(306, '#d4602f', { fillStyle: 'solid' })
          )}
        />
        <Ink
          d={gen.path(
            'M118 64 L118 70 M118 66 L114.5 68 M118 66 L121.5 67.5',
            stroke(307, { strokeWidth: 1.3 })
          )}
        />
      </motion.g>

      {/* faint dashed seam between the small self and its grand shadow —
          the gap imposter syndrome lives in */}
      <motion.path
        d='M122 64 Q140 56 162 30'
        fill='none'
        stroke='#c08a4d'
        strokeWidth='1'
        opacity='0.55'
        strokeDasharray='2 6'
        animate={{ strokeDashoffset: [0, -16] }}
        transition={linear(2.2)}
      />

      {/* one quiet spark over the giant's head — the unclaimed worth */}
      <motion.g
        animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.5, 1, 0.5] }}
        transition={loop(2)}
        style={{ transformOrigin: '146px 9px' }}
      >
        <Ink
          d={gen.polygon(
            [
              [146, 4],
              [147.6, 8],
              [151.6, 9],
              [147.6, 10],
              [146, 14],
              [144.4, 10],
              [140.4, 9],
              [144.4, 8],
            ],
            filled(308, '#f0b449', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
      </motion.g>
    </Frame>
  );
}

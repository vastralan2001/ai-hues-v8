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
  Sun,
} from './_kit';

/* Metaphor: a long row of identical pale stamped vessels (the "average" of all
   training voices — uniform, bland, mass-produced). One focal vessel is warm
   terracotta, hand-glazed and distinct, fed by a thin ink-stream of your own
   voice pouring in from above. Generic is the crowd; the fix is the single
   stream that makes one jar yours. Seeds for this file: 300-339. */

const genericJars: [number, number, number][] = [
  [22, 70, 0.62],
  [42, 71, 0.7],
  [62, 71.5, 0.66],
  [84, 72, 0.72],
  [140, 72, 0.7],
  [160, 71.5, 0.66],
  [180, 71, 0.62],
];

export default function Scene() {
  return (
    <Frame sky={['#f4f1ea', '#e3e7ec']}>
      <defs>
        <radialGradient id='vg_warm' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#f8e0c2' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#f8e0c2' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='vg_stream' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#e0a83f' />
          <stop offset='100%' stopColor='#c2502e' />
        </linearGradient>
      </defs>

      <Sun x={44} y={22} r={6} seed={265} />

      {/* far flat plain — the uniform field the average sits on */}
      <Ink
        d={gen.path(
          'M0 78 Q100 73 200 78 L200 100 L0 100 Z',
          filled(300, '#d6dbe1', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />
      <Ink
        d={gen.line(
          0,
          78,
          200,
          78,
          stroke(301, { stroke: '#c3cad2', strokeWidth: 0.9 })
        )}
      />

      {/* the crowd: identical pale stamped jars, all the same wobble-muted hue */}
      {genericJars.map(([jx, jy, js], i) => (
        <g key={jx} transform={`translate(${jx} ${jy}) scale(${js})`}>
          <Ink
            d={gen.path(
              'M-6 0 Q-8 -10 -4 -14 Q-6 -16 -2 -17 L2 -17 Q6 -16 4 -14 Q8 -10 6 0 Q0 4 -6 0 Z',
              filled(302 + i, '#c7cdd4', { hachureGap: 3, fillWeight: 0.55 })
            )}
          />
        </g>
      ))}

      {/* warm glow behind the one that becomes yours */}
      <circle cx='112' cy='58' r='30' fill='url(#vg_warm)' />

      {/* the stream of your own voice descending into the focal jar */}
      <RoughDash
        d='M112 18 Q110 34 112 50'
        c='url(#vg_stream)'
        w={2}
        dur={1.6}
        dash='3 6'
        seed={310}
      />

      {/* the focal vessel — hand-glazed terracotta, distinctly itself */}
      <motion.g
        animate={{ y: [0, -2.2, 0] }}
        transition={loop(2.6)}
        style={{ transformOrigin: '112px 64px' }}
      >
        <Ink
          d={gen.ellipse(
            112,
            78,
            26,
            6,
            filled(319, INK, {
              fillStyle: 'solid',
              stroke: 'none',
              roughness: 1.4,
              seed: 319,
            })
          )}
        />
        <Ink
          d={gen.path(
            'M101 50 Q97 36 105 32 Q101 28 108 26 L116 26 Q123 28 119 32 Q127 36 123 50 Q132 60 123 70 Q112 78 101 70 Q92 60 101 50 Z',
            filled(320, '#e2693f', { strokeWidth: 1.3, hachureGap: 2.4 })
          )}
        />
        {/* a hand-painted band — the personal mark the others lack */}
        <Ink
          d={gen.path(
            'M99 56 Q112 62 125 56',
            stroke(321, { stroke: '#e0a83f', strokeWidth: 1.6 })
          )}
        />
        <Ink
          d={gen.path(
            'M101 62 Q112 67 123 62',
            stroke(322, { stroke: '#cf9836', strokeWidth: 1.2 })
          )}
        />
        {/* the rim catching the stream */}
        <Ink
          d={gen.path(
            'M105 31 Q112 28 119 31',
            stroke(323, { strokeWidth: 1.2 })
          )}
        />
        <motion.g
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.12, 0.9] }}
          transition={loop(2.2)}
          style={{ transformOrigin: '112px 30px' }}
        >
          <Ink
            d={gen.circle(
              112,
              30,
              4,
              filled(324, '#f0b449', { fillStyle: 'solid' })
            )}
          />
        </motion.g>
      </motion.g>
    </Frame>
  );
}

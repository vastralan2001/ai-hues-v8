'use client';
import {
  Frame,
  Ink,
  gen,
  filled,
  stroke,
  loop,
  INK,
  motion,
  Sun,
} from './_kit';

/* Metaphor: a small database "vessel" rests on layered foundation strata that
   deepen tier by tier — start simple on the top slab, scale later by laying the
   deeper, broader layers beneath. A young shoot sprouts from the vessel; a few
   query "pulses" trickle down into the foundations. */

export default function Scene() {
  return (
    <Frame sky={['#f4f1e6', '#e6ddc6']}>
      <defs>
        <radialGradient id='dbidd_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff4d8' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#fff4d8' stopOpacity='0' />
        </radialGradient>
      </defs>

      <circle cx='104' cy='30' r='40' fill='url(#dbidd_glow)' />
      <Sun x={48} y={24} r={6} seed={289} />

      {/* deepening foundation strata — widest/deepest at the bottom (scale later) */}
      <Ink
        d={gen.path(
          'M0 92 Q100 86 200 92 L200 100 L0 100 Z',
          filled(301, '#788c5d', { roughness: 1.5, hachureGap: 3.2 })
        )}
      />
      <Ink
        d={gen.polygon(
          [
            [40, 84],
            [160, 84],
            [172, 92],
            [28, 92],
          ],
          filled(302, '#94ac78', { hachureGap: 3.4 })
        )}
      />
      <Ink
        d={gen.polygon(
          [
            [56, 76],
            [144, 76],
            [156, 84],
            [44, 84],
          ],
          filled(303, '#b9c79e', { hachureGap: 3.6 })
        )}
      />

      {/* query pulses trickling down through the foundations */}
      {(
        [
          [82, 70, 0, 341],
          [100, 72, 0.7, 342],
          [118, 70, 1.4, 343],
        ] as const
      ).map(([px, py, d, sd]) => (
        <motion.g
          key={px}
          animate={{ y: [0, 18], opacity: [0, 0.7, 0] }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: 'easeIn',
            delay: d,
          }}
          style={{ transformOrigin: `${px}px ${py}px` }}
        >
          <Ink
            d={gen.circle(
              px,
              py,
              2.8,
              filled(sd, '#e0a83f', { fillStyle: 'solid', strokeWidth: 0.8 })
            )}
          />
        </motion.g>
      ))}

      {/* the database vessel on the top slab (start simple) */}
      <Ink
        d={gen.ellipse(
          100,
          80,
          36,
          6.4,
          filled(304, INK, {
            fillStyle: 'solid',
            strokeWidth: 0,
            roughness: 1.4,
            seed: 304,
          })
        )}
      />
      <motion.g
        animate={{ y: [0, -1.4, 0] }}
        transition={loop(3)}
        style={{ transformOrigin: '100px 64px' }}
      >
        <Ink
          d={gen.path(
            'M85 54 L85 72 Q85 76 100 76 Q115 76 115 72 L115 54 Z',
            filled(311, '#e2693f', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        <Ink
          d={gen.ellipse(
            100,
            54,
            30,
            8,
            filled(312, '#f0b449', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        <Ink
          d={gen.path(
            'M85 61 Q100 67 115 61',
            stroke(313, { stroke: '#c2502e', strokeWidth: 1 })
          )}
        />
        <Ink
          d={gen.path(
            'M85 68 Q100 74 115 68',
            stroke(314, { stroke: '#c2502e', strokeWidth: 1 })
          )}
        />

        {/* a young shoot sprouting from the top — it grows from here */}
        <motion.g
          animate={{ rotate: [-3, 3, -3] }}
          transition={loop(3.4)}
          style={{ transformOrigin: '100px 52px' }}
        >
          <Ink
            d={gen.path(
              'M100 52 Q99 44 102 38',
              stroke(321, { stroke: '#6f8a4f', strokeWidth: 1.3 })
            )}
          />
          <Ink
            d={gen.path(
              'M101 44 Q108 41 110 36 Q103 37 101 44 Z',
              filled(322, '#94ac78', { fillStyle: 'solid', strokeWidth: 1 })
            )}
          />
          <Ink
            d={gen.path(
              'M100 40 Q93 38 90 33 Q98 33 100 40 Z',
              filled(323, '#788c5d', { fillStyle: 'solid', strokeWidth: 1 })
            )}
          />
        </motion.g>
      </motion.g>

      {/* a single drifting growth spark above the shoot */}
      <motion.g
        animate={{ y: [0, -4, 0], opacity: [0.4, 0.9, 0.4] }}
        transition={loop(2.8)}
        style={{ transformOrigin: '104px 30px' }}
      >
        <Ink
          d={gen.polygon(
            [
              [104, 26],
              [105.6, 30],
              [109.6, 30.6],
              [106.4, 33.2],
              [107.2, 37.2],
              [104, 35],
              [100.8, 37.2],
              [101.6, 33.2],
              [98.4, 30.6],
              [102.4, 30],
            ],
            filled(331, '#f0b449', { fillStyle: 'solid' })
          )}
        />
      </motion.g>
    </Frame>
  );
}

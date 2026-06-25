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

/* Testing strategies for small teams — a two-post safety net rig. Just two
   posts hold the whole apparatus (a small team), and a layered mesh slung
   between them catches falling "bug" sparks: a coarse weave up top (e2e),
   a finer middle band (integration), a tight mesh at the bottom (unit). Most
   sparks land safely in the net; one slips through a gap on the right — the
   thing you chose to skip. Seed block: 300–360. Gradient ids: tsst_*. */

export default function Scene() {
  return (
    <Frame sky={['#f3f2e2', '#dfe7cf']}>
      <defs>
        <radialGradient id='tsst_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff7e2' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#fff7e2' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* soft morning glow + sky accents */}
      <circle cx='150' cy='26' r='40' fill='url(#tsst_glow)' />
      <Cloud x={44} y={24} s={0.8} o={0.4} />
      <Twinkle x={30} y={20} c='#cf9836' />
      <Twinkle x={176} y={30} d={0.7} c='#e0a83f' />

      {/* distant ground band for depth */}
      <Ink
        d={gen.path(
          'M0 90 Q100 85 200 90 L200 100 L0 100 Z',
          filled(301, '#c7d3ad', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />

      {/* the two posts — a small team holding the whole rig */}
      <Ink
        d={gen.rectangle(
          37,
          40,
          5,
          50,
          filled(302, '#a98a5a', { fillStyle: 'solid', strokeWidth: 1.2 })
        )}
      />
      <Ink
        d={gen.rectangle(
          158,
          40,
          5,
          50,
          filled(303, '#a98a5a', { fillStyle: 'solid', strokeWidth: 1.2 })
        )}
      />
      {/* post caps */}
      <Ink d={gen.line(34, 40, 45, 40, stroke(304, { strokeWidth: 1.4 }))} />
      <Ink d={gen.line(155, 40, 166, 40, stroke(305, { strokeWidth: 1.4 }))} />

      {/* the net rig — sags gently like a real catch net */}
      <motion.g
        animate={{ y: [0, 1.3, 0] }}
        transition={loop(3)}
        style={{ transformOrigin: '100px 62px' }}
      >
        {/* top rim cable (coarse e2e tier) */}
        <Ink
          d={gen.path(
            'M40 44 Q100 60 160 44',
            stroke(306, { stroke: '#788c5d', strokeWidth: 1.3 })
          )}
        />
        {/* middle band (integration tier) */}
        <Ink
          d={gen.path(
            'M40 54 Q100 70 160 54',
            stroke(307, { stroke: '#94ac78', strokeWidth: 1.1 })
          )}
        />
        {/* bottom rim cable (unit tier) */}
        <Ink
          d={gen.path(
            'M40 64 Q100 80 160 64',
            stroke(308, { stroke: '#788c5d', strokeWidth: 1.2 })
          )}
        />

        {/* coarse vertical weave between top and middle (wide gaps = e2e) */}
        <Ink
          d={gen.path(
            'M60 50 Q60 60 60 64 M80 56 Q80 66 80 71 M100 60 Q100 70 100 75 M120 56 Q120 66 120 71 M140 50 Q140 60 140 64',
            stroke(309, { stroke: '#9bb07f', strokeWidth: 0.8, roughness: 1.1 })
          )}
        />

        {/* tight fine mesh hanging below the bottom cable (unit coverage) */}
        <Ink
          d={gen.path(
            'M50 64 L52 74 M58 66 L60 76 M66 68 L68 78 M74 70 L76 80 M82 71 L84 81 M90 72 L92 82 M98 73 L100 83 M106 72 L108 82 M114 71 L116 81 M122 70 L124 80 M130 68 L132 78 M138 66 L140 76 M146 64 L148 74',
            stroke(310, { stroke: '#94ac78', strokeWidth: 0.6, roughness: 0.9 })
          )}
        />
        <Ink
          d={gen.path(
            'M48 70 Q100 80 152 70',
            stroke(311, { stroke: '#788c5d', strokeWidth: 0.8 })
          )}
        />
        {/* the visible gap on the right rim — the test you skipped */}
        <Ink
          d={gen.path(
            'M150 65 L153 73',
            stroke(312, { stroke: '#cf9836', strokeWidth: 0.7, roughness: 1.2 })
          )}
        />
      </motion.g>

      {/* caught bug spark — settled, resting in the mesh */}
      <motion.g
        animate={{ y: [0, -1.6, 0], opacity: [0.85, 1, 0.85] }}
        transition={loop(2.2)}
        style={{ transformOrigin: '88px 73px' }}
      >
        <Ink
          d={gen.circle(
            88,
            73,
            5,
            filled(320, '#e2693f', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
        <Ink
          d={gen.line(85.5, 71, 90.5, 75, stroke(321, { strokeWidth: 0.8 }))}
        />
        <Ink
          d={gen.line(90.5, 71, 85.5, 75, stroke(322, { strokeWidth: 0.8 }))}
        />
      </motion.g>

      {/* a second caught spark, smaller, in the coarse weave */}
      <motion.g
        animate={{ y: [0, -1, 0] }}
        transition={loop(2.6, 0.6)}
        style={{ transformOrigin: '118px 66px' }}
      >
        <Ink
          d={gen.circle(
            118,
            66,
            3.6,
            filled(323, '#e0a83f', { fillStyle: 'solid', strokeWidth: 0.9 })
          )}
        />
      </motion.g>

      {/* a falling spark dropping toward the net — about to be caught */}
      <motion.g
        animate={{ y: [-26, 4], opacity: [0, 1, 1, 0] }}
        transition={linear(2.8)}
        style={{ transformOrigin: '66px 56px' }}
      >
        <Ink
          d={gen.circle(
            66,
            56,
            3.2,
            filled(324, '#c2502e', { fillStyle: 'solid', strokeWidth: 0.9 })
          )}
        />
      </motion.g>

      {/* the one that slips through the gap on the right — what you skip */}
      <motion.g
        animate={{ y: [-12, 22], opacity: [0, 0.9, 0.9, 0] }}
        transition={linear(3.4)}
        style={{ transformOrigin: '152px 60px' }}
      >
        <Ink
          d={gen.circle(
            152,
            60,
            2.6,
            filled(325, '#cf9836', { fillStyle: 'solid', strokeWidth: 0.8 })
          )}
        />
      </motion.g>
    </Frame>
  );
}

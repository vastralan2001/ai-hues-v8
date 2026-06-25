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

/* Bootstrapping with zero dollars: a lone seedling growing out of an empty,
   upturned ramen bowl on a quiet dawn hill. No outside rain — a thin stream
   the plant itself feeds rises, condenses into one small cloud, and falls back
   to water its own roots: a closed, self-sustaining cycle. Ramen-profitability,
   funded by nothing but its own loop. */
export default function Scene() {
  return (
    <Frame sky={['#fbf3e6', '#f0e3c4']}>
      <defs>
        <radialGradient id='bzd_dawn' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff5dd' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff5dd' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='bzd_steam' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#9fc0d8' stopOpacity='0' />
          <stop offset='100%' stopColor='#9fc0d8' stopOpacity='0.7' />
        </linearGradient>
      </defs>

      {/* dawn glow + far accents */}
      <circle cx='44' cy='30' r='40' fill='url(#bzd_dawn)' />
      <Twinkle x={30} y={22} c='#e0a83f' />
      <Twinkle x={172} y={26} d={0.8} c='#cf9836' />
      <Twinkle x={150} y={16} d={1.3} c='#e0a83f' r={0.9} />
      <Cloud x={158} y={64} s={0.7} o={0.4} />

      {/* distant hill for depth */}
      <Ink
        d={gen.path(
          'M0 82 Q70 70 138 80 T200 78 L200 100 L0 100 Z',
          filled(301, '#d9e2c4', { roughness: 1.6, hachureGap: 4 })
        )}
      />
      {/* near ground the bowl rests on */}
      <Ink
        d={gen.path(
          'M0 90 Q100 84 200 90 L200 100 L0 100 Z',
          filled(302, '#c3d0a5', { roughness: 1.5, hachureGap: 3.2 })
        )}
      />

      {/* the self-watering loop: stream rises on the left, condenses into a
          small cloud, falls back as a dashed thread onto the roots — no
          outside funding, the plant waters itself */}
      <motion.path
        d='M92 64 C84 52 86 42 96 36'
        fill='none'
        stroke='url(#bzd_steam)'
        strokeWidth='2'
        strokeDasharray='2 6'
        animate={{ strokeDashoffset: [0, -16] }}
        transition={linear(2.2)}
      />
      <motion.g
        animate={{ y: [0, -1.6, 0] }}
        transition={loop(3)}
        style={{ transformOrigin: '104px 32px' }}
      >
        <Cloud x={104} y={32} s={0.5} o={0.7} />
      </motion.g>
      <motion.path
        d='M110 36 C116 46 114 56 108 64'
        fill='none'
        stroke='#6a9bcc'
        strokeWidth='1.4'
        strokeDasharray='1.6 5'
        animate={{ strokeDashoffset: [0, -20] }}
        transition={linear(1.7)}
      />

      {/* the empty bowl — upturned ramen bowl as a humble pot */}
      <ellipse cx='100' cy='86' rx='22' ry='4' fill={INK} opacity='0.1' />
      <Ink
        d={gen.path(
          'M82 70 Q100 88 118 70 Z',
          filled(303, '#e2693f', { hachureGap: 3, fillWeight: 0.65 })
        )}
      />
      <Ink d={gen.line(80, 70, 120, 70, stroke(304, { strokeWidth: 1.3 }))} />

      {/* the seedling rising from the bowl — small focal subject */}
      <motion.g
        animate={{ rotate: [-2.5, 2.5, -2.5] }}
        transition={loop(2.8)}
        style={{ transformOrigin: '100px 70px' }}
      >
        <Ink
          d={gen.path(
            'M100 70 Q99 60 100 50',
            stroke(305, { strokeWidth: 1.4 })
          )}
        />
        <Ink
          d={gen.path(
            'M100 58 Q90 54 86 60 Q94 62 100 58 Z',
            filled(306, '#788c5d', { fillStyle: 'solid' })
          )}
        />
        <Ink
          d={gen.path(
            'M100 52 Q110 48 115 53 Q106 56 100 52 Z',
            filled(307, '#94ac78', { fillStyle: 'solid' })
          )}
        />
        {/* a single new bud at the tip */}
        <motion.g
          animate={{ scale: [0.9, 1.12, 0.9] }}
          transition={loop(2.2)}
          style={{ transformOrigin: '100px 49px' }}
        >
          <Ink
            d={gen.circle(
              100,
              49,
              4,
              filled(308, '#e0a83f', { fillStyle: 'solid' })
            )}
          />
        </motion.g>
      </motion.g>

      {/* the absent funding: a faint $0, the only "raise" */}
      <text
        x='100'
        y='80'
        textAnchor='middle'
        fontSize='5.5'
        fontWeight='800'
        fill={INK}
        opacity='0.5'
      >
        $0
      </text>

      {/* falling water droplet completing the loop */}
      <motion.circle
        cx='108'
        cy='40'
        r='1.3'
        fill='#6a9bcc'
        opacity='0.7'
        animate={{ cy: [40, 66], opacity: [0, 0.7, 0] }}
        transition={{ duration: 1.7, repeat: Infinity, ease: 'easeIn' }}
      />
    </Frame>
  );
}

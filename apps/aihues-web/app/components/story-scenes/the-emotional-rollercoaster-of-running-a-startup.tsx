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
} from './_kit';

/* The Emotional Rollercoaster of Running a Startup — a single rollercoaster rail
   that doubles as a sentiment line: a soaring crest (the high), a deep plunge
   (the revenue dip), and a recovering rise — with one small cart riding it.
   A gold sun marks the peak, a cool shadow pools in the trough. */

const RAIL = 'M8 70 Q34 24 60 26 Q86 28 100 80 Q116 36 142 40 Q172 44 192 24';

export default function Scene() {
  return (
    <Frame sky={['#fdeede', '#f3d2bd']}>
      <defs>
        <radialGradient id='roller_sun' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff3da' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff3da' stopOpacity='0' />
        </radialGradient>
        <radialGradient id='roller_dip' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#6a9bcc' stopOpacity='0.35' />
          <stop offset='100%' stopColor='#6a9bcc' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* crest glow + trough shadow */}
      <circle cx='60' cy='22' r='34' fill='url(#roller_sun)' />
      <circle cx='100' cy='84' r='26' fill='url(#roller_dip)' />

      {/* far hills for depth */}
      <Ink
        d={gen.path(
          'M0 90 Q56 80 110 88 T200 86 L200 100 L0 100 Z',
          filled(301, '#e8c39c', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />

      {/* support pylons under the rail */}
      <Ink
        d={gen.line(
          60,
          26,
          60,
          90,
          stroke(302, { strokeWidth: 1, roughness: 1 })
        )}
      />
      <Ink
        d={gen.line(
          100,
          80,
          100,
          92,
          stroke(303, { strokeWidth: 1, roughness: 1 })
        )}
      />
      <Ink
        d={gen.line(
          142,
          40,
          142,
          90,
          stroke(304, { strokeWidth: 1, roughness: 1 })
        )}
      />
      <Ink
        d={gen.line(
          30,
          50,
          30,
          84,
          stroke(305, { strokeWidth: 0.9, roughness: 1 })
        )}
      />
      <Ink
        d={gen.line(
          170,
          36,
          170,
          82,
          stroke(306, { strokeWidth: 0.9, roughness: 1 })
        )}
      />

      {/* the rollercoaster rail — the sentiment line */}
      <Ink
        d={gen.path(
          RAIL,
          stroke(307, { stroke: '#c2502e', strokeWidth: 1.4, roughness: 1.1 })
        )}
      />

      {/* a faint motion sheen sliding along the rail */}
      <RoughDash
        d={RAIL}
        c='#fff'
        w={1.6}
        dur={1.8}
        dash='2 11'
        o={0.5}
        seed={314}
      />

      {/* peak marker flag at the crest */}
      <Ink d={gen.line(60, 26, 60, 12, stroke(308, { strokeWidth: 1.4 }))} />
      <motion.g
        animate={{ skewX: [0, 8, 0] }}
        transition={loop(1.7)}
        style={{ transformOrigin: '60px 16px' }}
      >
        <Ink
          d={gen.path(
            'M60 12 Q68 14 74 11 Q68 17 74 20 Q67 18 60 21 Z',
            filled(309, '#e0a83f', { fillStyle: 'solid' })
          )}
        />
      </motion.g>

      {/* the cart, riding the rail through the high-low-high arc */}
      <motion.g
        animate={{
          x: [0, 32, 80, 116, 152, 184],
          y: [0, -46, 8, -42, 0, -50],
          rotate: [-28, 6, 40, -22, 18, -30],
        }}
        transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '8px 70px' }}
      >
        <g transform='translate(8 70)'>
          <Ink
            d={gen.path(
              'M-5 -3 L5 -3 L4 4 L-4 4 Z',
              filled(310, '#e2693f', { fillStyle: 'solid', strokeWidth: 1.2 })
            )}
          />
          <Ink
            d={gen.circle(
              -2.6,
              5,
              2.6,
              filled(311, '#5b5346', { fillStyle: 'solid' })
            )}
          />
          <Ink
            d={gen.circle(
              2.6,
              5,
              2.6,
              filled(312, '#5b5346', { fillStyle: 'solid' })
            )}
          />
          <Ink
            d={gen.path(
              'M-3 -3 L-3 -6 M0 -3 L0 -6 M3 -3 L3 -6',
              stroke(313, { strokeWidth: 0.9, stroke: '#cf9836' })
            )}
          />
        </g>
      </motion.g>
    </Frame>
  );
}

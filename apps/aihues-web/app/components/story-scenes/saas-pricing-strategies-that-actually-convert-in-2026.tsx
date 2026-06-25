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

/* SaaS pricing strategies that convert — usage-based vs seat-based vs hybrid.
   Metaphor: a slender apothecary balance-beam on a single fulcrum, weighing two
   suspended pans — a stack of metered usage cubes against a cluster of seat chips
   — tipping gently as it seeks the equilibrium that "converts", a gold star aloft.
   Seed block for this file: 600–640. Gradient ids prefixed `saaspx_`. */

export default function Scene() {
  return (
    <Frame sky={['#fdf3e2', '#f4dcb6']}>
      <defs>
        <radialGradient id='saaspx_star' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff1cf' stopOpacity='1' />
          <stop offset='100%' stopColor='#fff1cf' stopOpacity='0' />
        </radialGradient>
        <radialGradient id='saaspx_haze' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff' stopOpacity='0.55' />
          <stop offset='100%' stopColor='#fff' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* depth: hazed sun glow + distant rolling hills */}
      <circle cx='100' cy='30' r='40' fill='url(#saaspx_haze)' />

      <Ink
        d={gen.path(
          'M0 80 Q56 70 110 78 T200 74 L200 100 L0 100 Z',
          filled(601, '#e7c98e', { roughness: 1.6, hachureGap: 4 })
        )}
      />
      <Ink
        d={gen.path(
          'M0 90 Q70 82 130 88 T200 86 L200 100 L0 100 Z',
          filled(602, '#cdab74', { roughness: 1.5, hachureGap: 3.4 })
        )}
      />

      {/* the conversion star, glowing aloft above the beam */}
      <circle cx='100' cy='17' r='15' fill='url(#saaspx_star)' />
      <motion.g
        animate={{ scale: [0.92, 1.1, 0.92], rotate: [0, 7, 0] }}
        transition={loop(2.6)}
        style={{ transformOrigin: '100px 17px' }}
      >
        <Ink
          d={gen.polygon(
            [
              [100, 9],
              [102.3, 14],
              [107.6, 14.6],
              [103.7, 18.2],
              [104.7, 23.4],
              [100, 20.8],
              [95.3, 23.4],
              [96.3, 18.2],
              [92.4, 14.6],
              [97.7, 14],
            ],
            filled(603, '#f0b449', { fillStyle: 'solid' })
          )}
        />
      </motion.g>

      {/* the fulcrum: a slim post rising from the near hill */}
      <Ink d={gen.path('M100 90 L100 47', stroke(604, { strokeWidth: 1.5 }))} />
      <Ink
        d={gen.polygon(
          [
            [94, 90],
            [106, 90],
            [100, 80],
          ],
          filled(605, '#b78a52', { hachureGap: 2.4 })
        )}
      />
      <Ink
        d={gen.circle(
          100,
          46,
          4,
          filled(606, '#cf9836', { fillStyle: 'solid' })
        )}
      />

      {/* the whole beam tilts gently, seeking equilibrium */}
      <motion.g
        animate={{ rotate: [-5, 5, -5] }}
        transition={loop(3.4)}
        style={{ transformOrigin: '100px 46px' }}
      >
        {/* beam */}
        <Ink d={gen.line(58, 46, 142, 46, stroke(607, { strokeWidth: 1.4 }))} />
        <Ink
          d={gen.circle(
            100,
            46,
            2.4,
            filled(608, '#e0a83f', { fillStyle: 'solid' })
          )}
        />

        {/* LEFT chain + pan — usage-based: a stack of metered cubes */}
        <Ink d={gen.line(58, 46, 53, 62, stroke(609, { strokeWidth: 0.9 }))} />
        <Ink d={gen.line(58, 46, 63, 62, stroke(610, { strokeWidth: 0.9 }))} />
        <Ink
          d={gen.path(
            'M50 62 Q58 70 66 62',
            filled(611, '#dfa14a', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        <Ink
          d={gen.rectangle(
            54,
            54,
            8,
            6,
            filled(612, '#c2502e', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
        <Ink
          d={gen.rectangle(
            53,
            49,
            8,
            6,
            filled(613, '#e2693f', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
        <Ink
          d={gen.rectangle(
            55,
            44.5,
            7,
            6,
            filled(614, '#e2693f', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />

        {/* RIGHT chain + pan — seat-based: a cluster of seat chips */}
        <Ink
          d={gen.line(142, 46, 137, 62, stroke(615, { strokeWidth: 0.9 }))}
        />
        <Ink
          d={gen.line(142, 46, 147, 62, stroke(616, { strokeWidth: 0.9 }))}
        />
        <Ink
          d={gen.path(
            'M134 62 Q142 70 150 62',
            filled(617, '#dfa14a', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        <Ink
          d={gen.circle(
            138,
            57,
            6,
            filled(618, '#788c5d', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
        <Ink
          d={gen.circle(
            146,
            57,
            6,
            filled(619, '#94ac78', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
        <Ink
          d={gen.circle(
            142,
            51,
            6,
            filled(620, '#94ac78', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
      </motion.g>

      {/* a faint dashed thread tracing the balance arc up to the star */}
      <RoughDash
        d='M58 46 Q100 30 142 46'
        c='#cf9836'
        w={0.9}
        dur={1.8}
        seed={621}
        dash='2 6'
        o={0.55}
      />
    </Frame>
  );
}

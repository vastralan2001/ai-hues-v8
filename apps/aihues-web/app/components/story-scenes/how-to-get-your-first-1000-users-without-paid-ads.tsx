'use client';
import {
  Frame,
  Ink,
  Twinkle,
  Cloud,
  RoughDash,
  gen,
  filled,
  stroke,
  loop,
  INK,
  motion,
} from './_kit';

/* "First 1000 users without paid ads" → organic, unfunded spread: a single
   sprout on a low hill releases drifting spores that take root downwind as a
   scattering of small glowing dots — one seed becoming many, no fuel pumped in.
   Community-led growth blooming across the field. */

const SPORES: [number, number, number][] = [
  [108, 50, 0],
  [126, 42, 0.5],
  [140, 56, 0.2],
  [152, 38, 0.9],
  [166, 50, 0.4],
  [178, 40, 1.1],
  [134, 64, 0.7],
  [158, 62, 1.3],
];

export default function Scene() {
  return (
    <Frame sky={['#f6f1e0', '#e7ecd2']}>
      <defs>
        <radialGradient id='u1k_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fbeec2' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fbeec2' stopOpacity='0' />
        </radialGradient>
        <radialGradient id='u1k_dot' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#f3d27a' stopOpacity='0.85' />
          <stop offset='100%' stopColor='#f3d27a' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* soft low sun warming the field */}
      <circle cx='44' cy='30' r='34' fill='url(#u1k_glow)' />
      <Cloud x={150} y={22} s={0.75} o={0.4} />
      <Twinkle x={188} y={20} d={0.4} c='#e0a83f' />
      <Twinkle x={24} y={54} d={1} c='#cf9836' />

      {/* distant depth: two layered rolling fields */}
      <Ink
        d={gen.path(
          'M0 78 Q60 70 120 76 T200 74 L200 100 L0 100 Z',
          filled(301, '#cfd9b3', { roughness: 1.6, hachureGap: 4 })
        )}
      />
      <Ink
        d={gen.path(
          'M0 88 Q70 80 130 86 T200 86 L200 100 L0 100 Z',
          filled(302, '#aebf8c', { roughness: 1.5, hachureGap: 3.2 })
        )}
      />

      {/* faint scattered grass on the near field — texture, not focal */}
      <Ink
        d={gen.path(
          'M30 90 L29 85 M34 91 L35 86 M46 90 L45 85 M50 91 L51 87',
          stroke(303, { stroke: '#8a9d63', strokeWidth: 0.9, roughness: 1.5 })
        )}
      />

      {/* drifting spore trail from the sprout out across the field */}
      <RoughDash
        d='M62 70 Q110 48 178 42'
        c='#cf9836'
        w={1.3}
        dur={2.2}
        seed={305}
        dash='1.4 6'
        o={0.55}
      />

      {/* the spores that took root: small glowing dots, the new users */}
      {SPORES.map(([sx, sy, d], i) => (
        <g key={sx}>
          <circle cx={sx} cy={sy} r='5' fill='url(#u1k_dot)' />
          <motion.g
            animate={{ scale: [0, 1, 1], opacity: [0, 1, 0.85] }}
            transition={loop(3.2, d)}
            style={{ transformOrigin: `${sx}px ${sy}px` }}
          >
            <Ink
              d={gen.circle(
                sx,
                sy,
                3,
                filled(310 + i, '#e0a83f', {
                  fillStyle: 'solid',
                  strokeWidth: 0.9,
                })
              )}
            />
          </motion.g>
        </g>
      ))}

      {/* the focal subject: one sprout on the near hill, breathing */}
      <motion.g
        animate={{ rotate: [-2, 3, -2] }}
        transition={loop(3)}
        style={{ transformOrigin: '60px 76px' }}
      >
        {/* stem */}
        <Ink
          d={gen.path(
            'M60 78 Q59 70 61 62',
            stroke(330, { stroke: '#788c5d', strokeWidth: 1.3 })
          )}
        />
        {/* two leaves */}
        <Ink
          d={gen.path(
            'M60 70 Q51 66 49 60 Q57 60 60 67 Z',
            filled(331, '#94ac78', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
        <Ink
          d={gen.path(
            'M61 66 Q70 62 73 56 Q64 56 61 63 Z',
            filled(332, '#94ac78', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
        {/* the seed bloom — the source */}
        <motion.g
          animate={{ scale: [1, 1.12, 1] }}
          transition={loop(2.4)}
          style={{ transformOrigin: '61px 60px' }}
        >
          <Ink
            d={gen.circle(
              61,
              60,
              7,
              filled(333, '#e2693f', { fillStyle: 'solid', strokeWidth: 1.2 })
            )}
          />
          <Ink
            d={gen.circle(
              61,
              60,
              2.6,
              filled(334, '#fbeec2', { fillStyle: 'solid', strokeWidth: 0.8 })
            )}
          />
        </motion.g>
      </motion.g>

      {/* small mound under the sprout to seat it on the field */}
      <Ink
        d={gen.path(
          'M48 80 Q60 74 74 80 Q60 84 48 80 Z',
          filled(340, '#9aa86f', { hachureGap: 2.6, fillWeight: 0.6 })
        )}
      />
    </Frame>
  );
}

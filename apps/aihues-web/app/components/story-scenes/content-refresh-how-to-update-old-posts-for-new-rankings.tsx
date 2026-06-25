'use client';

import {
  Frame,
  Ink,
  Twinkle,
  RoughDash,
  gen,
  filled,
  stroke,
  loop,
  INK,
  motion,
} from './_kit';

/* Content Refresh (SEO) — a weathered old tree on a low hill: most of its
   branches are bare and pruned back (the stale post), but one grafted limb
   bears a single vivid new-green sprout that lifts upward toward a warm sun.
   The 80/20 of updating: cut the dead growth, keep the trunk, let one fresh
   shoot carry the climb. A dashed sap-line traces the new growth rising. */

export default function Scene() {
  return (
    <Frame sky={['#fdf4e2', '#f1e0bd']}>
      <defs>
        <radialGradient id='crf_sun' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff5da' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff5da' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='crf_hill' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#aebf95' />
          <stop offset='100%' stopColor='#8aa069' />
        </linearGradient>
      </defs>

      {/* warm low sun glow + sky accents */}
      <circle cx='150' cy='30' r='40' fill='url(#crf_sun)' />
      <Twinkle x={34} y={22} c='#e0a83f' />

      {/* depth: far hill ridge */}
      <Ink
        d={gen.path(
          'M0 78 Q56 66 120 74 T200 70 L200 100 L0 100 Z',
          filled(301, '#cdd7bb', { roughness: 1.6, hachureGap: 4 })
        )}
      />
      {/* near hill the tree stands on */}
      <rect
        x='0'
        y='84'
        width='200'
        height='16'
        fill='url(#crf_hill)'
        opacity='0.55'
      />
      <Ink
        d={gen.path(
          'M0 86 Q70 80 132 85 T200 83 L200 100 L0 100 Z',
          filled(302, '#9cb27c', { roughness: 1.5, hachureGap: 3.4 })
        )}
      />

      {/* soft ground-shadow under the tree */}
      <Ink
        d={gen.ellipse(96, 88, 52, 6.8, {
          fill: INK,
          fillStyle: 'solid',
          stroke: 'none',
          roughness: 1.6,
          seed: 313,
        })}
      />

      {/* ── the weathered tree ── */}
      {/* trunk */}
      <Ink
        d={gen.path(
          'M92 88 C91 76 90 66 93 56 C94 51 99 50 100 56 C101 66 100 78 100 88 Z',
          filled(303, '#9c6a44', {
            hachureGap: 3,
            fillWeight: 0.6,
            strokeWidth: 1.2,
          })
        )}
      />

      {/* bare, pruned-back old branches (left + upper) — thin dry ink */}
      <Ink
        d={gen.path(
          'M94 60 C86 56 80 58 74 52 M80 56 L76 50 M82 57 L84 51',
          stroke(304, { strokeWidth: 1, roughness: 1.5 })
        )}
      />
      <Ink
        d={gen.path(
          'M97 54 C97 47 95 42 90 39 M93 45 L88 43 M94 48 L90 46',
          stroke(305, { strokeWidth: 1, roughness: 1.5 })
        )}
      />
      <Ink
        d={gen.path(
          'M99 58 C104 55 108 56 112 52 M108 54 L112 50',
          stroke(306, { strokeWidth: 1, roughness: 1.5 })
        )}
      />

      {/* pruning marks — small cut nubs where dead growth was removed */}
      <Ink
        d={gen.circle(
          74,
          52,
          2.4,
          filled(307, '#d6c6a6', { fillStyle: 'solid' })
        )}
      />
      <Ink
        d={gen.circle(
          90,
          39,
          2.2,
          filled(308, '#d6c6a6', { fillStyle: 'solid' })
        )}
      />

      {/* the one grafted, refreshed limb rising to the upper-right */}
      <Ink
        d={gen.path(
          'M98 56 C104 50 110 46 116 38',
          stroke(309, { strokeWidth: 1.5, stroke: '#7d5a3a' })
        )}
      />

      {/* dashed sap / rising-rank line tracing the new growth upward */}
      <RoughDash
        d='M98 58 C106 50 112 44 118 34'
        c='#94ac78'
        w={1.4}
        dur={1.8}
        dash='2 6'
        seed={314}
      />

      {/* the fresh new sprout — breathing, alive */}
      <motion.g
        animate={{ y: [0, -1.6, 0], rotate: [0, 3, 0] }}
        transition={loop(2.6)}
        style={{ transformOrigin: '118px 34px' }}
      >
        {/* new-green leaf cluster */}
        <Ink
          d={gen.path(
            'M118 34 C112 30 110 23 116 20 C118 26 124 27 126 22 C128 28 124 34 118 34 Z',
            filled(310, '#8bbf5a', { fillStyle: 'solid', strokeWidth: 1.1 })
          )}
        />
        <Ink
          d={gen.path(
            'M118 34 C123 32 129 33 130 28',
            stroke(311, { strokeWidth: 1, stroke: '#6f9a45' })
          )}
        />
        {/* tiny upward bud / rank-climb spark above the sprout */}
        <Ink
          d={gen.polygon(
            [
              [122, 14],
              [123.6, 17.2],
              [127, 17.6],
              [124.4, 20],
              [125, 23.4],
              [122, 21.6],
              [119, 23.4],
              [119.6, 20],
              [117, 17.6],
              [120.4, 17.2],
            ],
            filled(312, '#e0a83f', { fillStyle: 'solid', strokeWidth: 0.9 })
          )}
        />
      </motion.g>

      {/* a couple of drifting-up renewal motes near the new growth */}
      {[
        [108, 40, 0, 315],
        [128, 30, 0.9, 316],
        [114, 28, 1.5, 317],
      ].map(([mx, my, dl, sd]) => (
        <motion.g
          key={mx}
          animate={{ y: [0, -12], opacity: [0, 0.6, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeOut',
            delay: dl,
          }}
        >
          <Ink
            d={gen.circle(mx, my, 2.2, {
              fill: '#bfe09a',
              fillStyle: 'solid',
              stroke: 'none',
              roughness: 1.4,
              seed: sd,
            })}
          />
        </motion.g>
      ))}
    </Frame>
  );
}

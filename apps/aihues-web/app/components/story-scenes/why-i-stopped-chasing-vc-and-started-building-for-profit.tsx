'use client';
import {
  Frame,
  Ink,
  gen,
  filled,
  stroke,
  loop,
  RoughDash,
  motion,
  Bolt,
} from './_kit';

/* "Stopped chasing VC, started building for profit" → a small wooden sailboat
   moving steadily under its own wind-power across a calm gold-dusk sea, while the
   abandoned VC vehicle — a slumping, deflating hot-air balloon — sinks toward the
   far horizon behind it. Self-sustaining craft in front, growth-at-all-costs
   balloon left behind. Seeds 300–340; gradient ids prefixed `vcsail_`. */

export default function Scene() {
  return (
    <Frame sky={['#fcf2df', '#f2d7ad']}>
      <defs>
        <radialGradient id='vcsail_sun' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff4d8' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff4d8' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='vcsail_sea' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#cfe1e6' />
          <stop offset='100%' stopColor='#8fb1bd' />
        </linearGradient>
      </defs>

      {/* dusk sun glow + soft disc, low and warm */}
      <circle cx='150' cy='40' r='44' fill='url(#vcsail_sun)' />
      <Ink
        d={gen.circle(
          150,
          40,
          18,
          filled(300, '#f7e3ad', { fillStyle: 'solid' })
        )}
      />

      <Bolt x={36} y={22} s={0.9} c='#cf9836' seed={225} />

      {/* far horizon haze band */}
      <Ink
        d={gen.path(
          'M0 62 Q100 58 200 62 L200 66 L0 66 Z',
          filled(301, '#e7caa0', { roughness: 1.6, hachureGap: 4 })
        )}
      />

      {/* the abandoned VC balloon — slumping, deflating, sinking far behind */}
      <motion.g
        animate={{ y: [0, 2.4, 0], rotate: [0, -3, 0] }}
        transition={loop(4)}
        style={{ transformOrigin: '52px 40px' }}
      >
        <Ink
          d={gen.path(
            'M44 30 C36 32 35 44 44 50 Q52 54 60 50 C68 44 66 32 58 30 Q51 27 44 30 Z',
            filled(302, '#d68a72', {
              hachureGap: 3.2,
              fillWeight: 0.6,
              roughness: 1.5,
            })
          )}
        />
        {/* sag crease — the deflation */}
        <Ink
          d={gen.path(
            'M40 47 Q51 53 62 47',
            stroke(303, { strokeWidth: 1, roughness: 1.6 })
          )}
        />
        <Ink d={gen.line(46, 51, 49, 58, stroke(304, { strokeWidth: 0.8 }))} />
        <Ink d={gen.line(56, 51, 53, 58, stroke(305, { strokeWidth: 0.8 }))} />
        <Ink
          d={gen.rectangle(
            48.5,
            58,
            5,
            4,
            filled(306, '#caa16a', { fillStyle: 'solid', strokeWidth: 0.9 })
          )}
        />
      </motion.g>

      {/* sea */}
      <rect x='0' y='66' width='200' height='34' fill='url(#vcsail_sea)' />
      <Ink
        d={gen.line(
          0,
          66,
          200,
          66,
          stroke(310, {
            stroke: '#eef6f3',
            strokeWidth: 1.2,
            roughness: 1,
          })
        )}
      />

      {/* drifting swell lines */}
      {[
        [72, 0, 311],
        [80, 0.8, 312],
        [88, 1.5, 313],
      ].map(([sy, d, seed]) => (
        <motion.g
          key={seed}
          animate={{ x: [0, -4, 0] }}
          transition={loop(3.2, d)}
        >
          <Ink
            d={gen.path(
              `M0 ${sy} Q50 ${sy - 1.6} 100 ${sy} T200 ${sy}`,
              stroke(seed, {
                stroke: '#7fa3af',
                strokeWidth: 0.8,
                roughness: 1.2,
              })
            )}
          />
        </motion.g>
      ))}

      {/* wake trail behind the sailboat — its own steady progress */}
      <RoughDash
        d='M150 80 Q132 78 116 76'
        c='#eef6f3'
        w={1.6}
        dur={1.8}
        dash='2 6'
        o={0.6}
        seed={330}
      />

      {/* the self-sustaining sailboat — wind-powered, moving forward */}
      <motion.g
        animate={{ y: [0, -1.6, 0], rotate: [-1.5, 1.5, -1.5] }}
        transition={loop(3)}
        style={{ transformOrigin: '112px 72px' }}
      >
        {/* mast */}
        <Ink
          d={gen.line(112, 70, 112, 44, stroke(320, { strokeWidth: 1.2 }))}
        />
        {/* main sail — full, catching wind */}
        <motion.g
          animate={{ skewX: [0, 4, 0] }}
          transition={loop(2.4)}
          style={{ transformOrigin: '112px 56px' }}
        >
          <Ink
            d={gen.path(
              'M113 45 Q126 54 124 68 L113 68 Z',
              filled(321, '#e2693f', { fillStyle: 'solid', strokeWidth: 1.1 })
            )}
          />
        </motion.g>
        {/* fore sail — smaller */}
        <Ink
          d={gen.path(
            'M111 48 Q101 58 100 68 L111 68 Z',
            filled(322, '#e0a83f', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
        {/* hull */}
        <Ink
          d={gen.path(
            'M96 70 L130 70 Q124 79 112 79 Q100 79 96 70 Z',
            filled(323, '#9a6b3e', { hachureGap: 2.4, fillWeight: 0.7 })
          )}
        />
        <Ink
          d={gen.line(
            98,
            72.5,
            128,
            72.5,
            stroke(324, { strokeWidth: 0.9, stroke: '#7c5530' })
          )}
        />
      </motion.g>
    </Frame>
  );
}

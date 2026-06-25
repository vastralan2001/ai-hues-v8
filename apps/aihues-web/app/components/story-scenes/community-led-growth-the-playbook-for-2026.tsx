'use client';

import {
  Frame,
  Ink,
  Twinkle,
  Cloud,
  RoughDash,
  gen,
  filled,
  loop,
  motion,
} from './_kit';

/* Community-Led Growth — a warm dusk hearth (the product/community heart) ringed
   by peer member-nodes connected by glowing threads; seed-sparks drift outward
   from the hearth and settle as new distant member-stars: adoption spreading
   through a connected community rather than broadcast from one source. */

// member nodes evenly placed on a ring around the hearth at (100,54)
const ring = [
  { x: 64, y: 40, seed: 320, ph: 0 },
  { x: 100, y: 30, seed: 322, ph: 0.5 },
  { x: 136, y: 40, seed: 324, ph: 1.0 },
  { x: 142, y: 64, seed: 326, ph: 1.5 },
  { x: 100, y: 74, seed: 328, ph: 2.0 },
  { x: 58, y: 64, seed: 330, ph: 2.5 },
];

export default function Scene() {
  return (
    <Frame sky={['#fbeede', '#f0d2b2']}>
      <defs>
        <radialGradient id='clg_hearth' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#ffe6b6' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#ffe6b6' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* distant atmosphere */}
      <Cloud x={42} y={22} s={0.8} o={0.4} />
      <Twinkle x={26} y={20} c='#cf9836' />
      <Twinkle x={176} y={18} d={0.7} c='#e0a83f' />

      {/* soft ground swell for depth */}
      <Ink
        d={gen.path(
          'M0 88 Q100 78 200 88 L200 100 L0 100 Z',
          filled(310, '#e7c79a', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />

      {/* glow around the hearth */}
      <circle cx='100' cy='54' r='40' fill='url(#clg_hearth)' />

      {/* connection threads: hearth → each member node, drawn as rough ink links */}
      {ring.map((m, i) => (
        <motion.g
          key={`th-${m.seed}`}
          animate={{ opacity: [0.35, 0.7, 0.35] }}
          transition={loop(2.4, i * 0.18)}
        >
          <Ink
            d={gen.line(100, 54, m.x, m.y, {
              stroke: '#d98f46',
              strokeWidth: 1,
              roughness: 1.4,
              bowing: 2,
              seed: m.seed + 5,
            })}
          />
        </motion.g>
      ))}

      {/* one live link flows as a rough dashed trail (the spreading signal) */}
      <RoughDash
        d='M100 54 L100 30'
        c='#d98f46'
        w={1.2}
        dur={1.6}
        dash='1.5 4'
        seed={336}
        o={0.85}
      />

      {/* member nodes around the ring, gently breathing */}
      {ring.map((m) => (
        <motion.g
          key={`mn-${m.seed}`}
          animate={{ scale: [1, 1.12, 1] }}
          transition={loop(2.6, m.ph)}
          style={{ transformOrigin: `${m.x}px ${m.y}px` }}
        >
          <Ink
            d={gen.circle(
              m.x,
              m.y,
              6,
              filled(m.seed, '#94ac78', {
                fillStyle: 'solid',
                strokeWidth: 1.1,
              })
            )}
          />
          <Ink
            d={gen.circle(
              m.x,
              m.y - 0.4,
              2.6,
              filled(m.seed + 1, '#f3e4c4', {
                fillStyle: 'solid',
                strokeWidth: 0,
              })
            )}
          />
        </motion.g>
      ))}

      {/* the hearth: the shared community heart, a warm pulsing ember-flame */}
      <motion.g
        animate={{ scale: [1, 1.07, 1] }}
        transition={loop(2.4)}
        style={{ transformOrigin: '100px 54px' }}
      >
        <Ink
          d={gen.circle(
            100,
            54,
            18,
            filled(340, '#e2693f', { fillStyle: 'solid', strokeWidth: 1.3 })
          )}
        />
        <Ink
          d={gen.circle(
            100,
            54,
            10,
            filled(341, '#e0a83f', { fillStyle: 'solid', strokeWidth: 0 })
          )}
        />
        <motion.g
          animate={{ scaleY: [1, 1.22, 1], opacity: [0.85, 1, 0.85] }}
          transition={loop(0.8)}
          style={{ transformOrigin: '100px 56px' }}
        >
          <Ink
            d={gen.path(
              'M96 58 Q97 50 100 46 Q103 50 104 58 Q100 60 96 58 Z',
              filled(342, '#ffe6b6', { fillStyle: 'solid', strokeWidth: 0 })
            )}
          />
        </motion.g>
      </motion.g>

      {/* seed-sparks rising from the hearth → new adoption spreading outward */}
      {[
        { dx: 26, d: 0, seed: 360 },
        { dx: -22, d: 1.1, seed: 362 },
        { dx: 8, d: 2.0, seed: 364 },
      ].map((s) => (
        <motion.g
          key={`sp-${s.dx}`}
          animate={{ x: [0, s.dx], y: [0, -26], opacity: [0, 0.9, 0] }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: 'easeOut',
            delay: s.d,
          }}
        >
          <Ink
            d={gen.circle(
              100,
              48,
              3,
              filled(s.seed, '#fff3da', { fillStyle: 'solid', strokeWidth: 0 })
            )}
          />
        </motion.g>
      ))}

      {/* a new far-off member-star the spread has reached */}
      <motion.g
        animate={{ scale: [0.9, 1.1, 0.9], rotate: [0, 8, 0] }}
        transition={loop(2.8)}
        style={{ transformOrigin: '150px 24px' }}
      >
        <Ink
          d={gen.polygon(
            [
              [150, 19],
              [151.6, 22.4],
              [155.4, 22.8],
              [152.6, 25.2],
              [153.4, 29],
              [150, 27],
              [146.6, 29],
              [147.4, 25.2],
              [144.6, 22.8],
              [148.4, 22.4],
            ],
            filled(350, '#cf9836', { fillStyle: 'solid' })
          )}
        />
      </motion.g>
    </Frame>
  );
}

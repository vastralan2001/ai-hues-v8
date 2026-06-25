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
  motion,
} from './_kit';

/* Authentication without the pain — three modern auth methods (OAuth, passkey,
   magic link) drift in along soft trails and converge on one calm gateway whose
   keyhole glows open. Security as a quiet, frictionless threshold of light. */

export default function Scene() {
  const px = 'auth_';
  const keys = [
    { x: 30, y: 34, d: 0 }, // OAuth — a small ringed token
    { x: 24, y: 64, d: 1.1 }, // passkey — fingerprint mark
    { x: 36, y: 84, d: 0.6 }, // magic link — envelope
  ];
  return (
    <Frame sky={['#f4f0e6', '#dfe6da']}>
      <defs>
        <radialGradient id={`${px}glow`} cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff3d4' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff3d4' stopOpacity='0' />
        </radialGradient>
        <linearGradient id={`${px}door`} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#ffe9b8' />
          <stop offset='100%' stopColor='#f3c873' />
        </linearGradient>
      </defs>

      {/* sky accents */}
      <Twinkle x={170} y={20} c='#cf9836' />
      <Twinkle x={150} y={36} d={0.8} c='#e0a83f' />
      <Cloud x={48} y={18} s={0.75} o={0.4} />

      {/* distant ground horizon for depth */}
      <Ink
        d={gen.path(
          'M0 84 Q100 78 200 84 L200 100 L0 100 Z',
          filled(301, '#cdd6bf', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />
      <Ink
        d={gen.path(
          'M0 90 Q90 86 200 91 L200 100 L0 100 Z',
          filled(302, '#aebf95', { roughness: 1.4, hachureGap: 3 })
        )}
      />

      {/* the gateway — a stone arch standing on the horizon */}
      <g>
        {/* aura of light spilling through the open door */}
        <circle cx='132' cy='56' r='30' fill={`url(#${px}glow)`} />
        {/* left jamb */}
        <Ink
          d={gen.rectangle(
            114,
            46,
            8,
            38,
            filled(303, '#d7cdb6', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        {/* right jamb */}
        <Ink
          d={gen.rectangle(
            142,
            46,
            8,
            38,
            filled(304, '#d7cdb6', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        {/* arched lintel over the jambs */}
        <Ink
          d={gen.path(
            'M114 50 Q132 30 150 50 L150 46 Q132 26 114 46 Z',
            filled(305, '#c9bea3', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        {/* the open doorway, lit from within */}
        <Ink
          d={gen.path(
            'M122 84 L122 50 Q132 36 142 50 L142 84 Z',
            filled(306, `url(#${px}door)`, {
              fillStyle: 'solid',
              strokeWidth: 1.1,
            })
          )}
        />
        {/* the keyhole — the focal mark, gently pulsing */}
        <motion.g
          animate={{ opacity: [0.7, 1, 0.7], scale: [0.94, 1.06, 0.94] }}
          transition={loop(2.4)}
          style={{ transformOrigin: '132px 64px' }}
        >
          <Ink
            d={gen.circle(
              132,
              61,
              7,
              filled(307, '#fff7e0', { fillStyle: 'solid', strokeWidth: 1.1 })
            )}
          />
          <Ink
            d={gen.polygon(
              [
                [132, 61],
                [134.4, 70],
                [129.6, 70],
              ],
              filled(308, '#fff7e0', { fillStyle: 'solid', strokeWidth: 1 })
            )}
          />
        </motion.g>
      </g>

      {/* one trail carrying the auth methods toward the keyhole */}
      <RoughDash
        d='M26 64 Q70 62 118 62'
        c='#788c5d'
        w={1.3}
        dur={2}
        dash='2 6'
        seed={316}
      />

      {/* OAuth — a ringed token (a small orbit of trust) */}
      <motion.g
        animate={{ y: [0, -2.4, 0] }}
        transition={loop(2.6, keys[0].d)}
        style={{ transformOrigin: `${keys[0].x}px ${keys[0].y}px` }}
      >
        <Ink
          d={gen.circle(
            keys[0].x,
            keys[0].y,
            13,
            stroke(309, { stroke: '#5a86c5', strokeWidth: 1.2, roughness: 1 })
          )}
        />
        <Ink
          d={gen.circle(
            keys[0].x,
            keys[0].y,
            5,
            filled(310, '#6a9bcc', { fillStyle: 'solid' })
          )}
        />
      </motion.g>

      {/* passkey — a fingerprint mark (you are the key) */}
      <motion.g
        animate={{ y: [0, -2, 0] }}
        transition={loop(3, keys[1].d)}
        style={{ transformOrigin: `${keys[1].x}px ${keys[1].y}px` }}
      >
        <Ink
          d={gen.path(
            'M18 64 Q24 56 30 64 M20 66 Q24 60 28 66 M21.5 67 Q24 63 26.5 67',
            stroke(311, { stroke: '#788c5d', strokeWidth: 1.2, roughness: 1.1 })
          )}
        />
        <Ink
          d={gen.path(
            'M16 62 Q24 52 32 62',
            stroke(312, { stroke: '#94ac78', strokeWidth: 1.1, roughness: 1.1 })
          )}
        />
      </motion.g>

      {/* magic link — a small envelope sealed with a spark */}
      <motion.g
        animate={{ y: [0, -2.6, 0], rotate: [0, 4, 0] }}
        transition={loop(2.8, keys[2].d)}
        style={{ transformOrigin: `${keys[2].x}px ${keys[2].y}px` }}
      >
        <Ink
          d={gen.rectangle(
            keys[2].x - 8,
            keys[2].y - 5,
            16,
            11,
            filled(313, '#fbe7d2', { fillStyle: 'solid', strokeWidth: 1.1 })
          )}
        />
        <Ink
          d={gen.path(
            `M${keys[2].x - 8} ${keys[2].y - 5} L${keys[2].x} ${keys[2].y + 1} L${keys[2].x + 8} ${keys[2].y - 5}`,
            stroke(314, { stroke: '#c2502e', strokeWidth: 1.1, roughness: 1 })
          )}
        />
        <motion.g
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.7, 1, 0.7] }}
          transition={loop(1.6)}
          style={{ transformOrigin: `${keys[2].x}px ${keys[2].y - 1}px` }}
        >
          <Ink
            d={gen.circle(
              keys[2].x,
              keys[2].y - 1,
              4,
              filled(315, '#e2693f', { fillStyle: 'solid' })
            )}
          />
        </motion.g>
      </motion.g>
    </Frame>
  );
}

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

/* "Building AI Products Without a PhD" — you bridge from where you stand to a
   shipped product using ready-made, modular blocks, spanning a chasm of theory
   you never have to climb down into. A near plinth and a far lit waypoint, a
   plank bridge of simple API-blocks laid across the gap (a fresh one floating
   into place), a small builder, the unknowable depth left in soft haze below. */

export default function Scene() {
  const planks = [
    { x: 70, c: '#e2693f', seed: 312 },
    { x: 88, c: '#e0a83f', seed: 314 },
    { x: 106, c: '#788c5d', seed: 316 },
    { x: 124, c: '#6a9bcc', seed: 318 },
  ];
  return (
    <Frame sky={['#fbf3e6', '#f1dcbd']}>
      <defs>
        <radialGradient id='bridge_goal' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff2cf' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff2cf' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='bridge_chasm' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#e7d4bd' stopOpacity='0.55' />
          <stop offset='100%' stopColor='#cdb89c' stopOpacity='0' />
        </linearGradient>
      </defs>

      {/* depth: glow over the goal, soft haze rising from the chasm */}
      <circle cx='162' cy='40' r='30' fill='url(#bridge_goal)' />
      <rect x='40' y='66' width='130' height='34' fill='url(#bridge_chasm)' />
      <Cloud x={52} y={28} s={0.8} o={0.42} />
      <Twinkle x={34} y={24} c='#cf9836' />
      <Twinkle x={180} y={26} d={0.7} c='#e0a83f' />

      {/* near plinth — "where you stand" */}
      <Ink
        d={gen.polygon(
          [
            [18, 62],
            [56, 62],
            [50, 100],
            [10, 100],
          ],
          filled(301, '#b9956a', { hachureGap: 3.2, fillWeight: 0.6 })
        )}
      />
      <Ink
        d={gen.path(
          'M18 62 L56 62',
          stroke(302, { stroke: '#9d7a52', strokeWidth: 1.4 })
        )}
      />

      {/* far pier — the shipped side */}
      <Ink
        d={gen.polygon(
          [
            [150, 58],
            [186, 58],
            [192, 100],
            [156, 100],
          ],
          filled(303, '#a8895f', { hachureGap: 3.4, fillWeight: 0.6 })
        )}
      />
      <Ink
        d={gen.path(
          'M150 58 L186 58',
          stroke(304, { stroke: '#8a6f49', strokeWidth: 1.4 })
        )}
      />

      {/* the laid planks — modular ready-made API blocks bridging the gap */}
      {planks.map((p, i) => (
        <motion.g
          key={p.seed}
          animate={{ y: [0, -1.1, 0] }}
          transition={loop(2.6, i * 0.35)}
          style={{ transformOrigin: `${p.x + 7}px 60px` }}
        >
          <Ink
            d={gen.rectangle(
              p.x,
              57 - i * 0.6,
              15,
              6,
              filled(p.seed, p.c, {
                fillStyle: 'solid',
                strokeWidth: 1.1,
                roughness: 1,
              })
            )}
          />
          <Ink
            d={gen.circle(
              p.x + 7.5,
              60 - i * 0.6,
              2.4,
              filled(p.seed + 1, '#fbf3e6', { fillStyle: 'solid' })
            )}
          />
        </motion.g>
      ))}

      {/* the missing plank, floating into place — the next ready-made piece */}
      <motion.g
        animate={{ y: [-9, -5, -9], rotate: [-4, 2, -4] }}
        transition={loop(2.8)}
        style={{ transformOrigin: '149px 55px' }}
      >
        <Ink
          d={gen.rectangle(
            141,
            52,
            15,
            6,
            filled(320, '#cf9836', {
              fillStyle: 'solid',
              strokeWidth: 1.1,
              roughness: 1,
            })
          )}
        />
        <Ink
          d={gen.circle(
            148.5,
            55,
            2.4,
            filled(321, '#fbf3e6', { fillStyle: 'solid' })
          )}
        />
      </motion.g>

      {/* a faint guide line from where the plank will drop */}
      <RoughDash
        d='M148 47 L148 51'
        c='#cf9836'
        w={1}
        dur={1.3}
        seed={350}
        dash='1 3'
      />

      {/* small builder on the near plinth, setting a plank */}
      <motion.g
        animate={{ y: [0, -1.3, 0] }}
        transition={loop(2)}
        style={{ transformOrigin: '40px 50px' }}
      >
        <Ink
          d={gen.circle(
            40,
            48,
            4.6,
            filled(330, '#c2502e', { fillStyle: 'solid' })
          )}
        />
        <Ink
          d={gen.path(
            'M40 50 L40 56 M40 52 L36.5 53.5 M40 52 L45 52 M40 56 L37 60 M40 56 L43 60',
            stroke(331, { strokeWidth: 1.3 })
          )}
        />
      </motion.g>

      {/* the goal: a small lit waypoint flag on the far pier */}
      <Ink d={gen.line(168, 58, 168, 40, stroke(340, { strokeWidth: 1.6 }))} />
      <motion.g
        animate={{ skewX: [0, 8, 0] }}
        transition={loop(1.7)}
        style={{ transformOrigin: '168px 45px' }}
      >
        <Ink
          d={gen.path(
            'M168 41 Q177 43 184 40 Q177 47 184 50 Q176 48 168 51 Z',
            filled(341, '#788c5d', { fillStyle: 'solid' })
          )}
        />
      </motion.g>
    </Frame>
  );
}

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

/* Digital minimalism (30-day declutter): a calm dusk desk-horizon holding one
   small, steady glowing device, while the swarm of deleted app-icons drifts up
   and fades away into the sky — the clutter leaving, a single focus remaining. */

export default function Scene() {
  // drifting app-icons being shed: start near the desk, rise + fade away
  const shed = [
    { x: 58, y: 70, s: 4.4, dx: -10, dur: 3.4, delay: 0, seed: 320 },
    { x: 70, y: 66, s: 3.6, dx: -16, dur: 3.9, delay: 0.7, seed: 322 },
    { x: 132, y: 68, s: 4.0, dx: 14, dur: 3.6, delay: 0.3, seed: 324 },
    { x: 144, y: 64, s: 3.2, dx: 20, dur: 4.2, delay: 1.1, seed: 326 },
    { x: 96, y: 60, s: 3.0, dx: -4, dur: 4.6, delay: 1.5, seed: 328 },
  ];

  return (
    <Frame sky={['#f3eef0', '#dfe0ea']}>
      <defs>
        <radialGradient id='dm30_calm' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fbeede' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fbeede' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* quiet dusk atmosphere */}
      <Cloud x={150} y={24} s={0.85} o={0.4} />
      <Twinkle x={28} y={20} c='#cf9836' />
      <Twinkle x={176} y={40} d={0.9} c='#e0a83f' />

      {/* soft glow behind the one device that stays */}
      <circle cx='100' cy='58' r='34' fill='url(#dm30_calm)' />

      {/* the desk / horizon shelf — long, calm, uncluttered */}
      <Ink
        d={gen.path(
          'M0 80 Q100 76 200 80 L200 100 L0 100 Z',
          filled(301, '#cdb79a', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />
      <Ink
        d={gen.line(
          0,
          80,
          200,
          80,
          stroke(302, { stroke: '#b59a78', strokeWidth: 1.3 })
        )}
      />

      {/* the swarm of deleted apps, drifting up and away, fading out */}
      {shed.map((a) => (
        <motion.g
          key={a.seed}
          animate={{
            y: [0, -34],
            x: [0, a.dx],
            opacity: [0.55, 0],
            rotate: [0, a.dx > 0 ? 22 : -22],
          }}
          transition={{
            duration: a.dur,
            repeat: Infinity,
            ease: 'easeOut',
            delay: a.delay,
          }}
          style={{ transformOrigin: `${a.x}px ${a.y}px` }}
        >
          <Ink
            d={gen.rectangle(
              a.x - a.s / 2,
              a.y - a.s / 2,
              a.s,
              a.s,
              filled(a.seed, '#9aa6c4', {
                fillStyle: 'solid',
                strokeWidth: 0.9,
                roughness: 1.4,
              })
            )}
          />
        </motion.g>
      ))}

      {/* the one device that remains — small, upright, steadily breathing */}
      <motion.g
        animate={{ y: [0, -1.4, 0] }}
        transition={loop(3)}
        style={{ transformOrigin: '100px 70px' }}
      >
        <Ink
          d={gen.ellipse(
            100,
            81,
            22,
            4.4,
            filled(313, INK, {
              fillStyle: 'solid',
              stroke: 'none',
              roughness: 1.4,
              seed: 313,
            })
          )}
        />
        <Ink
          d={gen.rectangle(
            92,
            54,
            16,
            26,
            filled(310, '#fbf6ee', {
              fillStyle: 'solid',
              strokeWidth: 1.2,
              roughness: 0.9,
            })
          )}
        />
        {/* a single calm screen — one thing, lit warmly */}
        <Ink
          d={gen.rectangle(
            94.5,
            57.5,
            11,
            17,
            filled(314, '#f3cf8d', {
              fillStyle: 'solid',
              strokeWidth: 0.9,
              roughness: 1,
              seed: 314,
            })
          )}
        />
        <motion.g
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={loop(2.6)}
          style={{ transformOrigin: '100px 66px' }}
        >
          <Ink
            d={gen.line(
              96,
              78,
              104,
              78,
              stroke(311, { stroke: '#c79a5a', strokeWidth: 1 })
            )}
          />
        </motion.g>
        {/* one solitary focus mark on the screen */}
        <Ink
          d={gen.circle(
            100,
            66,
            5,
            filled(312, '#e0a83f', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
      </motion.g>

      {/* a faint rising trail — the drift outward, the half cut away */}
      <RoughDash
        d='M100 70 Q88 48 70 30'
        c='#a7b0c9'
        w={1.2}
        dur={2.4}
        dash='1.5 6'
        o={0.45}
        seed={315}
      />
    </Frame>
  );
}

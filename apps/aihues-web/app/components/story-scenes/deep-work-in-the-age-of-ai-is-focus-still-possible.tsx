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

/* Deep Work in the Age of AI — metaphor: a lone lighthouse on a quiet headland
   throwing ONE steady beam through dusk fog while a swarm of restless
   notification-sparks drifts and scatters around it. The single held beam =
   protected attention; the scattering sparks = every tool trying to distract. */

export default function Scene() {
  return (
    <Frame sky={['#f3ecdc', '#e6d2b4']}>
      <defs>
        <linearGradient id='dwfocus_beam' x1='0' y1='0' x2='1' y2='0'>
          <stop offset='0%' stopColor='#f6e4b6' stopOpacity='0.85' />
          <stop offset='100%' stopColor='#f6e4b6' stopOpacity='0' />
        </linearGradient>
        <radialGradient id='dwfocus_lamp' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff3d2' stopOpacity='1' />
          <stop offset='100%' stopColor='#fff3d2' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* far depth: drifting fog banks and a couple of quiet stars */}
      <Twinkle x={28} y={20} c='#cf9836' />
      <Twinkle x={176} y={26} d={0.9} c='#e0a83f' />
      <Cloud x={150} y={30} s={0.85} o={0.4} />

      {/* the held beam — one calm wedge of light sweeping a hair, not scattering */}
      <motion.g
        animate={{ rotate: [-2.5, 2.5, -2.5] }}
        transition={loop(6)}
        style={{ transformOrigin: '70px 36px' }}
      >
        <path d='M70 36 L200 6 L200 64 Z' fill='url(#dwfocus_beam)' />
      </motion.g>

      {/* distant sea — a low calm horizon band for depth */}
      <Ink
        d={gen.path(
          'M0 80 Q100 74 200 80 L200 100 L0 100 Z',
          filled(301, '#c6a86e', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />
      <Ink
        d={gen.line(
          0,
          80,
          200,
          80,
          stroke(302, { stroke: '#efe2c2', strokeWidth: 1.2 })
        )}
      />

      {/* the headland the lighthouse stands on */}
      <Ink
        d={gen.path(
          'M40 88 Q58 70 84 74 Q100 76 108 88 Z',
          filled(303, '#94ac78', { hachureGap: 3 })
        )}
      />

      {/* the lighthouse — the single focused subject, holding its ground */}
      <motion.g animate={{ y: [0, -0.8, 0] }} transition={loop(3.4)}>
        {/* tower body */}
        <Ink
          d={gen.path(
            'M64 74 L60 42 L80 42 L76 74 Z',
            filled(304, '#f1e8d6', {
              fillStyle: 'solid',
              strokeWidth: 1.2,
            })
          )}
        />
        {/* terracotta banding stripe */}
        <Ink
          d={gen.path(
            'M61.6 56 L78.4 56 L77.6 62 L62.4 62 Z',
            filled(305, '#c2502e', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
        {/* lamp room */}
        <Ink
          d={gen.rectangle(
            64,
            33,
            12,
            9,
            filled(306, '#6a9bcc', {
              fillStyle: 'solid',
              strokeWidth: 1.2,
            })
          )}
        />
        {/* roof cap */}
        <Ink
          d={gen.polygon(
            [
              [62, 33],
              [70, 26],
              [78, 33],
            ],
            filled(307, '#cf9836', { fillStyle: 'solid' })
          )}
        />
        {/* the lamp glow — the protected, steady core of attention */}
        <circle cx='70' cy='37' r='12' fill='url(#dwfocus_lamp)' />
        <motion.g
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={loop(2.6)}
          style={{ transformOrigin: '70px 37px' }}
        >
          <Ink
            d={gen.circle(
              70,
              37,
              5,
              filled(308, '#f0b449', { fillStyle: 'solid' })
            )}
          />
        </motion.g>
      </motion.g>

      {/* the swarm — restless notification-sparks drifting & scattering off-axis,
          none of them landing on the beam's held line */}
      {[
        { x: 122, y: 30, dx: 7, dy: -5, dur: 2.2, dl: 0, c: '#e2693f', r: 1.5 },
        {
          x: 144,
          y: 50,
          dx: 9,
          dy: 4,
          dur: 2.8,
          dl: 0.5,
          c: '#cf9836',
          r: 1.3,
        },
        {
          x: 110,
          y: 58,
          dx: -6,
          dy: 6,
          dur: 2.4,
          dl: 1.1,
          c: '#788c5d',
          r: 1.4,
        },
        {
          x: 162,
          y: 38,
          dx: 8,
          dy: -6,
          dur: 3.0,
          dl: 0.3,
          c: '#e2693f',
          r: 1.2,
        },
        {
          x: 132,
          y: 64,
          dx: 6,
          dy: 7,
          dur: 2.6,
          dl: 0.8,
          c: '#6a9bcc',
          r: 1.3,
        },
        {
          x: 178,
          y: 56,
          dx: 5,
          dy: 5,
          dur: 2.3,
          dl: 1.4,
          c: '#cf9836',
          r: 1.1,
        },
      ].map((s, i) => (
        <motion.g
          key={s.x}
          animate={{
            x: [0, s.dx, 0],
            y: [0, s.dy, 0],
            opacity: [0.25, 0.85, 0.25],
          }}
          transition={{
            duration: s.dur,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: s.dl,
          }}
        >
          <Ink
            d={gen.path(
              `M${s.x} ${s.y - s.r} L${s.x + s.r * 0.4} ${s.y} L${s.x} ${s.y + s.r} L${s.x - s.r * 0.4} ${s.y} Z`,
              filled(320 + i, s.c, { fillStyle: 'solid', strokeWidth: 0.9 })
            )}
          />
        </motion.g>
      ))}

      {/* a faint scatter-trail showing distractions glancing off the focus */}
      <RoughDash
        d='M108 50 Q140 44 180 52'
        c='#e2693f'
        w={1}
        dur={1.8}
        seed={330}
        dash='1 6'
        o={0.4}
      />
    </Frame>
  );
}

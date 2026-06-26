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
  linear,
  INK,
  motion,
} from './_kit';

/* No-Code MVP — Launch in 48 Hours. Metaphor: a small product assembled from
   pre-made modular blocks. A base platform on a calm horizon, a half-built
   structure of snapped-together blocks, and two ready-made blocks drifting down
   to click into place — building without writing code. A dashed clock arc swings
   overhead for the 48-hour speed. Seeds in the 300 block. */

export default function Scene() {
  return (
    <Frame sky={['#fdf3e6', '#f6dcbd']}>
      <defs>
        <radialGradient id='ncmvp_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff4dd' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff4dd' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* sky glow + early-morning accents */}
      <circle cx='40' cy='26' r='40' fill='url(#ncmvp_glow)' />
      <Twinkle x={168} y={20} c='#e0a83f' />
      <Cloud x={156} y={64} s={0.8} o={0.4} />

      {/* 48h clock arc swinging overhead — speed of the build */}
      <RoughDash
        d='M52 60 Q100 4 148 60'
        c='#cf9836'
        w={1.4}
        dur={1.7}
        seed={300}
        dash='2 6'
      />
      <motion.g
        animate={{ rotate: 360 }}
        transition={linear(8)}
        style={{ transformOrigin: '100px 60px' }}
      >
        <Ink
          d={gen.line(100, 60, 100, 40, stroke(301, { strokeWidth: 1.3 }))}
        />
      </motion.g>
      <Ink
        d={gen.circle(
          100,
          60,
          3.4,
          filled(302, '#e2693f', { fillStyle: 'solid' })
        )}
      />

      {/* distant hill for depth */}
      <Ink
        d={gen.path(
          'M0 84 Q70 76 130 82 T200 80 L200 100 L0 100 Z',
          filled(303, '#d7c79c', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />

      {/* base platform / workbench */}
      <g opacity='0.08'>
        <Ink
          d={gen.ellipse(
            100,
            86,
            80,
            10,
            filled(316, INK, { fillStyle: 'solid', stroke: 'none' })
          )}
        />
      </g>
      <Ink
        d={gen.rectangle(
          70,
          80,
          60,
          7,
          filled(304, '#94ac78', { fillStyle: 'solid', strokeWidth: 1.2 })
        )}
      />

      {/* the half-built structure — snapped-together modular blocks */}
      <motion.g
        animate={{ y: [0, -1.4, 0] }}
        transition={loop(2.6)}
        style={{ transformOrigin: '100px 70px' }}
      >
        <Ink
          d={gen.rectangle(
            82,
            68,
            14,
            12,
            filled(305, '#6a9bcc', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        <Ink
          d={gen.rectangle(
            96,
            68,
            14,
            12,
            filled(306, '#e2693f', { hachureGap: 2.4 })
          )}
        />
        <Ink
          d={gen.rectangle(
            89,
            57,
            14,
            12,
            filled(307, '#e0a83f', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        {/* snap nubs on the top block */}
        <Ink d={gen.line(93, 57, 93, 54, stroke(308, { strokeWidth: 1.1 }))} />
        <Ink d={gen.line(99, 57, 99, 54, stroke(309, { strokeWidth: 1.1 }))} />
      </motion.g>

      {/* ready-made block drifting down to click into place (left) */}
      <motion.g
        animate={{ y: [-18, 0, 0, -18], opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 3.4,
          repeat: Infinity,
          ease: 'easeInOut',
          times: [0, 0.4, 0.75, 1],
        }}
      >
        <Ink
          d={gen.rectangle(
            110,
            57,
            13,
            11,
            filled(310, '#788c5d', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        <Ink d={gen.line(114, 57, 114, 54.5, stroke(311))} />
        <Ink d={gen.line(119, 57, 119, 54.5, stroke(312))} />
      </motion.g>

      {/* second ready-made block drifting in (right, offset timing) */}
      <motion.g
        animate={{ y: [-22, 0, 0, -22], opacity: [0, 1, 1, 0] }}
        transition={{
          duration: 3.4,
          delay: 1.6,
          repeat: Infinity,
          ease: 'easeInOut',
          times: [0, 0.4, 0.75, 1],
        }}
      >
        <Ink
          d={gen.rectangle(
            128,
            66,
            13,
            11,
            filled(313, '#cf9836', { hachureGap: 2.4 })
          )}
        />
        <Ink d={gen.line(132, 66, 132, 63.5, stroke(314))} />
        <Ink d={gen.line(137, 66, 137, 63.5, stroke(315))} />
      </motion.g>

      {/* a soft 'click' spark where blocks meet */}
      <Twinkle x={106} y={63} d={0.3} r={1.3} c='#fff4dd' />
    </Frame>
  );
}

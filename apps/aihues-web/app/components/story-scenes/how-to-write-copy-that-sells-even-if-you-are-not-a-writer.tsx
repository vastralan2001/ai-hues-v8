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

/* Metaphor — copy as a baited hook: a pen-nib casts a single thin line that
   arcs down past a still water line to a glowing golden hook (the "hook" of
   good copy / the one question), and a small reader-fish rises to take it.
   The writer's tool and the angler's cast are the same gesture: the right
   words catch. */

export default function Scene() {
  // line from nib tip (54,30) curving down to the hook eye (132,62)
  const cast = 'M54 30 Q70 70 110 60 T132 62';
  return (
    <Frame sky={['#fcf4e6', '#f1dcb4']}>
      <defs>
        <radialGradient id='copy_bait' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff2cf' stopOpacity='1' />
          <stop offset='100%' stopColor='#fff2cf' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='copy_water' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#dfe9d2' stopOpacity='0.55' />
          <stop offset='100%' stopColor='#9fb583' stopOpacity='0.5' />
        </linearGradient>
      </defs>

      <Twinkle x={36} y={20} c='#e0a83f' />
      <Twinkle x={172} y={26} d={0.7} c='#cf9836' />
      <Cloud x={158} y={30} s={0.75} o={0.4} />

      {/* still water — the reader's attention pool, lower third */}
      <rect x='0' y='72' width='200' height='28' fill='url(#copy_water)' />
      <Ink
        d={gen.line(
          0,
          72,
          200,
          72,
          stroke(310, {
            stroke: '#fbf6ea',
            strokeWidth: 1.2,
            roughness: 1.1,
            bowing: 0.6,
          })
        )}
      />
      {/* faint reflected ripples */}
      {[
        [104, 78, 0, 311],
        [128, 84, 0.8, 312],
        [150, 80, 1.5, 313],
      ].map(([rx, ry, d, sd]) => (
        <motion.g
          key={rx}
          animate={{ scaleX: [0.5, 1.5], opacity: [0.55, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeOut',
            delay: d,
          }}
          style={{ transformOrigin: `${rx}px ${ry}px` }}
        >
          <Ink
            d={gen.ellipse(rx, ry, 12, 2.8, {
              stroke: '#fbf6ea',
              strokeWidth: 0.7,
              roughness: 1.4,
              seed: sd,
            })}
          />
        </motion.g>
      ))}

      {/* the pen-nib (the writer's tool, top-left), gently dipping */}
      <motion.g
        animate={{ rotate: [-2, 1, -2] }}
        transition={loop(3.4)}
        style={{ transformOrigin: '50px 22px' }}
      >
        <Ink
          d={gen.path(
            'M44 12 L56 24 L54 30 L50 27 L48 21 Z',
            filled(301, '#e2693f', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        {/* nib slit */}
        <Ink d={gen.line(50, 18, 54, 28, stroke(302, { strokeWidth: 0.9 }))} />
        {/* shaft */}
        <Ink d={gen.line(44, 12, 36, 6, stroke(303, { strokeWidth: 1.4 }))} />
      </motion.g>

      {/* the cast line — flowing, reads as the written sentence becoming a hook */}
      <RoughDash
        d={cast}
        c={INK}
        w={1}
        dur={1.8}
        dash='2 5'
        o={0.75}
        seed={320}
      />

      {/* glow behind the bait */}
      <circle cx='132' cy='64' r='16' fill='url(#copy_bait)' />

      {/* the hook + golden bait (the "one question" / the hook of copy) */}
      <motion.g
        animate={{ y: [0, -2.2, 0] }}
        transition={loop(2.4)}
        style={{ transformOrigin: '132px 64px' }}
      >
        {/* hook curve */}
        <Ink
          d={gen.path(
            'M132 60 L132 68 Q132 74 137 73 Q140 72 139 69',
            stroke(304, { strokeWidth: 1.3, roughness: 1 })
          )}
        />
        {/* barb */}
        <Ink d={gen.line(139, 69, 136, 70, stroke(305, { strokeWidth: 1 }))} />
        {/* glowing bait drop */}
        <Ink
          d={gen.circle(
            132,
            62,
            8,
            filled(306, '#f0b449', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        {/* the question mark glinting inside the bait */}
        <text
          x='132'
          y='65'
          textAnchor='middle'
          fontSize='8'
          fontWeight='800'
          fill={INK}
        >
          ?
        </text>
      </motion.g>

      {/* the reader-fish, rising toward the bait from below */}
      <motion.g
        animate={{ x: [0, 4, 0], y: [0, -1.5, 0] }}
        transition={loop(2.8)}
        style={{ transformOrigin: '150px 86px' }}
      >
        <Ink
          d={gen.path(
            'M150 86 Q158 82 166 86 Q158 90 150 86 Z',
            filled(307, '#788c5d', { fillStyle: 'solid', strokeWidth: 1.1 })
          )}
        />
        {/* tail fin */}
        <Ink
          d={gen.polygon(
            [
              [150, 86],
              [145, 83],
              [146, 86],
              [145, 89],
            ],
            filled(308, '#94ac78', { fillStyle: 'solid' })
          )}
        />
        {/* eye */}
        <Ink
          d={gen.circle(
            163,
            85.5,
            1.4,
            filled(309, INK, { fillStyle: 'solid' })
          )}
        />
      </motion.g>
    </Frame>
  );
}

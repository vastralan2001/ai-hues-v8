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
  linear,
  motion,
} from './_kit';

/* Referral loops — a viral growth chain. A pulsing seed node at center sends an
   invitation along a closed dashed loop; the loop threads through a widening ring
   of bloomed nodes, each smaller and farther out, the propagation of one user
   becoming many. The flowing dashes read as the referral passing hand to hand. */

const RL_LOOP =
  'M100 56 C150 36 158 70 124 78 C96 84 58 80 50 60 C44 44 70 30 100 56 Z';

// outer bloomed nodes along the loop — descending size = each new generation
const NODES: [number, number, number, string, number, number][] = [
  // x, y, diameter, color, seed, twinkle/pulse delay
  [50, 60, 8, '#e2693f', 320, 0],
  [124, 78, 7, '#e0a83f', 321, 0.5],
  [148, 49, 6, '#788c5d', 322, 1.0],
  [100, 30, 5.4, '#6a9bcc', 323, 1.5],
  [56, 38, 4.6, '#cf9836', 324, 0.8],
];

export default function Scene() {
  return (
    <Frame sky={['#fcf3e6', '#f1ddc6']}>
      <defs>
        <radialGradient id='rl_seedglow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff3da' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff3da' stopOpacity='0' />
        </radialGradient>
        <radialGradient id='rl_ring' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#f6e7c4' stopOpacity='0' />
          <stop offset='72%' stopColor='#f0d6a8' stopOpacity='0' />
          <stop offset='100%' stopColor='#e7c189' stopOpacity='0.4' />
        </radialGradient>
      </defs>

      <Twinkle x={28} y={22} c='#cf9836' />
      <Twinkle x={176} y={28} d={0.7} c='#e0a83f' />

      {/* soft expanding-reach ring behind the loop */}
      <circle cx='100' cy='56' r='56' fill='url(#rl_ring)' />

      {/* the closed referral loop — flowing dashes = the invite passing onward */}
      <RoughDash
        d={RL_LOOP}
        c='#d99a3f'
        w={1.6}
        dur={2.4}
        seed={313}
        dash='2 6'
        o={0.85}
      />

      {/* sketched underdrawing of the loop for hand-drawn texture */}
      <Ink
        d={gen.path(
          RL_LOOP,
          stroke(310, { stroke: '#cf9836', strokeWidth: 0.9, roughness: 1.4 })
        )}
      />

      {/* central seed node — the original user, glowing and pulsing */}
      <circle cx='100' cy='56' r='22' fill='url(#rl_seedglow)' />
      <motion.g
        animate={{ scale: [1, 1.08, 1] }}
        transition={loop(2.6)}
        style={{ transformOrigin: '100px 56px' }}
      >
        <Ink
          d={gen.circle(
            100,
            56,
            12,
            filled(311, '#c2502e', { fillStyle: 'solid', strokeWidth: 1.3 })
          )}
        />
        <Ink
          d={gen.circle(
            100,
            56,
            5.2,
            filled(312, '#fbe9cf', { fillStyle: 'solid' })
          )}
        />
      </motion.g>

      {/* an outward ripple from the seed — referral reaching new people */}
      <motion.g
        animate={{ scale: [1, 2.5], opacity: [0.55, 0] }}
        transition={linear(2.8)}
        style={{ transformOrigin: '100px 56px' }}
      >
        <Ink
          d={gen.circle(
            100,
            56,
            12,
            stroke(314, { stroke: '#e2693f', strokeWidth: 1.2, roughness: 1.5 })
          )}
        />
      </motion.g>

      {/* the bloomed referral nodes — each generation smaller, farther along */}
      {NODES.map(([x, y, dia, color, seed, delay]) => (
        <motion.g
          key={seed}
          animate={{ scale: [0.85, 1.1, 0.85] }}
          transition={loop(2.2, delay)}
          style={{ transformOrigin: `${x}px ${y}px` }}
        >
          <Ink
            d={gen.circle(
              x,
              y,
              dia,
              filled(seed, color, { fillStyle: 'solid', strokeWidth: 1.1 })
            )}
          />
        </motion.g>
      ))}
    </Frame>
  );
}

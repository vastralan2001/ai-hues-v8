'use client';
import {
  Frame,
  Ink,
  Twinkle,
  Cloud,
  gen,
  filled,
  stroke,
  loop,
  linear,
  INK,
  motion,
} from './_kit';

/* Metaphor — the indie dev's small product sails calm water, but a vast submerged
   ledge of legal paperwork (an official seal / stamped foundation) lies just beneath
   the surface, ready to ground the venture. Hidden compliance under a still sea. */

export default function Scene() {
  return (
    <Frame sky={['#f3f6fb', '#dde7f1']}>
      <defs>
        <linearGradient id='ltx_water' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#cfe0ee' />
          <stop offset='100%' stopColor='#7ea7cb' />
        </linearGradient>
        <radialGradient id='ltx_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff3da' stopOpacity='0.85' />
          <stop offset='100%' stopColor='#fff3da' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* sky depth */}
      <Twinkle x={30} y={20} c='#cf9836' />
      <Twinkle x={176} y={26} d={0.8} c='#e0a83f' />
      <Twinkle x={150} y={16} d={1.3} c='#cf9836' />
      <Cloud x={52} y={24} s={0.8} o={0.45} />
      <Cloud x={158} y={36} s={0.66} o={0.38} />

      {/* still waterline */}
      <rect x='0' y='52' width='200' height='48' fill='url(#ltx_water)' />
      <line
        x1='0'
        y1='52'
        x2='200'
        y2='52'
        stroke='#eaf4ff'
        strokeWidth='1.3'
        opacity='0.7'
      />

      {/* the submerged ledge of paperwork — a vast official seal stamped on the seabed */}
      <motion.g animate={{ opacity: [0.82, 1, 0.82] }} transition={loop(3.2)}>
        <Ink
          d={gen.ellipse(
            104,
            84,
            150,
            34,
            filled(2101, '#6f9bc1', {
              hachureGap: 4.2,
              fillWeight: 0.55,
              roughness: 1.5,
            })
          )}
        />
        <Ink
          d={gen.ellipse(
            104,
            84,
            64,
            22,
            stroke(2102, {
              stroke: '#33506b',
              strokeWidth: 1.2,
              roughness: 1.1,
            })
          )}
        />
        <Ink
          d={gen.ellipse(
            104,
            84,
            52,
            17,
            stroke(2103, { stroke: '#33506b', strokeWidth: 1, roughness: 1.1 })
          )}
        />
        {/* the seal's notched rim */}
        <Ink
          d={gen.path(
            'M104 73 L104 95 M82 84 L126 84 M88 77 L120 91 M120 77 L88 91',
            stroke(2104, { stroke: '#33506b', strokeWidth: 0.9, roughness: 1 })
          )}
        />
        <Ink
          d={gen.path(
            'M104 78 Q110 84 104 90 Q98 84 104 78 Z',
            filled(2105, '#33506b', { fillStyle: 'solid', strokeWidth: 0.9 })
          )}
        />
      </motion.g>

      {/* faint warning glints rising off the hidden hazard */}
      {[
        [70, 70, 0],
        [138, 66, 0.9],
        [104, 62, 1.6],
      ].map(([bx, by, d]) => (
        <motion.circle
          key={bx}
          cx={bx}
          cy={by}
          r='1.4'
          fill='#eaf6ff'
          opacity='0.55'
          animate={{ y: [0, -10], opacity: [0, 0.55, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeOut',
            delay: d,
          }}
        />
      ))}

      {/* sun warmth on the small venture above */}
      <circle cx='150' cy='30' r='30' fill='url(#ltx_glow)' />

      {/* the small product-boat, riding the calm surface, unaware */}
      <motion.g
        animate={{ y: [0, -1.6, 0], rotate: [-1.4, 1.4, -1.4] }}
        transition={loop(2.6)}
        style={{ transformOrigin: '92px 50px' }}
      >
        {/* paper sail with a tiny seal stamp */}
        <Ink
          d={gen.path(
            'M92 26 L92 49 L74 49 Q82 38 92 26 Z',
            filled(2106, '#f4ede0', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        <Ink
          d={gen.line(
            83,
            44,
            88,
            44,
            stroke(2107, { stroke: INK, strokeWidth: 0.7, roughness: 0.8 })
          )}
        />
        <Ink
          d={gen.line(
            80,
            40,
            88,
            40,
            stroke(2108, { stroke: INK, strokeWidth: 0.7, roughness: 0.8 })
          )}
        />
        <Ink
          d={gen.circle(
            85,
            35,
            4,
            filled(2109, '#c2502e', { fillStyle: 'solid', strokeWidth: 0.8 })
          )}
        />
        {/* mast */}
        <Ink
          d={gen.line(
            92,
            24,
            92,
            52,
            stroke(2110, { strokeWidth: 1, roughness: 0.7 })
          )}
        />
        {/* hull */}
        <Ink
          d={gen.path(
            'M78 50 L106 50 L100 57 L84 57 Z',
            filled(2111, '#e2693f', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
      </motion.g>

      {/* gentle surface ripple drifting the boat toward the hazard */}
      <motion.path
        d='M58 52 Q92 49 132 52'
        fill='none'
        stroke='#eaf4ff'
        strokeWidth='1'
        opacity='0.6'
        strokeDasharray='3 6'
        animate={{ strokeDashoffset: [0, -18] }}
        transition={linear(2.2)}
      />
    </Frame>
  );
}

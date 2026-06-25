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

// ── Indie Dev — the exit: a small boat at a three-way fork in a dusk river ──
// The venture drifts to the point where its single channel splits into three
// diverging routes (sell / pivot / shut down); the founder must pick one.
export default function Scene() {
  return (
    <Frame sky={['#fcefe0', '#f3d6bd']}>
      <defs>
        <radialGradient id='exit_dusk' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff1d6' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff1d6' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='exit_water' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#e6b98f' />
          <stop offset='100%' stopColor='#c98c63' />
        </linearGradient>
      </defs>

      {/* low dusk sun + sparks toward the edges */}
      <circle cx='150' cy='30' r='40' fill='url(#exit_dusk)' />
      <Ink
        d={gen.circle(
          150,
          30,
          15,
          filled(301, '#f4dca0', { fillStyle: 'solid' })
        )}
      />
      <Twinkle x={36} y={22} c='#cf9836' />
      <Twinkle x={176} y={54} d={0.8} c='#e0a83f' />
      <Twinkle x={28} y={50} d={1.4} c='#cf9836' r={0.9} />
      <Cloud x={56} y={20} s={0.8} o={0.42} />
      <Cloud x={132} y={62} s={0.6} o={0.3} />

      {/* far bank / horizon land mass for depth */}
      <Ink
        d={gen.path(
          'M0 58 Q60 50 116 56 T200 52 L200 60 L0 60 Z',
          filled(302, '#cdb27e', {
            roughness: 1.5,
            hachureGap: 3.6,
            fillWeight: 0.6,
          })
        )}
      />

      {/* the water: a single channel below that forks into three above */}
      <rect x='0' y='60' width='200' height='40' fill='url(#exit_water)' />

      {/* three diverging channels carved into the bank, lighter than the water */}
      <Ink
        d={gen.path(
          'M86 60 Q70 50 38 44 L48 41 Q78 49 96 60 Z',
          filled(303, '#ecc89a', { hachureGap: 4, fillWeight: 0.55 })
        )}
      />
      <Ink
        d={gen.path(
          'M92 60 Q98 48 100 34 L106 34 Q104 49 100 60 Z',
          filled(304, '#f0d2a8', { hachureGap: 4, fillWeight: 0.55 })
        )}
      />
      <Ink
        d={gen.path(
          'M104 60 Q126 51 162 46 L154 43 Q120 50 98 60 Z',
          filled(305, '#ecc89a', { hachureGap: 4, fillWeight: 0.55 })
        )}
      />

      {/* drifting current lines that flow up toward the fork */}
      <motion.path
        d='M96 78 Q92 70 84 62'
        fill='none'
        stroke='#fbe7cc'
        strokeWidth='1'
        opacity='0.6'
        strokeDasharray='2 6'
        animate={{ strokeDashoffset: [0, -16] }}
        transition={linear(2.2)}
      />
      <motion.path
        d='M104 80 Q108 70 116 60'
        fill='none'
        stroke='#fbe7cc'
        strokeWidth='1'
        opacity='0.5'
        strokeDasharray='2 6'
        animate={{ strokeDashoffset: [0, -16] }}
        transition={linear(2.6)}
      />

      {/* three route markers — small cairns at the head of each channel */}
      <Ink
        d={gen.circle(
          38,
          44,
          4.4,
          filled(306, '#c2502e', { fillStyle: 'solid' })
        )}
      />
      <Ink
        d={gen.circle(
          100,
          33,
          4.4,
          filled(307, '#788c5d', { fillStyle: 'solid' })
        )}
      />
      <Ink
        d={gen.circle(
          162,
          46,
          4.4,
          filled(308, '#6a9bcc', { fillStyle: 'solid' })
        )}
      />

      {/* the venture: a small boat at the point of divergence, gently bobbing */}
      <motion.g
        animate={{ y: [0, -1.6, 0], rotate: [-1.5, 1.5, -1.5] }}
        transition={loop(3)}
        style={{ transformOrigin: '100px 70px' }}
      >
        <ellipse cx='100' cy='76' rx='14' ry='2.6' fill={INK} opacity='0.12' />
        {/* hull */}
        <Ink
          d={gen.path(
            'M86 70 Q100 80 114 70 Q108 73 100 73 Q92 73 86 70 Z',
            filled(309, '#e2693f', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        {/* mast */}
        <Ink
          d={gen.line(100, 70, 100, 54, stroke(310, { strokeWidth: 1.3 }))}
        />
        {/* sail catching the dusk light */}
        <motion.g
          animate={{ skewX: [0, 7, 0] }}
          transition={loop(2.4)}
          style={{ transformOrigin: '100px 60px' }}
        >
          <Ink
            d={gen.path(
              'M101 55 Q110 60 109 68 Q104 66 101 67 Z',
              filled(311, '#f4dca0', { fillStyle: 'solid', strokeWidth: 1.1 })
            )}
          />
        </motion.g>
      </motion.g>

      {/* faint ripples spreading from the boat */}
      {[
        [100, 78, 0],
        [100, 78, 1.5],
      ].map(([rx, ry, d], i) => (
        <motion.ellipse
          key={i}
          cx={rx}
          cy={ry}
          rx='8'
          ry='2'
          fill='none'
          stroke='#fbe7cc'
          strokeWidth='0.8'
          animate={{ scale: [0.5, 1.4], opacity: [0.5, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeOut',
            delay: d,
          }}
          style={{ transformOrigin: `${rx}px ${ry}px` }}
        />
      ))}
    </Frame>
  );
}

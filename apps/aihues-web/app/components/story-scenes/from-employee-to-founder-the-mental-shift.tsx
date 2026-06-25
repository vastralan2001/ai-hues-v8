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

/* From Employee to Founder — the mental shift.
   Metaphor: a lone figure mid-crossing on a thin rope bridge spanning a deep
   chasm. The near cliff (the salaried, structured past) sits in cool shade; the
   far cliff catches the warm gold of a rising sun (the founder's side). The gap
   below is the unknown — risk tolerance — and the single small figure out on the
   ropes, no one beside them, is the loneliness nobody warns you about. */

export default function Scene() {
  const e2f = 'e2f';
  return (
    <Frame sky={['#f4efe2', '#e7d9c2']}>
      <defs>
        <radialGradient id={`${e2f}_dawn`} cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff3da' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff3da' stopOpacity='0' />
        </radialGradient>
        <linearGradient id={`${e2f}_chasm`} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#cdbfa6' stopOpacity='0.55' />
          <stop offset='100%' stopColor='#a99c84' stopOpacity='0' />
        </linearGradient>
      </defs>

      {/* dawn glow over the far (founder) side */}
      <circle cx='158' cy='26' r='40' fill={`url(#${e2f}_dawn)`} />
      <Ink
        d={gen.circle(
          158,
          26,
          15,
          filled(301, '#f4dca0', { fillStyle: 'solid' })
        )}
      />

      <Twinkle x={36} y={22} c='#c9a24a' />
      <Twinkle x={184} y={44} d={0.8} c='#e0a83f' r={1.2} />
      <Twinkle x={120} y={16} d={1.3} c='#cf9836' />
      <Cloud x={54} y={30} s={0.78} o={0.4} />
      <Cloud x={150} y={62} s={0.62} o={0.32} />

      {/* hazy depth in the chasm */}
      <rect x='40' y='60' width='120' height='40' fill={`url(#${e2f}_chasm)`} />

      {/* near cliff — employee side, in cool shade */}
      <Ink
        d={gen.path(
          'M0 58 L18 58 Q32 60 44 70 L50 96 L0 96 Z',
          filled(302, '#8f9a86', { hachureGap: 3.4, fillWeight: 0.6 })
        )}
      />
      <Ink
        d={gen.path(
          'M0 58 L18 58 Q30 60 40 68',
          stroke(303, { strokeWidth: 1.3, stroke: '#6f7a64' })
        )}
      />

      {/* far cliff — founder side, catching warm light */}
      <Ink
        d={gen.path(
          'M200 50 L176 50 Q160 53 150 66 L146 96 L200 96 Z',
          filled(304, '#d9b873', { hachureGap: 3.2, fillWeight: 0.6 })
        )}
      />
      <Ink
        d={gen.path(
          'M200 50 L176 50 Q162 53 152 64',
          stroke(305, { strokeWidth: 1.3, stroke: '#b6913f' })
        )}
      />

      {/* the rope bridge: two slung guide-ropes + plank deck spanning the gap */}
      <Ink
        d={gen.path(
          'M40 66 Q100 80 152 64',
          stroke(306, { strokeWidth: 1.1, roughness: 1.4, stroke: '#8a7a5c' })
        )}
      />
      <Ink
        d={gen.path(
          'M40 60 Q100 73 152 58',
          stroke(307, { strokeWidth: 1, roughness: 1.4, stroke: '#9c8c6c' })
        )}
      />
      {/* vertical plank/hanger ticks between the two ropes */}
      <Ink
        d={gen.path(
          'M58 62.6 L58 68 M72 64.4 L72 70.4 M86 65.4 L86 71.6 M100 65.8 L100 72 M114 65.4 L114 71.6 M128 64.4 L128 70.4 M142 62.6 L142 68',
          stroke(308, { strokeWidth: 0.9, roughness: 1.2, stroke: '#8a7a5c' })
        )}
      />

      {/* a single thread of dawn light reaching from the founder side along the span */}
      <motion.path
        d='M152 61 Q100 76 40 63'
        fill='none'
        stroke='#f0cf86'
        strokeWidth='1.4'
        strokeDasharray='2 7'
        opacity='0.8'
        animate={{ strokeDashoffset: [0, -18] }}
        transition={linear(2)}
      />

      {/* the lone figure, out on the ropes mid-crossing, edging toward the light */}
      <motion.g
        animate={{ x: [-4, 6, -4], y: [0, -1.1, 0] }}
        transition={loop(3.2)}
        style={{ transformOrigin: '100px 70px' }}
      >
        <Ink
          d={gen.circle(
            100,
            60,
            4,
            filled(309, '#c2502e', { fillStyle: 'solid' })
          )}
        />
        <Ink
          d={gen.path(
            'M100 62 L100 67 M100 64 L96.4 65.6 M100 64 L103.6 65.4 M100 67 L97 71 M100 67 L103 71',
            stroke(310, { strokeWidth: 1.3, stroke: INK })
          )}
        />
      </motion.g>

      {/* a small flag planted on the founder cliff — the goal */}
      <Ink d={gen.line(178, 50, 178, 36, stroke(311, { strokeWidth: 1.4 }))} />
      <motion.g
        animate={{ skewX: [0, 8, 0] }}
        transition={loop(1.7)}
        style={{ transformOrigin: '178px 39px' }}
      >
        <Ink
          d={gen.path(
            'M178 37 Q186 39 192 36 Q186 42 192 45 Q185 43 178 46 Z',
            filled(312, '#e2693f', { fillStyle: 'solid' })
          )}
        />
      </motion.g>
    </Frame>
  );
}

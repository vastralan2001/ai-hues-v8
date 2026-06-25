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

/* Metaphor: a 12-month growth timeline as an ascending run of milestone posts —
   short seedling stake on the left climbing to a tall flagged post crowned with
   light on the right ($50K ARR). A dashed thread of progress weaves up through
   the markers, ground rises with the months, gold dawn breaks at the summit. */

// twelve months: x evenly spaced, post tops climbing left→right
const MONTHS = Array.from({ length: 12 }, (_, i) => {
  const x = 26 + i * 13;
  const base = 84 - i * 1.0; // ground rises gently
  const top = 80 - i * 4.6; // posts grow taller toward the goal
  return { x, base, top, i };
});

// progress thread threading near the post tops
const THREAD = 'M26 78 Q60 70 78 64 T128 44 T182 22';

export default function Scene() {
  return (
    <Frame sky={['#fdf3e1', '#f4d9ab']}>
      <defs>
        <radialGradient id='s50k_dawn' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff3d4' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff3d4' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* dawn glow at the summit / goal */}
      <circle cx='184' cy='20' r='40' fill='url(#s50k_dawn)' />

      <Twinkle x={36} y={20} c='#cf9836' />
      <Cloud x={56} y={28} s={0.78} o={0.4} />

      {/* rising ground band */}
      <Ink
        d={gen.path(
          'M0 86 Q60 82 110 78 T200 70 L200 100 L0 100 Z',
          filled(301, '#e6cf9a', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />
      <Ink
        d={gen.line(0, 86, 200, 70, {
          stroke: '#f3e3bd',
          strokeWidth: 1,
          roughness: 1.4,
          bowing: 1.2,
          seed: 305,
        })}
      />

      {/* the twelve milestone posts, climbing */}
      {MONTHS.map(({ x, base, top, i }) => {
        const isGoal = i === 11;
        const milestone = i === 3 || i === 7; // a couple of pivots stand out
        const cap = isGoal ? '#e2693f' : milestone ? '#788c5d' : '#cf9836';
        return (
          <g key={i}>
            <Ink
              d={gen.line(
                x,
                base,
                x,
                top,
                stroke(310 + i, {
                  stroke: INK,
                  strokeWidth: isGoal ? 1.4 : 1.1,
                  roughness: 1.1,
                })
              )}
            />
            <motion.g
              animate={{ scale: isGoal ? [1, 1.14, 1] : [0.94, 1.06, 0.94] }}
              transition={loop(2.2 + (i % 4) * 0.4, i * 0.18)}
              style={{ transformOrigin: `${x}px ${top}px` }}
            >
              <Ink
                d={gen.circle(
                  x,
                  top,
                  isGoal ? 5.6 : milestone ? 4.2 : 3,
                  filled(330 + i, cap, { fillStyle: 'solid', strokeWidth: 1 })
                )}
              />
            </motion.g>
          </g>
        );
      })}

      {/* progress thread weaving up through the posts */}
      <RoughDash
        d={THREAD}
        c='#d99a3f'
        w={1.6}
        dur={1.7}
        dash='2 6'
        seed={306}
      />

      {/* the summit post: a flag crowning the final ($50K) marker */}
      <Ink d={gen.line(184, 22, 184, 6, stroke(360, { strokeWidth: 1.5 }))} />
      <motion.g
        animate={{ skewX: [0, 8, 0] }}
        transition={loop(1.7)}
        style={{ transformOrigin: '184px 10px' }}
      >
        <Ink
          d={gen.path(
            'M184 7 Q193 9 200 6 Q193 13 200 16 Q192 14 184 17 Z',
            filled(361, '#e2693f', { fillStyle: 'solid' })
          )}
        />
      </motion.g>

      {/* a little seedling at the start — the side-project origin */}
      <motion.g
        animate={{ rotate: [-3, 3, -3] }}
        transition={loop(2.8)}
        style={{ transformOrigin: '26px 82px' }}
      >
        <Ink
          d={gen.path(
            'M26 82 Q22 78 20 79 M26 82 Q30 77 33 79',
            stroke(370, { stroke: '#788c5d', strokeWidth: 1.2 })
          )}
        />
      </motion.g>
    </Frame>
  );
}

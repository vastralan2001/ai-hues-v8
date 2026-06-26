'use client';

import {
  Frame,
  Ink,
  Cloud,
  RoughDash,
  gen,
  filled,
  stroke,
  loop,
  motion,
} from './_kit';

// ── Productivity — night owls: a calm evening crescent moon, a gentle arc of
// stars flowing down to a small dawn sun on the horizon. The night before sets
// up the morning; the productive day is prepared, not forced awake.
export default function Scene() {
  const arc = 'M58 34 Q96 30 132 54 T182 78';
  return (
    <Frame sky={['#e9e6f1', '#f4ddc4']}>
      <defs>
        <radialGradient id='nightowl_moon' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fbf3df' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#fbf3df' stopOpacity='0' />
        </radialGradient>
        <radialGradient id='nightowl_dawn' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#ffe6c4' stopOpacity='1' />
          <stop offset='100%' stopColor='#ffe6c4' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* evening-side stars, fading toward the warmer dawn edge */}
      <Cloud x={150} y={30} s={0.7} o={0.4} />

      {/* far dawn glow + low hills for depth */}
      <circle cx='182' cy='78' r='30' fill='url(#nightowl_dawn)' />
      <Ink
        d={gen.path(
          'M0 86 Q70 80 130 84 T200 82 L200 100 L0 100 Z',
          filled(201, '#cdb9d6', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />
      <Ink
        d={gen.path(
          'M96 90 Q150 82 200 88 L200 100 L96 100 Z',
          filled(202, '#e7c79d', { roughness: 1.5, hachureGap: 3.4 })
        )}
      />

      {/* the flowing arc — night preparation easing into the morning */}
      <RoughDash d={arc} c='#b89cc4' w={1.6} dur={2.2} dash='2 7' seed={208} />

      {/* small dawn sun resting on the horizon */}
      <motion.g
        animate={{ y: [0, -1.6, 0] }}
        transition={loop(2.8)}
        style={{ transformOrigin: '182px 80px' }}
      >
        <Ink
          d={gen.circle(
            182,
            80,
            12,
            filled(203, '#f0b449', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
      </motion.g>

      {/* the focal subject — a calm evening crescent moon */}
      <circle cx='66' cy='44' r='28' fill='url(#nightowl_moon)' />
      <motion.g
        animate={{ rotate: [0, 4, 0] }}
        transition={loop(4.5)}
        style={{ transformOrigin: '66px 44px' }}
      >
        <Ink
          d={gen.path(
            'M70 28 C58 30 50 40 50 50 C50 61 59 70 70 70 C63 65 59 58 59 49 C59 40 63 33 70 28 Z',
            filled(204, '#f4e9c6', { fillStyle: 'solid', strokeWidth: 1.3 })
          )}
        />
        {/* a couple of soft craters for texture */}
        <Ink
          d={gen.circle(
            58,
            44,
            4,
            stroke(205, { strokeWidth: 0.9, roughness: 1 })
          )}
        />
        <Ink
          d={gen.circle(
            56,
            56,
            3,
            stroke(206, { strokeWidth: 0.9, roughness: 1 })
          )}
        />
      </motion.g>

      {/* a tiny moonlit cloud drifting under the moon */}
      <motion.g
        animate={{ x: [0, 6, 0] }}
        transition={loop(5)}
        style={{ transformOrigin: '70px 60px' }}
      >
        <Ink
          d={gen.path(
            'M52 64 Q60 58 70 62 Q80 58 86 64 Q70 68 52 64 Z',
            filled(207, '#efe6f2', {
              fillStyle: 'solid',
              strokeWidth: 0.9,
              roughness: 1.1,
            })
          )}
        />
      </motion.g>
    </Frame>
  );
}

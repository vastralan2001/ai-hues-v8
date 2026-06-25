'use client';
import { Frame, filled, gen, Ink, linear, loop, motion, stroke } from './_kit';

/* React Server Components: a quiet orbital system over a planet's rim — server
   and client components circling one shared core. */

export default function Scene() {
  return (
    <Frame sky={['#eef2fb', '#d4e0f1']}>
      <defs>
        <radialGradient id='rsc_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#9cc0ea' stopOpacity='0.7' />
          <stop offset='100%' stopColor='#9cc0ea' stopOpacity='0' />
        </radialGradient>
      </defs>
      <Ink
        d={gen.path(
          'M0 88 Q100 66 200 88 L200 100 L0 100 Z',
          filled(81, '#6f9fd4', { hachureGap: 3 })
        )}
      />
      <circle cx='100' cy='48' r='32' fill='url(#rsc_glow)' />
      {[
        { rot: 0, dur: 9, dir: 1, seed: 82 },
        { rot: 60, dur: 12, dir: -1, seed: 83 },
        { rot: 120, dur: 10, dir: 1, seed: 84 },
      ].map((o) => (
        <motion.g
          key={o.seed}
          animate={{ rotate: 360 * o.dir }}
          transition={linear(o.dur)}
          style={{ transformOrigin: '100px 48px' }}
        >
          <g transform={`rotate(${o.rot} 100 48)`}>
            <Ink
              d={gen.ellipse(
                100,
                48,
                80,
                26,
                stroke(o.seed, {
                  stroke: '#5a86c5',
                  strokeWidth: 1.3,
                  roughness: 1,
                })
              )}
            />
            <Ink
              d={gen.circle(
                140,
                48,
                4.4,
                filled(o.seed + 100, '#5a86c5', { fillStyle: 'solid' })
              )}
            />
          </g>
        </motion.g>
      ))}
      <motion.g
        animate={{ scale: [1, 1.06, 1] }}
        transition={loop(2.6)}
        style={{ transformOrigin: '100px 48px' }}
      >
        <Ink
          d={gen.circle(
            100,
            48,
            16,
            filled(85, '#6a9bcc', { fillStyle: 'solid', strokeWidth: 1.3 })
          )}
        />
      </motion.g>
    </Frame>
  );
}

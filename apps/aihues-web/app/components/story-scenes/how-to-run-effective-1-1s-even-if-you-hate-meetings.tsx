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

/* "How to Run Effective 1:1s" — the bloated hour distilled.
   Metaphor: an hourglass whose wide upper bulb (the hour-long status meeting,
   lots of slow sand) funnels down to a small, bright focused pool below — the
   15-minute format. Two people sit as small markers on either side, a quiet
   1:1 either side of the glass, joined by the falling stream. */

export default function Scene() {
  return (
    <Frame sky={['#fbf3e6', '#f1ddbe']}>
      <defs>
        <radialGradient id='oneone_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff4d8' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff4d8' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='oneone_sand' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#e9b863' />
          <stop offset='100%' stopColor='#d99a3f' />
        </linearGradient>
      </defs>

      {/* atmosphere */}
      <Twinkle x={34} y={22} c='#cf9836' />
      <Twinkle x={170} y={28} d={0.8} c='#e0a83f' />
      <Cloud x={48} y={24} s={0.78} o={0.4} />

      {/* warm focus glow on the small lower bulb (the 15 productive minutes) */}
      <circle cx='100' cy='66' r='28' fill='url(#oneone_glow)' />

      {/* far ground line for depth */}
      <Ink
        d={gen.path(
          'M0 90 Q100 85 200 90 L200 100 L0 100 Z',
          filled(301, '#e7cf9f', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />

      {/* two people — small markers on either side, a quiet 1:1 */}
      <motion.g animate={{ y: [0, -1.2, 0] }} transition={loop(2.6)}>
        <Ink
          d={gen.circle(
            40,
            70,
            5,
            filled(302, '#788c5d', { fillStyle: 'solid' })
          )}
        />
        <Ink
          d={gen.path(
            'M40 73 L40 81 M40 75 L36.5 78 M40 75 L43.5 78',
            stroke(303, { strokeWidth: 1.3 })
          )}
        />
      </motion.g>
      <motion.g animate={{ y: [0, -1.2, 0] }} transition={loop(2.6, 1.3)}>
        <Ink
          d={gen.circle(
            160,
            70,
            5,
            filled(304, '#6a9bcc', { fillStyle: 'solid' })
          )}
        />
        <Ink
          d={gen.path(
            'M160 73 L160 81 M160 75 L156.5 78 M160 75 L163.5 78',
            stroke(305, { strokeWidth: 1.3 })
          )}
        />
      </motion.g>

      {/* hourglass frame: top & bottom caps */}
      <Ink d={gen.line(76, 30, 124, 30, stroke(306, { strokeWidth: 1.6 }))} />
      <Ink d={gen.line(82, 84, 118, 84, stroke(307, { strokeWidth: 1.6 }))} />

      {/* hourglass glass: wide hour-bulb above narrowing to a small minute-bulb below */}
      <Ink
        d={gen.path(
          'M78 31 C78 48 96 53 100 56 C104 53 122 48 122 31 Z',
          stroke(308, { strokeWidth: 1.2, roughness: 1 })
        )}
      />
      <Ink
        d={gen.path(
          'M100 56 C103 59 113 64 113 78 C113 81 109 83 100 83 C91 83 87 81 87 78 C87 64 97 59 100 56 Z',
          stroke(309, { strokeWidth: 1.2, roughness: 1 })
        )}
      />

      {/* slow-draining upper sand — the bloated hour */}
      <motion.g
        animate={{ scaleY: [1, 0.86, 1] }}
        transition={loop(3)}
        style={{ transformOrigin: '100px 32px' }}
      >
        <Ink
          d={gen.path(
            'M80 32 L120 32 C118 45 104 50 100 53 C96 50 82 45 80 32 Z',
            filled(310, 'url(#oneone_sand)', {
              fillStyle: 'solid',
              strokeWidth: 0,
            })
          )}
        />
      </motion.g>

      {/* the falling stream through the waist */}
      <RoughDash
        d='M100 53 L100 73'
        c='#d99a3f'
        w={1.4}
        dur={0.9}
        seed={312}
        dash='1.5 3'
      />

      {/* the small bright focused pool — 15 minutes that count */}
      <motion.g
        animate={{ scaleY: [0.9, 1.06, 0.9] }}
        transition={loop(3)}
        style={{ transformOrigin: '100px 82px' }}
      >
        <Ink
          d={gen.path(
            'M89 82 C90 74 96 71 100 70 C104 71 110 74 111 82 Z',
            filled(311, '#f0b449', { fillStyle: 'solid', strokeWidth: 0 })
          )}
        />
      </motion.g>
    </Frame>
  );
}

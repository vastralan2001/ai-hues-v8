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

/* Time Blocking for Creatives — metaphor: a day-planner column of stacked time
   blocks. The rigid hour grid sways and breathes instead of holding a stiff
   timetable; one warm "deep work" block expands organically (the flexible system
   that actually works), its dashed flow-line drifting through. A soft gold glow
   marks where creative focus lands. Light, atmospheric, no faces. Seeds 300+. */

export default function Scene() {
  return (
    <Frame sky={['#fbf3e6', '#f0e2c8']}>
      <defs>
        <radialGradient id='tbc_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff2cf' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff2cf' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* distant atmosphere */}
      <Cloud x={46} y={24} s={0.8} o={0.4} />
      <Cloud x={158} y={30} s={0.65} o={0.32} />
      <Twinkle x={30} y={20} c='#cf9836' />
      <Twinkle x={176} y={18} d={0.8} c='#e0a83f' />
      <Twinkle x={150} y={66} d={1.4} c='#94ac78' r={1} />

      {/* warm focus glow over the deep-work block */}
      <circle cx='118' cy='52' r='40' fill='url(#tbc_glow)' />

      {/* the planner column spine — drawn, slightly bowed, not CAD-straight */}
      <Ink d={gen.line(70, 16, 70, 92, stroke(300, { strokeWidth: 1.3 }))} />

      {/* the rigid grid: gently swaying hour rows (the schedule that breathes) */}
      <motion.g
        animate={{ skewY: [0, 1.4, 0] }}
        transition={loop(3.2)}
        style={{ transformOrigin: '70px 54px' }}
      >
        {[24, 40, 80, 96].map((gy, i) => (
          <Ink
            key={gy}
            d={gen.line(
              74,
              gy,
              160,
              gy,
              stroke(310 + i, {
                stroke: '#cbb289',
                strokeWidth: 0.9,
                roughness: 1.5,
              })
            )}
          />
        ))}
      </motion.g>

      {/* two small fixed blocks — the ordinary, rigid slots */}
      <Ink
        d={gen.rectangle(
          74,
          26,
          40,
          12,
          filled(320, '#bcd0a6', {
            hachureGap: 3,
            fillWeight: 0.6,
            strokeWidth: 1,
          })
        )}
      />
      <Ink
        d={gen.rectangle(
          74,
          82,
          54,
          12,
          filled(321, '#9fbfd9', {
            hachureGap: 3,
            fillWeight: 0.6,
            strokeWidth: 1,
          })
        )}
      />

      {/* the deep-work block — breathes/expands to fit the creative flow */}
      <motion.g
        animate={{ scaleX: [1, 1.06, 1], scaleY: [1, 1.05, 1] }}
        transition={loop(2.8)}
        style={{ transformOrigin: '102px 54px' }}
      >
        <ellipse cx='102' cy='70' rx='32' ry='4' fill={INK} opacity='0.08' />
        <Ink
          d={gen.rectangle(
            74,
            42,
            72,
            26,
            filled(330, '#e6a24a', {
              fillStyle: 'solid',
              strokeWidth: 1.3,
              roughness: 1,
            })
          )}
        />
        {/* a flowing dashed line — the work moving freely inside the block */}
        <motion.path
          d='M80 56 Q98 48 116 56 T140 54'
          fill='none'
          stroke='#fff6e2'
          strokeWidth='1.6'
          strokeDasharray='2 5'
          animate={{ strokeDashoffset: [0, -14] }}
          transition={linear(1.8)}
        />
      </motion.g>

      {/* a creative spark/nib floating over the flexible block */}
      <motion.g
        animate={{ y: [0, -3, 0], rotate: [0, 6, 0] }}
        transition={loop(2.4)}
        style={{ transformOrigin: '150px 50px' }}
      >
        <Ink
          d={gen.polygon(
            [
              [150, 42],
              [156, 50],
              [152, 50],
              [152, 58],
              [148, 58],
              [148, 50],
              [144, 50],
            ],
            filled(340, '#c2502e', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        <Ink
          d={gen.line(150, 58, 150, 62, stroke(341, { stroke: '#c2502e' }))}
        />
      </motion.g>
    </Frame>
  );
}

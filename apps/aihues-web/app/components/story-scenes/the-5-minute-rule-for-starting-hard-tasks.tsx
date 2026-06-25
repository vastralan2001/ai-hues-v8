'use client';
import {
  Frame,
  Ink,
  RoughDash,
  gen,
  filled,
  stroke,
  loop,
  motion,
} from './_kit';

/* The 5-Minute Rule: starting is the whole battle. A small hourglass holding
   only a few grains (five minutes) sits at the foot of a steep, looming slope —
   the "hard task". Once the first grains fall, a thin dashed trail of momentum
   climbs the daunting wall and crests it into open, warm light. The tiny act of
   beginning is what carries you over the threshold. Seed range: 300-399. */

export default function Scene() {
  const climb = 'M70 70 Q92 66 118 50 T180 22';
  return (
    <Frame sky={['#fbf3e6', '#efd9bd']}>
      <defs>
        <radialGradient id='fivemin_dawn' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff4dd' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff4dd' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='fivemin_sand' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#f0b449' />
          <stop offset='100%' stopColor='#cf9836' />
        </linearGradient>
      </defs>

      {/* open light over the crest the momentum is heading toward */}
      <circle cx='182' cy='20' r='40' fill='url(#fivemin_dawn)' />

      {/* the steep, looming slope — the hard task to begin */}
      <Ink
        d={gen.path(
          'M0 100 L0 88 Q40 80 96 96 L96 100 Z',
          filled(301, '#c8b79a', { hachureGap: 4, fillWeight: 0.6 })
        )}
      />
      <Ink
        d={gen.path(
          'M44 100 L44 70 Q108 28 200 14 L200 100 Z',
          filled(302, '#9aab7f', { hachureGap: 3.2 })
        )}
      />
      <Ink
        d={gen.path(
          'M44 70 Q108 28 200 14',
          stroke(303, { stroke: '#788c5d', strokeWidth: 1.3, roughness: 1 })
        )}
      />

      {/* momentum: once it starts, it flows up and over the wall into the light */}
      <RoughDash
        d={climb}
        c='#c2502e'
        w={1.6}
        dur={1.7}
        dash='2 6'
        seed={311}
      />

      {/* the focal subject: a small hourglass with only a few grains left up top */}
      <motion.g
        animate={{ y: [0, -1.6, 0] }}
        transition={loop(2.6)}
        style={{ transformOrigin: '64px 60px' }}
      >
        {/* frame: top and bottom caps */}
        <Ink d={gen.line(54, 44, 74, 44, stroke(304, { strokeWidth: 1.4 }))} />
        <Ink d={gen.line(54, 76, 74, 76, stroke(305, { strokeWidth: 1.4 }))} />
        {/* glass bulbs — two triangles meeting at a narrow waist */}
        <Ink
          d={gen.polygon(
            [
              [56, 45],
              [72, 45],
              [64, 60],
            ],
            filled(306, '#ffffff', {
              fillStyle: 'solid',
              strokeWidth: 1.1,
              roughness: 1,
            })
          )}
        />
        <Ink
          d={gen.polygon(
            [
              [64, 60],
              [72, 75],
              [56, 75],
            ],
            filled(307, '#ffffff', {
              fillStyle: 'solid',
              strokeWidth: 1.1,
              roughness: 1,
            })
          )}
        />
        {/* the few grains still up top — the five minutes you commit to */}
        <Ink
          d={gen.polygon(
            [
              [58.5, 49],
              [69.5, 49],
              [64, 57],
            ],
            filled(308, 'url(#fivemin_sand)', {
              fillStyle: 'solid',
              strokeWidth: 0,
            })
          )}
        />
        {/* the thin stream beginning to fall through the waist */}
        <motion.g animate={{ opacity: [0.5, 1, 0.5] }} transition={loop(1.1)}>
          <Ink
            d={gen.line(
              64,
              58,
              64,
              70,
              stroke(309, { stroke: '#cf9836', strokeWidth: 1 })
            )}
          />
        </motion.g>
        {/* the small mound already gathering below — momentum starting */}
        <Ink
          d={gen.path(
            'M58 74 Q64 69 70 74 Z',
            filled(310, 'url(#fivemin_sand)', {
              fillStyle: 'solid',
              strokeWidth: 0,
            })
          )}
        />
      </motion.g>

      {/* a single grain mid-fall, looping — the moment of beginning */}
      <motion.g
        animate={{ y: [0, 11], opacity: [0, 1, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'easeIn' }}
      >
        <Ink
          d={gen.circle(
            64,
            60,
            1.8,
            filled(312, '#cf9836', { fillStyle: 'solid', strokeWidth: 0.6 })
          )}
        />
      </motion.g>
    </Frame>
  );
}

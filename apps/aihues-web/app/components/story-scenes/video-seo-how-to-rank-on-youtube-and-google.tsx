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

/* Video SEO on YouTube + Google, with transcripts as the underrated lever.
   Metaphor: one small play-frame at center emits a transcript ribbon (dashed
   text-lines) that descends and forks into two rising signal paths, each
   crowned by a beacon — terracotta for YouTube, slate-blue for Google. The
   shared transcript is the root that lifts both ranks. */

export default function Scene() {
  const ribbon = 'M100 56 Q100 70 100 74';
  const leftPath = 'M100 74 Q78 78 58 60 T44 36';
  const rightPath = 'M100 74 Q122 78 142 60 T156 36';
  return (
    <Frame sky={['#fbf3e6', '#f1ddc4']}>
      <defs>
        <radialGradient id='vsy_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff5e0' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#fff5e0' stopOpacity='0' />
        </radialGradient>
        <radialGradient id='vsy_beaconL' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#f4c4ad' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#f4c4ad' stopOpacity='0' />
        </radialGradient>
        <radialGradient id='vsy_beaconR' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#bcd4ee' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#bcd4ee' stopOpacity='0' />
        </radialGradient>
      </defs>

      <circle cx='100' cy='40' r='40' fill='url(#vsy_glow)' />
      <Cloud x={42} y={24} s={0.8} o={0.4} />
      <Cloud x={162} y={30} s={0.7} o={0.35} />
      <Twinkle x={30} y={20} c='#cf9836' />
      <Twinkle x={176} y={22} d={0.7} c='#cf9836' />
      <Twinkle x={100} y={14} d={1.2} c='#e0a83f' r={1.2} />

      {/* distant horizon for depth */}
      <Ink
        d={gen.path(
          'M0 88 Q100 82 200 88 L200 100 L0 100 Z',
          filled(301, '#e7cfa6', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />

      {/* transcript ribbon: shared root descending from the frame */}
      <motion.path
        d={ribbon}
        fill='none'
        stroke='#cf9836'
        strokeWidth='1.6'
        strokeDasharray='3 4'
        animate={{ strokeDashoffset: [0, -14] }}
        transition={linear(1.5)}
      />

      {/* the two rising signal paths feeding off the transcript */}
      <motion.path
        d={leftPath}
        fill='none'
        stroke='#c2502e'
        strokeWidth='1.5'
        strokeDasharray='2 5'
        animate={{ strokeDashoffset: [0, -14] }}
        transition={linear(1.7)}
      />
      <motion.path
        d={rightPath}
        fill='none'
        stroke='#5a86c5'
        strokeWidth='1.5'
        strokeDasharray='2 5'
        animate={{ strokeDashoffset: [0, -14] }}
        transition={linear(1.9)}
      />

      {/* left beacon — YouTube (terracotta) */}
      <circle cx='44' cy='36' r='12' fill='url(#vsy_beaconL)' />
      <motion.g
        animate={{ scale: [0.9, 1.08, 0.9] }}
        transition={loop(2.4)}
        style={{ transformOrigin: '44px 36px' }}
      >
        <Ink
          d={gen.circle(
            44,
            36,
            11,
            filled(302, '#e2693f', { fillStyle: 'solid' })
          )}
        />
        <Ink
          d={gen.polygon(
            [
              [41, 32.5],
              [41, 39.5],
              [47.5, 36],
            ],
            filled(303, '#fbf3e6', { fillStyle: 'solid', strokeWidth: 0.9 })
          )}
        />
      </motion.g>

      {/* right beacon — Google (slate-blue) */}
      <circle cx='156' cy='36' r='12' fill='url(#vsy_beaconR)' />
      <motion.g
        animate={{ scale: [0.9, 1.08, 0.9] }}
        transition={loop(2.4, 0.6)}
        style={{ transformOrigin: '156px 36px' }}
      >
        <Ink
          d={gen.circle(
            156,
            36,
            11,
            filled(304, '#6a9bcc', { fillStyle: 'solid' })
          )}
        />
        {/* magnifying lens — search */}
        <Ink
          d={gen.circle(
            154,
            34,
            7,
            stroke(305, { stroke: '#fbf3e6', strokeWidth: 1.3, roughness: 0.9 })
          )}
        />
        <Ink
          d={gen.line(
            159,
            39,
            162.5,
            42.5,
            stroke(306, { stroke: '#fbf3e6', strokeWidth: 1.6 })
          )}
        />
      </motion.g>

      {/* focal subject: the play-frame emitting the transcript */}
      <motion.g
        animate={{ y: [0, -2.5, 0] }}
        transition={loop(2.8)}
        style={{ transformOrigin: '100px 48px' }}
      >
        <ellipse cx='100' cy='62' rx='17' ry='3.4' fill={INK} opacity='0.1' />
        <Ink
          d={gen.rectangle(
            82,
            38,
            36,
            22,
            filled(307, '#ffffff', {
              fillStyle: 'solid',
              strokeWidth: 1.2,
              roughness: 1,
            })
          )}
        />
        {/* clapper hinge strip */}
        <Ink
          d={gen.rectangle(
            82,
            38,
            36,
            5,
            filled(308, '#788c5d', { fillStyle: 'solid', strokeWidth: 0.9 })
          )}
        />
        <Ink
          d={gen.line(
            88,
            38,
            92,
            43,
            stroke(309, { stroke: '#fbf3e6', strokeWidth: 1 })
          )}
        />
        <Ink
          d={gen.line(
            98,
            38,
            102,
            43,
            stroke(310, { stroke: '#fbf3e6', strokeWidth: 1 })
          )}
        />
        <Ink
          d={gen.line(
            108,
            38,
            112,
            43,
            stroke(311, { stroke: '#fbf3e6', strokeWidth: 1 })
          )}
        />
        {/* play triangle */}
        <motion.g
          animate={{ scale: [1, 1.12, 1] }}
          transition={loop(2)}
          style={{ transformOrigin: '101px 51px' }}
        >
          <Ink
            d={gen.polygon(
              [
                [97, 47],
                [97, 55],
                [105, 51],
              ],
              filled(312, '#e0a83f', { fillStyle: 'solid' })
            )}
          />
        </motion.g>
      </motion.g>

      {/* transcript text-lines emerging below the frame */}
      <Ink
        d={gen.line(
          91,
          66,
          109,
          66,
          stroke(313, { stroke: '#cf9836', strokeWidth: 1.2 })
        )}
      />
      <Ink
        d={gen.line(
          94,
          69.5,
          106,
          69.5,
          stroke(314, { stroke: '#cf9836', strokeWidth: 1.1 })
        )}
      />
    </Frame>
  );
}

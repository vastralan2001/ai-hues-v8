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
  motion,
} from './_kit';

/* Local SEO for SaaS — the lone map-pin rooted to one spot, dwarfed by the vast
   global audience: a large soft globe with latitude arcs and far-flung nodes the
   product actually has to reach. One bright thread arcs worldwide while the small
   terracotta pin stays grounded and local. */

export default function Scene() {
  const G = 'lseo';
  // far-reaching arc from the local pin out to a distant node on the globe
  const reach = 'M58 78 Q108 30 158 40';

  return (
    <Frame sky={['#eef4fb', '#dbe7f3']}>
      <defs>
        <radialGradient id={`${G}_globe`} cx='50%' cy='42%' r='58%'>
          <stop offset='0%' stopColor='#bcd6ee' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#bcd6ee' stopOpacity='0' />
        </radialGradient>
        <radialGradient id={`${G}_halo`} cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff3df' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#fff3df' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* atmosphere */}
      <Twinkle x={30} y={20} c='#9cc3e2' />
      <Twinkle x={176} y={26} d={0.8} c='#9cc3e2' />
      <Twinkle x={150} y={16} d={1.3} c='#cf9836' />
      <Cloud x={44} y={24} s={0.8} o={0.4} />
      <Cloud x={158} y={66} s={0.7} o={0.35} />

      {/* the vast global audience — large soft globe, the real market */}
      <circle cx='124' cy='46' r='44' fill={`url(#${G}_globe)`} />
      <motion.g
        animate={{ rotate: [0, 4, 0] }}
        transition={loop(7)}
        style={{ transformOrigin: '124px 46px' }}
      >
        <Ink
          d={gen.circle(
            124,
            46,
            56,
            stroke(301, { stroke: '#5a86c5', strokeWidth: 1.2, roughness: 0.9 })
          )}
        />
        {/* latitudes */}
        <Ink
          d={gen.ellipse(
            124,
            32,
            50,
            12,
            stroke(302, {
              stroke: '#7aa3d2',
              strokeWidth: 1,
              roughness: 0.9,
              bowing: 0.6,
            })
          )}
        />
        <Ink
          d={gen.ellipse(
            124,
            46,
            56,
            18,
            stroke(303, {
              stroke: '#7aa3d2',
              strokeWidth: 1,
              roughness: 0.9,
              bowing: 0.6,
            })
          )}
        />
        <Ink
          d={gen.ellipse(
            124,
            60,
            50,
            12,
            stroke(304, {
              stroke: '#7aa3d2',
              strokeWidth: 1,
              roughness: 0.9,
              bowing: 0.6,
            })
          )}
        />
        {/* a meridian */}
        <Ink
          d={gen.ellipse(
            124,
            46,
            22,
            56,
            stroke(305, {
              stroke: '#7aa3d2',
              strokeWidth: 1,
              roughness: 0.9,
              bowing: 0.6,
            })
          )}
        />
      </motion.g>

      {/* far-flung audience nodes scattered across the globe */}
      {[
        [100, 34, 0],
        [148, 38, 0.6],
        [136, 62, 1.1],
        [108, 60, 0.4],
        [128, 46, 0.9],
      ].map(([nx, ny, d]) => (
        <Twinkle key={nx} x={nx} y={ny} d={d} r={1.3} c='#5a86c5' />
      ))}
      <Ink
        d={gen.circle(
          148,
          38,
          4,
          filled(306, '#6a9bcc', { fillStyle: 'solid' })
        )}
      />
      <Ink
        d={gen.circle(
          108,
          60,
          3.4,
          filled(307, '#94ac78', { fillStyle: 'solid' })
        )}
      />

      {/* the worldwide thread — what the product actually has to reach */}
      <motion.path
        d={reach}
        fill='none'
        stroke='#e0a83f'
        strokeWidth='1.6'
        strokeDasharray='2 6'
        animate={{ strokeDashoffset: [0, -16] }}
        transition={linear(1.8)}
      />

      {/* the lone local map-pin — small, rooted, grounded to one spot */}
      <circle cx='58' cy='66' r='18' fill={`url(#${G}_halo)`} />
      {/* its small patch of local ground */}
      <Ink
        d={gen.ellipse(
          58,
          84,
          30,
          6,
          filled(308, '#cdbf9a', { roughness: 1.5, hachureGap: 3.4 })
        )}
      />
      <motion.g
        animate={{ y: [0, -2.4, 0] }}
        transition={loop(2.4)}
        style={{ transformOrigin: '58px 70px' }}
      >
        <Ink
          d={gen.path(
            'M58 52 C66 52 70 60 64 70 L58 80 L52 70 C46 60 50 52 58 52 Z',
            filled(309, '#c2502e', { fillStyle: 'solid', strokeWidth: 1.3 })
          )}
        />
        <Ink
          d={gen.circle(
            58,
            62,
            6,
            filled(310, '#f6e7c4', { fillStyle: 'solid' })
          )}
        />
      </motion.g>
    </Frame>
  );
}

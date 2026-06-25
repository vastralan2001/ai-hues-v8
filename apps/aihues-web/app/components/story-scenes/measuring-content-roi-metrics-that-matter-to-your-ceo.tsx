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

/* Measuring Content ROI — a refinery that transmutes raw metrics into value the
   CEO cares about. A scattered ledger of small data bars (traffic, rankings,
   impressions) feeds up a tapering distillation column and condenses, at the
   apex, into a single gleaming gold coin — vanity numbers refined into proven
   business worth. Warm boardroom-dawn sky, one small focal subject, breathing
   room. Seeds for this file live in the 300 block; gradient ids are roi_*. */

export default function Scene() {
  // raw metric bars at the base — uneven, "noisy" measurement
  const bars: Array<[number, number]> = [
    [54, 18],
    [62, 11],
    [70, 24],
    [78, 14],
    [86, 20],
  ];
  return (
    <Frame sky={['#fdf3e2', '#f4dcb6']}>
      <defs>
        <radialGradient id='roi_halo' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff2cf' stopOpacity='1' />
          <stop offset='100%' stopColor='#fff2cf' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='roi_vessel' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#fbeccb' />
          <stop offset='100%' stopColor='#ecd2a2' />
        </linearGradient>
      </defs>

      {/* distant depth: a soft horizon ground line + sky accents */}
      <Cloud x={44} y={24} s={0.8} o={0.4} />
      <Cloud x={158} y={32} s={0.7} o={0.35} />
      <Twinkle x={30} y={20} c='#cf9836' />
      <Twinkle x={176} y={22} d={0.8} c='#e0a83f' />
      <Twinkle x={150} y={14} d={1.3} c='#cf9836' />

      <Ink
        d={gen.path(
          'M0 84 Q100 78 200 84 L200 100 L0 100 Z',
          filled(301, '#e8cf9c', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />

      {/* base ledger: raw metric bars feeding the refinery */}
      {bars.map(([bx, h], i) => (
        <motion.g
          key={bx}
          animate={{ scaleY: [1, 1.12, 1] }}
          transition={loop(2.2, i * 0.25)}
          style={{ transformOrigin: `${bx}px 84px` }}
        >
          <Ink
            d={gen.rectangle(
              bx - 3,
              84 - h,
              6,
              h,
              filled(302 + i, '#94ac78', {
                fillStyle: 'solid',
                strokeWidth: 1,
                roughness: 1,
              })
            )}
          />
        </motion.g>
      ))}

      {/* the distillation column: a tapering vessel rising from the bars */}
      <Ink
        d={gen.polygon(
          [
            [50, 84],
            [90, 84],
            [78, 50],
            [62, 50],
          ],
          filled(311, 'url(#roi_vessel)', {
            fillStyle: 'solid',
            strokeWidth: 1.2,
            roughness: 1,
          })
        )}
      />
      {/* a narrow neck where metrics condense into worth */}
      <Ink
        d={gen.polygon(
          [
            [62, 50],
            [78, 50],
            [75, 40],
            [65, 40],
          ],
          filled(312, '#e2c98f', { fillStyle: 'solid', strokeWidth: 1.1 })
        )}
      />
      {/* banded gauge marks on the vessel — measurement made legible */}
      <Ink
        d={gen.line(
          57,
          74,
          83,
          74,
          stroke(313, { stroke: '#cf9836', strokeWidth: 1 })
        )}
      />
      <Ink
        d={gen.line(
          60,
          64,
          80,
          64,
          stroke(314, { stroke: '#cf9836', strokeWidth: 1 })
        )}
      />

      {/* rising distillate: dashed stream condensing up the neck */}
      <motion.path
        d='M70 84 L70 38'
        fill='none'
        stroke='#e0a83f'
        strokeWidth='1.6'
        strokeDasharray='2 6'
        animate={{ strokeDashoffset: [0, -16] }}
        transition={linear(1.5)}
      />

      {/* halo behind the refined product */}
      <circle cx='70' cy='28' r='20' fill='url(#roi_halo)' />

      {/* the focal subject: one gleaming gold coin — value the CEO recognizes */}
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={loop(2.6)}
        style={{ transformOrigin: '70px 28px' }}
      >
        <ellipse cx='70' cy='40' rx='12' ry='3' fill={INK} opacity='0.1' />
        <motion.g
          animate={{ scaleX: [1, 0.9, 1] }}
          transition={loop(3.2)}
          style={{ transformOrigin: '70px 28px' }}
        >
          <Ink
            d={gen.circle(
              70,
              28,
              18,
              filled(321, '#f0b449', { fillStyle: 'solid', strokeWidth: 1.3 })
            )}
          />
          <Ink
            d={gen.circle(
              70,
              28,
              12,
              stroke(322, { stroke: '#cf9836', strokeWidth: 1 })
            )}
          />
          <Ink
            d={gen.path(
              'M70 21 L70 35 M66 24 Q73 24.5 73 27 Q73 29.5 66 30 Q73 30.5 73 33',
              stroke(323, {
                stroke: '#b9802b',
                strokeWidth: 1.3,
                roughness: 0.9,
              })
            )}
          />
        </motion.g>
      </motion.g>

      {/* upward sparks of realized worth */}
      {[
        [54, 16, 0],
        [88, 18, 0.6],
        [70, 8, 1.1],
      ].map(([sx, sy, d]) => (
        <Twinkle key={sx} x={sx} y={sy} d={d} c='#e0a83f' r={1.2} />
      ))}
    </Frame>
  );
}

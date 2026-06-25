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

/* Metaphor — a lean marketing "tool dock": one small shelf holding exactly 5
   essential instruments, with 3 dashed signal trails arcing out to 3 distant
   beacons (the channels). Minimum viable = uncluttered, only what earns its
   place. Warm dawn-gold sky for early traction. Seeds: 300-series. */

export default function Scene() {
  const ch1 = 'M118 58 Q150 50 178 32';
  const ch2 = 'M118 62 Q156 64 188 56';
  const ch3 = 'M118 66 Q146 82 176 84';
  return (
    <Frame sky={['#fcf3e2', '#f5dcba']}>
      <defs>
        <radialGradient id='mvms_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff4dd' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#fff4dd' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* atmosphere */}
      <circle cx='150' cy='34' r='40' fill='url(#mvms_glow)' />
      <Cloud x={42} y={24} s={0.8} o={0.4} />
      <Cloud x={158} y={72} s={0.6} o={0.32} />
      <Twinkle x={30} y={20} c='#cf9836' />
      <Twinkle x={96} y={16} d={0.7} c='#e0a83f' />
      <Twinkle x={184} y={22} d={1.2} c='#cf9836' />

      {/* far ground band for depth */}
      <Ink
        d={gen.path(
          'M0 92 Q100 86 200 92 L200 100 L0 100 Z',
          filled(301, '#eccfa1', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />

      {/* 3 channel trails radiating out to distant beacons */}
      <motion.path
        d={ch1}
        fill='none'
        stroke='#c2502e'
        strokeWidth='1.4'
        strokeDasharray='2 6'
        animate={{ strokeDashoffset: [0, -16] }}
        transition={linear(1.5)}
      />
      <motion.path
        d={ch2}
        fill='none'
        stroke='#cf9836'
        strokeWidth='1.4'
        strokeDasharray='2 6'
        animate={{ strokeDashoffset: [0, -16] }}
        transition={linear(1.8)}
      />
      <motion.path
        d={ch3}
        fill='none'
        stroke='#788c5d'
        strokeWidth='1.4'
        strokeDasharray='2 6'
        animate={{ strokeDashoffset: [0, -16] }}
        transition={linear(1.65)}
      />
      {/* beacons at the trail ends */}
      {[
        [178, 32, '#c2502e', 0],
        [188, 56, '#cf9836', 0.5],
        [176, 84, '#788c5d', 1],
      ].map(([bx, by, bc, bd]) => (
        <motion.g
          key={bx as number}
          animate={{ scale: [0.85, 1.12, 0.85] }}
          transition={loop(2.2, bd as number)}
          style={{ transformOrigin: `${bx}px ${by}px` }}
        >
          <Ink
            d={gen.circle(
              bx as number,
              by as number,
              5,
              filled(310 + (bx as number), bc as string, { fillStyle: 'solid' })
            )}
          />
        </motion.g>
      ))}

      {/* the tool dock — one small shelf, gently breathing */}
      <motion.g
        animate={{ y: [0, -1.6, 0] }}
        transition={loop(2.8)}
        style={{ transformOrigin: '70px 60px' }}
      >
        <ellipse cx='70' cy='74' rx='34' ry='3.4' fill={INK} opacity='0.09' />

        {/* shelf board */}
        <Ink
          d={gen.rectangle(
            38,
            60,
            64,
            8,
            filled(320, '#cf9836', {
              fillStyle: 'solid',
              strokeWidth: 1.2,
              roughness: 1,
            })
          )}
        />
        {/* two small brackets */}
        <Ink d={gen.line(46, 68, 46, 73, stroke(321, { strokeWidth: 1.2 }))} />
        <Ink d={gen.line(94, 68, 94, 73, stroke(322, { strokeWidth: 1.2 }))} />

        {/* exactly 5 essential tools standing on the shelf */}
        {/* 1 — terracotta jar (analytics) */}
        <Ink
          d={gen.rectangle(
            44,
            50,
            8,
            10,
            filled(330, '#c2502e', { fillStyle: 'solid', strokeWidth: 1.1 })
          )}
        />
        <Ink
          d={gen.line(
            45,
            53,
            51,
            53,
            stroke(331, { stroke: '#fbe6cf', strokeWidth: 1 })
          )}
        />

        {/* 2 — sage flag pin (email) */}
        <Ink d={gen.line(60, 60, 60, 46, stroke(332, { strokeWidth: 1.2 }))} />
        <Ink
          d={gen.polygon(
            [
              [60, 46],
              [68, 48],
              [60, 51],
            ],
            filled(333, '#788c5d', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />

        {/* 3 — gold gauge dial (landing/SEO) */}
        <Ink
          d={gen.circle(
            74,
            53,
            9,
            filled(334, '#e0a83f', { fillStyle: 'solid', strokeWidth: 1.1 })
          )}
        />
        <Ink
          d={gen.line(
            74,
            53,
            77,
            49,
            stroke(335, { stroke: INK, strokeWidth: 1.2 })
          )}
        />

        {/* 4 — slate-blue card/post (social) */}
        <Ink
          d={gen.rectangle(
            82,
            49,
            10,
            11,
            filled(336, '#6a9bcc', { fillStyle: 'solid', strokeWidth: 1.1 })
          )}
        />
        <Ink
          d={gen.line(
            84,
            53,
            90,
            53,
            stroke(337, { stroke: '#eaf2fb', strokeWidth: 0.9 })
          )}
        />
        <Ink
          d={gen.line(
            84,
            56,
            88,
            56,
            stroke(338, { stroke: '#eaf2fb', strokeWidth: 0.9 })
          )}
        />

        {/* 5 — small terracotta megaphone (outreach) */}
        <Ink
          d={gen.polygon(
            [
              [94, 52],
              [101, 49],
              [101, 59],
              [94, 56],
            ],
            filled(339, '#e2693f', { fillStyle: 'solid', strokeWidth: 1.1 })
          )}
        />
      </motion.g>
    </Frame>
  );
}

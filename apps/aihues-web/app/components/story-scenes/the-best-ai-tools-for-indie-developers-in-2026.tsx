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

/* Metaphor: from a crowded, noisy field of AI tools (faint icons drifting in the
   distance), a few genuinely useful ones are picked and hung on a small lit
   tool-rack — a curated indie-dev kit. Three distinct hand tools (wrench,
   screwdriver, brush) gathered on one warm-lit hanging bar over a workbench. */

export default function Scene() {
  return (
    <Frame sky={['#fbf3e6', '#f0dcc0']}>
      <defs>
        <radialGradient id='aitools26_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff3d6' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff3d6' stopOpacity='0' />
        </radialGradient>
      </defs>

      <Cloud x={42} y={22} s={0.8} o={0.4} />
      <Cloud x={158} y={30} s={0.65} o={0.32} />

      {/* the noise: many faint, drifting tool-sparks in the distance */}
      {[
        [30, 30, 0],
        [54, 18, 0.6],
        [172, 22, 1.1],
        [186, 44, 0.4],
        [20, 50, 1.4],
        [148, 16, 0.9],
      ].map(([fx, fy, d]) => (
        <motion.g
          key={fx}
          animate={{ y: [0, -2, 0], opacity: [0.18, 0.34, 0.18] }}
          transition={loop(3.4, d)}
          style={{ transformOrigin: `${fx}px ${fy}px` }}
        >
          <Ink
            d={gen.circle(
              fx,
              fy,
              4.4,
              stroke(301 + fx, {
                stroke: '#b89a6a',
                strokeWidth: 0.8,
                roughness: 1.5,
              })
            )}
          />
        </motion.g>
      ))}

      {/* warm light pooling on the chosen rack */}
      <circle cx='100' cy='52' r='40' fill='url(#aitools26_glow)' />

      {/* workbench horizon — a soft sage shelf below */}
      <Ink
        d={gen.path(
          'M0 84 Q100 79 200 84 L200 100 L0 100 Z',
          filled(311, '#b6c39a', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />
      <Ink
        d={gen.line(
          0,
          84,
          200,
          84,
          stroke(312, { stroke: '#8b9c6e', strokeWidth: 1 })
        )}
      />

      {/* the curated rack: a hanging bar, gently swaying */}
      <motion.g
        animate={{ rotate: [-1.4, 1.4, -1.4] }}
        transition={loop(3.2)}
        style={{ transformOrigin: '100px 36px' }}
      >
        {/* suspension cords */}
        <Ink
          d={gen.line(
            76,
            22,
            76,
            38,
            stroke(321, { stroke: '#9b8252', strokeWidth: 0.9 })
          )}
        />
        <Ink
          d={gen.line(
            124,
            22,
            124,
            38,
            stroke(322, { stroke: '#9b8252', strokeWidth: 0.9 })
          )}
        />

        {/* the bar */}
        <Ink
          d={gen.rectangle(
            70,
            38,
            60,
            4,
            filled(323, '#cf9836', {
              fillStyle: 'solid',
              strokeWidth: 1.2,
              roughness: 0.9,
            })
          )}
        />

        {/* tool 1 — wrench (terracotta) */}
        <g transform='translate(82 42)'>
          <Ink
            d={gen.path(
              'M0 0 L0 18 Q0 22 3 22 Q6 22 6 18 L6 0 Z',
              filled(331, '#e2693f', { fillStyle: 'solid', strokeWidth: 1.1 })
            )}
          />
          <Ink
            d={gen.path(
              'M-2 -1 Q-3 -6 1 -7 Q5 -8 6 -3 Q4 -3 3 -4 Q1 -3 1 -1 Z',
              filled(332, '#e2693f', { fillStyle: 'solid', strokeWidth: 1.1 })
            )}
          />
        </g>

        {/* tool 2 — screwdriver (slate-blue) */}
        <g transform='translate(99 42)'>
          <Ink
            d={gen.rectangle(
              -2,
              0,
              5,
              11,
              filled(333, '#6a9bcc', { fillStyle: 'solid', strokeWidth: 1.1 })
            )}
          />
          <Ink
            d={gen.path(
              'M-0.5 11 L3.5 11 L2 24 L1 24 Z',
              filled(334, '#cfd9e6', { fillStyle: 'solid', strokeWidth: 1 })
            )}
          />
        </g>

        {/* tool 3 — brush (sage handle, gold bristles) */}
        <g transform='translate(116 42)'>
          <Ink
            d={gen.rectangle(
              -1.5,
              0,
              5,
              13,
              filled(335, '#788c5d', { fillStyle: 'solid', strokeWidth: 1.1 })
            )}
          />
          <Ink
            d={gen.path(
              'M-2.5 13 L4.5 13 L3.5 23 L-1.5 23 Z',
              filled(336, '#e0a83f', { hachureGap: 2, fillWeight: 0.8 })
            )}
          />
        </g>
      </motion.g>

      {/* selection sparks gathering toward the rack */}
      <Twinkle x={88} y={30} c='#e0a83f' r={1.2} />
      <Twinkle x={112} y={28} d={0.7} c='#cf9836' r={1.1} />
      <Twinkle x={100} y={20} d={1.3} c='#e0a83f' r={1} />
    </Frame>
  );
}

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

/* AI Coding Assistants: Copilot vs Cody vs Codeium — three styluses of different
   colors hover over one drafting sheet, each trailing a dashed code-line that
   converges toward a single shared mark: three tools, one craft, honestly
   measured against each other. */

const PEN = [
  { x: 56, color: '#c2502e', tip: 64, ph: 0, seed: 320, dash: 1.6 },
  { x: 100, color: '#e0a83f', tip: 62, ph: 0.7, seed: 330, dash: 1.9 },
  { x: 144, color: '#5a86c5', tip: 64, ph: 1.4, seed: 340, dash: 1.55 },
];

const FOCUS_X = 100;
const FOCUS_Y = 82;

export default function Scene() {
  return (
    <Frame sky={['#f3f6fb', '#e2e8f1']}>
      <defs>
        <radialGradient id='cca_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff4dc' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#fff4dc' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='cca_sheet' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#fdfbf4' />
          <stop offset='100%' stopColor='#eee6d4' />
        </linearGradient>
      </defs>

      <Twinkle x={30} y={20} c='#cf9836' />
      <Twinkle x={176} y={24} d={0.8} c='#6a9bcc' />
      <Twinkle x={88} y={14} d={1.3} c='#94ac78' />
      <Cloud x={46} y={26} s={0.78} o={0.4} />
      <Cloud x={158} y={32} s={0.66} o={0.32} />

      {/* the drafting sheet — the one shared task all three tools work on */}
      <circle cx={FOCUS_X} cy={FOCUS_Y} r={30} fill='url(#cca_glow)' />
      <g transform='rotate(-3 100 84)'>
        <rect
          x='40'
          y='72'
          width='120'
          height='26'
          fill='url(#cca_sheet)'
          opacity='0.96'
        />
        <Ink
          d={gen.rectangle(
            40,
            72,
            120,
            26,
            stroke(300, { stroke: INK, strokeWidth: 1.1, roughness: 1.1 })
          )}
        />
        <Ink
          d={gen.line(
            48,
            80,
            132,
            80,
            stroke(301, { stroke: '#c9bfa6', strokeWidth: 0.8 })
          )}
        />
        <Ink
          d={gen.line(
            48,
            86,
            116,
            86,
            stroke(302, { stroke: '#c9bfa6', strokeWidth: 0.8 })
          )}
        />
        <Ink
          d={gen.line(
            48,
            92,
            104,
            92,
            stroke(303, { stroke: '#c9bfa6', strokeWidth: 0.8 })
          )}
        />
      </g>

      {/* three code-lines, each in its tool's color, converging on one mark */}
      {PEN.map((p) => (
        <motion.path
          key={`trail-${p.seed}`}
          d={`M${p.x} ${p.tip + 4} Q${(p.x + FOCUS_X) / 2} ${
            (p.tip + FOCUS_Y) / 2 + 4
          } ${FOCUS_X} ${FOCUS_Y}`}
          fill='none'
          stroke={p.color}
          strokeWidth='1.5'
          strokeDasharray='2 4'
          opacity='0.85'
          animate={{ strokeDashoffset: [0, -18] }}
          transition={linear(p.dash)}
        />
      ))}

      {/* the shared focal mark where all three meet */}
      <motion.g
        animate={{ scale: [0.8, 1.15, 0.8], opacity: [0.7, 1, 0.7] }}
        transition={loop(2.2)}
        style={{ transformOrigin: `${FOCUS_X}px ${FOCUS_Y}px` }}
      >
        <Ink
          d={gen.polygon(
            [
              [FOCUS_X, FOCUS_Y - 5],
              [FOCUS_X + 1.6, FOCUS_Y - 1.6],
              [FOCUS_X + 5, FOCUS_Y - 1.6],
              [FOCUS_X + 2.2, FOCUS_Y + 0.8],
              [FOCUS_X + 3.2, FOCUS_Y + 4.2],
              [FOCUS_X, FOCUS_Y + 2.2],
              [FOCUS_X - 3.2, FOCUS_Y + 4.2],
              [FOCUS_X - 2.2, FOCUS_Y + 0.8],
              [FOCUS_X - 5, FOCUS_Y - 1.6],
              [FOCUS_X - 1.6, FOCUS_Y - 1.6],
            ],
            filled(310, '#f0b449', { fillStyle: 'solid' })
          )}
        />
      </motion.g>

      {/* three hovering styluses, each bobbing on its own phase */}
      {PEN.map((p) => (
        <motion.g
          key={`pen-${p.seed}`}
          animate={{ y: [0, -3.4, 0] }}
          transition={loop(2.8, p.ph)}
          style={{ transformOrigin: `${p.x}px ${p.tip}px` }}
        >
          <ellipse
            cx={p.x}
            cy={p.tip + 9}
            rx='5'
            ry='1.6'
            fill={INK}
            opacity='0.1'
          />
          <g transform={`rotate(18 ${p.x} ${p.tip})`}>
            {/* barrel */}
            <Ink
              d={gen.path(
                `M${p.x - 3.4} ${p.tip - 26} L${p.x + 3.4} ${p.tip - 26} L${
                  p.x + 2.6
                } ${p.tip - 6} L${p.x - 2.6} ${p.tip - 6} Z`,
                filled(p.seed, p.color, {
                  fillStyle: 'solid',
                  strokeWidth: 1.2,
                })
              )}
            />
            {/* nib */}
            <Ink
              d={gen.polygon(
                [
                  [p.x - 2.6, p.tip - 6],
                  [p.x + 2.6, p.tip - 6],
                  [p.x, p.tip + 1],
                ],
                filled(p.seed + 1, '#fbf6ea', {
                  fillStyle: 'solid',
                  strokeWidth: 1.1,
                })
              )}
            />
            <Ink
              d={gen.line(
                p.x,
                p.tip - 6,
                p.x,
                p.tip + 1,
                stroke(p.seed + 2, { stroke: INK, strokeWidth: 0.8 })
              )}
            />
            {/* cap band */}
            <Ink
              d={gen.line(
                p.x - 3.2,
                p.tip - 22,
                p.x + 3.2,
                p.tip - 22,
                stroke(p.seed + 3, { stroke: INK, strokeWidth: 1 })
              )}
            />
          </g>
          {/* ink spark at the nib */}
          <Twinkle x={p.x + 2} y={p.tip + 3} d={p.ph} r={0.9} c={p.color} />
        </motion.g>
      ))}
    </Frame>
  );
}

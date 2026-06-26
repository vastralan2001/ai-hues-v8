'use client';
import {
  Frame,
  Ink,
  Twinkle,
  RoughDash,
  gen,
  filled,
  stroke,
  loop,
  INK,
  motion,
} from './_kit';

/* Attention Residuals — a stack of transformer layers (bottom to top). The top,
   "current" layer doesn't just add the running sum: it attends back over depth,
   reaching past the nearer layers to pull in the one earlier representation it
   actually wants. The chosen arc is thick and alive; the others are faint. A
   little softmax bar-chart on the right stands for the learned, input-dependent
   weights. */

const LAYERS = [
  { y: 84, c: '#cdd9e6', seed: 20 },
  { y: 71, c: '#bcd0e3', seed: 22 },
  { y: 58, c: '#9ec0de', seed: 24 }, // the chosen one
  { y: 45, c: '#bcd0e3', seed: 26 },
  { y: 32, c: '#6a9bcc', seed: 28 }, // current / top layer
];

const LX = 52;
const LW = 58;
const LH = 9;
const TOP_Y = 36; // mid of the current layer, where arcs leave from
const CHOSEN_Y = 62; // mid of the chosen layer (y:58 + ~4)

export default function Scene() {
  return (
    <Frame sky={['#eef3fb', '#dbe6f3']}>
      <defs>
        <radialGradient id='ar_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff6df' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#fff6df' stopOpacity='0' />
        </radialGradient>
      </defs>

      <Twinkle x={172} y={22} c='#8fb2dd' />

      {/* the layer stack */}
      {LAYERS.map((l, i) => (
        <g key={l.seed}>
          <Ink
            d={gen.rectangle(
              LX,
              l.y,
              LW,
              LH,
              filled(l.seed, l.c, {
                fillStyle: 'solid',
                strokeWidth: i === 4 ? 1.3 : 1,
                roughness: 1.1,
              })
            )}
          />
          {/* a couple of "token" ticks on each layer */}
          <Ink
            d={gen.line(
              LX + 7,
              l.y + LH / 2,
              LX + LW - 7,
              l.y + LH / 2,
              stroke(l.seed + 1, {
                stroke: i === 4 ? '#eaf3ff' : '#7d93a8',
                strokeWidth: 0.8,
                roughness: 1,
              })
            )}
          />
        </g>
      ))}

      {/* the faint, un-chosen attention arcs reaching back over depth */}
      <RoughDash
        d={`M${LX} ${TOP_Y} Q18 ${(TOP_Y + 49) / 2} ${LX} 49`}
        c='#9bb0c6'
        w={0.9}
        dur={2.6}
        dash='2 6'
        seed={40}
        o={0.4}
      />
      <RoughDash
        d={`M${LX} ${TOP_Y} Q12 ${(TOP_Y + 75) / 2} ${LX} 75`}
        c='#9bb0c6'
        w={0.9}
        dur={3}
        dash='2 6'
        seed={42}
        o={0.32}
      />

      {/* the chosen arc — thick, warm, alive */}
      <RoughDash
        d={`M${LX} ${TOP_Y} Q14 ${(TOP_Y + CHOSEN_Y) / 2} ${LX} ${CHOSEN_Y}`}
        c='#e0a83f'
        w={1.8}
        dur={1.8}
        dash='3 5'
        seed={44}
        o={0.95}
      />

      {/* glow + pulsing node where the chosen arc lands */}
      <circle cx={LX} cy={CHOSEN_Y} r={12} fill='url(#ar_glow)' />
      <motion.g
        animate={{ scale: [0.82, 1.15, 0.82], opacity: [0.75, 1, 0.75] }}
        transition={loop(2)}
        style={{ transformOrigin: `${LX}px ${CHOSEN_Y}px` }}
      >
        <Ink
          d={gen.circle(
            LX,
            CHOSEN_Y,
            6,
            filled(46, '#f0b449', { fillStyle: 'solid', strokeWidth: 1.1 })
          )}
        />
      </motion.g>

      {/* softmax weights — the layer choosing, input-dependent, sums to one */}
      {[
        { x: 150, h: 7, c: '#b8cadd', sd: 60 },
        { x: 159, h: 20, c: '#e0a83f', sd: 62 }, // the peak weight = chosen
        { x: 168, h: 11, c: '#b8cadd', sd: 64 },
        { x: 177, h: 5, c: '#b8cadd', sd: 66 },
      ].map((b) => (
        <motion.g
          key={b.sd}
          animate={{ scaleY: [0.9, 1, 0.9] }}
          transition={loop(2.2, b.x * 0.01)}
          style={{ transformOrigin: `${b.x}px 64px` }}
        >
          <Ink
            d={gen.rectangle(
              b.x,
              64 - b.h,
              5,
              b.h,
              filled(b.sd, b.c, { fillStyle: 'solid', strokeWidth: 0.9 })
            )}
          />
        </motion.g>
      ))}
      <Ink
        d={gen.line(
          147,
          65,
          184,
          65,
          stroke(68, { stroke: INK, strokeWidth: 1, roughness: 1.1 })
        )}
      />
    </Frame>
  );
}

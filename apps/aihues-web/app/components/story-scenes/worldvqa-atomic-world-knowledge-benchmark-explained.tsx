'use client';

import {
  Frame,
  Ink,
  Twinkle,
  RoughIcon,
  RoughDash,
  gen,
  filled,
  stroke,
  loop,
  INK,
  motion,
} from './_kit';
import { __iconNode as searchNode } from 'lucide-react/dist/esm/icons/search.mjs';

/* WorldVQA: Measuring Atomic World Knowledge in MLLMs — metaphor: a hand lens
   passing over a line of specimen cards that march from foreground into the
   haze. The nearest card is sharp and named (the "Head" — common knowledge the
   model recognizes); each card behind it is fainter and more uncertain (the
   "Tail" — long-tail entities that dissolve into a guess). The lens is the
   benchmark: it stops on one atomic entity and asks, do you actually know this? */

const ID = 'wvqa';

// receding "specimen cards": [x, y, w, h, fill, opacity, seed]
const cards: Array<[number, number, number, number, string, number, number]> = [
  [70, 62, 30, 22, '#e2693f', 1.0, 40], // head — sharp, named, under the lens
  [108, 57, 24, 18, '#e0a83f', 0.66, 43],
  [138, 53, 18, 14, '#788c5d', 0.42, 46],
  [161, 50, 13, 10, '#6a9bcc', 0.26, 49],
  [178, 48, 9, 7, '#9a8a72', 0.16, 52], // tail — barely legible, fading out
];

export default function Scene() {
  return (
    <Frame sky={['#fdf4e8', '#efd9bd']}>
      <defs>
        <radialGradient id={`${ID}_lens`} cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fffbef' stopOpacity='0.95' />
          <stop offset='70%' stopColor='#fff2d6' stopOpacity='0.35' />
          <stop offset='100%' stopColor='#fff2d6' stopOpacity='0' />
        </radialGradient>
        <linearGradient id={`${ID}_haze`} x1='0' y1='0' x2='1' y2='0'>
          <stop offset='0.42' stopColor='#f6e6cf' stopOpacity='0' />
          <stop offset='1' stopColor='#f6e6cf' stopOpacity='0.82' />
        </linearGradient>
      </defs>

      <Twinkle x={30} y={20} c='#cf9836' />

      {/* the long ground rail the specimens stand on, receding to the right */}
      <Ink
        d={gen.path(
          'M52 86 Q120 82 192 79',
          stroke(31, { strokeWidth: 1.2, stroke: '#c8a878', roughness: 1.4 })
        )}
      />

      {/* a faint trail threading the cards together — the chain of knowledge,
          common to rare, that the benchmark walks down */}
      <RoughDash
        d='M70 62 Q105 56 178 49'
        c='#cf9836'
        w={1.2}
        dur={2.2}
        dash='2 7'
        seed={34}
        o={0.5}
      />

      {/* specimen cards, head (sharp) to tail (dissolving) */}
      {cards.map(([cx, cy, w, h, fill, op, sd], i) => (
        <g key={i} opacity={op}>
          {/* little easel leg to the rail */}
          <Ink
            d={gen.line(
              cx,
              cy + h / 2,
              cx,
              86 - i * 1.4,
              stroke(sd + 4, { strokeWidth: 0.9, stroke: '#b9986e' })
            )}
          />
          <motion.g
            animate={i === 0 ? { y: [0, -1.4, 0] } : { y: [0, -0.6, 0] }}
            transition={loop(3 + i * 0.4, i * 0.3)}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          >
            <Ink
              d={gen.rectangle(
                cx - w / 2,
                cy - h / 2,
                w,
                h,
                filled(sd, fill, {
                  fillStyle: i === 0 ? 'solid' : 'hachure',
                  hachureGap: 2.4,
                  strokeWidth: i === 0 ? 1.2 : 1,
                  roughness: 1 + i * 0.25,
                })
              )}
            />
            {/* the "name" line on the card — bold on the head, a faint scribble
                on the tail, standing in for a confident vs. uncertain answer */}
            <Ink
              d={gen.line(
                cx - w / 2 + 3,
                cy + h / 2 - 3,
                cx + w / 2 - 3,
                cy + h / 2 - 3,
                stroke(sd + 2, {
                  strokeWidth: i === 0 ? 1.4 : 0.8,
                  stroke: '#fff6e6',
                  roughness: 1 + i * 0.6,
                })
              )}
            />
          </motion.g>
        </g>
      ))}

      {/* haze swallowing the long tail on the right — a horizontal wash over the
          full frame so it has no hard rectangular edge, only thickens rightward */}
      <rect x='0' y='0' width='200' height='100' fill={`url(#${ID}_haze)`} />

      {/* the benchmark lens — hovering over the head card, drifting slightly as
          if scanning for the next atomic entity to interrogate */}
      <motion.g
        animate={{ x: [0, 5, 0], y: [0, -2, 0] }}
        transition={loop(4)}
        style={{ transformOrigin: '70px 56px' }}
      >
        <circle cx='71' cy='55' r='20' fill={`url(#${ID}_lens)`} />
        <RoughIcon
          node={searchNode}
          x={71}
          y={55}
          size={40}
          c={INK}
          sw={1.4}
          seed={60}
        />
      </motion.g>
    </Frame>
  );
}

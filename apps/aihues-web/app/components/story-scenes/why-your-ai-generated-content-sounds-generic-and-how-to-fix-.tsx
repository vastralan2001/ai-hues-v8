'use client';

import {
  Frame,
  Ink,
  RoughDash,
  gen,
  filled,
  stroke,
  loop,
  INK,
  motion,
  Bolt,
} from './_kit';

/* "Why your AI content sounds generic (and how to fix it)" — a row of identical
   mass-produced vessels (all the same flat beige, stamped out the same), and a
   single brush dipping terracotta pigment onto the one pot at the front, giving
   it a voice of its own. The generic output is the assembly line; the fix is the
   one human stroke that makes it sound like you. */

export default function Scene() {
  const SHELF_Y = 70;
  // four identical generic pots, evenly spaced along the back shelf
  const generic = [44, 74, 104, 134];

  return (
    <Frame sky={['#f7f1e6', '#ecdcc4']}>
      <defs>
        <radialGradient id='gen5x_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff5e2' stopOpacity='0.85' />
          <stop offset='100%' stopColor='#fff5e2' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* soft warm light pooling over the one painted pot */}
      <circle cx='162' cy='60' r='40' fill='url(#gen5x_glow)' />

      {/* shelf the generic vessels stand on, receding into depth */}
      <Ink
        d={gen.rectangle(
          10,
          SHELF_Y,
          150,
          5,
          filled(500, '#e0c79f', {
            fillStyle: 'solid',
            strokeWidth: 1,
            roughness: 1.4,
          })
        )}
      />
      <Ink
        d={gen.line(10, SHELF_Y, 160, SHELF_Y, stroke(501, { strokeWidth: 1 }))}
      />

      {/* the assembly line of identical, flat, voiceless pots */}
      {generic.map((cx, i) => (
        <g key={cx}>
          <Ink
            d={gen.ellipse(
              cx,
              SHELF_Y + 1,
              18,
              4,
              filled(505 + i, INK, {
                fillStyle: 'solid',
                stroke: 'none',
                roughness: 1.4,
              })
            )}
          />
          <Ink
            d={gen.path(
              `M${cx - 7} ${SHELF_Y - 18}
               Q${cx - 9} ${SHELF_Y - 8} ${cx - 6} ${SHELF_Y}
               L${cx + 6} ${SHELF_Y}
               Q${cx + 9} ${SHELF_Y - 8} ${cx + 7} ${SHELF_Y - 18}
               Q${cx} ${SHELF_Y - 22} ${cx - 7} ${SHELF_Y - 18} Z`,
              filled(510 + i, '#d9c39e', {
                fillStyle: 'solid',
                strokeWidth: 1,
                roughness: 1.4,
              })
            )}
          />
          {/* identical neck band on every one — the tell of mass production */}
          <Ink
            d={gen.line(
              cx - 6.5,
              SHELF_Y - 16,
              cx + 6.5,
              SHELF_Y - 16,
              stroke(520 + i, { strokeWidth: 1, stroke: '#bfa97f' })
            )}
          />
        </g>
      ))}

      {/* the one pot brought forward, larger, in the light — being given a voice */}
      <Ink
        d={gen.ellipse(
          162,
          90,
          30,
          7,
          filled(529, INK, {
            fillStyle: 'solid',
            stroke: 'none',
            roughness: 1.4,
          })
        )}
      />
      <Ink
        d={gen.path(
          `M150 60
           Q146 75 152 88
           L172 88
           Q178 75 174 60
           Q162 55 150 60 Z`,
          filled(530, '#eef0e6', {
            fillStyle: 'solid',
            strokeWidth: 1.2,
            roughness: 1.1,
          })
        )}
      />

      {/* the fresh terracotta stroke that makes this pot sound like you */}
      <RoughDash
        d='M150 70 Q162 66 174 70'
        c='#c2502e'
        w={3.4}
        dur={3.6}
        dash='34 34'
        seed={531}
      />

      {/* the brush, dipping and sweeping across the focal pot */}
      <motion.g
        animate={{
          x: [-9, 9, 9, -9],
          y: [-2, 0, 0, -2],
          rotate: [-6, 4, 4, -6],
        }}
        transition={loop(3.6)}
        style={{ transformOrigin: '162px 48px' }}
      >
        {/* handle */}
        <Ink
          d={gen.line(168, 32, 158, 56, stroke(540, { strokeWidth: 2.4 }))}
        />
        {/* ferrule */}
        <Ink
          d={gen.line(
            156.5,
            58,
            159.5,
            54.5,
            stroke(541, { strokeWidth: 2.8, stroke: '#cf9836' })
          )}
        />
        {/* loaded bristle tip, terracotta */}
        <Ink
          d={gen.path(
            'M156 58 L153 64 Q155.5 63 158 64 L159.5 54.5 Z',
            filled(542, '#c2502e', { fillStyle: 'solid', strokeWidth: 0.9 })
          )}
        />
        {/* a fresh drop of pigment falling from the tip */}
        <motion.g
          animate={{ y: [0, 5, 5], opacity: [0.9, 0, 0] }}
          transition={loop(3.6)}
        >
          <Ink
            d={gen.circle(
              153.5,
              65,
              2.6,
              filled(543, '#c2502e', {
                fillStyle: 'solid',
                stroke: 'none',
              })
            )}
          />
        </motion.g>
      </motion.g>

      {/* a couple of bright accents over the one that found its voice */}
      <Bolt x={178} y={50} s={0.9} c='#e2693f' seed={991} />
    </Frame>
  );
}

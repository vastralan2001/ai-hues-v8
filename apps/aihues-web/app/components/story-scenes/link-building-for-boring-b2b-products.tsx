'use client';
import {
  Frame,
  Ink,
  Cloud,
  Star,
  gen,
  filled,
  stroke,
  loop,
  RoughDash,
  INK,
  motion,
} from './_kit';

/* "Link building for boring B2B products" → a plain, unglamorous steel hex-nut
   sits on a low plinth at center; one earned thread reaches out from it across a
   dusk sky to a distant glowing authority node. The dull object becomes a hub
   radiating connection — backlinks turning something unsexy into a node of value. */

const NUT = { x: 100, y: 64 };

// the distant authority "domain" the boring product earns its link to
const NODE = { x: 150, y: 24 };

export default function Scene() {
  return (
    <Frame sky={['#f6efe1', '#e8d6bd']}>
      <defs>
        <radialGradient id='lbbb_haze' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff4dd' stopOpacity='0.85' />
          <stop offset='100%' stopColor='#fff4dd' stopOpacity='0' />
        </radialGradient>
      </defs>

      <circle cx={NUT.x} cy={NUT.y} r='40' fill='url(#lbbb_haze)' />

      <Cloud x={48} y={20} s={0.7} o={0.4} />

      {/* far ground band for depth */}
      <Ink
        d={gen.path(
          'M0 86 Q100 80 200 86 L200 100 L0 100 Z',
          filled(301, '#d8c39e', {
            roughness: 1.6,
            hachureGap: 3.6,
            fillWeight: 0.6,
          })
        )}
      />

      {/* the single earned thread, hand-drawn, reaching the authority node */}
      <RoughDash
        d={`M${NUT.x} ${NUT.y - 4} Q${(NUT.x + NODE.x) / 2} ${(NUT.y + NODE.y) / 2 - 10} ${NODE.x} ${NODE.y}`}
        c='#cf9836'
        w={0.9}
        dur={1.7}
        seed={307}
        dash='1.5 5'
        o={0.6}
      />
      {/* the distant authority domain it earns a link to */}
      <Star x={NODE.x} y={NODE.y} r={4} c='#e0a83f' seed={308} />

      {/* the plinth the unglamorous product rests on */}
      <Ink
        d={gen.path(
          'M82 78 L118 78 L114 86 L86 86 Z',
          filled(302, '#b7a684', {
            fillStyle: 'solid',
            strokeWidth: 1.2,
            roughness: 1.1,
          })
        )}
      />
      <g opacity={0.12}>
        <Ink
          d={gen.ellipse(
            NUT.x,
            80,
            34,
            6,
            filled(309, INK, {
              fillStyle: 'solid',
              strokeWidth: 0,
              roughness: 1,
            })
          )}
        />
      </g>

      {/* the boring B2B product: a plain steel hex nut, slowly turning */}
      <motion.g
        animate={{ y: [0, -2, 0] }}
        transition={loop(3)}
        style={{ transformOrigin: '100px 64px' }}
      >
        <motion.g
          animate={{ rotate: [0, 4, 0, -4, 0] }}
          transition={loop(6)}
          style={{ transformOrigin: '100px 64px' }}
        >
          {/* hexagon body */}
          <Ink
            d={gen.polygon(
              [
                [100, 51],
                [111, 57.5],
                [111, 70.5],
                [100, 77],
                [89, 70.5],
                [89, 57.5],
              ],
              filled(303, '#9aa0a6', {
                fillStyle: 'solid',
                strokeWidth: 1.3,
                roughness: 1,
              })
            )}
          />
          {/* hachure shading on the boring metal */}
          <Ink
            d={gen.polygon(
              [
                [100, 51],
                [111, 57.5],
                [111, 70.5],
                [100, 77],
                [89, 70.5],
                [89, 57.5],
              ],
              filled(304, '#7f868d', {
                hachureGap: 2.4,
                fillWeight: 0.6,
                strokeWidth: 0,
              })
            )}
          />
          {/* threaded bore */}
          <Ink
            d={gen.circle(
              100,
              64,
              12,
              filled(305, '#e8d6bd', { fillStyle: 'solid', strokeWidth: 1.2 })
            )}
          />
          <Ink
            d={gen.circle(
              100,
              64,
              7,
              stroke(306, { strokeWidth: 0.9, roughness: 0.9 })
            )}
          />
        </motion.g>
      </motion.g>
    </Frame>
  );
}

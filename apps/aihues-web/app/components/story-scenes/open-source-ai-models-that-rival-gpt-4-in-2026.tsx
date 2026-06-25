'use client';

import {
  Frame,
  Ink,
  Twinkle,
  Cloud,
  RoughDash,
  gen,
  filled,
  stroke,
  loop,
  INK,
  motion,
} from './_kit';

/* Open Source AI Models That Rival GPT-4 — metaphor: a paywall padlock sprung
   open, its shackle swung free, releasing three small glowing model-lights
   (Llama 4 / Mistral / Qwen) that rise unbound into an open dawn sky. The lock
   that gated the paid APIs is open; the open-source rivals ascend freely. */

const ID = 'osm';
const lights: Array<[number, number, string, number]> = [
  [78, 40, '#e2693f', 0],
  [100, 30, '#e0a83f', 0.5],
  [122, 38, '#788c5d', 1],
];

export default function Scene() {
  return (
    <Frame sky={['#fdf3e6', '#f4ddc4']}>
      <defs>
        <radialGradient id={`${ID}_glow`} cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff4dc' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff4dc' stopOpacity='0' />
        </radialGradient>
        <radialGradient id={`${ID}_spark`} cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff8e8' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#fff8e8' stopOpacity='0' />
        </radialGradient>
      </defs>

      <circle cx='100' cy='44' r='52' fill={`url(#${ID}_glow)`} />

      <Twinkle x={36} y={22} c='#cf9836' />
      <Twinkle x={168} y={26} d={0.7} c='#e0a83f' />
      <Cloud x={46} y={30} s={0.8} o={0.4} />

      {/* open horizon — a low, free field, no walls */}
      <Ink
        d={gen.path(
          'M0 88 Q100 80 200 88 L200 100 L0 100 Z',
          filled(301, '#e7c89a', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />

      {/* three open-source model-lights rising free of the lock */}
      {lights.map(([lx, ly, c, ph], i) => (
        <g key={i}>
          <circle cx={lx} cy={ly} r='7' fill={`url(#${ID}_spark)`} />
          <motion.g
            animate={{ y: [0, -4, 0], opacity: [0.85, 1, 0.85] }}
            transition={loop(2.6, ph)}
            style={{ transformOrigin: `${lx}px ${ly}px` }}
          >
            <Ink
              d={gen.circle(
                lx,
                ly,
                7,
                filled(310 + i, c, { fillStyle: 'solid', strokeWidth: 1.2 })
              )}
            />
            <Ink
              d={gen.path(
                `M${lx} ${ly + 5} Q${lx - 1.5} ${ly + 11} ${lx} ${ly + 14} Q${lx + 1.5} ${ly + 11} ${lx} ${ly + 5} Z`,
                filled(320 + i, '#fff2d6', {
                  fillStyle: 'solid',
                  strokeWidth: 0.9,
                  roughness: 1,
                })
              )}
            />
          </motion.g>
        </g>
      ))}

      {/* rising trail of open sparks between lock and lights */}
      <RoughDash
        d='M100 70 Q98 58 100 30'
        c='#cf9836'
        w={1.4}
        dur={1.7}
        dash='1.5 6'
        seed={340}
        o={0.6}
      />

      {/* the sprung padlock — shackle swung open, body resting on the field */}
      <motion.g
        animate={{ y: [0, -1.6, 0] }}
        transition={loop(3)}
        style={{ transformOrigin: '100px 72px' }}
      >
        <g opacity='0.1'>
          <Ink
            d={gen.ellipse(
              100,
              90,
              36,
              6,
              filled(335, INK, {
                fillStyle: 'solid',
                stroke: 'none',
                roughness: 1.4,
              })
            )}
          />
        </g>

        {/* lock body */}
        <Ink
          d={gen.path(
            'M85 67 Q85 64 88 64 L112 64 Q115 64 115 67 L115 87 Q115 90 112 90 L88 90 Q85 90 85 87 Z',
            filled(330, '#c2502e', {
              fillStyle: 'solid',
              strokeWidth: 1.3,
              roughness: 1,
            })
          )}
        />
        {/* keyhole — open, light leaking out */}
        <Ink
          d={gen.circle(
            100,
            74,
            5,
            filled(331, '#fdf3e6', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
        <Ink
          d={gen.polygon(
            [
              [98.4, 76],
              [101.6, 76],
              [102.6, 84],
              [97.4, 84],
            ],
            filled(332, '#fdf3e6', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />

        {/* shackle — one leg seated, the other swung open (the gate is unlocked) */}
        <Ink
          d={gen.line(
            90,
            64,
            90,
            58,
            stroke(333, { strokeWidth: 2.4, stroke: '#9a8a72' })
          )}
        />
        <motion.g
          animate={{ rotate: [0, -4, 0] }}
          transition={loop(3.4)}
          style={{ transformOrigin: '90px 58px' }}
        >
          <Ink
            d={gen.path(
              'M90 58 Q90 44 104 44 Q116 44 118 53',
              stroke(334, { strokeWidth: 2.4, stroke: '#9a8a72', roughness: 1 })
            )}
          />
        </motion.g>
      </motion.g>
    </Frame>
  );
}

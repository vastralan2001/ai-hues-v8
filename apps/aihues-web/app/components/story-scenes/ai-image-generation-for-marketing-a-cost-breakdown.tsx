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

/* Metaphor — a painter's easel whose legs are a tall, swaying stack of coins:
   every AI-generated marketing image is a canvas, and the price of a visual
   brand is the column of money it stands on. A gold coin falls into the frame's
   coin-slot; the canvas shows a half-rendered picture. */

const AIC = 'aimg';

export default function Scene() {
  return (
    <Frame sky={['#f7f3e6', '#e9ddc4']}>
      <defs>
        <radialGradient id={`${AIC}_glow`} cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff4d8' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#fff4d8' stopOpacity='0' />
        </radialGradient>
        <linearGradient id={`${AIC}_canvas`} x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#dfe9ef' />
          <stop offset='100%' stopColor='#cf9836' />
        </linearGradient>
      </defs>

      {/* soft sky depth */}
      <circle cx='148' cy='30' r='40' fill={`url(#${AIC}_glow)`} />
      <Cloud x={44} y={26} s={0.8} o={0.4} />
      <Cloud x={166} y={64} s={0.65} o={0.32} />
      <Twinkle x={30} y={22} c='#cf9836' />
      <Twinkle x={176} y={28} d={0.8} c='#e0a83f' />
      <Twinkle x={120} y={16} d={1.3} r={1} c='#94ac78' />

      {/* far ground line for depth */}
      <Ink
        d={gen.path(
          'M0 88 Q100 83 200 88 L200 100 L0 100 Z',
          filled(401, '#d7c79e', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />
      <ellipse cx='100' cy='90' rx='30' ry='4' fill={INK} opacity='0.1' />

      {/* the tall, gently-swaying stack of coins that serves as the easel's leg */}
      <motion.g
        animate={{ rotate: [-1.4, 1.4, -1.4] }}
        transition={loop(3.4)}
        style={{ transformOrigin: '100px 90px' }}
      >
        {[
          [88, 0],
          [85, 1],
          [89, 2],
          [86, 3],
          [88, 4],
          [85, 5],
          [87, 6],
        ].map(([cx, i], k) => {
          const cy = 86 - i * 4.6;
          return (
            <Ink
              key={k}
              d={gen.ellipse(
                cx,
                cy,
                26,
                7,
                filled(410 + k, k % 2 ? '#e0a83f' : '#cf9836', {
                  fillStyle: 'solid',
                  strokeWidth: 1,
                  roughness: 1.1,
                })
              )}
            />
          );
        })}

        {/* the easel mast rising out of the coin stack */}
        <Ink d={gen.line(86, 54, 86, 24, stroke(430, { strokeWidth: 1.4 }))} />
        {/* one splayed back leg for the easel's tripod read */}
        <Ink d={gen.line(96, 52, 112, 88, stroke(431, { strokeWidth: 1.4 }))} />

        {/* the canvas — a half-rendered generated picture */}
        <g transform='rotate(-4 84 40)'>
          <Ink
            d={gen.rectangle(
              66,
              22,
              40,
              34,
              filled(432, `url(#${AIC}_canvas)`, {
                fillStyle: 'solid',
                strokeWidth: 1.3,
                roughness: 1,
              })
            )}
          />
          {/* sketched sun + hills inside the canvas — the "image" being made */}
          <Ink
            d={gen.circle(
              94,
              33,
              9,
              filled(433, '#e2693f', { fillStyle: 'solid' })
            )}
          />
          <Ink
            d={gen.path(
              'M67 49 Q78 41 90 49 T106 47 L106 56 L67 56 Z',
              filled(434, '#788c5d', { hachureGap: 3 })
            )}
          />
          {/* unrendered region — dashed scan line crawling across the canvas */}
          <motion.line
            x1='66'
            y1='40'
            x2='106'
            y2='40'
            stroke='#fff'
            strokeWidth='1.4'
            opacity='0.7'
            strokeDasharray='2 4'
            animate={{ y: [-14, 14, -14], strokeDashoffset: [0, -18] }}
            transition={linear(2.6)}
          />
        </g>
      </motion.g>

      {/* a gold coin falling into the slot — the per-image cost being paid */}
      <motion.g
        animate={{ y: [-18, 30], opacity: [0, 1, 1, 0], rotate: [0, 180] }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: 'easeIn',
          delay: 0.4,
        }}
        style={{ transformOrigin: '130px 44px' }}
      >
        <Ink
          d={gen.circle(
            130,
            44,
            9,
            filled(440, '#f0b449', { fillStyle: 'solid' })
          )}
        />
        <text
          x='130'
          y='47'
          textAnchor='middle'
          fontSize='6'
          fontWeight='800'
          fill={INK}
        >
          $
        </text>
      </motion.g>
    </Frame>
  );
}

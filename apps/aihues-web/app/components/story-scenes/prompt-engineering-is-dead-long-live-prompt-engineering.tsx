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

/* Metaphor: the death of the complex prompt chain → the rebirth of the simple one.
   On the left, a fading tangle of looped chain-links (the over-engineered chain)
   unravels and resolves, on the right, into ONE clean straight thread of light
   reaching a small glowing orb. Three small distinct sparks sit along the clean
   line — the three patterns that still matter. Dawn sky: "dead… long live". */

export default function Scene() {
  // seed block for this file: 310–349
  return (
    <Frame sky={['#fbeede', '#f2d6bd']}>
      <defs>
        <radialGradient id='ped_orb' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff3d8' stopOpacity='1' />
          <stop offset='100%' stopColor='#fff3d8' stopOpacity='0' />
        </radialGradient>
        <radialGradient id='ped_haze' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#e9c9ac' stopOpacity='0.55' />
          <stop offset='100%' stopColor='#e9c9ac' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* sky accents + depth */}
      <Twinkle x={30} y={20} c='#cf9836' />
      <Twinkle x={176} y={26} d={0.8} c='#e0a83f' />
      <Twinkle x={150} y={14} d={1.4} c='#cf9836' r={0.9} />
      <Cloud x={150} y={70} s={0.85} o={0.4} />
      <Cloud x={40} y={74} s={0.7} o={0.32} />

      {/* far horizon ground for grounding */}
      <Ink
        d={gen.path(
          'M0 90 Q100 85 200 90 L200 100 L0 100 Z',
          filled(310, '#ead0a6', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />

      {/* the dying tangle — slowly drifting apart + dimming on the left */}
      <motion.g
        animate={{ opacity: [0.55, 0.28, 0.55], x: [0, -2.5, 0] }}
        transition={loop(3.2)}
        style={{ transformOrigin: '46px 48px' }}
      >
        <circle cx='46' cy='48' r='30' fill='url(#ped_haze)' />
        <Ink
          d={gen.path(
            'M22 60 C30 44 18 40 30 32 C40 26 34 44 48 38 C60 33 50 22 60 30',
            stroke(311, {
              stroke: '#b06a45',
              strokeWidth: 1.2,
              roughness: 1.6,
              bowing: 2.2,
            })
          )}
        />
        <Ink
          d={gen.path(
            'M26 66 C40 58 30 50 44 50 C56 50 48 62 62 58 C72 55 66 46 74 52',
            stroke(312, {
              stroke: '#c2502e',
              strokeWidth: 1.1,
              roughness: 1.7,
              bowing: 2.4,
            })
          )}
        />
        <Ink
          d={gen.circle(
            33,
            40,
            7,
            stroke(313, { stroke: '#b06a45', strokeWidth: 1, roughness: 1.6 })
          )}
        />
        <Ink
          d={gen.circle(
            50,
            56,
            8,
            stroke(314, { stroke: '#c2502e', strokeWidth: 1, roughness: 1.6 })
          )}
        />
        <Ink
          d={gen.circle(
            42,
            30,
            6,
            stroke(315, { stroke: '#cf9836', strokeWidth: 1, roughness: 1.5 })
          )}
        />
      </motion.g>

      {/* a couple of loose links breaking away from the tangle (dissolving) */}
      {[
        [70, 44, 0],
        [62, 62, 0.7],
        [78, 54, 1.3],
      ].map(([lx, ly, dl]) => (
        <motion.g
          key={lx}
          animate={{ opacity: [0.5, 0, 0.5], x: [0, 6, 0], y: [0, -3, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: dl as number,
          }}
          style={{ transformOrigin: `${lx}px ${ly}px` }}
        >
          <Ink
            d={gen.circle(
              lx,
              ly,
              4,
              stroke(320 + (lx as number), {
                stroke: '#b06a45',
                strokeWidth: 0.9,
                roughness: 1.4,
              })
            )}
          />
        </motion.g>
      ))}

      {/* the one clean thread of light — straight, resolved, reaching the orb */}
      <motion.path
        d='M84 52 L168 30'
        fill='none'
        stroke='#fff'
        strokeWidth='2.4'
        opacity='0.55'
        strokeDasharray='1 6'
        animate={{ strokeDashoffset: [0, -14] }}
        transition={linear(1.5)}
      />
      <Ink
        d={gen.line(
          84,
          52,
          168,
          30,
          stroke(316, {
            stroke: '#cf9836',
            strokeWidth: 1.3,
            roughness: 0.7,
            bowing: 0.5,
          })
        )}
      />

      {/* three sparks along the clean line — the 3 patterns that still matter */}
      {[
        [104, 46.8, 0],
        [126, 41, 0.5],
        [148, 35.2, 1],
      ].map(([sx, sy, dl], i) => (
        <motion.g
          key={sx}
          animate={{ scale: [0.8, 1.15, 0.8], opacity: [0.7, 1, 0.7] }}
          transition={loop(2.2, dl as number)}
          style={{ transformOrigin: `${sx}px ${sy}px` }}
        >
          <Ink
            d={gen.polygon(
              [
                [sx as number, (sy as number) - 3],
                [(sx as number) + 0.9, sy as number],
                [(sx as number) + 3, sy as number],
                [(sx as number) + 0.9, (sy as number) + 1],
                [(sx as number) + 1.6, (sy as number) + 3.4],
                [sx as number, (sy as number) + 1.6],
                [(sx as number) - 1.6, (sy as number) + 3.4],
                [(sx as number) - 0.9, (sy as number) + 1],
                [(sx as number) - 3, sy as number],
                [(sx as number) - 0.9, sy as number],
              ],
              filled(330 + i, '#e0a83f', {
                fillStyle: 'solid',
                strokeWidth: 0.9,
              })
            )}
          />
        </motion.g>
      ))}

      {/* the focal subject: one small bright orb — the simple prompt, alive */}
      <circle cx='168' cy='30' r='22' fill='url(#ped_orb)' />
      <motion.g
        animate={{ scale: [0.94, 1.08, 0.94] }}
        transition={loop(2.6)}
        style={{ transformOrigin: '168px 30px' }}
      >
        <Ink
          d={gen.circle(
            168,
            30,
            13,
            filled(317, '#f0b449', { fillStyle: 'solid', strokeWidth: 1.3 })
          )}
        />
        <Ink
          d={gen.circle(
            168,
            30,
            6,
            filled(318, '#fff3d8', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
      </motion.g>
    </Frame>
  );
}

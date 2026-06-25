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
  RoughDash,
  motion,
} from './_kit';

/* Metaphor — attention residue & batching. On the left, a single thread of focus
   frays into tangled loose ends, each one snagged on a scattered task-peg (every
   context switch leaves a strand stuck behind). On the right the thread gathers
   into ONE taut, glowing line that flows cleanly into a single bright focal node:
   batched deep work. Seed block: 410–449. Gradient ids prefixed `cssw_`. */

export default function Scene() {
  return (
    <Frame sky={['#f6f0e6', '#ecdcc6']}>
      <defs>
        <radialGradient id='cssw_focus' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff3d8' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff3d8' stopOpacity='0' />
        </radialGradient>
        <radialGradient id='cssw_haze' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#e9c8b4' stopOpacity='0.5' />
          <stop offset='100%' stopColor='#e9c8b4' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* depth: soft glow over the clean side, faint haze over the tangled side */}
      <circle cx='168' cy='46' r='40' fill='url(#cssw_focus)' />
      <circle cx='40' cy='52' r='34' fill='url(#cssw_haze)' />
      <Cloud x={150} y={22} s={0.8} o={0.4} />
      <Twinkle x={28} y={28} c='#cf9836' />
      <Twinkle x={184} y={24} d={1.2} c='#e0a83f' />

      {/* low ground band for grounding */}
      <Ink
        d={gen.path(
          'M0 84 Q100 78 200 84 L200 100 L0 100 Z',
          filled(410, '#dcc8a6', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />

      {/* scattered task-pegs on the fragmented (left) side */}
      {[
        [24, 70, 411],
        [40, 60, 412],
        [30, 50, 413],
        [54, 72, 414],
      ].map(([px, py, sd]) => (
        <Ink
          key={sd}
          d={gen.circle(
            px,
            py,
            4,
            filled(sd, '#a98a6a', { fillStyle: 'solid' })
          )}
        />
      ))}

      {/* frayed strands of attention, each snagged on a peg — they tremble */}
      <motion.g
        animate={{ rotate: [0, 1.4, 0] }}
        transition={loop(2.2)}
        style={{ transformOrigin: '40px 60px' }}
      >
        <Ink
          d={gen.path(
            'M88 56 Q60 50 24 70',
            stroke(415, { stroke: '#bf8f63', roughness: 2, bowing: 3 })
          )}
        />
      </motion.g>
      <motion.g
        animate={{ rotate: [0, -1.8, 0] }}
        transition={loop(1.8, 0.3)}
        style={{ transformOrigin: '40px 56px' }}
      >
        <Ink
          d={gen.path(
            'M88 56 Q58 56 40 60',
            stroke(416, { stroke: '#c2502e', roughness: 2.2, bowing: 3 })
          )}
        />
      </motion.g>
      <motion.g
        animate={{ rotate: [0, 2, 0] }}
        transition={loop(2.6, 0.6)}
        style={{ transformOrigin: '34px 50px' }}
      >
        <Ink
          d={gen.path(
            'M88 55 Q56 44 30 50',
            stroke(417, { stroke: '#cf9836', roughness: 2.1, bowing: 3.2 })
          )}
        />
      </motion.g>
      <motion.g
        animate={{ rotate: [0, -1.4, 0] }}
        transition={loop(2, 0.45)}
        style={{ transformOrigin: '54px 72px' }}
      >
        <Ink
          d={gen.path(
            'M88 57 Q66 62 54 72',
            stroke(418, { stroke: '#a98a6a', roughness: 2, bowing: 2.8 })
          )}
        />
      </motion.g>

      {/* the gathering knot where strands converge into one thread */}
      <Ink
        d={gen.circle(
          90,
          56,
          7,
          filled(419, '#e2693f', { fillStyle: 'solid' })
        )}
      />

      {/* ONE clean taut thread flowing from the knot to the focal node */}
      <Ink
        d={gen.path(
          'M93 56 Q130 50 162 46',
          stroke(420, {
            stroke: '#94ac78',
            strokeWidth: 1.3,
            roughness: 0.9,
            bowing: 0.6,
          })
        )}
      />
      {/* flowing progress dash along the clean thread */}
      <RoughDash
        d='M93 56 Q130 50 162 46'
        c='#fff'
        w={1.6}
        seed={422}
        dur={1.6}
        dash='2 8'
        o={0.7}
      />

      {/* focal node: a single bright deep-work star, pulsing */}
      <motion.g
        animate={{ scale: [0.92, 1.1, 0.92], rotate: [0, 6, 0] }}
        transition={loop(2.4)}
        style={{ transformOrigin: '168px 46px' }}
      >
        <Ink
          d={gen.polygon(
            [
              [168, 37],
              [170.6, 42.4],
              [176.6, 43.1],
              [172.3, 47.1],
              [173.4, 53],
              [168, 50],
              [162.6, 53],
              [163.7, 47.1],
              [159.4, 43.1],
              [165.4, 42.4],
            ],
            filled(421, '#f0b449', { fillStyle: 'solid' })
          )}
        />
      </motion.g>
    </Frame>
  );
}

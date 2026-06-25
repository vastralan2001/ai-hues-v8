'use client';
import {
  Cloud,
  Frame,
  filled,
  gen,
  Ink,
  loop,
  motion,
  RoughDash,
  Twinkle,
} from './_kit';

/* Launching on Product Hunt: a rough paper rocket climbing a dashed trail past a
   low morning sun, twin sparks marking the moment of lift-off. */

export default function Scene() {
  const trail = 'M58 90 Q92 74 124 44';
  return (
    <Frame sky={['#fdf2e4', '#f6dcc1']}>
      <defs>
        <radialGradient id='ph_sun' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff6e6' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#fff6e6' stopOpacity='0' />
        </radialGradient>
      </defs>
      <circle cx='150' cy='22' r='46' fill='url(#ph_sun)' />
      <Twinkle x={40} y={24} c='#cf9836' />
      <Cloud x={48} y={66} s={0.85} o={0.45} />
      <Ink
        d={gen.path(
          'M0 90 Q100 84 200 90 L200 100 L0 100 Z',
          filled(11, '#eecba3', { roughness: 1.5, hachureGap: 3.4 })
        )}
      />
      <RoughDash
        d={trail}
        c='#fff'
        w={3}
        dash='1 7'
        dur={1.4}
        seed={17}
        o={0.5}
      />
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={loop(2.6)}
        style={{ transformOrigin: '124px 44px' }}
      >
        <g transform='rotate(34 124 44)'>
          <motion.g
            animate={{ scaleY: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
            transition={loop(0.4)}
            style={{ transformOrigin: '124px 56px' }}
          >
            <Ink
              d={gen.path(
                'M120 56 Q124 68 128 56',
                filled(12, '#f0b449', { roughness: 0.9 })
              )}
            />
          </motion.g>
          <Ink
            d={gen.polygon(
              [
                [120.5, 50],
                [115, 60],
                [120.5, 56],
              ],
              filled(13, '#c2502e')
            )}
          />
          <Ink
            d={gen.polygon(
              [
                [127.5, 50],
                [133, 60],
                [127.5, 56],
              ],
              filled(14, '#c2502e')
            )}
          />
          <Ink
            d={gen.path(
              'M124 30 C131 38 131 50 128 56 L120 56 C117 50 117 38 124 30 Z',
              filled(15, '#e2693f', { strokeWidth: 1.3 })
            )}
          />
          <Ink d={gen.circle(124, 41, 7, filled(16, '#cfe6fb'))} />
        </g>
      </motion.g>
    </Frame>
  );
}

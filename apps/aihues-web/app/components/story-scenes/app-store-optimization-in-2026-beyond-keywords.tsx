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
} from './_kit';

/* App Store Optimization: an app icon rides a dashed growth curve up toward a
   glowing star ranking — the climb beyond keywords. */

export default function Scene() {
  const curve = 'M14 84 Q70 80 104 58 T182 22';
  return (
    <Frame sky={['#fcf5e3', '#f3ddb0']}>
      <defs>
        <radialGradient id='aso_star' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff1cf' stopOpacity='1' />
          <stop offset='100%' stopColor='#fff1cf' stopOpacity='0' />
        </radialGradient>
      </defs>
      <Cloud x={46} y={26} s={0.8} o={0.4} />
      <Ink
        d={gen.path(
          'M14 84 Q70 80 104 58 T182 22 L182 96 L14 96 Z',
          filled(51, '#f1d3a0', { roughness: 1.6, hachureGap: 4 })
        )}
      />
      <RoughDash d={curve} c='#d99a3f' w={1.8} dash='2 6' dur={1.6} seed={55} />
      <circle cx='182' cy='22' r='18' fill='url(#aso_star)' />
      <motion.g
        animate={{ scale: [0.92, 1.08, 0.92], rotate: [0, 6, 0] }}
        transition={loop(2.4)}
        style={{ transformOrigin: '182px 22px' }}
      >
        <Ink
          d={gen.polygon(
            [
              [182, 13],
              [184.6, 18.4],
              [190.6, 19.1],
              [186.3, 23.1],
              [187.4, 29],
              [182, 26],
              [176.6, 29],
              [177.7, 23.1],
              [173.4, 19.1],
              [179.4, 18.4],
            ],
            filled(52, '#f0b449', { fillStyle: 'solid' })
          )}
        />
      </motion.g>
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={loop(2.2)}
        style={{ transformOrigin: '96px 60px' }}
      >
        <g transform='rotate(-26 96 60)'>
          <Ink
            d={gen.rectangle(
              88,
              49,
              16,
              24,
              filled(53, '#ffffff', { fillStyle: 'solid', strokeWidth: 1.2 })
            )}
          />
          <Ink
            d={gen.polygon(
              [
                [96, 55],
                [97.5, 58],
                [100.8, 58.4],
                [98.4, 60.6],
                [99, 63.9],
                [96, 62.2],
                [93, 63.9],
                [93.6, 60.6],
                [91.2, 58.4],
                [94.5, 58],
              ],
              filled(54, '#f0b449', { fillStyle: 'solid' })
            )}
          />
        </g>
      </motion.g>
    </Frame>
  );
}

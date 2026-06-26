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
  stroke,
} from './_kit';

/* Solo founding: a lone figure on a dashed trail across vast layered summits,
   planting a flag at the top — one year of lessons and regrets. */

export default function Scene() {
  const trail = 'M22 86 Q60 82 96 64 T172 30';
  return (
    <Frame sky={['#f5f1e4', '#dfead4']}>
      <defs>
        <radialGradient id='sf_sun' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff7e4' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff7e4' stopOpacity='0' />
        </radialGradient>
      </defs>
      <circle cx='160' cy='24' r='38' fill='url(#sf_sun)' />
      <Ink
        d={gen.circle(
          160,
          24,
          16,
          filled(71, '#f6e7bb', { fillStyle: 'solid' })
        )}
      />
      <Cloud x={48} y={28} s={0.8} o={0.45} />
      <Ink
        d={gen.polygon(
          [
            [0, 70],
            [48, 34],
            [96, 70],
          ],
          filled(72, '#d4dec9', { hachureGap: 4 })
        )}
      />
      <Ink
        d={gen.polygon(
          [
            [64, 72],
            [120, 30],
            [172, 72],
          ],
          filled(73, '#c2cfb1', { hachureGap: 4 })
        )}
      />
      <Ink
        d={gen.polygon(
          [
            [0, 84],
            [58, 50],
            [120, 84],
          ],
          filled(74, '#aebf95', { hachureGap: 3.4 })
        )}
      />
      <Ink
        d={gen.polygon(
          [
            [86, 92],
            [172, 26],
            [200, 92],
          ],
          filled(75, '#94ac78', { hachureGap: 3 })
        )}
      />
      <RoughDash d={trail} c='#6f8a4f' w={1.8} dash='3 7' dur={1.9} seed={80} />
      <motion.g animate={{ y: [0, -1.4, 0] }} transition={loop(1.9)}>
        <Ink
          d={gen.circle(
            96,
            56,
            5,
            filled(76, '#d4602f', { fillStyle: 'solid' })
          )}
        />
        <Ink
          d={gen.path(
            'M96 58 L96 63 M96 60 L92.5 62 M96 60 L99.5 61 M96 63 L93 67 M96 63 L99 67',
            stroke(77, { strokeWidth: 1.4 })
          )}
        />
      </motion.g>
      <Ink d={gen.line(172, 30, 172, 12, stroke(78, { strokeWidth: 1.6 }))} />
      <motion.g
        animate={{ skewX: [0, 9, 0] }}
        transition={loop(1.6)}
        style={{ transformOrigin: '172px 17px' }}
      >
        <Ink
          d={gen.path(
            'M172 13 Q181 15 188 12 Q181 19 188 22 Q180 20 172 23 Z',
            filled(79, '#c2502e', { fillStyle: 'solid' })
          )}
        />
      </motion.g>
    </Frame>
  );
}

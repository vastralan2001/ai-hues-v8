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

/* "2026 SEO Trends: From Keywords to Intent" — a compass on the ground whose
   needle has swung off a scattered field of loose keyword-tiles and now points
   up at one warm guiding waypoint star on the horizon (intent). Seeds 301–399,
   gradient ids prefixed seo26_. */

export default function Scene() {
  const path = 'M150 30 Q116 44 88 60 T34 84';
  const tiles: [number, number, number][] = [
    [30, 70, -14],
    [44, 80, 8],
    [58, 88, -6],
    [22, 84, 11],
    [70, 80, -10],
  ];
  return (
    <Frame sky={['#fdf4e6', '#f4dcb8']}>
      <defs>
        <radialGradient id='seo26_star' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff2cd' stopOpacity='1' />
          <stop offset='100%' stopColor='#fff2cd' stopOpacity='0' />
        </radialGradient>
        <radialGradient id='seo26_dial' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fffaf0' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#fffaf0' stopOpacity='0' />
        </radialGradient>
      </defs>

      <Cloud x={52} y={24} s={0.8} o={0.4} />
      <Twinkle x={26} y={22} c='#cf9836' />
      <Twinkle x={118} y={16} d={0.6} c='#e0a83f' />

      {/* distant ground swell for depth */}
      <Ink
        d={gen.path(
          'M0 90 Q100 82 200 90 L200 100 L0 100 Z',
          filled(301, '#ead0a0', { roughness: 1.6, hachureGap: 3.6 })
        )}
      />

      {/* the guiding waypoint star (intent) on the horizon */}
      <circle cx='150' cy='30' r='20' fill='url(#seo26_star)' />
      <motion.g
        animate={{ scale: [0.92, 1.1, 0.92], rotate: [0, 8, 0] }}
        transition={loop(2.6)}
        style={{ transformOrigin: '150px 30px' }}
      >
        <Ink
          d={gen.polygon(
            [
              [150, 21],
              [152.6, 26.4],
              [158.6, 27.1],
              [154.3, 31.1],
              [155.4, 37],
              [150, 34],
              [144.6, 37],
              [145.7, 31.1],
              [141.4, 27.1],
              [147.4, 26.4],
            ],
            filled(302, '#f0b449', { fillStyle: 'solid' })
          )}
        />
      </motion.g>

      {/* search-path arc converging out of the scattered field toward the star */}
      <RoughDash d={path} c='#cf9836' w={1.6} dur={1.7} seed={303} dash='2 6' />

      {/* scattered, fading keyword tiles being left behind */}
      {tiles.map(([tx, ty, rot], i) => (
        <motion.g
          key={tx}
          animate={{ opacity: [0.7, 0.35, 0.7], y: [0, 0.8, 0] }}
          transition={loop(3 + i * 0.4, i * 0.3)}
          style={{ transformOrigin: `${tx}px ${ty}px` }}
        >
          <g transform={`rotate(${rot} ${tx} ${ty})`}>
            <Ink
              d={gen.rectangle(
                tx - 6,
                ty - 4,
                12,
                8,
                filled(310 + i, '#d8cab0', {
                  fillStyle: 'solid',
                  strokeWidth: 1,
                  roughness: 1.3,
                })
              )}
            />
            <Ink
              d={gen.line(
                tx - 3.5,
                ty,
                tx + 3.5,
                ty,
                stroke(320 + i, { stroke: '#a99a7f', strokeWidth: 1 })
              )}
            />
          </g>
        </motion.g>
      ))}

      {/* the compass dial on the ground, mid-foreground */}
      <Ink
        d={gen.ellipse(
          100,
          80,
          44,
          12,
          filled(336, INK, {
            fillStyle: 'solid',
            stroke: 'none',
            strokeWidth: 0,
            roughness: 1.5,
          })
        )}
      />
      <circle cx='100' cy='70' r='22' fill='url(#seo26_dial)' />
      <Ink
        d={gen.circle(
          100,
          70,
          30,
          filled(330, '#fbf3e4', { fillStyle: 'solid', strokeWidth: 1.2 })
        )}
      />
      <Ink
        d={gen.circle(
          100,
          70,
          24,
          stroke(331, { stroke: '#94835f', strokeWidth: 1 })
        )}
      />
      {/* cardinal ticks */}
      <Ink
        d={gen.path(
          'M100 56 L100 60 M100 80 L100 84 M86 70 L90 70 M110 70 L114 70',
          stroke(332, { stroke: '#94835f', strokeWidth: 1.2 })
        )}
      />

      {/* the needle: swung up toward the star (intent), not at the tiles */}
      <motion.g
        animate={{ rotate: [-3, 3, -3] }}
        transition={loop(2.2)}
        style={{ transformOrigin: '100px 70px' }}
      >
        <g transform='rotate(34 100 70)'>
          <Ink
            d={gen.polygon(
              [
                [100, 56],
                [103, 70],
                [100, 67],
                [97, 70],
              ],
              filled(333, '#c2502e', { fillStyle: 'solid', strokeWidth: 1.1 })
            )}
          />
          <Ink
            d={gen.polygon(
              [
                [100, 84],
                [97, 70],
                [100, 73],
                [103, 70],
              ],
              filled(334, '#dccaa9', { fillStyle: 'solid', strokeWidth: 1 })
            )}
          />
        </g>
        <Ink
          d={gen.circle(
            100,
            70,
            4,
            filled(335, '#e0a83f', { fillStyle: 'solid' })
          )}
        />
      </motion.g>
    </Frame>
  );
}

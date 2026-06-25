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
  motion,
} from './_kit';

/* Energy vs time: a uniform ring of clock ticks recedes on the horizon — every
   hour weighed the same — while one warm lantern (your charge) hangs in front of
   it, breathing brighter and dimmer. Time is constant; energy is the thing that
   actually waxes and wanes, so the lantern is the focal subject that outshines
   the even-marching dial behind it. */

const cx = 110;
const cy = 50;

export default function Scene() {
  return (
    <Frame sky={['#fbf3e6', '#f0dcc0']}>
      <defs>
        <radialGradient id='enmgt_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#ffe9bf' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#ffe9bf' stopOpacity='0' />
        </radialGradient>
        <radialGradient id='enmgt_dial' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#f4e2c4' stopOpacity='0' />
          <stop offset='70%' stopColor='#e8cfa6' stopOpacity='0.35' />
          <stop offset='100%' stopColor='#e8cfa6' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* sky accents + distant atmosphere */}
      <Twinkle x={30} y={22} c='#cf9836' />
      <Twinkle x={178} y={30} d={0.8} c='#e0a83f' />
      <Cloud x={44} y={26} s={0.78} o={0.4} />

      {/* far horizon haze for depth */}
      <Ink
        d={gen.path(
          'M0 86 Q100 80 200 86 L200 100 L0 100 Z',
          filled(401, '#ecd2a8', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />

      {/* the dial of time: an evenly-ticked ring receding behind the lantern.
          It rotates slowly and uniformly — every hour the same weight. */}
      <ellipse cx={cx} cy={cy} rx='58' ry='26' fill='url(#enmgt_dial)' />
      <motion.g
        animate={{ rotate: 360 }}
        transition={linear(46)}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        <Ink
          d={gen.ellipse(
            cx,
            cy,
            96,
            42,
            stroke(402, {
              stroke: '#cf9836',
              strokeWidth: 1,
              roughness: 1,
            })
          )}
        />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const ox = Math.cos(a) * 48;
          const oy = Math.sin(a) * 21;
          const ix = Math.cos(a) * 42;
          const iy = Math.sin(a) * 18.4;
          return (
            <Ink
              key={i}
              d={gen.line(
                cx + ix,
                cy + iy,
                cx + ox,
                cy + oy,
                stroke(410 + i, {
                  stroke: '#c79a4a',
                  strokeWidth: 1,
                  roughness: 0.8,
                  bowing: 0.6,
                })
              )}
            />
          );
        })}
      </motion.g>

      {/* glow pool the lantern casts onto the scene */}
      <circle cx={cx} cy={cy} r='34' fill='url(#enmgt_glow)' />

      {/* the lantern: your energy. The cord is fixed; the lamp breathes
          brighter/dimmer and bobs — charge that ebbs and flows. */}
      <Ink d={gen.line(cx, 8, cx, 30, stroke(430, { strokeWidth: 1.2 }))} />
      <motion.g
        animate={{ y: [0, 2.4, 0] }}
        transition={loop(3.2)}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        {/* top cap + ring */}
        <Ink
          d={gen.path(
            `M${cx - 6} 32 L${cx + 6} 32 L${cx + 4} 36 L${cx - 4} 36 Z`,
            filled(431, '#cf9836', { fillStyle: 'solid', strokeWidth: 1.1 })
          )}
        />
        <Ink d={gen.circle(cx, 30, 4, stroke(432, { strokeWidth: 1.1 }))} />

        {/* glass body */}
        <Ink
          d={gen.path(
            `M${cx - 9} 38 Q${cx} 36 ${cx + 9} 38 L${cx + 8} 62 Q${cx} 66 ${cx - 8} 62 Z`,
            filled(433, '#fff4dd', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />

        {/* the flame / charge — breathes in brightness and scale */}
        <motion.g
          animate={{
            scaleY: [1, 1.28, 0.86, 1],
            opacity: [0.78, 1, 0.7, 0.78],
          }}
          transition={loop(2.4)}
          style={{ transformOrigin: `${cx}px 58px` }}
        >
          <Ink
            d={gen.path(
              `M${cx} 44 C${cx + 6} 50 ${cx + 5} 58 ${cx} 58 C${cx - 5} 58 ${cx - 6} 50 ${cx} 44 Z`,
              filled(434, '#e2693f', { fillStyle: 'solid', strokeWidth: 1 })
            )}
          />
          <Ink
            d={gen.path(
              `M${cx} 49 C${cx + 3} 52 ${cx + 2.6} 57 ${cx} 57 C${cx - 2.6} 57 ${cx - 3} 52 ${cx} 49 Z`,
              filled(435, '#f0b449', { fillStyle: 'solid', strokeWidth: 0.8 })
            )}
          />
        </motion.g>

        {/* base */}
        <Ink
          d={gen.path(
            `M${cx - 8} 62 L${cx + 8} 62 L${cx + 6} 66 L${cx - 6} 66 Z`,
            filled(436, '#cf9836', { fillStyle: 'solid', strokeWidth: 1.1 })
          )}
        />
      </motion.g>

      {/* a couple of warm sparks drifting up from the lantern's heat */}
      {(
        [
          [cx - 3, 40, 0, 440],
          [cx + 4, 42, 1.1, 441],
        ] as [number, number, number, number][]
      ).map(([sx, sy, d, sd]) => (
        <motion.g
          key={sx}
          animate={{ y: [0, -10], opacity: [0, 0.7, 0] }}
          transition={{
            duration: 2.6,
            repeat: Infinity,
            ease: 'easeOut',
            delay: d,
          }}
        >
          <Ink
            d={gen.circle(
              sx,
              sy,
              1.8,
              filled(sd, '#f0b449', { fillStyle: 'solid', strokeWidth: 0.6 })
            )}
          />
        </motion.g>
      ))}
    </Frame>
  );
}

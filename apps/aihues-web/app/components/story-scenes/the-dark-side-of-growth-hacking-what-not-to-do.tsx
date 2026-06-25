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

/* The Dark Side of Growth Hacking — a tall startup tower shooting up fast, but
   propped on thin, cracking stilts over a dark sinkhole. One support is buckling
   and a brick is falling; hollow "fake" five-star outlines drift up on strings
   like empty balloons. Vanity growth on a hollow foundation, about to collapse. */

export default function Scene() {
  return (
    <Frame sky={['#f6ead6', '#ecd2ad']}>
      <defs>
        <radialGradient id='gh_dark_pit' cx='50%' cy='40%' r='60%'>
          <stop offset='0%' stopColor='#5b5346' stopOpacity='0.55' />
          <stop offset='100%' stopColor='#5b5346' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='gh_tower' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#e2693f' />
          <stop offset='100%' stopColor='#c2502e' />
        </linearGradient>
      </defs>

      {/* far hazy ground line for depth */}
      <Cloud x={44} y={22} s={0.7} o={0.4} />
      <Twinkle x={30} y={20} c='#cf9836' />
      <Twinkle x={176} y={18} d={0.8} c='#e0a83f' />

      {/* the dark sinkhole the whole thing teeters over */}
      <ellipse cx='100' cy='90' rx='62' ry='14' fill='url(#gh_dark_pit)' />
      <Ink
        d={gen.path(
          'M48 88 Q72 78 100 80 Q132 82 154 90 Q128 96 100 95 Q70 95 48 88 Z',
          filled(401, '#7a6f5c', {
            hachureGap: 3.2,
            fillWeight: 0.6,
            roughness: 1.5,
          })
        )}
      />

      {/* thin cracking stilts holding the tower up over the void */}
      <Ink d={gen.line(80, 80, 78, 60, stroke(402, { strokeWidth: 1.3 }))} />
      <Ink d={gen.line(120, 80, 122, 60, stroke(403, { strokeWidth: 1.3 }))} />
      {/* center support, buckled — the crack that sinks it */}
      <Ink
        d={gen.path(
          'M100 82 L101 72 L97 66 L100 60',
          stroke(404, { strokeWidth: 1.4, roughness: 1.8 })
        )}
      />
      <Ink d={gen.line(80, 70, 100, 71, stroke(405, { strokeWidth: 0.9 }))} />
      <Ink d={gen.line(100, 71, 120, 70, stroke(406, { strokeWidth: 0.9 }))} />

      {/* the leaning startup tower — fast, tall, top-heavy */}
      <motion.g
        animate={{ rotate: [-1.5, 1.5, -1.5] }}
        transition={loop(3.2)}
        style={{ transformOrigin: '100px 60px' }}
      >
        <g transform='rotate(-4 100 60)'>
          <Ink
            d={gen.rectangle(86, 22, 28, 38, {
              ...filled(407, 'url(#gh_tower)', {
                fillStyle: 'solid',
                strokeWidth: 1.2,
              }),
            })}
          />
          {/* stacked floors / windows */}
          <Ink
            d={gen.line(
              89,
              32,
              111,
              32,
              stroke(408, { stroke: '#f3d9b8', strokeWidth: 0.9 })
            )}
          />
          <Ink
            d={gen.line(
              89,
              40,
              111,
              40,
              stroke(409, { stroke: '#f3d9b8', strokeWidth: 0.9 })
            )}
          />
          <Ink
            d={gen.line(
              89,
              48,
              111,
              48,
              stroke(410, { stroke: '#f3d9b8', strokeWidth: 0.9 })
            )}
          />
          {/* a tall fragile spire pushing higher */}
          <Ink
            d={gen.polygon(
              [
                [100, 22],
                [95, 12],
                [100, 6],
                [105, 12],
              ],
              filled(411, '#e0a83f', { fillStyle: 'solid' })
            )}
          />
          {/* a stress crack down the facade */}
          <Ink
            d={gen.path(
              'M104 24 L101 34 L105 42 L102 52',
              stroke(412, { strokeWidth: 0.9, roughness: 1.9 })
            )}
          />
        </g>
      </motion.g>

      {/* a brick breaking loose and falling into the pit */}
      <motion.g
        animate={{ y: [0, 22], x: [0, 4], rotate: [0, 40], opacity: [0.95, 0] }}
        transition={linear(2.4)}
        style={{ transformOrigin: '128px 56px' }}
      >
        <Ink
          d={gen.rectangle(
            125,
            54,
            6,
            4,
            filled(413, '#c2502e', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
      </motion.g>

      {/* hollow "fake" five-star reviews drifting up on strings — empty growth */}
      {[
        { sx: 150, sy: 36, d: 0, dur: 3.4 },
        { sx: 166, sy: 50, d: 1.1, dur: 3.9 },
        { sx: 42, sy: 44, d: 0.6, dur: 3.6 },
      ].map((b, i) => (
        <motion.g
          key={b.sx}
          animate={{ y: [0, -4, 0] }}
          transition={loop(b.dur, b.d)}
          style={{ transformOrigin: `${b.sx}px ${b.sy}px` }}
        >
          <Ink
            d={gen.line(
              b.sx,
              b.sy + 5,
              b.sx,
              b.sy + 16,
              stroke(420 + i, { strokeWidth: 0.7 })
            )}
          />
          <Ink
            d={gen.polygon(
              [
                [b.sx, b.sy - 5],
                [b.sx + 1.5, b.sy - 1.5],
                [b.sx + 5, b.sy - 1.2],
                [b.sx + 2.2, b.sy + 1.2],
                [b.sx + 3, b.sy + 5],
                [b.sx, b.sy + 2.6],
                [b.sx - 3, b.sy + 5],
                [b.sx - 2.2, b.sy + 1.2],
                [b.sx - 5, b.sy - 1.2],
                [b.sx - 1.5, b.sy - 1.5],
              ],
              stroke(423 + i, { stroke: '#cf9836', strokeWidth: 1 })
            )}
          />
        </motion.g>
      ))}
    </Frame>
  );
}

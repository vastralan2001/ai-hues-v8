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

/* twitter-growth — "0 to 10K in 90 days". One small songbird on a bare branch
   releases a flock that fans up and multiplies toward a bright dawn horizon:
   a single voice compounding into an audience. The lone bird is the focal
   subject; the rising migration arc is the growth curve. */

const ARC = 'M40 78 Q96 70 140 44 T192 18';

// A simple V-stroke bird; size & wing-beat phase vary per bird in the flock.
function Bird({
  x,
  y,
  s,
  seed,
  ph,
  c = INK,
}: {
  x: number;
  y: number;
  s: number;
  seed: number;
  ph: number;
  c?: string;
}) {
  const w = 5 * s;
  const h = 2.6 * s;
  return (
    <motion.g
      animate={{ y: [0, -1.6, 0], scaleY: [1, 0.8, 1] }}
      transition={loop(1.5 + s, ph)}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      <Ink
        d={gen.path(
          `M${x - w} ${y} Q${x - w * 0.4} ${y - h} ${x} ${y} Q${x + w * 0.4} ${y - h} ${x + w} ${y}`,
          stroke(seed, {
            stroke: c,
            strokeWidth: 1 * Math.min(s, 1.2),
            bowing: 1.6,
          })
        )}
      />
    </motion.g>
  );
}

export default function Scene() {
  // Flock points fanning up the arc — denser & higher toward the bright horizon.
  const flock: [number, number, number, number][] = [
    [62, 73, 0.6, 0.0],
    [78, 67, 0.7, 0.4],
    [92, 62, 0.8, 0.2],
    [104, 55, 0.9, 0.7],
    [118, 50, 0.75, 0.3],
    [128, 44, 1.0, 0.9],
    [142, 41, 0.7, 0.5],
    [150, 35, 0.85, 1.1],
    [162, 32, 0.6, 0.2],
    [170, 27, 0.7, 0.8],
    [180, 24, 0.5, 0.4],
  ];

  return (
    <Frame sky={['#fdf3e6', '#f7dcc6']}>
      <defs>
        <radialGradient id='twg_dawn' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff4dc' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff4dc' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* dawn glow on the horizon the flock climbs toward */}
      <circle cx='190' cy='16' r='42' fill='url(#twg_dawn)' />

      <Twinkle x={36} y={20} c='#cf9836' />
      <Twinkle x={176} y={48} d={0.9} c='#e0a83f' />
      <Twinkle x={108} y={16} d={1.4} c='#cf9836' r={0.9} />
      <Cloud x={52} y={30} s={0.8} o={0.4} />
      <Cloud x={140} y={20} s={0.6} o={0.3} />

      {/* far hill for depth */}
      <Ink
        d={gen.path(
          'M0 88 Q70 80 200 86 L200 100 L0 100 Z',
          filled(101, '#eac7a0', { roughness: 1.5, hachureGap: 3.6 })
        )}
      />

      {/* the rising migration arc — the growth curve, faintly dashed */}
      <motion.path
        d={ARC}
        fill='none'
        stroke='#d99a3f'
        strokeWidth='1.4'
        opacity='0.55'
        strokeDasharray='2 7'
        animate={{ strokeDashoffset: [0, -18] }}
        transition={linear(1.8)}
      />

      {/* the expanding flock */}
      {flock.map(([fx, fy, fs, fp], i) => (
        <Bird
          key={fx}
          x={fx}
          y={fy}
          s={fs}
          seed={110 + i}
          ph={fp}
          c={i > 6 ? '#5a86c5' : INK}
        />
      ))}

      {/* bare branch the lone bird sits on, lower-left */}
      <Ink
        d={gen.path(
          'M2 86 Q18 80 34 78 M22 79 Q26 74 31 72 M28 78 Q34 75 40 76',
          stroke(140, { stroke: '#8a6f54', strokeWidth: 1.4, roughness: 1.4 })
        )}
      />

      {/* the focal subject: one small songbird, the single voice */}
      <motion.g
        animate={{ y: [0, -1, 0], rotate: [0, -2, 0] }}
        transition={loop(2.4)}
        style={{ transformOrigin: '34px 72px' }}
      >
        {/* body */}
        <Ink
          d={gen.path(
            'M30 74 Q30 68 35 68 Q40 68 41 73 Q38 76 33 76 Z',
            filled(141, '#6a9bcc', { fillStyle: 'solid', strokeWidth: 1.1 })
          )}
        />
        {/* wing */}
        <Ink
          d={gen.path(
            'M34 70 Q38 69 40 72 Q37 73 34 72 Z',
            filled(142, '#5a86c5', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
        {/* tail */}
        <Ink
          d={gen.line(
            30,
            74,
            25,
            77,
            stroke(143, { stroke: '#5a86c5', strokeWidth: 1.3 })
          )}
        />
        {/* beak */}
        <Ink
          d={gen.line(
            41,
            71,
            45,
            70.5,
            stroke(144, { stroke: '#e0a83f', strokeWidth: 1.2 })
          )}
        />
        {/* legs */}
        <Ink
          d={gen.path(
            'M34 76 L34 80 M37 76 L37.6 80',
            stroke(145, { strokeWidth: 1 })
          )}
        />
        {/* a small song-note rising, hint of the message going out */}
        <motion.g
          animate={{ y: [0, -6], opacity: [0, 0.8, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut' }}
          style={{ transformOrigin: '47px 66px' }}
        >
          <Ink
            d={gen.circle(
              47,
              66,
              2.2,
              filled(146, '#e2693f', { fillStyle: 'solid', strokeWidth: 0.9 })
            )}
          />
        </motion.g>
      </motion.g>
    </Frame>
  );
}

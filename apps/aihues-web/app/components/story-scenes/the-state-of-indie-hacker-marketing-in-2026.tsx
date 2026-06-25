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

/* "The State of Indie Hacker Marketing in 2026" (Growth) — three channels,
   one launch. A low evening ridge carries three slender signal-masts of
   different heights — HN gold, Reddit terracotta, Twitter slate-blue — each
   broadcasting outward dashed wave-arcs that converge on a single rising gold
   spark above the horizon. The solo founder's one signal, amplified across
   Hacker News, Reddit and Twitter. Seed range: 300–360. */

export default function Scene() {
  const masts = [
    { x: 58, base: 78, top: 50, c: '#cf9836', seed: 320, ph: 0 }, // HN gold
    { x: 100, base: 80, top: 44, c: '#c2502e', seed: 330, ph: 0.7 }, // Reddit terracotta
    { x: 142, base: 78, top: 52, c: '#5a86c5', seed: 340, ph: 1.4 }, // Twitter slate-blue
  ];
  const spark = { x: 100, y: 26 };

  return (
    <Frame sky={['#fdf3e2', '#f4d9bf']}>
      <defs>
        <radialGradient id='ihm26_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff2d2' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff2d2' stopOpacity='0' />
        </radialGradient>
      </defs>

      <Twinkle x={30} y={20} c='#cf9836' />
      <Twinkle x={172} y={24} d={0.8} c='#e0a83f' />
      <Twinkle x={150} y={14} d={1.3} c='#cf9836' />
      <Cloud x={44} y={30} s={0.8} o={0.4} />
      <Cloud x={158} y={40} s={0.6} o={0.3} />

      {/* distant ridge */}
      <Ink
        d={gen.path(
          'M0 82 Q52 72 100 78 T200 76 L200 100 L0 100 Z',
          filled(301, '#e6c79b', { roughness: 1.6, hachureGap: 3.6 })
        )}
      />
      {/* nearer ridge for depth */}
      <Ink
        d={gen.path(
          'M0 90 Q70 84 134 88 T200 90 L200 100 L0 100 Z',
          filled(302, '#d9b285', { roughness: 1.5, hachureGap: 3 })
        )}
      />

      {/* glow behind the rising spark */}
      <circle cx={spark.x} cy={spark.y} r='26' fill='url(#ihm26_glow)' />

      {/* the three signal-masts, each with its own broadcast arcs */}
      {masts.map((m) => {
        const lo = m.c;
        return (
          <g key={m.seed}>
            {/* broadcast arcs rippling upward toward the spark */}
            {[0, 1, 2].map((k) => {
              const r = 9 + k * 6;
              const ay = m.top - 2;
              return (
                <motion.path
                  key={k}
                  d={`M ${m.x - r} ${ay} A ${r} ${r * 0.7} 0 0 1 ${m.x + r} ${ay}`}
                  fill='none'
                  stroke={lo}
                  strokeWidth='1.2'
                  strokeDasharray='2 4'
                  animate={{ opacity: [0, 0.7, 0], strokeDashoffset: [0, -10] }}
                  transition={{
                    duration: 2.6,
                    repeat: Infinity,
                    ease: 'easeOut',
                    delay: m.ph + k * 0.45,
                  }}
                />
              );
            })}
            {/* mast pole */}
            <Ink
              d={gen.line(
                m.x,
                m.base,
                m.x,
                m.top,
                stroke(m.seed, { stroke: INK, strokeWidth: 1.3 })
              )}
            />
            {/* small base anchor */}
            <Ink
              d={gen.line(
                m.x - 4,
                m.base,
                m.x + 4,
                m.base,
                stroke(m.seed + 1, { strokeWidth: 1.2 })
              )}
            />
            {/* channel beacon lamp at the tip */}
            <motion.g
              animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.7, 1, 0.7] }}
              transition={loop(2.2, m.ph)}
              style={{ transformOrigin: `${m.x}px ${m.top}px` }}
            >
              <Ink
                d={gen.circle(
                  m.x,
                  m.top,
                  5,
                  filled(m.seed + 2, lo, {
                    fillStyle: 'solid',
                    strokeWidth: 1.1,
                  })
                )}
              />
            </motion.g>
          </g>
        );
      })}

      {/* faint converging signal lines from each mast to the rising spark */}
      {masts.map((m) => (
        <motion.line
          key={`c${m.seed}`}
          x1={m.x}
          y1={m.top - 4}
          x2={spark.x}
          y2={spark.y + 4}
          stroke={m.c}
          strokeWidth='0.8'
          strokeDasharray='1.5 5'
          opacity='0.5'
          animate={{ strokeDashoffset: [0, -13] }}
          transition={linear(2 + m.ph)}
        />
      ))}

      {/* the single rising launch-spark the three channels converge on */}
      <motion.g
        animate={{ y: [0, -2.5, 0], scale: [0.94, 1.08, 0.94] }}
        transition={loop(2.8)}
        style={{ transformOrigin: `${spark.x}px ${spark.y}px` }}
      >
        <Ink
          d={gen.polygon(
            [
              [spark.x, spark.y - 8],
              [spark.x + 2.4, spark.y - 2.6],
              [spark.x + 8, spark.y - 1.8],
              [spark.x + 3.6, spark.y + 2.2],
              [spark.x + 4.6, spark.y + 8],
              [spark.x, spark.y + 4.8],
              [spark.x - 4.6, spark.y + 8],
              [spark.x - 3.6, spark.y + 2.2],
              [spark.x - 8, spark.y - 1.8],
              [spark.x - 2.4, spark.y - 2.6],
            ],
            filled(351, '#f0b449', { fillStyle: 'solid', strokeWidth: 1.1 })
          )}
        />
      </motion.g>
    </Frame>
  );
}

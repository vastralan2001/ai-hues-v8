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

/* Metaphor — "the one that finally stuck for me": a developer tries many
   note apps (loose pages drifting off on the wind) until one takes root.
   A single open notebook sits anchored on a small sage knoll, roots
   threading down into it, softly aglow — while the other pages blow away. */

export default function Scene() {
  return (
    <Frame sky={['#fbf3e6', '#ecdcc1']}>
      <defs>
        <radialGradient id='dnotes_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff3d6' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff3d6' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* sky accents + a drifting cloud for depth */}
      <Twinkle x={30} y={22} c='#cf9836' />
      <Twinkle x={176} y={28} d={0.9} c='#e0a83f' />
      <Cloud x={52} y={24} s={0.8} o={0.4} />

      {/* far hills — soft layered horizon */}
      <Ink
        d={gen.path(
          'M0 78 Q56 70 110 76 T200 72 L200 100 L0 100 Z',
          filled(201, '#cdd7b9', {
            hachureGap: 4,
            fillWeight: 0.6,
            roughness: 1.5,
          })
        )}
      />
      <Ink
        d={gen.path(
          'M0 86 Q70 80 132 85 T200 82 L200 100 L0 100 Z',
          filled(202, '#aebf95', { hachureGap: 3.4, roughness: 1.4 })
        )}
      />

      {/* the loose pages that drift away — the apps that never stuck */}
      <DriftPage x={36} y={50} rot={-18} dur={5} delay={0} seed={210} />
      <DriftPage x={60} y={34} rot={14} dur={6.2} delay={1.1} seed={213} />
      <DriftPage x={170} y={56} rot={22} dur={5.6} delay={0.5} seed={216} />

      {/* focal glow behind the anchored notebook */}
      <circle cx='104' cy='62' r='30' fill='url(#dnotes_glow)' />

      {/* the small sage knoll the notebook is rooted into */}
      <Ink
        d={gen.path(
          'M70 90 Q104 74 140 90 Z',
          filled(220, '#94ac78', { hachureGap: 3, roughness: 1.3 })
        )}
      />

      {/* roots threading down from the notebook into the knoll */}
      <Ink
        d={gen.path(
          'M100 78 Q97 84 93 88 M104 78 L104 90 M108 78 Q112 84 116 87',
          stroke(221, { stroke: '#788c5d', strokeWidth: 1.2, roughness: 1.5 })
        )}
      />

      {/* the one that stuck — an open notebook, gently breathing */}
      <motion.g
        animate={{ y: [0, -1.6, 0] }}
        transition={loop(2.8)}
        style={{ transformOrigin: '104px 66px' }}
      >
        <g opacity='0.1'>
          <Ink
            d={gen.ellipse(104, 80, 36, 6.8, {
              fill: INK,
              fillStyle: 'solid',
              stroke: 'none',
              roughness: 1.2,
              seed: 228,
            })}
          />
        </g>
        {/* left leaf */}
        <Ink
          d={gen.polygon(
            [
              [104, 60],
              [104, 76],
              [88, 73],
              [89, 58],
            ],
            filled(222, '#fbf6ec', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        {/* right leaf */}
        <Ink
          d={gen.polygon(
            [
              [104, 60],
              [104, 76],
              [120, 73],
              [119, 58],
            ],
            filled(223, '#ffffff', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        {/* spine */}
        <Ink
          d={gen.line(104, 60, 104, 76, stroke(224, { strokeWidth: 1.3 }))}
        />
        {/* ruled note lines (code/notes) */}
        <Ink
          d={gen.path(
            'M92 63 L101 63 M92 66 L101 66 M92 69 L99 69',
            stroke(225, { stroke: '#788c5d', strokeWidth: 0.9, roughness: 0.9 })
          )}
        />
        <Ink
          d={gen.path(
            'M107 63 L116 63 M107 66 L116 66 M107 69 L114 69',
            stroke(226, { stroke: '#6a9bcc', strokeWidth: 0.9, roughness: 0.9 })
          )}
        />
        {/* a checkmark — the keeper, the one that worked */}
        <motion.g
          animate={{ scale: [0.9, 1.12, 0.9] }}
          transition={loop(2.2)}
          style={{ transformOrigin: '104px 52px' }}
        >
          <Ink
            d={gen.path(
              'M100.5 52 L103 54.5 L108 49',
              stroke(227, {
                stroke: '#c2502e',
                strokeWidth: 1.6,
                roughness: 0.8,
              })
            )}
          />
        </motion.g>
      </motion.g>

      {/* sparks of recognition rising from the kept notebook */}
      {(
        [
          [96, 44, 0, 230],
          [112, 46, 0.8, 231],
          [104, 40, 1.5, 232],
        ] as [number, number, number, number][]
      ).map(([sx, sy, d, sd]) => (
        <motion.g
          key={sx}
          animate={{ y: [0, -8], opacity: [0, 0.85, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeOut',
            delay: d,
          }}
        >
          <Ink
            d={gen.circle(sx, sy, 2.2, {
              fill: '#e0a83f',
              fillStyle: 'solid',
              stroke: 'none',
              roughness: 1.1,
              seed: sd,
            })}
          />
        </motion.g>
      ))}
    </Frame>
  );
}

/* A loose page tumbling away on the wind — an app that didn't stick. */
function DriftPage({
  x,
  y,
  rot,
  dur,
  delay,
  seed,
}: {
  x: number;
  y: number;
  rot: number;
  dur: number;
  delay: number;
  seed: number;
}) {
  return (
    <motion.g
      animate={{ x: [0, 10, 4], y: [0, -6, -2], rotate: [rot, rot + 16, rot] }}
      transition={loop(dur, delay)}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      <g transform={`rotate(${rot} ${x} ${y})`}>
        <Ink
          d={gen.rectangle(
            x - 6,
            y - 8,
            12,
            16,
            filled(seed, '#f6efe1', {
              fillStyle: 'solid',
              strokeWidth: 1,
              roughness: 1.4,
            })
          )}
        />
        <Ink
          d={gen.line(
            x - 3,
            y - 4,
            x + 3,
            y - 4,
            stroke(seed + 1, {
              stroke: '#b9a98c',
              strokeWidth: 0.8,
              roughness: 1,
            })
          )}
        />
        <Ink
          d={gen.line(
            x - 3,
            y,
            x + 2,
            y,
            stroke(seed + 2, {
              stroke: '#b9a98c',
              strokeWidth: 0.8,
              roughness: 1,
            })
          )}
        />
      </g>
    </motion.g>
  );
}

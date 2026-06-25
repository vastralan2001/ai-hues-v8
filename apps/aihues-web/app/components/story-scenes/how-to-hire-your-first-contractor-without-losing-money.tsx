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

/* Metaphor: building a rope bridge across a ravine toward a lone figure on the
   far cliff. The near cliff is "you", the chasm below is the money at risk, and
   the span being laid plank by plank is finding/vetting/managing a remote
   contractor you've never met — reaching the far side without falling in. */

export default function Scene() {
  const span = 'M44 56 Q100 49 162 50';
  const plank = (x: number) => {
    const t = (x - 44) / 118;
    const dip = 56 - 7 * Math.sin(Math.PI * t) - 1 * t;
    return { x, top: dip - 3.4, bot: dip + 3.4 };
  };
  const planks = [54, 66, 78, 90, 102, 114, 126, 138, 150];
  return (
    <Frame sky={['#f6efe0', '#e7d8bd']}>
      <defs>
        <radialGradient id='hire_sun' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff5df' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff5df' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='hire_chasm' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#d9c7a6' stopOpacity='0.7' />
          <stop offset='100%' stopColor='#c4ad84' stopOpacity='0' />
        </linearGradient>
      </defs>

      {/* sky depth */}
      <circle cx='100' cy='26' r='40' fill='url(#hire_sun)' />
      <Cloud x={150} y={24} s={0.8} o={0.4} />
      <Cloud x={44} y={34} s={0.6} o={0.3} />
      <Twinkle x={30} y={20} c='#cf9836' />
      <Twinkle x={172} y={18} d={0.8} c='#e0a83f' />
      <Twinkle x={120} y={14} d={1.3} c='#cf9836' r={1} />

      {/* the chasm haze rising from below */}
      <rect x='44' y='58' width='118' height='42' fill='url(#hire_chasm)' />

      {/* far cliff (right) — the contractor's side, lighter/distant */}
      <Ink
        d={gen.path(
          'M162 50 L200 46 L200 100 L162 100 Z',
          filled(301, '#c9b78f', { hachureGap: 3.4, fillWeight: 0.6 })
        )}
      />
      <Ink d={gen.line(162, 50, 200, 46, stroke(302, { strokeWidth: 1.2 }))} />

      {/* near cliff (left) — "you", heavier sage */}
      <Ink
        d={gen.path(
          'M0 54 L44 56 L44 100 L0 100 Z',
          filled(303, '#94ac78', { hachureGap: 3 })
        )}
      />
      <Ink d={gen.line(0, 54, 44, 56, stroke(304, { strokeWidth: 1.2 }))} />

      {/* anchor posts at each cliff edge */}
      <Ink d={gen.line(44, 56, 44, 47, stroke(305, { strokeWidth: 1.4 }))} />
      <Ink d={gen.line(162, 50, 162, 41, stroke(306, { strokeWidth: 1.4 }))} />

      {/* the bridge sways gently as a whole */}
      <motion.g
        animate={{ rotate: [-0.6, 0.6, -0.6] }}
        transition={loop(3.2)}
        style={{ transformOrigin: '100px 50px' }}
      >
        {/* upper guide rope */}
        <Ink
          d={gen.path(
            'M44 47 Q100 42 162 41',
            stroke(307, { stroke: '#9b6a3c', strokeWidth: 1.2, roughness: 1 })
          )}
        />
        {/* lower deck rope (the span) */}
        <Ink
          d={gen.path(
            span,
            stroke(308, { stroke: '#9b6a3c', strokeWidth: 1.3, roughness: 1 })
          )}
        />
        {/* planks + vertical ties */}
        {planks.map((px, i) => {
          const p = plank(px);
          const guideY = 47 - 5 * Math.sin(Math.PI * ((px - 44) / 118));
          return (
            <g key={px}>
              <Ink
                d={gen.line(
                  p.x,
                  guideY,
                  p.x,
                  p.top,
                  stroke(320 + i, {
                    stroke: '#9b6a3c',
                    strokeWidth: 0.8,
                    roughness: 0.9,
                  })
                )}
              />
              <Ink
                d={gen.line(
                  p.x,
                  p.top,
                  p.x,
                  p.bot,
                  filled(340 + i, '#cf9836', {
                    fillStyle: 'solid',
                    stroke: '#9b6a3c',
                    strokeWidth: 1.4,
                    roughness: 0.8,
                  })
                )}
              />
            </g>
          );
        })}
      </motion.g>

      {/* a single coin slipping into the void — the money at stake */}
      <motion.g
        animate={{ y: [0, 30], opacity: [0, 0.8, 0] }}
        transition={{
          duration: 3.4,
          repeat: Infinity,
          ease: 'easeIn',
          delay: 1.2,
        }}
      >
        <Ink
          d={gen.circle(
            100,
            58,
            6,
            filled(360, '#e0a83f', { fillStyle: 'solid', strokeWidth: 1.1 })
          )}
        />
        <text
          x='100'
          y='60.6'
          textAnchor='middle'
          fontSize='5'
          fontWeight='800'
          fill={INK}
        >
          $
        </text>
      </motion.g>

      {/* the lone contractor waiting on the far cliff */}
      <motion.g
        animate={{ y: [0, -1.3, 0] }}
        transition={loop(2.4)}
        style={{ transformOrigin: '180px 40px' }}
      >
        <Ink
          d={gen.circle(
            180,
            38,
            4.6,
            filled(361, '#c2502e', { fillStyle: 'solid' })
          )}
        />
        <Ink
          d={gen.path(
            'M180 40 L180 45 M180 41.5 L176.8 43.4 M180 41.5 L183.2 42.6 M180 45 L177 48.6 M180 45 L183 48.6',
            stroke(362, { strokeWidth: 1.3 })
          )}
        />
      </motion.g>

      {/* a small flag on the far post — the goal: a working hire */}
      <motion.g
        animate={{ skewX: [0, 8, 0] }}
        transition={loop(1.7)}
        style={{ transformOrigin: '162px 41px' }}
      >
        <Ink
          d={gen.path(
            'M162 41 Q170 43 176 40 Q170 46 176 49 Q169 47 162 50 Z',
            filled(363, '#788c5d', { fillStyle: 'solid' })
          )}
        />
      </motion.g>
    </Frame>
  );
}

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

/* Metaphor — "soft launch": one small sapling rooting and growing patiently on
   solid ground (the gradual approach that endures), while a single firework
   bursts and fades in the dusk above it (the spectacular "big bang" that flares
   bright, then dissipates). The lasting subject is grounded and quiet; the
   spectacle is transient. Seed range for this file: 300–360. */

export default function Scene() {
  const burst = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <Frame sky={['#fbeede', '#efd6c0']}>
      <defs>
        <radialGradient id='soft_dusk' cx='50%' cy='42%' r='52%'>
          <stop offset='0%' stopColor='#fff3df' stopOpacity='0.85' />
          <stop offset='100%' stopColor='#fff3df' stopOpacity='0' />
        </radialGradient>
        <radialGradient id='soft_spark' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fbe4c4' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#fbe4c4' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* dusk glow + faint depth */}
      <circle cx='100' cy='40' r='58' fill='url(#soft_dusk)' />
      <Cloud x={42} y={24} s={0.8} o={0.4} />
      <Cloud x={158} y={34} s={0.7} o={0.32} />
      <Twinkle x={24} y={30} c='#cf9836' />
      <Twinkle x={182} y={22} d={0.7} c='#e0a83f' />
      <Twinkle x={66} y={16} d={1.2} c='#cf9836' r={1} />

      {/* the firework: a bright burst that flares then fades — the "big bang" */}
      <motion.g
        animate={{ opacity: [0, 1, 0.85, 0] }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: 'easeOut',
          times: [0, 0.12, 0.4, 1],
        }}
        style={{ transformOrigin: '142px 30px' }}
      >
        <circle cx='142' cy='30' r='16' fill='url(#soft_spark)' />
        <motion.g
          animate={{ scale: [0.2, 1.1] }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            ease: 'easeOut',
            times: [0, 0.4],
          }}
          style={{ transformOrigin: '142px 30px' }}
        >
          {burst.map((i) => {
            const a = (Math.PI / 4) * i;
            const r1 = 4;
            const r2 = 13;
            const x1 = 142 + Math.cos(a) * r1;
            const y1 = 30 + Math.sin(a) * r1;
            const x2 = 142 + Math.cos(a) * r2;
            const y2 = 30 + Math.sin(a) * r2;
            return (
              <Ink
                key={i}
                d={gen.line(
                  x1,
                  y1,
                  x2,
                  y2,
                  stroke(300 + i, {
                    stroke: '#e2693f',
                    strokeWidth: 1,
                    roughness: 0.9,
                  })
                )}
              />
            );
          })}
          {burst.map((i) => {
            const a = (Math.PI / 4) * i + Math.PI / 8;
            const x = 142 + Math.cos(a) * 13;
            const y = 30 + Math.sin(a) * 13;
            return (
              <Ink
                key={`d${i}`}
                d={gen.circle(
                  x,
                  y,
                  2,
                  filled(320 + i, '#e0a83f', { fillStyle: 'solid' })
                )}
              />
            );
          })}
        </motion.g>
      </motion.g>

      {/* a single falling ember — the spectacle dissipating */}
      <motion.circle
        cx='142'
        cy='38'
        r='1.1'
        fill='#e2693f'
        animate={{ y: [0, 18], opacity: [0, 0.7, 0] }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: 'easeIn',
          delay: 0.6,
        }}
      />

      {/* solid ground */}
      <Ink
        d={gen.path(
          'M0 82 Q100 76 200 82 L200 100 L0 100 Z',
          filled(340, '#cf9836', {
            roughness: 1.5,
            hachureGap: 3.6,
            fillWeight: 0.6,
          })
        )}
      />
      <Ink
        d={gen.path(
          'M0 90 Q100 86 200 90 L200 100 L0 100 Z',
          filled(341, '#788c5d', { roughness: 1.5, hachureGap: 3.2 })
        )}
      />

      {/* roots beneath — patient, unseen foundation */}
      <Ink
        d={gen.path(
          'M58 84 L60 90 M58 84 L54 89 M58 84 L57 92 M58 84 L62 91',
          stroke(342, { stroke: '#94795a', strokeWidth: 1, roughness: 1.4 })
        )}
      />

      {/* the sapling: grounded, growing — the soft launch that endures */}
      <motion.g
        animate={{ rotate: [-2, 2, -2] }}
        transition={loop(3)}
        style={{ transformOrigin: '58px 84px' }}
      >
        <Ink
          d={gen.path(
            'M58 84 Q57 74 58.5 64',
            stroke(343, { stroke: '#6f8a4f', strokeWidth: 1.6, roughness: 1 })
          )}
        />
        <Ink
          d={gen.path(
            'M58 74 Q52 70 49 73',
            stroke(344, { stroke: '#6f8a4f', strokeWidth: 1.2 })
          )}
        />
        <Ink
          d={gen.path(
            'M58.2 69 Q64 65 67 68',
            stroke(345, { stroke: '#6f8a4f', strokeWidth: 1.2 })
          )}
        />
        <motion.g
          animate={{ scale: [0.96, 1.04, 0.96] }}
          transition={loop(2.6)}
          style={{ transformOrigin: '58.5px 62px' }}
        >
          <Ink
            d={gen.ellipse(
              50,
              72,
              11,
              6,
              filled(346, '#94ac78', { hachureGap: 2.2 })
            )}
          />
          <Ink
            d={gen.ellipse(
              67,
              67,
              11,
              6,
              filled(347, '#94ac78', { hachureGap: 2.2 })
            )}
          />
          <Ink
            d={gen.ellipse(
              58.5,
              60,
              9,
              12,
              filled(348, '#788c5d', { hachureGap: 2.4 })
            )}
          />
        </motion.g>
      </motion.g>

      {/* slow drifting motes near the sapling — quiet, steady life */}
      {[
        [40, 56, 0],
        [78, 50, 1.1],
        [50, 44, 0.6],
      ].map(([mx, my, d]) => (
        <motion.circle
          key={mx}
          cx={mx}
          cy={my}
          r='0.9'
          fill='#94ac78'
          opacity='0.6'
          animate={{ y: [0, -8, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={loop(3.4, d)}
        />
      ))}
    </Frame>
  );
}

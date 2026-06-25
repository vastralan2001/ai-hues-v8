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
  motion,
} from './_kit';

export default function Scene() {
  return (
    <Frame sky={['#fcf3e2', '#efdcc6']}>
      <defs>
        <radialGradient id='kolm_signal' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff3da' stopOpacity='0.85' />
          <stop offset='100%' stopColor='#fff3da' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='kolm_hill' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#a7bd86' />
          <stop offset='100%' stopColor='#869b66' />
        </linearGradient>
      </defs>

      <Cloud x={42} y={22} s={0.7} o={0.4} />

      {/* far ridge for depth */}
      <Ink
        d={gen.path(
          'M0 80 Q56 70 110 76 T200 72 L200 100 L0 100 Z',
          filled(401, '#d7e0c7', {
            hachureGap: 4,
            fillWeight: 0.55,
            roughness: 1.5,
          })
        )}
      />
      {/* near hill the beacon stands on */}
      <Ink
        d={gen.path(
          'M0 92 Q40 80 86 84 T200 86 L200 100 L0 100 Z',
          filled(402, 'url(#kolm_hill)', { fillStyle: 'solid', roughness: 1.4 })
        )}
      />

      {/* signal glow behind the beacon tip */}
      <circle cx='86' cy='48' r='30' fill='url(#kolm_signal)' />

      {/* concentric signal rings radiating outward — the indie dev's small reach */}
      {[
        { rx: 18, ry: 7, seed: 410, dur: 3.2, delay: 0 },
        { rx: 32, ry: 12, seed: 411, dur: 3.2, delay: 0.7 },
        { rx: 48, ry: 18, seed: 412, dur: 3.2, delay: 1.4 },
      ].map((r) => (
        <motion.g
          key={r.seed}
          animate={{ scale: [0.6, 1.05, 0.6], opacity: [0, 0.7, 0] }}
          transition={loop(r.dur, r.delay)}
          style={{ transformOrigin: '86px 48px' }}
        >
          <Ink
            d={gen.ellipse(
              86,
              48,
              r.rx * 2,
              r.ry * 2,
              stroke(r.seed, {
                stroke: '#cf9836',
                strokeWidth: 1,
                roughness: 1,
                bowing: 0.8,
              })
            )}
          />
        </motion.g>
      ))}

      {/* the small beacon: a slender tower with a glowing tip — the indie founder's signal */}
      <motion.g
        animate={{ y: [0, -1.2, 0] }}
        transition={loop(2.6)}
        style={{ transformOrigin: '86px 64px' }}
      >
        <Ink
          d={gen.polygon(
            [
              [82, 84],
              [90, 84],
              [88, 52],
              [84, 52],
            ],
            filled(420, '#e2693f', { fillStyle: 'solid', strokeWidth: 1.2 })
          )}
        />
        <Ink
          d={gen.line(83.4, 73, 88.6, 73, stroke(421, { strokeWidth: 1 }))}
        />
        <Ink d={gen.line(83, 64, 89, 64, stroke(422, { strokeWidth: 1 }))} />
        <motion.g
          animate={{ scale: [0.9, 1.18, 0.9], opacity: [0.85, 1, 0.85] }}
          transition={loop(1.8)}
          style={{ transformOrigin: '86px 49px' }}
        >
          <Ink
            d={gen.circle(
              86,
              49,
              7,
              filled(423, '#f0b449', { fillStyle: 'solid' })
            )}
          />
        </motion.g>
      </motion.g>

      {/* small far voices (micro-influencers) lit by the signal, off to the right */}
      <motion.g
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={loop(3.2, 1.4)}
        style={{ transformOrigin: '142px 40px' }}
      >
        <Ink
          d={gen.polygon(
            [
              [142, 35],
              [143.5, 39],
              [147.6, 39.4],
              [144.5, 42],
              [145.4, 46],
              [142, 43.7],
              [138.6, 46],
              [139.5, 42],
              [136.4, 39.4],
              [140.5, 39],
            ],
            filled(430, '#94ac78', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
      </motion.g>
      <motion.g
        animate={{ opacity: [0.25, 0.9, 0.25] }}
        transition={loop(3.2, 0.7)}
        style={{ transformOrigin: '124px 56px' }}
      >
        <Ink
          d={gen.polygon(
            [
              [124, 52],
              [125.2, 55],
              [128.4, 55.3],
              [126, 57.3],
              [126.7, 60.4],
              [124, 58.6],
              [121.3, 60.4],
              [122, 57.3],
              [119.6, 55.3],
              [122.8, 55],
            ],
            filled(431, '#788c5d', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
      </motion.g>

      <Twinkle x={166} y={26} d={0.4} c='#cf9836' r={1.2} />
      <Twinkle x={36} y={50} d={0.9} c='#cf9836' r={1} />
    </Frame>
  );
}

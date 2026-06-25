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

/* Metaphor — "automation runs the routine, judgment stays human": a pair of
   self-turning automation gears churn away on their own (the 4-hour-workweek
   promise of work that runs itself), while the one thing the whole machine
   still waits on is a small hand-set balance scale out front — the deliberate
   human call the gears can never make. */

function gearTeeth(cx: number, cy: number, r: number, n: number, h: number) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const a2 = ((i + 0.5) / n) * Math.PI * 2;
    const xo = cx + Math.cos(a) * (r + h);
    const yo = cy + Math.sin(a) * (r + h);
    const xi = cx + Math.cos(a2) * r;
    const yi = cy + Math.sin(a2) * r;
    d += `${i === 0 ? 'M' : 'L'}${xo.toFixed(2)} ${yo.toFixed(2)} L${xi.toFixed(2)} ${yi.toFixed(2)} `;
  }
  return d + 'Z';
}

export default function Scene() {
  return (
    <Frame sky={['#fdf3e2', '#f4d9b6']}>
      <defs>
        <radialGradient id='hww_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff3da' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff3da' stopOpacity='0' />
        </radialGradient>
      </defs>

      <circle cx='150' cy='30' r='44' fill='url(#hww_glow)' />
      <Twinkle x={42} y={22} c='#cf9836' />
      <Twinkle x={176} y={48} d={0.8} c='#e0a83f' />
      <Cloud x={52} y={24} s={0.78} o={0.4} />

      {/* distant horizon + soft ground for depth */}
      <Ink
        d={gen.path(
          'M0 84 Q100 78 200 84 L200 100 L0 100 Z',
          filled(301, '#ecca97', { roughness: 1.6, hachureGap: 3.6 })
        )}
      />

      {/* ghosted large automation gear, slow churn behind everything */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={linear(26)}
        style={{ transformOrigin: '150px 64px', opacity: 0.4 }}
      >
        <Ink
          d={gen.path(
            gearTeeth(150, 64, 22, 12, 4),
            stroke(302, { stroke: '#cf9836', strokeWidth: 1, roughness: 1 })
          )}
        />
      </motion.g>

      {/* — automation gear train: two interlocking gears turning on their own — */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={linear(11)}
        style={{ transformOrigin: '66px 50px' }}
      >
        <Ink
          d={gen.path(
            gearTeeth(66, 50, 15, 10, 3.4),
            filled(303, '#94ac78', {
              fillStyle: 'solid',
              strokeWidth: 1.2,
              roughness: 1,
            })
          )}
        />
        <Ink
          d={gen.circle(
            66,
            50,
            12,
            filled(304, '#dfead4', { fillStyle: 'solid' })
          )}
        />
        <Ink d={gen.circle(66, 50, 4, stroke(305, { strokeWidth: 1 }))} />
      </motion.g>

      <motion.g
        animate={{ rotate: -360 }}
        transition={linear(8)}
        style={{ transformOrigin: '93px 56px' }}
      >
        <Ink
          d={gen.path(
            gearTeeth(93, 56, 10, 8, 3),
            filled(306, '#788c5d', {
              fillStyle: 'solid',
              strokeWidth: 1.2,
              roughness: 1,
            })
          )}
        />
        <Ink
          d={gen.circle(
            93,
            56,
            7.5,
            filled(307, '#dfead4', { fillStyle: 'solid' })
          )}
        />
        <Ink d={gen.circle(93, 56, 3, stroke(308, { strokeWidth: 1 }))} />
      </motion.g>

      {/* — the human call: a small hand-set balance scale, gently weighing — */}
      <Ink d={gen.line(150, 92, 150, 60, stroke(309, { strokeWidth: 1.4 }))} />
      <Ink
        d={gen.circle(
          150,
          60,
          3,
          filled(310, '#e0a83f', { fillStyle: 'solid' })
        )}
      />
      <motion.g
        animate={{ rotate: [-7, 6, -7] }}
        transition={loop(3.2)}
        style={{ transformOrigin: '150px 60px' }}
      >
        <Ink
          d={gen.line(133, 60, 167, 60, stroke(311, { strokeWidth: 1.3 }))}
        />
        {/* left pan — heavier, deliberate weight */}
        <Ink
          d={gen.line(133, 60, 133, 68, stroke(312, { strokeWidth: 0.9 }))}
        />
        <Ink
          d={gen.path(
            'M127 68 Q133 75 139 68 Z',
            filled(313, '#c2502e', { fillStyle: 'solid', strokeWidth: 1.1 })
          )}
        />
        {/* right pan — the routine, lighter */}
        <Ink
          d={gen.line(167, 60, 167, 66, stroke(314, { strokeWidth: 0.9 }))}
        />
        <Ink
          d={gen.path(
            'M162 66 Q167 72 172 66 Z',
            filled(315, '#e2693f', { fillStyle: 'solid', strokeWidth: 1.1 })
          )}
        />
      </motion.g>

      {/* a single bright judgment spark over the scale's pivot */}
      <motion.g
        animate={{ scale: [0.8, 1.15, 0.8], opacity: [0.6, 1, 0.6] }}
        transition={loop(2.4)}
        style={{ transformOrigin: '150px 50px' }}
      >
        <Ink
          d={gen.polygon(
            [
              [150, 44],
              [152, 49],
              [157, 50],
              [152, 51],
              [150, 56],
              [148, 51],
              [143, 50],
              [148, 49],
            ],
            filled(316, '#f0b449', { fillStyle: 'solid' })
          )}
        />
      </motion.g>
    </Frame>
  );
}

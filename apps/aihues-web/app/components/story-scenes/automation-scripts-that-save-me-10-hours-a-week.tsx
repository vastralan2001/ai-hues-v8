'use client';
import {
  Frame,
  Ink,
  RoughDash,
  gen,
  filled,
  stroke,
  linear,
  motion,
} from './_kit';

/* "Automation Scripts That Save Me 10 Hours a Week" — a small clockwork of
   coupled gears turning on its own in a quiet night workshop, a dashed "script"
   belt threading through them. The machinery keeps working hands-free while the
   maker is away (the moon, the empty bench): each gear = a recurring automated
   job; the flowing belt = the script pipeline; the freed hours drift up as
   sparks. Seeds 200+, gradient ids prefixed auto10_. */

function Gear({
  cx,
  cy,
  r,
  teeth,
  color,
  seed,
  dur,
  dir,
}: {
  cx: number;
  cy: number;
  r: number;
  teeth: number;
  color: string;
  seed: number;
  dur: number;
  dir: number;
}) {
  const tooth = r * 0.26;
  const lines: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * Math.PI * 2;
    const x1 = cx + Math.cos(a) * r;
    const y1 = cy + Math.sin(a) * r;
    const x2 = cx + Math.cos(a) * (r + tooth);
    const y2 = cy + Math.sin(a) * (r + tooth);
    lines.push(
      `M${x1.toFixed(2)} ${y1.toFixed(2)} L${x2.toFixed(2)} ${y2.toFixed(2)}`
    );
  }
  return (
    <motion.g
      animate={{ rotate: 360 * dir }}
      transition={linear(dur)}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      <Ink
        d={gen.path(
          lines.join(' '),
          stroke(seed, { stroke: color, strokeWidth: 1.4 })
        )}
      />
      <Ink
        d={gen.circle(
          cx,
          cy,
          r * 2,
          filled(seed + 1, color, { fillStyle: 'solid', strokeWidth: 1.2 })
        )}
      />
      <Ink
        d={gen.circle(
          cx,
          cy,
          r * 0.7,
          filled(seed + 2, '#fbf6ea', { fillStyle: 'solid', strokeWidth: 1 })
        )}
      />
    </motion.g>
  );
}

export default function Scene() {
  // belt threading through the three gears
  const belt =
    'M70 56 Q86 30 112 40 Q140 50 150 60 Q120 78 96 70 Q74 64 70 56 Z';
  return (
    <Frame sky={['#eef2f7', '#d7dfeb']}>
      <defs>
        <radialGradient id='auto10_moon' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fbf3da' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fbf3da' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* night sky: moon + a couple of cool stars + a low cloud for depth */}
      <circle cx='164' cy='24' r='30' fill='url(#auto10_moon)' />
      <Ink
        d={gen.circle(
          164,
          24,
          17,
          filled(200, '#f3ead0', { fillStyle: 'solid', strokeWidth: 1.1 })
        )}
      />
      <Ink
        d={gen.circle(
          170,
          20,
          4,
          filled(203, '#e2e8f0', { fillStyle: 'solid', strokeWidth: 0.8 })
        )}
      />

      {/* the workbench — distant depth layer the machinery rests on */}
      <Ink
        d={gen.rectangle(
          0,
          80,
          200,
          20,
          filled(205, '#bcc7d6', { fillStyle: 'solid', strokeWidth: 0 })
        )}
      />
      <Ink
        d={gen.line(
          0,
          80,
          200,
          80,
          stroke(206, { stroke: '#f1f5fb', strokeWidth: 1, roughness: 0.8 })
        )}
      />

      {/* the flowing "script" belt looping through the gears */}
      <RoughDash d={belt} c='#788c5d' w={1.6} dur={2.2} dash='2 5' seed={208} />

      {/* coupled clockwork — three meshed gears turning on their own */}
      <Gear
        cx={96}
        cy={62}
        r={15}
        teeth={11}
        color='#c2502e'
        seed={210}
        dur={9}
        dir={1}
      />
      <Gear
        cx={70}
        cy={56}
        r={9}
        teeth={9}
        color='#e0a83f'
        seed={220}
        dir={-1}
        dur={6}
      />
      <Gear
        cx={150}
        cy={60}
        r={11}
        teeth={10}
        color='#6a9bcc'
        seed={230}
        dur={7.5}
        dir={-1}
      />

      {/* the saved hours drifting up off the running machine */}
      {[
        [96, 44, 0, 240],
        [120, 48, 0.9, 242],
        [78, 46, 1.6, 244],
      ].map(([sx, sy, d, sd]) => (
        <motion.g
          key={sx}
          animate={{ y: [0, -16], opacity: [0, 0.7, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeOut',
            delay: d,
          }}
        >
          <Ink
            d={gen.circle(
              sx,
              sy,
              3,
              filled(sd, '#e0a83f', { fillStyle: 'solid', strokeWidth: 0.8 })
            )}
          />
        </motion.g>
      ))}
    </Frame>
  );
}

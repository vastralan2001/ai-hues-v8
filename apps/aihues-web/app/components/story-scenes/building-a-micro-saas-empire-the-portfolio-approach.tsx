'use client';
import {
  Frame,
  Ink,
  Twinkle,
  RoughDash,
  gen,
  filled,
  stroke,
  loop,
  linear,
  INK,
  motion,
} from './_kit';

// Building a Micro-SaaS Empire — the portfolio approach: a small archipelago of
// floating sky-islands (each a tiny product with its own sprout), tethered to a
// central founder hub. Many small bets, diversified, tended together.

type Isle = {
  x: number;
  y: number;
  w: number; // island half-width at the flat top
  ph: number; // bob phase
  bob: number; // bob amplitude
  land: string;
  crop: string;
  seed: number;
};

const ISLES: Isle[] = [
  {
    x: 52,
    y: 40,
    w: 11,
    ph: 0.0,
    bob: 2.4,
    land: '#94ac78',
    crop: '#e2693f',
    seed: 320,
  },
  {
    x: 150,
    y: 36,
    w: 10,
    ph: 1.1,
    bob: 2.0,
    land: '#aebf95',
    crop: '#e0a83f',
    seed: 330,
  },
  {
    x: 168,
    y: 64,
    w: 8,
    ph: 0.6,
    bob: 1.7,
    land: '#788c5d',
    crop: '#cf9836',
    seed: 340,
  },
  {
    x: 36,
    y: 70,
    w: 7.5,
    ph: 1.7,
    bob: 1.5,
    land: '#94ac78',
    crop: '#c2502e',
    seed: 350,
  },
];

const HUB = { x: 100, y: 54 };

function SkyIsle({ isle }: { isle: Isle }) {
  const { x, y, w, land, crop, seed } = isle;
  const top = y;
  const tipY = y + w * 1.7;
  return (
    <motion.g
      animate={{ y: [0, -isle.bob, 0] }}
      transition={loop(2.6 + isle.ph * 0.5, isle.ph)}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      {/* floating-shadow gives lift */}
      <g opacity={0.1}>
        <Ink
          d={gen.ellipse(
            x,
            tipY + 5,
            w * 1.4,
            3.2,
            filled(seed + 6, INK, { fillStyle: 'solid', strokeWidth: 0 })
          )}
        />
      </g>
      {/* the underside cone of the island */}
      <Ink
        d={gen.polygon(
          [
            [x - w, top],
            [x + w, top],
            [x + w * 0.45, top + w * 0.9],
            [x, tipY],
            [x - w * 0.45, top + w * 0.9],
          ],
          filled(seed, land, { hachureGap: 2.8, fillWeight: 0.6 })
        )}
      />
      {/* the grassy cap */}
      <Ink
        d={gen.path(
          `M${x - w} ${top} Q${x} ${top - 3.2} ${x + w} ${top} Q${x} ${top + 2.4} ${x - w} ${top} Z`,
          filled(seed + 1, '#c8d8b0', { fillStyle: 'solid', strokeWidth: 1.2 })
        )}
      />
      {/* a tiny sprout — this little product is growing */}
      <Ink
        d={gen.line(
          x,
          top - 1,
          x,
          top - 8,
          stroke(seed + 2, { strokeWidth: 1.2 })
        )}
      />
      <Ink
        d={gen.circle(
          x,
          top - 9.5,
          5,
          filled(seed + 3, crop, { fillStyle: 'solid' })
        )}
      />
      {/* two small leaves on the stem */}
      <Ink
        d={gen.path(
          `M${x} ${top - 4} Q${x - 4} ${top - 5} ${x - 5} ${top - 2}`,
          stroke(seed + 4, { stroke: '#788c5d', strokeWidth: 1.1 })
        )}
      />
      <Ink
        d={gen.path(
          `M${x} ${top - 5.6} Q${x + 4} ${top - 6.6} ${x + 5} ${top - 3.6}`,
          stroke(seed + 5, { stroke: '#788c5d', strokeWidth: 1.1 })
        )}
      />
    </motion.g>
  );
}

export default function Scene() {
  return (
    <Frame sky={['#f3f6ec', '#dde8d0']}>
      <defs>
        <radialGradient id='microsaas_hubglow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff6df' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff6df' stopOpacity='0' />
        </radialGradient>
      </defs>

      {/* atmosphere */}
      <Twinkle x={24} y={32} c='#cf9836' />

      {/* warm glow behind the founder hub */}
      <circle cx={HUB.x} cy={HUB.y} r={30} fill='url(#microsaas_hubglow)' />

      {/* tethers: a rough dashed trail looping the hub out across the islands —
          the portfolio held together, value flowing inward */}
      <RoughDash
        d={`M${ISLES[3].x} ${ISLES[3].y + 1} Q${HUB.x - 20} ${HUB.y} ${HUB.x} ${HUB.y} Q${HUB.x + 26} ${ISLES[1].y} ${ISLES[1].x} ${ISLES[1].y + 1}`}
        c='#9aab7d'
        w={0.9}
        dur={2.4}
        dash='2 4'
        o={0.75}
        seed={371}
      />

      {/* the four small product-islands */}
      {ISLES.map((isle) => (
        <SkyIsle key={isle.seed} isle={isle} />
      ))}

      {/* the central founder hub: a small steady ringed node that tends them all */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={linear(22)}
        style={{ transformOrigin: `${HUB.x}px ${HUB.y}px` }}
      >
        <Ink
          d={gen.ellipse(
            HUB.x,
            HUB.y,
            26,
            10,
            stroke(361, { stroke: '#cf9836', strokeWidth: 1, roughness: 1 })
          )}
        />
      </motion.g>
      <motion.g
        animate={{ scale: [1, 1.07, 1] }}
        transition={loop(2.8)}
        style={{ transformOrigin: `${HUB.x}px ${HUB.y}px` }}
      >
        <Ink
          d={gen.circle(
            HUB.x,
            HUB.y,
            11,
            filled(362, '#e0a83f', { fillStyle: 'solid', strokeWidth: 1.3 })
          )}
        />
        <Ink
          d={gen.circle(
            HUB.x,
            HUB.y,
            4.4,
            filled(363, '#fff6df', { fillStyle: 'solid', strokeWidth: 1 })
          )}
        />
      </motion.g>
    </Frame>
  );
}

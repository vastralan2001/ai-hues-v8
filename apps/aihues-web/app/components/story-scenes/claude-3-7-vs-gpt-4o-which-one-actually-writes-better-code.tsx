'use client';
import { Frame, filled, gen, Ink, INK, loop, motion, stroke } from './_kit';

/* Claude 3.7 vs GPT-4o: two model "cards" face off across a bright spark — two
   ways of writing code, honestly measured against each other. */

function Panel({
  x,
  c,
  ph,
  seed,
}: {
  x: number;
  c: string;
  ph: number;
  seed: number;
}) {
  return (
    <motion.g
      animate={{ y: [0, -3.5, 0] }}
      transition={loop(3, ph)}
      style={{ transformOrigin: `${x}px 52px` }}
    >
      <Ink
        d={gen.ellipse(
          x,
          74,
          40,
          8,
          filled(seed + 5, INK, { fillStyle: 'solid', stroke: 'none' })
        )}
      />
      <Ink
        d={gen.rectangle(
          x - 19,
          36,
          38,
          32,
          filled(seed, '#ffffff', {
            fillStyle: 'solid',
            strokeWidth: 1.2,
            roughness: 1,
          })
        )}
      />
      <Ink
        d={gen.line(
          x - 11,
          54,
          x + 7,
          54,
          stroke(seed + 1, { stroke: c, strokeWidth: 2 })
        )}
      />
      <Ink
        d={gen.line(
          x - 11,
          59,
          x + 11,
          59,
          stroke(seed + 2, { stroke: c, strokeWidth: 2 })
        )}
      />
      <Ink
        d={gen.line(
          x - 11,
          64,
          x + 2,
          64,
          stroke(seed + 3, { stroke: c, strokeWidth: 2 })
        )}
      />
      <Ink
        d={gen.circle(
          x - 11,
          43,
          5,
          filled(seed + 4, c, { fillStyle: 'solid' })
        )}
      />
    </motion.g>
  );
}

export default function Scene() {
  return (
    <Frame sky={['#eff3fa', '#dae5f2']}>
      <defs>
        <radialGradient id='vs_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff' stopOpacity='0.8' />
          <stop offset='100%' stopColor='#fff' stopOpacity='0' />
        </radialGradient>
      </defs>
      <circle cx='100' cy='52' r='34' fill='url(#vs_glow)' />
      <Panel x={62} c='#5f93c6' ph={0} seed={21} />
      <Panel x={138} c='#d97757' ph={1.3} seed={31} />
      <motion.g
        animate={{ scale: [0.85, 1.12, 0.85], rotate: [0, 12, 0] }}
        transition={loop(2)}
        style={{ transformOrigin: '100px 52px' }}
      >
        <Ink
          d={gen.polygon(
            [
              [100, 42],
              [103, 50],
              [111, 52],
              [103, 54],
              [100, 62],
              [97, 54],
              [89, 52],
              [97, 50],
            ],
            filled(41, '#f0b449', { fillStyle: 'solid' })
          )}
        />
      </motion.g>
    </Frame>
  );
}

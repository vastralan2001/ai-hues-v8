'use client';

import rough from 'roughjs';
import { motion } from 'framer-motion';
import type { ComponentType, ReactNode } from 'react';

import { GENERATED_SCENES } from './story-scenes/registry';

/* Hand-authored, per-article Stories visuals. Each is a small atmospheric scene
   tied to the article: a soft gradient sky for depth, then the solid shapes are
   drawn with rough.js (sketchy outlines + hachure fills) for a hand-drawn,
   textured "doodle" quality, animated with Framer Motion. Fixed per-shape seeds
   keep rough's output deterministic, so SSR and client render identically.
   200×100 landscape, full-bleed; StoryArt picks the scene by slug. */

const FONT = '"Radiance", var(--font-noto-sans), "Noto Sans", sans-serif';
const INK = '#5b5346';
const gen = rough.generator();

const loop = (duration: number, delay = 0) => ({
  duration,
  repeat: Infinity,
  ease: 'easeInOut' as const,
  delay,
});
const linear = (duration: number) => ({
  duration,
  repeat: Infinity,
  ease: 'linear' as const,
});

// rough option presets
type Opts = Parameters<typeof gen.path>[1];
const stroke = (seed: number, over: Opts = {}): Opts => ({
  stroke: INK,
  strokeWidth: 1.1,
  roughness: 1.3,
  bowing: 1.4,
  seed,
  ...over,
});
const filled = (seed: number, fill: string, over: Opts = {}): Opts => ({
  stroke: INK,
  strokeWidth: 1.1,
  roughness: 1.2,
  bowing: 1,
  fill,
  fillStyle: 'hachure',
  fillWeight: 0.7,
  hachureGap: 2.6,
  seed,
  ...over,
});

// Render a rough drawable's op-sets as plain SVG paths (DOM-free, SSR-safe).
function Ink({ d }: { d: ReturnType<typeof gen.path> }) {
  const o = d.options;
  return (
    <>
      {d.sets.map((set, i) => {
        const path = gen.opsToPath(set);
        if (set.type === 'fillSketch')
          return (
            <path
              key={i}
              d={path}
              fill='none'
              stroke={o.fill}
              strokeWidth={
                o.fillWeight && o.fillWeight > 0 ? o.fillWeight : 0.8
              }
            />
          );
        if (set.type === 'fillPath')
          return <path key={i} d={path} fill={o.fill} stroke='none' />;
        return (
          <path
            key={i}
            d={path}
            fill='none'
            stroke={o.stroke}
            strokeWidth={o.strokeWidth}
          />
        );
      })}
    </>
  );
}

function Frame({
  sky,
  children,
}: {
  sky: [string, string];
  children: ReactNode;
}) {
  return (
    <div
      className='h-full w-full'
      style={{ background: `linear-gradient(165deg, ${sky[0]}, ${sky[1]})` }}
    >
      <svg
        viewBox='0 0 200 100'
        preserveAspectRatio='xMidYMid slice'
        className='h-full w-full'
        style={{ fontFamily: FONT }}
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        {children}
      </svg>
    </div>
  );
}

function Twinkle({
  x,
  y,
  d = 0,
  r = 1.1,
  c = '#fff',
}: {
  x: number;
  y: number;
  d?: number;
  r?: number;
  c?: string;
}) {
  return (
    <motion.circle
      cx={x}
      cy={y}
      r={r}
      fill={c}
      animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.6, 1.1, 0.6] }}
      transition={loop(2.4, d)}
      style={{ transformOrigin: `${x}px ${y}px` }}
    />
  );
}

function Cloud({
  x,
  y,
  s = 1,
  o = 0.5,
}: {
  x: number;
  y: number;
  s?: number;
  o?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill='#fff' opacity={o}>
      <ellipse cx='0' cy='0' rx='15' ry='5' />
      <ellipse cx='10' cy='1.5' rx='9' ry='4' />
      <ellipse cx='-10' cy='2' rx='8' ry='3.5' />
    </g>
  );
}

// ── Growth — Product Hunt launch: a small rocket arcing into a dawn sky ──
function LaunchProductHunt() {
  const trail = 'M58 90 Q92 74 124 44';
  return (
    <Frame sky={['#fdf2e4', '#f6dcc1']}>
      <defs>
        <radialGradient id='ph_sun' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff6e6' stopOpacity='0.9' />
          <stop offset='100%' stopColor='#fff6e6' stopOpacity='0' />
        </radialGradient>
      </defs>
      <circle cx='150' cy='22' r='46' fill='url(#ph_sun)' />
      <Twinkle x={40} y={24} c='#cf9836' />
      <Twinkle x={176} y={46} d={0.8} c='#e0a83f' />
      <Twinkle x={94} y={18} d={1.3} c='#cf9836' />
      <Cloud x={48} y={66} s={0.85} o={0.45} />
      <Ink
        d={gen.path(
          'M0 90 Q100 84 200 90 L200 100 L0 100 Z',
          filled(11, '#eecba3', { roughness: 1.5, hachureGap: 3.4 })
        )}
      />
      <motion.path
        d={trail}
        fill='none'
        stroke='#fff'
        strokeWidth='3'
        opacity='0.5'
        strokeDasharray='1 7'
        animate={{ strokeDashoffset: [0, -16] }}
        transition={linear(1.4)}
      />
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={loop(2.6)}
        style={{ transformOrigin: '124px 44px' }}
      >
        <g transform='rotate(34 124 44)'>
          <motion.g
            animate={{ scaleY: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
            transition={loop(0.4)}
            style={{ transformOrigin: '124px 56px' }}
          >
            <Ink
              d={gen.path(
                'M120 56 Q124 68 128 56',
                filled(12, '#f0b449', { roughness: 0.9 })
              )}
            />
          </motion.g>
          <Ink
            d={gen.polygon(
              [
                [120.5, 50],
                [115, 60],
                [120.5, 56],
              ],
              filled(13, '#c2502e')
            )}
          />
          <Ink
            d={gen.polygon(
              [
                [127.5, 50],
                [133, 60],
                [127.5, 56],
              ],
              filled(14, '#c2502e')
            )}
          />
          <Ink
            d={gen.path(
              'M124 30 C131 38 131 50 128 56 L120 56 C117 50 117 38 124 30 Z',
              filled(15, '#e2693f', { strokeWidth: 1.3 })
            )}
          />
          <Ink d={gen.circle(124, 41, 7, filled(16, '#cfe6fb'))} />
        </g>
      </motion.g>
    </Frame>
  );
}

// ── AI Tools — Claude vs GPT: two model "cards", a spark between ──
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
      <ellipse cx={x} cy='74' rx='20' ry='4' fill={INK} opacity='0.1' />
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

function ClaudeVsGpt() {
  return (
    <Frame sky={['#eff3fa', '#dae5f2']}>
      <defs>
        <radialGradient id='vs_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff' stopOpacity='0.8' />
          <stop offset='100%' stopColor='#fff' stopOpacity='0' />
        </radialGradient>
      </defs>
      <circle cx='100' cy='52' r='34' fill='url(#vs_glow)' />
      <Twinkle x={34} y={24} c='#6a9bcc' />
      <Twinkle x={172} y={30} d={0.7} c='#d97757' />
      <Cloud x={40} y={28} s={0.7} o={0.4} />
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

// ── Growth — ASO: an app rising along a growth curve toward a star ──
function AppStoreOptimization() {
  const curve = 'M14 84 Q70 80 104 58 T182 22';
  return (
    <Frame sky={['#fcf5e3', '#f3ddb0']}>
      <defs>
        <radialGradient id='aso_star' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff1cf' stopOpacity='1' />
          <stop offset='100%' stopColor='#fff1cf' stopOpacity='0' />
        </radialGradient>
      </defs>
      <Cloud x={46} y={26} s={0.8} o={0.4} />
      <Cloud x={150} y={70} s={0.7} o={0.35} />
      <Ink
        d={gen.path(
          'M14 84 Q70 80 104 58 T182 22 L182 96 L14 96 Z',
          filled(51, '#f1d3a0', { roughness: 1.6, hachureGap: 4 })
        )}
      />
      <motion.path
        d={curve}
        fill='none'
        stroke='#d99a3f'
        strokeWidth='1.8'
        strokeDasharray='2 6'
        animate={{ strokeDashoffset: [0, -16] }}
        transition={linear(1.6)}
      />
      <circle cx='182' cy='22' r='18' fill='url(#aso_star)' />
      <motion.g
        animate={{ scale: [0.92, 1.08, 0.92], rotate: [0, 6, 0] }}
        transition={loop(2.4)}
        style={{ transformOrigin: '182px 22px' }}
      >
        <Ink
          d={gen.polygon(
            [
              [182, 13],
              [184.6, 18.4],
              [190.6, 19.1],
              [186.3, 23.1],
              [187.4, 29],
              [182, 26],
              [176.6, 29],
              [177.7, 23.1],
              [173.4, 19.1],
              [179.4, 18.4],
            ],
            filled(52, '#f0b449', { fillStyle: 'solid' })
          )}
        />
      </motion.g>
      {[
        [110, 50],
        [134, 42],
        [158, 32],
      ].map(([sx, sy], i) => (
        <Twinkle key={sx} x={sx} y={sy} d={i * 0.3} c='#e0a83f' r={1.2} />
      ))}
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={loop(2.2)}
        style={{ transformOrigin: '96px 60px' }}
      >
        <g transform='rotate(-26 96 60)'>
          <Ink
            d={gen.rectangle(
              88,
              49,
              16,
              24,
              filled(53, '#ffffff', { fillStyle: 'solid', strokeWidth: 1.2 })
            )}
          />
          <Ink
            d={gen.polygon(
              [
                [96, 55],
                [97.5, 58],
                [100.8, 58.4],
                [98.4, 60.6],
                [99, 63.9],
                [96, 62.2],
                [93, 63.9],
                [93.6, 60.6],
                [91.2, 58.4],
                [94.5, 58],
              ],
              filled(54, '#f0b449', { fillStyle: 'solid' })
            )}
          />
        </g>
      </motion.g>
    </Frame>
  );
}

// ── AI Tools — hidden costs: the iceberg (small tip, vast mass below) ──
function HiddenCostsAiWriting() {
  return (
    <Frame sky={['#eef4fb', '#d2e2f1']}>
      <defs>
        <linearGradient id='hc_water' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#aed3ec' />
          <stop offset='100%' stopColor='#5d99c4' />
        </linearGradient>
      </defs>
      <Twinkle x={34} y={20} c='#9cc3e2' />
      <Twinkle x={168} y={22} d={0.7} c='#9cc3e2' />
      <Cloud x={150} y={26} s={0.8} o={0.5} />
      <rect x='0' y='54' width='200' height='46' fill='url(#hc_water)' />
      <line
        x1='0'
        y1='54'
        x2='200'
        y2='54'
        stroke='#eaf6ff'
        strokeWidth='1.4'
        opacity='0.7'
      />
      <Ink
        d={gen.polygon(
          [
            [84, 54],
            [116, 54],
            [128, 80],
            [100, 96],
            [72, 80],
          ],
          filled(61, '#74acd2', { hachureGap: 3.4, fillWeight: 0.6 })
        )}
      />
      <Ink
        d={gen.polygon(
          [
            [89, 54],
            [100, 33],
            [111, 54],
          ],
          filled(62, '#eaf4fb', { fillStyle: 'solid', strokeWidth: 1.2 })
        )}
      />
      <Ink
        d={gen.circle(
          100,
          45,
          9,
          filled(63, '#f0b449', { fillStyle: 'solid' })
        )}
      />
      <text
        x='100'
        y='48'
        textAnchor='middle'
        fontSize='6'
        fontWeight='800'
        fill={INK}
      >
        $
      </text>
      {[
        [78, 84, 0],
        [122, 80, 0.9],
        [94, 90, 1.6],
      ].map(([bx, by, d]) => (
        <motion.circle
          key={bx}
          cx={bx}
          cy={by}
          r='1.6'
          fill='#eaf6ff'
          opacity='0.6'
          animate={{ y: [0, -15], opacity: [0, 0.6, 0] }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'easeOut',
            delay: d,
          }}
        />
      ))}
    </Frame>
  );
}

// ── Indie Dev — solo founding: a lone figure, vast layered summits ──
function SoloFounding() {
  const trail = 'M22 86 Q60 82 96 64 T172 30';
  return (
    <Frame sky={['#f5f1e4', '#dfead4']}>
      <defs>
        <radialGradient id='sf_sun' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#fff7e4' stopOpacity='0.95' />
          <stop offset='100%' stopColor='#fff7e4' stopOpacity='0' />
        </radialGradient>
      </defs>
      <circle cx='160' cy='24' r='38' fill='url(#sf_sun)' />
      <Ink
        d={gen.circle(
          160,
          24,
          16,
          filled(71, '#f6e7bb', { fillStyle: 'solid' })
        )}
      />
      <Cloud x={48} y={28} s={0.8} o={0.45} />
      <Ink
        d={gen.polygon(
          [
            [0, 70],
            [48, 34],
            [96, 70],
          ],
          filled(72, '#d4dec9', { hachureGap: 4 })
        )}
      />
      <Ink
        d={gen.polygon(
          [
            [64, 72],
            [120, 30],
            [172, 72],
          ],
          filled(73, '#c2cfb1', { hachureGap: 4 })
        )}
      />
      <Ink
        d={gen.polygon(
          [
            [0, 84],
            [58, 50],
            [120, 84],
          ],
          filled(74, '#aebf95', { hachureGap: 3.4 })
        )}
      />
      <Ink
        d={gen.polygon(
          [
            [86, 92],
            [172, 26],
            [200, 92],
          ],
          filled(75, '#94ac78', { hachureGap: 3 })
        )}
      />
      <motion.path
        d={trail}
        fill='none'
        stroke='#6f8a4f'
        strokeWidth='1.8'
        strokeDasharray='3 7'
        animate={{ strokeDashoffset: [0, -22] }}
        transition={linear(1.9)}
      />
      <motion.g animate={{ y: [0, -1.4, 0] }} transition={loop(1.9)}>
        <Ink
          d={gen.circle(
            96,
            56,
            5,
            filled(76, '#d4602f', { fillStyle: 'solid' })
          )}
        />
        <Ink
          d={gen.path(
            'M96 58 L96 63 M96 60 L92.5 62 M96 60 L99.5 61 M96 63 L93 67 M96 63 L99 67',
            stroke(77, { strokeWidth: 1.4 })
          )}
        />
      </motion.g>
      <Ink d={gen.line(172, 30, 172, 12, stroke(78, { strokeWidth: 1.6 }))} />
      <motion.g
        animate={{ skewX: [0, 9, 0] }}
        transition={loop(1.6)}
        style={{ transformOrigin: '172px 17px' }}
      >
        <Ink
          d={gen.path(
            'M172 13 Q181 15 188 12 Q181 19 188 22 Q180 20 172 23 Z',
            filled(79, '#c2502e', { fillStyle: 'solid' })
          )}
        />
      </motion.g>
    </Frame>
  );
}

// ── Development — RSC: a quiet orbital system over a planet's rim ──
function ReactServerComponents() {
  return (
    <Frame sky={['#eef2fb', '#d4e0f1']}>
      <defs>
        <radialGradient id='rsc_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#9cc0ea' stopOpacity='0.7' />
          <stop offset='100%' stopColor='#9cc0ea' stopOpacity='0' />
        </radialGradient>
      </defs>
      <Twinkle x={28} y={22} d={0.2} c='#8fb2dd' />
      <Twinkle x={168} y={18} d={0.9} c='#8fb2dd' />
      <Twinkle x={150} y={40} d={1.4} c='#8fb2dd' />
      <Twinkle x={44} y={48} d={0.6} c='#8fb2dd' />
      <Ink
        d={gen.path(
          'M0 88 Q100 66 200 88 L200 100 L0 100 Z',
          filled(81, '#6f9fd4', { hachureGap: 3 })
        )}
      />
      <circle cx='100' cy='48' r='32' fill='url(#rsc_glow)' />
      {[
        { rot: 0, dur: 9, dir: 1, seed: 82 },
        { rot: 60, dur: 12, dir: -1, seed: 83 },
        { rot: 120, dur: 10, dir: 1, seed: 84 },
      ].map((o) => (
        <motion.g
          key={o.seed}
          animate={{ rotate: 360 * o.dir }}
          transition={linear(o.dur)}
          style={{ transformOrigin: '100px 48px' }}
        >
          <g transform={`rotate(${o.rot} 100 48)`}>
            <Ink
              d={gen.ellipse(
                100,
                48,
                80,
                26,
                stroke(o.seed, {
                  stroke: '#5a86c5',
                  strokeWidth: 1.3,
                  roughness: 1,
                })
              )}
            />
            <Ink
              d={gen.circle(
                140,
                48,
                4.4,
                filled(o.seed + 100, '#5a86c5', { fillStyle: 'solid' })
              )}
            />
          </g>
        </motion.g>
      ))}
      <motion.g
        animate={{ scale: [1, 1.06, 1] }}
        transition={loop(2.6)}
        style={{ transformOrigin: '100px 48px' }}
      >
        <Ink
          d={gen.circle(
            100,
            48,
            16,
            filled(85, '#6a9bcc', { fillStyle: 'solid', strokeWidth: 1.3 })
          )}
        />
      </motion.g>
    </Frame>
  );
}

// The six reference scenes are hand-authored inline here; every other article's
// scene lives in its own file under story-scenes/ and is merged via the
// generated registry. See .claude/skills/story-demo/SKILL.md.
const HAND_AUTHORED: Record<string, ComponentType> = {
  'launching-on-product-hunt-what-worked-in-2026': LaunchProductHunt,
  'claude-3-7-vs-gpt-4o-which-one-actually-writes-better-code': ClaudeVsGpt,
  'app-store-optimization-in-2026-beyond-keywords': AppStoreOptimization,
  'the-hidden-costs-of-ai-writing-tools-nobody-talks-about':
    HiddenCostsAiWriting,
  'solo-founding-one-year-of-lessons-and-regrets': SoloFounding,
  'react-server-components-a-practical-guide': ReactServerComponents,
};

export const STORY_SVG: Record<string, ComponentType> = {
  ...GENERATED_SCENES,
  ...HAND_AUTHORED,
};

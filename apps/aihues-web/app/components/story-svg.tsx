'use client';

import { motion } from 'framer-motion';
import type { ComponentType, ReactNode } from 'react';

/* Hand-authored, per-article Stories visuals — SVG + Framer Motion. Each one is
   a small atmospheric SCENE tied to the article: soft gradient skies, layered
   distance, glow and depth, a single understated focal subject with generous
   negative space (epic scale rather than cartoon), thin muted ink lines, the
   AIHues palette, Radiance display font. 200×100 landscape, full-bleed.
   StoryArt renders the matching scene by slug; the rest fall back to canvas. */

const FONT = '"Radiance", var(--font-noto-sans), "Noto Sans", sans-serif';
const INK = '#6a6051'; // muted, light-touch ink
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
        <linearGradient id='ph_body' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stopColor='#ef9168' />
          <stop offset='100%' stopColor='#d4602f' />
        </linearGradient>
      </defs>
      <circle cx='150' cy='22' r='46' fill='url(#ph_sun)' />
      <Twinkle x={40} y={24} c='#cf9836' />
      <Twinkle x={176} y={46} d={0.8} c='#e0a83f' />
      <Twinkle x={94} y={18} d={1.3} c='#cf9836' />
      <Cloud x={48} y={66} s={0.85} o={0.5} />
      <Cloud x={168} y={74} s={0.7} o={0.4} />
      {/* distant horizon */}
      <path
        d='M0 90 Q100 84 200 90 L200 100 L0 100 Z'
        fill='#eecba3'
        opacity='0.7'
      />
      {/* vapour trail */}
      <motion.path
        d={trail}
        fill='none'
        stroke='#fff'
        strokeWidth='3'
        opacity='0.55'
        strokeDasharray='1 7'
        animate={{ strokeDashoffset: [0, -16] }}
        transition={linear(1.4)}
      />
      {/* rocket — small, with breathing room */}
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={loop(2.6)}
        style={{ transformOrigin: '124px 44px' }}
      >
        <g transform='rotate(34 124 44)'>
          <motion.path
            d='M120 56 Q124 68 128 56'
            fill='#f0b449'
            animate={{ scaleY: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
            transition={loop(0.4)}
            style={{ transformOrigin: '124px 56px' }}
          />
          <path d='M120.5 50 L115 60 L120.5 56 Z' fill='#c2502e' />
          <path d='M127.5 50 L133 60 L127.5 56 Z' fill='#c2502e' />
          <path
            d='M124 30 C131 38 131 50 128 56 L120 56 C117 50 117 38 124 30 Z'
            fill='url(#ph_body)'
            stroke={INK}
            strokeWidth='1.3'
          />
          <circle
            cx='124'
            cy='41'
            r='3.4'
            fill='#cfe6fb'
            stroke={INK}
            strokeWidth='1.1'
          />
        </g>
      </motion.g>
    </Frame>
  );
}

// ── AI Tools — Claude vs GPT: two refined model panels, a spark between ──
function Panel({
  x,
  c,
  hi,
  ph,
}: {
  x: number;
  c: string;
  hi: string;
  ph: number;
}) {
  return (
    <motion.g
      animate={{ y: [0, -3.5, 0] }}
      transition={loop(3, ph)}
      style={{ transformOrigin: `${x}px 52px` }}
    >
      <ellipse cx={x} cy='74' rx='20' ry='4' fill={INK} opacity='0.1' />
      <rect
        x={x - 19}
        y='36'
        width='38'
        height='32'
        rx='9'
        fill='#fff'
        stroke={INK}
        strokeWidth='1.3'
      />
      <rect
        x={x - 19}
        y='36'
        width='38'
        height='11'
        rx='9'
        fill={c}
        opacity='0.18'
      />
      <circle cx={x - 11} cy='41.5' r='2.4' fill={c} />
      <line
        x1={x - 11}
        y1='54'
        x2={x + 6}
        y2='54'
        stroke={hi}
        strokeWidth='2.4'
      />
      <line
        x1={x - 11}
        y1='59'
        x2={x + 10}
        y2='59'
        stroke={c}
        strokeWidth='2.4'
        opacity='0.5'
      />
      <line x1={x - 11} y1='64' x2={x} y2='64' stroke={hi} strokeWidth='2.4' />
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
      <Twinkle x={150} y={72} d={1.2} c='#6a9bcc' />
      <Cloud x={40} y={30} s={0.7} o={0.4} />
      <Panel x={62} c='#5f93c6' hi='#9cc1e2' ph={0} />
      <Panel x={138} c='#d97757' hi='#e8b09c' ph={1.3} />
      <motion.path
        d='M100 42 L103 50 L111 52 L103 54 L100 62 L97 54 L89 52 L97 50 Z'
        fill='#f0b449'
        stroke={INK}
        strokeWidth='1'
        animate={{ scale: [0.85, 1.12, 0.85], rotate: [0, 12, 0] }}
        transition={loop(2)}
        style={{ transformOrigin: '100px 52px' }}
      />
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
        <linearGradient id='aso_phone' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#ffffff' />
          <stop offset='100%' stopColor='#f0e4cb' />
        </linearGradient>
      </defs>
      <Cloud x={46} y={26} s={0.8} o={0.45} />
      <Cloud x={150} y={70} s={0.7} o={0.4} />
      {/* growth curve */}
      <path
        d='M14 84 Q70 80 104 58 T182 22 L182 96 L14 96 Z'
        fill='#f1d3a0'
        opacity='0.35'
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
      {/* summit star */}
      <circle cx='182' cy='22' r='18' fill='url(#aso_star)' />
      <motion.path
        d='M182 13 l2.6 5.4 6 .7 -4.3 4 1.1 5.9 -5.4-3 -5.4 3 1.1-5.9 -4.3-4 6-.7 Z'
        fill='#f0b449'
        stroke={INK}
        strokeWidth='1'
        animate={{ scale: [0.92, 1.08, 0.92], rotate: [0, 6, 0] }}
        transition={loop(2.4)}
        style={{ transformOrigin: '182px 22px' }}
      />
      {[
        [110, 50],
        [134, 42],
        [158, 32],
      ].map(([sx, sy], i) => (
        <Twinkle key={sx} x={sx} y={sy} d={i * 0.3} c='#e0a83f' r={1.2} />
      ))}
      {/* phone climbing the curve */}
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={loop(2.2)}
        style={{ transformOrigin: '96px 60px' }}
      >
        <g transform='rotate(-26 96 60)'>
          <rect
            x='88'
            y='49'
            width='16'
            height='24'
            rx='4.5'
            fill='url(#aso_phone)'
            stroke={INK}
            strokeWidth='1.3'
          />
          <path
            d='M96 56 l1.5 3 3.3 .4 -2.4 2.2 .6 3.3 -3-1.7 -3 1.7 .6-3.3 -2.4-2.2 3.3-.4 Z'
            fill='#f0b449'
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
        <linearGradient id='hc_tip' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#ffffff' />
          <stop offset='100%' stopColor='#d3e8f6' />
        </linearGradient>
      </defs>
      <Twinkle x={34} y={20} c='#9cc3e2' />
      <Twinkle x={168} y={22} d={0.7} c='#9cc3e2' />
      <Cloud x={150} y={26} s={0.8} o={0.5} />
      {/* water */}
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
      {/* submerged mass — the bulk */}
      <path
        d='M84 54 L116 54 L128 80 Q116 96 100 96 Q84 96 72 80 Z'
        fill='#74acd2'
        opacity='0.5'
      />
      <path
        d='M92 54 L100 90 L108 54'
        fill='none'
        stroke='#5f9cc6'
        strokeWidth='1'
        opacity='0.5'
      />
      {/* tip above water */}
      <path
        d='M89 54 L100 33 L111 54 Z'
        fill='url(#hc_tip)'
        stroke={INK}
        strokeWidth='1.2'
      />
      <path d='M100 33 L95 54' stroke={INK} strokeWidth='0.9' opacity='0.3' />
      {/* a small cost marker on the tip */}
      <circle
        cx='100'
        cy='45'
        r='4.6'
        fill='#f0b449'
        stroke={INK}
        strokeWidth='1'
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
      <circle cx='160' cy='24' r='8' fill='#f6e7bb' />
      <Cloud x={48} y={28} s={0.8} o={0.5} />
      {/* layered ranges, far → near (atmospheric fade) */}
      <path d='M0 66 L46 38 L96 66 Z' fill='#d4dec9' />
      <path d='M64 70 L116 34 L170 70 Z' fill='#c2cfb1' />
      <path d='M0 84 L58 52 L122 84 Z' fill='#aebf95' />
      <path d='M86 92 L172 26 L200 92 Z' fill='#94ac78' />
      <path
        d='M86 92 L172 26 L200 92'
        fill='none'
        stroke='#bccfa1'
        strokeWidth='1.2'
        opacity='0.6'
      />
      <rect x='0' y='92' width='200' height='8' fill='#94ac78' />
      {/* winding trail */}
      <path d={trail} fill='none' stroke='#7d976066' strokeWidth='2.4' />
      <motion.path
        d={trail}
        fill='none'
        stroke='#6f8a4f'
        strokeWidth='1.8'
        strokeDasharray='3 7'
        animate={{ strokeDashoffset: [0, -22] }}
        transition={linear(1.9)}
      />
      {/* lone figure — tiny, for scale */}
      <motion.g animate={{ y: [0, -1.4, 0] }} transition={loop(1.9)}>
        <circle cx='96' cy='56' r='2.4' fill='#d4602f' />
        <path
          d='M96 58 L96 63 M96 60 L92.5 62 M96 60 L99.5 61 M96 63 L93 67 M96 63 L99 67'
          stroke={INK}
          strokeWidth='1.4'
          fill='none'
        />
      </motion.g>
      {/* summit flag */}
      <line x1='172' y1='30' x2='172' y2='12' stroke={INK} strokeWidth='1.6' />
      <motion.path
        d='M172 13 Q181 15 188 12 Q181 19 188 22 Q180 20 172 23 Z'
        fill='#c2502e'
        stroke={INK}
        strokeWidth='1.1'
        animate={{ skewX: [0, 9, 0] }}
        transition={loop(1.6)}
        style={{ transformOrigin: '172px 17px' }}
      />
      {/* drifting birds */}
      <motion.path
        d='M36 42 q3 -2.6 6 0 q3 -2.6 6 0'
        fill='none'
        stroke={INK}
        strokeWidth='1.1'
        opacity='0.45'
        animate={{ x: [0, 10, 0], y: [0, -2, 0] }}
        transition={loop(5)}
      />
    </Frame>
  );
}

// ── Development — RSC: a quiet orbital system over a planet's rim ──
function ReactServerComponents() {
  return (
    <Frame sky={['#eef2fb', '#d4e0f1']}>
      <defs>
        <radialGradient id='rsc_glow' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stopColor='#9cc0ea' stopOpacity='0.75' />
          <stop offset='100%' stopColor='#9cc0ea' stopOpacity='0' />
        </radialGradient>
        <radialGradient id='rsc_core' cx='40%' cy='38%' r='65%'>
          <stop offset='0%' stopColor='#a7c7ee' />
          <stop offset='100%' stopColor='#5a86c5' />
        </radialGradient>
        <linearGradient id='rsc_planet' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#7aa6d8' />
          <stop offset='100%' stopColor='#587fbc' />
        </linearGradient>
      </defs>
      <Twinkle x={28} y={22} d={0.2} c='#8fb2dd' />
      <Twinkle x={168} y={18} d={0.9} c='#8fb2dd' />
      <Twinkle x={150} y={40} d={1.4} c='#8fb2dd' />
      <Twinkle x={44} y={48} d={0.6} c='#8fb2dd' />
      {/* planet rim */}
      <path
        d='M0 88 Q100 66 200 88 L200 100 L0 100 Z'
        fill='url(#rsc_planet)'
      />
      <path
        d='M0 88 Q100 66 200 88'
        fill='none'
        stroke='#cfe0f4'
        strokeWidth='1.4'
        opacity='0.6'
      />
      <circle cx='100' cy='48' r='32' fill='url(#rsc_glow)' />
      {/* orbits, each carrying an electron */}
      {[
        { rot: 0, dur: 9, dir: 1 },
        { rot: 60, dur: 12, dir: -1 },
        { rot: 120, dur: 10, dir: 1 },
      ].map((o, i) => (
        <motion.g
          key={i}
          animate={{ rotate: 360 * o.dir }}
          transition={linear(o.dur)}
          style={{ transformOrigin: '100px 48px' }}
        >
          <g transform={`rotate(${o.rot} 100 48)`}>
            <ellipse
              cx='100'
              cy='48'
              rx='40'
              ry='13'
              fill='none'
              stroke='#6a9bcc'
              strokeWidth='1.4'
              opacity='0.85'
            />
            <circle cx='140' cy='48' r='2.2' fill='#5a86c5' />
          </g>
        </motion.g>
      ))}
      {/* core */}
      <motion.g
        animate={{ scale: [1, 1.06, 1] }}
        transition={loop(2.6)}
        style={{ transformOrigin: '100px 48px' }}
      >
        <circle
          cx='100'
          cy='48'
          r='8'
          fill='url(#rsc_core)'
          stroke={INK}
          strokeWidth='1.2'
        />
        <circle cx='97' cy='45' r='2' fill='#fff' opacity='0.7' />
      </motion.g>
    </Frame>
  );
}

export const STORY_SVG: Record<string, ComponentType> = {
  'launching-on-product-hunt-what-worked-in-2026': LaunchProductHunt,
  'claude-3-7-vs-gpt-4o-which-one-actually-writes-better-code': ClaudeVsGpt,
  'app-store-optimization-in-2026-beyond-keywords': AppStoreOptimization,
  'the-hidden-costs-of-ai-writing-tools-nobody-talks-about':
    HiddenCostsAiWriting,
  'solo-founding-one-year-of-lessons-and-regrets': SoloFounding,
  'react-server-components-a-practical-guide': ReactServerComponents,
};

'use client';

import { motion } from 'framer-motion';
import type { ComponentType, ReactNode } from 'react';

/* Hand-authored, per-article Stories visuals — SVG + Framer Motion in the
   playful Kimi-"doodle" tonality (loose hand-drawn line-art with a touch of
   character), recoloured to the AIHues family on a light warm surface, text in
   the Radiance display font. StoryArt renders the matching one by slug and
   falls back to the canvas interpreter for not-yet-migrated slugs.
   Coordinates are a 0..100 viewBox, centred. */

const FONT = '"Radiance", var(--font-noto-sans), "Noto Sans", sans-serif';
const INK = '#4a4036'; // warm hand-drawn ink
const loop = (duration: number, delay = 0) => ({
  duration,
  repeat: Infinity,
  ease: 'easeInOut' as const,
  delay,
});

function Frame({
  from,
  to,
  children,
}: {
  from: string;
  to: string;
  children: ReactNode;
}) {
  return (
    <div
      className='h-full w-full'
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <svg
        viewBox='0 0 100 100'
        preserveAspectRatio='xMidYMid meet'
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

// a little hand-drawn sparkle (twinkling plus)
function Spark({
  x,
  y,
  d = 0,
  c = INK,
}: {
  x: number;
  y: number;
  d?: number;
  c?: string;
}) {
  return (
    <motion.g
      stroke={c}
      strokeWidth='1.6'
      animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.1, 0.8] }}
      transition={loop(1.8, d)}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      <line x1={x - 3} y1={y} x2={x + 3} y2={y} />
      <line x1={x} y1={y - 3} x2={x} y2={y + 3} />
    </motion.g>
  );
}

// Growth — Product Hunt launch: a doodled rocket taking off.
function LaunchProductHunt() {
  return (
    <Frame from='#f9efe7' to='#f5e7d8'>
      <Spark x={26} y={30} c='#c2502e' />
      <Spark x={74} y={26} d={0.6} c='#cf9836' />
      <Spark x={78} y={58} d={1.1} c='#c2502e' />
      <motion.g animate={{ y: [0, -3.5, 0] }} transition={loop(2)}>
        <path
          d='M50 22 C59 30 59 48 55 56 L45 56 C41 48 41 30 50 22 Z'
          fill='#e2693f'
          stroke={INK}
          strokeWidth='2.4'
        />
        <circle
          cx='50'
          cy='39'
          r='4.6'
          fill='#cfe6fb'
          stroke={INK}
          strokeWidth='2'
        />
        <path
          d='M45 50 L38 60 L45 56 Z'
          fill='#c2502e'
          stroke={INK}
          strokeWidth='2'
        />
        <path
          d='M55 50 L62 60 L55 56 Z'
          fill='#c2502e'
          stroke={INK}
          strokeWidth='2'
        />
        <motion.path
          d='M46 56 Q50 70 54 56'
          fill='#e0a83f'
          stroke={INK}
          strokeWidth='2'
          animate={{ scaleY: [1, 1.3, 1] }}
          transition={loop(0.45)}
          style={{ transformOrigin: '50px 56px' }}
        />
      </motion.g>
    </Frame>
  );
}

// AI Tools — Claude vs GPT: two friendly bot heads facing off.
function Bot({ x, c, ph }: { x: number; c: string; ph: number }) {
  return (
    <motion.g animate={{ y: [0, -2, 0] }} transition={loop(1.8, ph)}>
      <line x1={x} y1='28' x2={x} y2='33' stroke={INK} strokeWidth='2' />
      <circle cx={x} cy='27' r='1.8' fill={c} stroke={INK} strokeWidth='1.4' />
      <rect
        x={x - 13}
        y='34'
        width='26'
        height='22'
        rx='7'
        fill={c}
        stroke={INK}
        strokeWidth='2.4'
      />
      <circle
        cx={x - 5}
        cy='44'
        r='2.1'
        fill='#fff'
        stroke={INK}
        strokeWidth='1.2'
      />
      <circle
        cx={x + 5}
        cy='44'
        r='2.1'
        fill='#fff'
        stroke={INK}
        strokeWidth='1.2'
      />
      <path
        d={`M${x - 4} 50 Q${x} 53 ${x + 4} 50`}
        fill='none'
        stroke={INK}
        strokeWidth='1.8'
      />
    </motion.g>
  );
}

function ClaudeVsGpt() {
  return (
    <Frame from='#eef1f7' to='#e2eaf4'>
      <Bot x={30} c='#6a9bcc' ph={0} />
      <Bot x={70} c='#d97757' ph={0.9} />
      <text
        x='50'
        y='49'
        textAnchor='middle'
        fontSize='9'
        fontWeight='800'
        fill={INK}
      >
        VS
      </text>
    </Frame>
  );
}

// Growth — ASO: a happy phone with a star rating.
function AppStoreOptimization() {
  const stars = [36, 44, 52, 60, 68];
  return (
    <Frame from='#f7f2e7' to='#f0e3cc'>
      <rect
        x='40'
        y='22'
        width='20'
        height='34'
        rx='5'
        fill='#fff'
        stroke={INK}
        strokeWidth='2.4'
      />
      <rect
        x='43'
        y='27'
        width='14'
        height='20'
        rx='2'
        fill='#cf9836'
        opacity='0.25'
      />
      <circle cx='47' cy='35' r='1.4' fill={INK} />
      <circle cx='53' cy='35' r='1.4' fill={INK} />
      <path
        d='M46 39 Q50 43 54 39'
        fill='none'
        stroke={INK}
        strokeWidth='1.8'
      />
      <circle cx='50' cy='52' r='1.4' fill={INK} />
      {stars.map((x, i) => (
        <motion.path
          key={x}
          d={`M${x} 64 l1.5 3 3 .3 -2.3 2 .7 3 -2.9-1.7 -2.9 1.7 .7-3 -2.3-2 3-.3 Z`}
          fill='#e0a83f'
          stroke={INK}
          strokeWidth='1.2'
          animate={{ scale: [0.85, 1.1, 0.85], opacity: [0.5, 1, 0.5] }}
          transition={loop(1.8, i * 0.25)}
          style={{ transformOrigin: `${x}px 67px` }}
        />
      ))}
    </Frame>
  );
}

// AI Tools — hidden costs: a coin with a worried face + a price tag.
function HiddenCostsAiWriting() {
  return (
    <Frame from='#eef1f7' to='#e2eaf4'>
      <circle
        cx='44'
        cy='52'
        r='18'
        fill='#e0a83f'
        stroke={INK}
        strokeWidth='2.4'
      />
      <circle
        cx='44'
        cy='52'
        r='13'
        fill='none'
        stroke={INK}
        strokeWidth='1.2'
        opacity='0.5'
      />
      <circle cx='39' cy='48' r='1.6' fill={INK} />
      <circle cx='49' cy='48' r='1.6' fill={INK} />
      <path
        d='M40 58 Q44 55 48 58'
        fill='none'
        stroke={INK}
        strokeWidth='1.8'
      />
      <motion.g
        animate={{ y: [0, -2.5, 0], rotate: [-4, 4, -4] }}
        transition={loop(2)}
        style={{ transformOrigin: '66px 32px' }}
      >
        <path
          d='M60 26 L72 26 L74 36 L62 40 Z'
          fill='#c2502e'
          stroke={INK}
          strokeWidth='2'
        />
        <circle
          cx='63'
          cy='29.5'
          r='1.4'
          fill='#fff'
          stroke={INK}
          strokeWidth='1'
        />
        <text
          x='67'
          y='35'
          textAnchor='middle'
          fontSize='6'
          fontWeight='800'
          fill='#fff'
        >
          $?
        </text>
      </motion.g>
    </Frame>
  );
}

// Indie Dev — solo founding: a little climber planting a flag on a hill.
function SoloFounding() {
  const d = 'M10 72 Q30 66 44 50 T84 28';
  return (
    <Frame from='#eef3e9' to='#dfe9d2'>
      <path
        d='M6 74 Q40 70 60 62 T96 70 L96 80 L6 80 Z'
        fill='#9caf6e'
        opacity='0.35'
      />
      <path
        d={d}
        fill='none'
        stroke='#6f8a4f'
        strokeWidth='2.4'
        opacity='0.45'
      />
      <motion.path
        d={d}
        fill='none'
        stroke='#6f8a4f'
        strokeWidth='2'
        strokeDasharray='4 6'
        animate={{ strokeDashoffset: [0, -20] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
      />
      {/* climber */}
      <motion.g animate={{ y: [0, -1.6, 0] }} transition={loop(1.6)}>
        <circle
          cx='60'
          cy='40'
          r='3.4'
          fill='#e2693f'
          stroke={INK}
          strokeWidth='1.8'
        />
        <path
          d='M60 43 L60 50 M60 46 L56 49 M60 46 L64 48 M60 50 L57 55 M60 50 L63 55'
          stroke={INK}
          strokeWidth='1.8'
          fill='none'
        />
      </motion.g>
      {/* flag */}
      <line x1='84' y1='28' x2='84' y2='14' stroke={INK} strokeWidth='2' />
      <motion.path
        d='M84 15 Q90 16 95 14 Q90 20 95 22 Q89 21 84 23 Z'
        fill='#c2502e'
        stroke={INK}
        strokeWidth='1.6'
        animate={{ skewX: [0, 6, 0] }}
        transition={loop(1.4)}
        style={{ transformOrigin: '84px 18px' }}
      />
    </Frame>
  );
}

// Development — React Server Components: a doodled spinning atom.
function ReactServerComponents() {
  return (
    <Frame from='#eef1f7' to='#e2eaf4'>
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '50px 48px' }}
      >
        <ellipse
          cx='50'
          cy='48'
          rx='26'
          ry='10'
          fill='none'
          stroke='#6a9bcc'
          strokeWidth='2.2'
        />
        <ellipse
          cx='50'
          cy='48'
          rx='26'
          ry='10'
          fill='none'
          stroke='#5a86c5'
          strokeWidth='2.2'
          transform='rotate(60 50 48)'
        />
        <ellipse
          cx='50'
          cy='48'
          rx='26'
          ry='10'
          fill='none'
          stroke='#7aa6d8'
          strokeWidth='2.2'
          transform='rotate(120 50 48)'
        />
      </motion.g>
      <circle
        cx='50'
        cy='48'
        r='5.5'
        fill='#6a9bcc'
        stroke={INK}
        strokeWidth='2'
      />
      <circle cx='48' cy='47' r='1.2' fill='#fff' />
      <circle cx='52' cy='47' r='1.2' fill='#fff' />
      <path
        d='M47.5 50.5 Q50 52.5 52.5 50.5'
        fill='none'
        stroke='#fff'
        strokeWidth='1.4'
      />
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

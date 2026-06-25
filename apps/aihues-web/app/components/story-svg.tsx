'use client';

import { motion } from 'framer-motion';
import type { ComponentType, ReactNode } from 'react';

/* Hand-authored, per-article Stories visuals — SVG + Framer Motion, on a light
   warm AIHues surface, text in the Radiance display font. Each export below is
   a bespoke composition (centred, premium); StoryArt renders the matching one
   by slug and falls back to the canvas interpreter for not-yet-migrated slugs.
   Coordinates are a 0..100 viewBox (centred via preserveAspectRatio). */

const FONT = '"Radiance", var(--font-noto-sans), "Noto Sans", sans-serif';
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
      >
        {children}
      </svg>
    </div>
  );
}

// Growth — Product Hunt launch: a centred podium with a bobbing upvote.
function LaunchProductHunt() {
  return (
    <Frame from='#f9efe7' to='#f1d9c6'>
      <line
        x1='24'
        y1='78'
        x2='76'
        y2='78'
        stroke='rgba(58,53,44,0.18)'
        strokeWidth='1'
      />
      <rect x='30' y='50' width='12' height='28' rx='3' fill='#d97757' />
      <rect x='58' y='46' width='12' height='32' rx='3' fill='#e2693f' />
      <rect x='44' y='34' width='12' height='44' rx='3' fill='#c2502e' />
      <text
        x='50'
        y='55'
        textAnchor='middle'
        fontSize='11'
        fontWeight='800'
        fill='#faf6ee'
      >
        #1
      </text>
      <motion.g animate={{ y: [0, -4, 0] }} transition={loop(1.8)}>
        <path
          d='M43 26 L50 16.5 L57 26'
          fill='none'
          stroke='#c2502e'
          strokeWidth='3.4'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <line
          x1='50'
          y1='18.5'
          x2='50'
          y2='30'
          stroke='#c2502e'
          strokeWidth='3.4'
          strokeLinecap='round'
        />
      </motion.g>
    </Frame>
  );
}

// AI Tools — Claude vs GPT: two pulsing orbs with a VS.
function ClaudeVsGpt() {
  return (
    <Frame from='#eef1f7' to='#dde6f1'>
      <motion.circle
        cx='33'
        cy='47'
        fill='#5a86c5'
        animate={{ r: [14, 15.4, 14] }}
        transition={loop(1.6)}
      />
      <motion.circle
        cx='67'
        cy='47'
        fill='#c2502e'
        animate={{ r: [15.4, 14, 15.4] }}
        transition={loop(1.6)}
      />
      <text
        x='33'
        y='52'
        textAnchor='middle'
        fontSize='15'
        fontWeight='800'
        fill='#faf6ee'
      >
        C
      </text>
      <text
        x='67'
        y='52'
        textAnchor='middle'
        fontSize='15'
        fontWeight='800'
        fill='#faf6ee'
      >
        G
      </text>
      <text
        x='50'
        y='51'
        textAnchor='middle'
        fontSize='9'
        fontWeight='800'
        fill='#2f2a22'
      >
        VS
      </text>
    </Frame>
  );
}

// Growth — ASO: a centred app icon with a twinkling star rating.
function AppStoreOptimization() {
  const stars = [34, 42, 50, 58, 66];
  return (
    <Frame from='#f7f2e7' to='#eddcc1'>
      <rect x='36' y='24' width='28' height='28' rx='8' fill='#cf9836' />
      <text
        x='50'
        y='44'
        textAnchor='middle'
        fontSize='15'
        fontWeight='800'
        fill='#faf6ee'
      >
        A
      </text>
      {stars.map((x, i) => (
        <motion.text
          key={x}
          x={x}
          y='72'
          textAnchor='middle'
          fontSize='6.5'
          fill='#e0a83f'
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={loop(1.8, i * 0.25)}
        >
          ★
        </motion.text>
      ))}
    </Frame>
  );
}

// AI Tools — hidden costs: a centred coin stack under a bobbing warning.
function HiddenCostsAiWriting() {
  return (
    <Frame from='#eef1f7' to='#dde6f1'>
      <rect x='36' y='58' width='28' height='8' rx='4' fill='#cf9836' />
      <rect x='36' y='49' width='28' height='8' rx='4' fill='#e0a83f' />
      <rect x='36' y='40' width='28' height='8' rx='4' fill='#cf9836' />
      <text
        x='50'
        y='46.5'
        textAnchor='middle'
        fontSize='6.5'
        fontWeight='800'
        fill='#2f2a22'
      >
        $
      </text>
      <motion.g animate={{ y: [0, -2.5, 0] }} transition={loop(1.6)}>
        <path
          d='M42 32 L50 19 L58 32 Z'
          fill='none'
          stroke='#c2502e'
          strokeWidth='3'
          strokeLinejoin='round'
        />
        <text
          x='50'
          y='30'
          textAnchor='middle'
          fontSize='7'
          fontWeight='800'
          fill='#c2502e'
        >
          !
        </text>
      </motion.g>
    </Frame>
  );
}

// Indie Dev — solo founding: a winding journey with a flowing dashed trail.
function SoloFounding() {
  const d = 'M12 66 C24 40, 34 64, 46 40 S66 56, 86 26';
  return (
    <Frame from='#eef3e9' to='#dce7d2'>
      <path
        d={d}
        fill='none'
        stroke='#9caf6e'
        strokeWidth='3'
        strokeLinecap='round'
        opacity='0.5'
      />
      <motion.path
        d={d}
        fill='none'
        stroke='#6f8a4f'
        strokeWidth='2'
        strokeLinecap='round'
        strokeDasharray='5 6'
        animate={{ strokeDashoffset: [0, -22] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
      />
      <circle cx='12' cy='66' r='2.6' fill='#6f8a4f' />
      <line x1='86' y1='26' x2='86' y2='13' stroke='#2f2a22' strokeWidth='2' />
      <path d='M86 13 L95 17 L86 21 Z' fill='#e2693f' />
    </Frame>
  );
}

// Development — React Server Components: server → browser, data flowing.
function ReactServerComponents() {
  return (
    <Frame from='#eef1f7' to='#dde6f1'>
      <rect
        x='12'
        y='32'
        width='26'
        height='36'
        rx='4'
        fill='rgba(58,53,44,0.05)'
        stroke='#5a86c5'
        strokeWidth='1.2'
      />
      {[38, 49, 60].map((y, i) => (
        <motion.circle
          key={y}
          cx='17'
          cy={y}
          r='1.4'
          fill='#6f8a4f'
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={loop(1.6, i * 0.5)}
        />
      ))}
      <rect
        x='62'
        y='32'
        width='26'
        height='36'
        rx='5'
        fill='rgba(58,53,44,0.05)'
        stroke='#6a9bcc'
        strokeWidth='1.2'
      />
      <line
        x1='62'
        y1='40'
        x2='88'
        y2='40'
        stroke='rgba(106,155,204,0.5)'
        strokeWidth='1'
      />
      <rect x='66' y='46' width='14' height='3' rx='1.5' fill='#6a9bcc' />
      <rect
        x='66'
        y='53'
        width='18'
        height='3'
        rx='1.5'
        fill='rgba(58,53,44,0.25)'
      />
      <motion.line
        x1='38'
        y1='50'
        x2='62'
        y2='50'
        stroke='#6a9bcc'
        strokeWidth='2'
        strokeDasharray='5 6'
        animate={{ strokeDashoffset: [0, -22] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
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

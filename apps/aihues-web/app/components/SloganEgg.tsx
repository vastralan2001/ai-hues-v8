'use client';

import { useRef, useState } from 'react';
import {
  motion,
  type TargetAndTransition,
  type Transition,
} from 'framer-motion';
import confetti from 'canvas-confetti';

import { BrandWord } from '@/components/Logo';

/* Home-band slogan easter eggs. Hovering the keyword makes the TEXT react to its
   own meaning: "heavy lifting" gets crushed under a barbell, "overworked" droops
   in fatigue, "pay grade" rains coins (canvas-confetti), and "noise" trembles
   between sound waves. Everything is transform/overlay-based — no layout shift. */

type Egg = 'lifting' | 'overworked' | 'paygrade' | 'noise';

function rainCoins(el: HTMLElement | null) {
  if (!el || typeof window === 'undefined') return;
  const r = el.getBoundingClientRect();
  const origin = {
    x: (r.left + r.width / 2) / window.innerWidth,
    y: Math.max(0, r.top / window.innerHeight),
  };
  const coin = confetti.shapeFromText
    ? confetti.shapeFromText({ text: '🪙', scalar: 2 })
    : undefined;
  confetti({
    particleCount: 16,
    spread: 55,
    startVelocity: 26,
    gravity: 1.5,
    ticks: 110,
    scalar: 1.8,
    origin,
    shapes: coin ? [coin] : undefined,
    colors: coin ? undefined : ['#e0a83f', '#cf9836', '#f0b449'],
    disableForReducedMotion: true,
  });
}

function WaveArcs() {
  return (
    <svg viewBox='0 0 16 24' width='16' height='24'>
      <g
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
      >
        <path d='M3 8 a 6 6 0 0 1 0 8' />
        <path d='M8 5 a 11 11 0 0 1 0 14' />
        <path d='M13 2.5 a 16 16 0 0 1 0 19' />
      </g>
    </svg>
  );
}

function EggWord({ word, egg }: { word: string; egg: Egg }) {
  const [on, setOn] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  const enter = () => {
    setOn(true);
    if (egg === 'paygrade') rainCoins(ref.current);
  };
  const leave = () => setOn(false);

  // "overworked" droops letter by letter, like it's tired.
  if (egg === 'overworked') {
    return (
      <span
        ref={ref}
        className='egg-word'
        onMouseEnter={enter}
        onMouseLeave={leave}
      >
        <motion.span
          className='egg-overlay egg-sweat'
          aria-hidden='true'
          animate={
            on ? { opacity: [0, 1, 0], y: [0, 13] } : { opacity: 0, y: 0 }
          }
          transition={{
            duration: 1,
            repeat: on ? Infinity : 0,
            ease: 'easeIn',
          }}
        >
          💧
        </motion.span>
        {word.split('').map((ch, i) => (
          <motion.span
            key={i}
            style={{
              display: 'inline-block',
              transformOrigin: 'top center',
              whiteSpace: 'pre',
            }}
            animate={
              on
                ? { rotate: 11, y: 2, opacity: 0.75 }
                : { rotate: 0, y: 0, opacity: 1 }
            }
            transition={{
              delay: i * 0.035,
              type: 'spring',
              stiffness: 280,
              damping: 13,
            }}
          >
            {ch}
          </motion.span>
        ))}
      </span>
    );
  }

  let anim: TargetAndTransition = {};
  let trans: Transition = {};
  if (egg === 'lifting') {
    anim = on ? { scaleY: 0.58, y: 1 } : { scaleY: 1, y: 0 };
    trans = { type: 'spring', stiffness: 420, damping: 15 };
  } else if (egg === 'noise') {
    anim = on
      ? { x: [-1.6, 1.6, -1.3, 1.3, -1.6], rotate: [-1, 1.2, -1] }
      : { x: 0, rotate: 0 };
    trans = on ? { duration: 0.15, repeat: Infinity } : {};
  } else if (egg === 'paygrade') {
    anim = on ? { y: [0, -4, 0] } : { y: 0 };
    trans = on ? { duration: 0.5, repeat: Infinity, ease: 'easeInOut' } : {};
  }

  const waveAnim = on
    ? { opacity: [0, 1, 0], scale: [0.6, 1.25] }
    : { opacity: 0, scale: 0.6 };
  const waveTrans: Transition = {
    duration: 0.7,
    repeat: on ? Infinity : 0,
    ease: 'easeOut',
  };

  return (
    <span
      ref={ref}
      className='egg-word'
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      {egg === 'lifting' ? (
        <motion.svg
          className='egg-barbell'
          viewBox='0 0 200 14'
          fill='var(--color-accent)'
          aria-hidden='true'
          initial={false}
          animate={on ? { y: 0, opacity: 1 } : { y: -9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 520, damping: 17 }}
        >
          <rect x='24' y='5' width='152' height='4' rx='2' />
          <rect x='14' y='1' width='8' height='12' rx='2' />
          <rect x='178' y='1' width='8' height='12' rx='2' />
          <rect x='6' y='3.5' width='6' height='7' rx='1.5' />
          <rect x='188' y='3.5' width='6' height='7' rx='1.5' />
        </motion.svg>
      ) : null}
      {egg === 'noise' ? (
        <>
          <span className='egg-wave egg-wave-l' aria-hidden='true'>
            <motion.span
              style={{ display: 'inline-block' }}
              animate={waveAnim}
              transition={waveTrans}
            >
              <WaveArcs />
            </motion.span>
          </span>
          <span className='egg-wave egg-wave-r' aria-hidden='true'>
            <motion.span
              style={{ display: 'inline-block' }}
              animate={waveAnim}
              transition={{ ...waveTrans, delay: 0.12 }}
            >
              <WaveArcs />
            </motion.span>
          </span>
        </>
      ) : null}
      <motion.span
        style={{ display: 'inline-block', transformOrigin: 'bottom center' }}
        animate={anim}
        transition={trans}
      >
        {word}
      </motion.span>
    </span>
  );
}

export function SloganEgg({
  slogan,
  keyword,
  egg,
}: {
  slogan: string;
  keyword: string;
  egg: Egg;
}) {
  const idx = slogan.toLowerCase().indexOf(keyword.toLowerCase());
  if (idx < 0) return <BrandWord>{slogan}</BrandWord>;
  const before = slogan.slice(0, idx);
  const word = slogan.slice(idx, idx + keyword.length);
  const after = slogan.slice(idx + keyword.length);
  return (
    <>
      {before ? <BrandWord>{before}</BrandWord> : null}
      <EggWord word={word} egg={egg} />
      {after}
    </>
  );
}

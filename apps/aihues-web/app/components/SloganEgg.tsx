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
        {/* 暴汗黄豆 — a few big, fat bean-shaped sweat drops that BURST out at
            the tail (the soybean-emoji look), then trickle down and off. The
            quick pop happens in the first ~16% of the cycle (times), then the
            drop flows down the rest of the way, accelerating like a real bead. */}
        {[
          { left: '84%', top: -3, size: 17, fall: 34, delay: 0.0, dur: 1.5 },
          { left: '100%', top: 1, size: 14, fall: 30, delay: 0.55, dur: 1.4 },
          { left: '92%', top: -5, size: 15, fall: 38, delay: 1.1, dur: 1.6 },
        ].map((d, i) => (
          <motion.span
            key={i}
            aria-hidden='true'
            style={{
              position: 'absolute',
              top: d.top,
              left: d.left,
              lineHeight: 0,
              transformOrigin: 'center bottom',
              pointerEvents: 'none',
              zIndex: 5,
            }}
            animate={
              on
                ? {
                    opacity: [0, 1, 1, 0],
                    scale: [0.3, 1.12, 1, 1],
                    y: [0, 1, d.fall * 0.45, d.fall],
                  }
                : { opacity: 0, scale: 0.3, y: 0 }
            }
            transition={{
              duration: d.dur,
              times: [0, 0.16, 0.55, 1],
              delay: d.delay,
              repeat: on ? Infinity : 0,
              repeatDelay: 0.3,
              ease: 'easeIn',
            }}
          >
            <svg
              width={d.size}
              height={d.size * 1.32}
              viewBox='0 0 12 16'
              fill='none'
            >
              <path
                d='M6 1C6 1 1.5 8 1.5 11A4.5 4.5 0 0 0 10.5 11C10.5 8 6 1 6 1Z'
                fill='#5ea0e0'
              />
              <ellipse
                cx='4.3'
                cy='11'
                rx='1.5'
                ry='2'
                fill='#cfe6fa'
                opacity='0.8'
              />
            </svg>
          </motion.span>
        ))}
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
    // crushed under the bar, then a slow strained attempt to push back up that
    // never quite makes it — the struggle of heavy lifting.
    anim = on
      ? { scaleY: [0.58, 0.72, 0.61, 0.74, 0.58], y: [1, 0.3, 0.7, 0.2, 1] }
      : { scaleY: 1, y: 0 };
    trans = on
      ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
      : { type: 'spring', stiffness: 420, damping: 15 };
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
          // the bar rises and sinks in lockstep with the word's 2.2s lift
          // struggle below — heaved up on the strain, settling back as it sags
          animate={
            on ? { opacity: 1, y: [0, -2.5, -1, -3, 0] } : { opacity: 0, y: -9 }
          }
          transition={
            on
              ? {
                  y: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
                  opacity: { duration: 0.25 },
                }
              : { type: 'spring', stiffness: 520, damping: 17 }
          }
        >
          {/* the bar bows symmetrically in the middle under the load, flexing
              as the lift is fought for */}
          <motion.path
            fill='none'
            stroke='var(--color-accent)'
            strokeWidth='4'
            strokeLinecap='round'
            initial={false}
            animate={
              on
                ? {
                    d: [
                      'M24 7 Q100 12 176 7',
                      'M24 7 Q100 9 176 7',
                      'M24 7 Q100 12 176 7',
                    ],
                  }
                : { d: 'M24 7 Q100 7 176 7' }
            }
            transition={
              on
                ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
                : { type: 'spring', stiffness: 520, damping: 17 }
            }
          />
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

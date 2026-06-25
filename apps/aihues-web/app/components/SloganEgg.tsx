'use client';

import type { ReactNode } from 'react';

import { BrandWord } from '@/components/Logo';

/* Home-band slogan with a hidden easter egg: hovering the keyword reveals a tiny
   semantically-matched animation above it (absolutely positioned, so it never
   affects layout). One per band: heavy lifting → barbell, overworked → coffee,
   pay grade → flipping coin, noise → sound waves. */

type Egg = 'lifting' | 'overworked' | 'paygrade' | 'noise';

function Barbell() {
  return (
    <svg viewBox='0 0 40 24' width='40' height='24' fill='currentColor'>
      <g className='egg-lift'>
        <rect x='7' y='10' width='26' height='3.5' rx='1.5' />
        <rect x='3' y='6' width='5' height='12' rx='1.4' />
        <rect x='32' y='6' width='5' height='12' rx='1.4' />
        <rect x='0.5' y='8' width='3' height='8' rx='1.2' />
        <rect x='36.5' y='8' width='3' height='8' rx='1.2' />
      </g>
    </svg>
  );
}

function Coffee() {
  return (
    <svg viewBox='0 0 32 28' width='30' height='26'>
      <g
        className='egg-steam'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.6'
        strokeLinecap='round'
      >
        <path d='M12 9 q-2.5 -3 0 -6' />
        <path d='M20 9 q2.5 -3 0 -6' />
      </g>
      <path
        d='M6 12 h17 v5 a5 5 0 0 1 -5 5 h-7 a5 5 0 0 1 -5 -5 z'
        fill='currentColor'
      />
      <path
        d='M23 13 a3.5 3.5 0 0 1 0 7'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
      />
    </svg>
  );
}

function Coin() {
  return (
    <svg viewBox='0 0 24 24' width='24' height='24'>
      <g className='egg-coin'>
        <circle cx='12' cy='12' r='9.5' fill='currentColor' />
        <text
          x='12'
          y='16.5'
          textAnchor='middle'
          fontSize='13'
          fontWeight='900'
          fill='#fff'
        >
          $
        </text>
      </g>
    </svg>
  );
}

function Waves() {
  return (
    <svg viewBox='0 0 40 24' width='40' height='24'>
      <circle cx='9' cy='12' r='2.6' fill='currentColor' />
      <g
        className='egg-waves'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
      >
        <path className='egg-w1' d='M14 8 a 6 6 0 0 1 0 8' />
        <path className='egg-w2' d='M19 5 a 10 10 0 0 1 0 14' />
        <path className='egg-w3' d='M24 2.5 a 14 14 0 0 1 0 19' />
      </g>
    </svg>
  );
}

const ANIM: Record<Egg, ReactNode> = {
  lifting: <Barbell />,
  overworked: <Coffee />,
  paygrade: <Coin />,
  noise: <Waves />,
};

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
      <span className='egg-word'>
        <span className='egg-anim' aria-hidden='true'>
          {ANIM[egg]}
        </span>
        {word}
      </span>
      {after}
    </>
  );
}

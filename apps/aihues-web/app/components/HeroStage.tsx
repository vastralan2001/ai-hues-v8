'use client';

import { type ReactNode, useState } from 'react';

import { slidesFromPicks } from '@/lib/spotlight-picks';
import SpotlightCarousel from './SpotlightCarousel';

const PALETTES = [
  'radial-gradient(140% 130% at 8% -10%, rgba(194,80,46,0.42), transparent 60%), radial-gradient(120% 120% at 100% 110%, rgba(217,140,70,0.30), transparent 60%)',
  'radial-gradient(140% 130% at 100% -10%, rgba(199,150,66,0.46), transparent 60%), radial-gradient(120% 120% at 0% 110%, rgba(194,80,46,0.28), transparent 60%)',
  'radial-gradient(140% 130% at 100% 110%, rgba(176,72,96,0.40), transparent 60%), radial-gradient(120% 120% at 0% -10%, rgba(217,119,87,0.30), transparent 60%)',
  'radial-gradient(140% 130% at 0% 110%, rgba(120,90,166,0.34), transparent 60%), radial-gradient(120% 120% at 100% -10%, rgba(199,150,66,0.30), transparent 60%)',
  'radial-gradient(140% 130% at 50% -20%, rgba(217,119,87,0.40), transparent 60%), radial-gradient(120% 120% at 50% 120%, rgba(176,72,96,0.26), transparent 60%)',
];

export default function HeroStage({
  marquee,
  children,
}: {
  marquee?: ReactNode;
  children: ReactNode;
}) {
  const [active, setActive] = useState(0);
  const slides = slidesFromPicks();

  const layers = PALETTES.slice(
    0,
    Math.max(1, Math.min(slides.length, PALETTES.length))
  );

  return (
    <section className='relative isolate flex min-h-[88vh] flex-col justify-center gap-12 overflow-x-clip py-12 lg:min-h-[calc(100vh-76px)]'>
      {/* Crossfading full-viewport gradient — shifts with the active slide */}
      {layers.map((bg, i) => (
        <div
          key={i}
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 -z-10'
          style={{
            background: bg,
            opacity: i === active % layers.length ? 1 : 0,
            transition: 'opacity 900ms ease',
          }}
        />
      ))}
      {/* Soft vignette */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 -z-10'
        style={{
          background:
            'radial-gradient(120% 100% at 50% 45%, transparent 60%, rgba(26,26,25,0.06) 100%)',
        }}
      />
      {/* Bottom fade into page */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40'
        style={{
          background:
            'linear-gradient(to bottom, transparent, var(--color-bg))',
        }}
      />

      {/* Upper — full-width two-column stage */}
      <div className='w-full px-[clamp(1.5rem,5vw,7rem)]'>
        <div className='mx-auto grid w-full max-w-[1760px] items-center gap-12 lg:grid-cols-2 lg:gap-16'>
          {children}
          {slides.length > 0 ? (
            <div className='w-full min-w-0'>
              <SpotlightCarousel slides={slides} onIndexChange={setActive} />
            </div>
          ) : null}
        </div>
      </div>

      {marquee ? <div className='w-full'>{marquee}</div> : null}
    </section>
  );
}

'use client';

import { type ReactNode, useEffect, useState } from 'react';

import HeroSearch from '@/components/HeroSearch';
import { BrandWord } from '@/components/Logo';
import SyncedTypewriter from '@/components/SyncedTypewriter';
import { categoryColor, categoryThemeStyle } from '@/lib/category-brand';
import type { HeroScene } from '@/lib/spotlight-picks';
import type { Locale } from '@/lib/dict';
import SpotlightCarousel from './SpotlightCarousel';

/* The hero — one typewriter cadence drives everything. A timer advances the
   target word; the typewriter erases the old word, and the moment it's cleared
   the carousel slides to the next scene and the slogan, background hue, Ask-AI
   button colour and search placeholder all flip together. Scene slides are built
   on the server from the same data the home bands use, so ids stay consistent. */
export default function HeroStage({
  scenes,
  locale = 'en',
  askAILabel,
  searchPlaceholder,
  marquee,
}: {
  scenes: HeroScene[];
  locale?: Locale;
  askAILabel: string;
  searchPlaceholder: string;
  marquee?: ReactNode;
}) {
  const [active, setActive] = useState(0);
  // `committed` lags `active` until the typewriter finishes deleting the old
  // word — carousel, slogan, hue, Ask-AI colour + placeholder all flip then.
  const [committed, setCommitted] = useState(0);
  const slides = scenes.map((s) => s.slide);
  const len = scenes.length || 1;

  // Advance the target word on a steady cadence; the typewriter handles the
  // erase→type, and onCleared commits the rest in lockstep.
  useEffect(() => {
    if (len <= 1) return;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const t = setInterval(() => setActive((p) => (p + 1) % len), 3400);
    return () => clearInterval(t);
  }, [len]);

  const a = active % len; // typewriter target
  const i = committed % len; // synced visuals
  const scene = scenes[i];
  const typeScene = scenes[a];
  const zh = locale === 'zh';
  const typeHue = typeScene
    ? categoryColor(typeScene.cat)
    : 'var(--color-accent)';
  const hue = scene ? categoryColor(scene.cat) : 'var(--color-accent)';

  return (
    <section className='relative isolate flex min-h-[88vh] flex-col justify-center gap-12 overflow-x-clip py-12 lg:min-h-[calc(100vh-76px)]'>
      {/* Background — a soft two-point wash tinted with the committed family's
          hue, cross-fading as the scene commits. */}
      {scenes.map((s, n) => {
        const h = categoryColor(s.cat);
        return (
          <div
            key={s.cat}
            aria-hidden='true'
            className='pointer-events-none absolute inset-0 -z-10'
            style={{
              background: `radial-gradient(140% 130% at 12% -10%, color-mix(in srgb, ${h} 36%, transparent), transparent 60%), radial-gradient(120% 120% at 100% 110%, color-mix(in srgb, ${h} 22%, transparent), transparent 60%)`,
              opacity: n === i ? 1 : 0,
              transition: 'opacity 900ms ease',
            }}
          />
        );
      })}
      {/* Soft vignette */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 -z-10'
        style={{
          background:
            'radial-gradient(120% 100% at 50% 45%, transparent 60%, rgba(26,26,25,0.06) 100%)',
        }}
      />
      {/* Top + bottom edges fade to the warm-white page colour, matching the
          FeatureBand edge fades so the hue washes meet the page seamlessly. */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-0 top-0 -z-10 h-24'
        style={{
          background:
            'linear-gradient(to bottom, var(--color-bg), transparent)',
        }}
      />
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-24'
        style={{
          background: 'linear-gradient(to top, var(--color-bg), transparent)',
        }}
      />

      {/* Upper — full-width two-column stage */}
      <div className='w-full px-[clamp(1.5rem,5vw,7rem)]'>
        <div className='mx-auto grid w-full max-w-[1760px] items-center gap-12 lg:grid-cols-2 lg:gap-16'>
          {/* LEFT — pitch + search */}
          <div className='min-w-0 text-center lg:text-left'>
            <h1 className='hero-title mb-6 text-foreground'>
              {zh ? '你的全能' : 'Your all-in-one'}
              <br />
              <SyncedTypewriter
                color={typeHue}
                onCleared={() => setCommitted(active)}
                word={
                  typeScene
                    ? zh
                      ? typeScene.typeword.zh
                      : typeScene.typeword.en
                    : ''
                }
              />
            </h1>

            <div className='mx-auto mb-9 h-[2.4em] max-w-[600px] lg:mx-0'>
              {scene ? (
                <p
                  key={i}
                  className='hero-slogan-in text-[19px] font-normal leading-snug text-foreground/85'
                >
                  <BrandWord>
                    {zh ? scene.slogan.zh : scene.slogan.en}
                  </BrandWord>
                </p>
              ) : null}
            </div>

            <div style={scene ? categoryThemeStyle(scene.cat) : undefined}>
              <HeroSearch
                askAILabel={askAILabel}
                searchPlaceholder={searchPlaceholder}
                accent={hue}
                hint={scene ? scene.query : undefined}
              />
            </div>
          </div>

          {slides.length > 0 ? (
            // Theme the carousel subtree with the committed family's hue; the
            // carousel is driven by `committed` (no auto-advance, no controls).
            <div
              className='w-full min-w-0'
              style={scene ? categoryThemeStyle(scene.cat) : undefined}
            >
              <SpotlightCarousel
                slides={slides}
                controlledIndex={i}
                controls={false}
                secondaryCta
              />
            </div>
          ) : null}
        </div>
      </div>

      {marquee ? (
        <div className='relative z-10 w-full pb-10 pt-2'>{marquee}</div>
      ) : null}
    </section>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';

import { GameDemo, GAME_DEMO_SLUGS } from '@/components/games/GameDemos';
import type { Locale } from '@/lib/dict';
import { GAME_THEMES, REACT_GAMES } from '@/lib/games';

/* A live, on-page taste of the game for the share view — so a visitor who
   lands on a shared link can see what they're getting before clicking Play.
   Games that ship an auto-play demo show that (lightweight, looping); the
   rest mount the real playable component inside their themed stage, which is
   exactly how the detail page renders them. */
export function GameSharePreview({
  slug,
  locale,
}: {
  slug: string;
  locale: Locale;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const game = REACT_GAMES[slug];
  const hasDemo = GAME_DEMO_SLUGS.includes(slug);

  useEffect(() => {
    if (!hasDemo) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), {
      threshold: 0.2,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [hasDemo]);

  if (!game) return null;
  const theme = game.theme ? GAME_THEMES[game.theme] : null;
  const Game = game.Component;

  return (
    <div ref={ref} className='mt-8'>
      <div className='mb-3 flex items-center justify-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-muted'>
        <span
          aria-hidden='true'
          className='h-1.5 w-1.5 rounded-full'
          style={{ background: theme?.glow ?? 'var(--color-accent)' }}
        />
        {locale === 'zh' ? '实机预览' : 'Live preview'}
      </div>

      {hasDemo ? (
        <div className='mx-auto max-w-[460px]'>
          <GameDemo slug={slug} active={active} />
        </div>
      ) : (
        <div
          className='relative overflow-hidden rounded-[18px] border border-border shadow-sm'
          style={{ background: theme?.bg ?? 'var(--color-surface)' }}
        >
          <div className='px-4 py-6 sm:px-6'>
            <Game locale={locale} />
          </div>
        </div>
      )}

      <p className='mt-3 text-center text-[12px] text-muted'>
        {hasDemo
          ? locale === 'zh'
            ? '自动演示 · 点下方按钮亲自上手'
            : 'Auto-play demo · hit play below to try it yourself'
          : locale === 'zh'
            ? '可直接试玩 · 想认真冲分点下方开始'
            : 'Playable right here · hit play below for the full screen'}
      </p>
    </div>
  );
}

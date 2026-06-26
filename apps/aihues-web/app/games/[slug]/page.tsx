import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Breadcrumb from '@/components/Breadcrumb';
import { JsonLd } from '@/components/JsonLd';
import RelatedItems from '@/components/RelatedItems';
import ShareButtons from '@/components/ShareButtons';
import { PageShell } from '@/components/SiteChrome';
import type { Locale } from '@/lib/dict';
import { GAME_THEMES, REACT_GAMES } from '@/lib/games';

/* Short how-to-play instructions per game, shown in a panel under the board. */
// Only games that don't already surface their own in-game instructions.
const GAME_HOWTO: Record<string, string[]> = {
  'doodle-jump': [
    'Move left / right with the arrow keys or by tapping the screen sides',
    'You bounce off every platform automatically — never stop climbing',
    'Goal: climb as high as you can without falling off the bottom',
  ],
  'daily-luck': [
    'Tap the card to draw your fortune for the day',
    'One free draw per day — come back tomorrow for the next',
    'Keep a daily streak going for bonus credits',
  ],
  'slot-machine': [
    'Press Spin to roll the 3×3 reels',
    'Match three symbols on any payline to win',
    '3 free spins a day — climb the leaderboard',
  ],
  flappy: [
    'Tap or press Space to flap upward',
    'Thread the gaps between pipes without touching them',
    'Pick a difficulty and chase your best score',
  ],
  'fruit-slash': [
    'Swipe across the flying fruit to slice it',
    'Slice several in one swipe for combo bonuses',
    'Never cut the bombs — you have three lives',
  ],
  'bullet-storm': [
    'Move with the arrow keys or by dragging',
    'Weave through the bullet patterns',
    'Survive as long as you can',
  ],
  'depth-charge': [
    'Move your ship left / right with the arrow keys',
    'Drop charges to hit the targets lurking below',
    'Time each drop carefully — sink targets for points',
  ],
};

function HowToPlay({
  items,
  dark = false,
}: {
  items: string[];
  dark?: boolean;
}) {
  return (
    <div className='mx-auto mt-12 w-full max-w-[1760px] px-[clamp(1.5rem,5vw,7rem)]'>
      <div
        className={
          dark
            ? 'rounded-[18px] border border-white/[0.12] bg-white/[0.05] p-6'
            : 'rounded-[18px] border border-border bg-surface p-6'
        }
      >
        <div
          className={`mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em] ${dark ? 'text-white/45' : 'text-accent'}`}
        >
          How to play
        </div>
        <ul className='grid gap-2.5 sm:grid-cols-2'>
          {items.map((it) => (
            <li
              key={it}
              className={`flex items-start gap-2.5 text-[14px] leading-relaxed ${dark ? 'text-white/70' : 'text-secondary'}`}
            >
              <span
                aria-hidden='true'
                className={`mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full ${dark ? 'bg-white/40' : 'bg-accent'}`}
              />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return Object.keys(REACT_GAMES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = REACT_GAMES[slug];
  if (!game) return { title: 'Game | AIHues' };
  return { title: `${game.title} | AIHues`, description: game.desc };
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = REACT_GAMES[slug];
  if (!game) notFound();
  const locale = 'en' as Locale;
  const Game = game.Component;
  const howTo = GAME_HOWTO[slug];
  const theme = game.theme ? GAME_THEMES[game.theme] : null;

  return (
    <PageShell variant='games' locale={locale}>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'VideoGame',
            name: game.title,
            description: game.desc,
            url: `https://aihues.com/games/${slug}`,
            applicationCategory: 'Game',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://aihues.com',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Games',
                item: 'https://aihues.com/games',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: game.title,
                item: `https://aihues.com/games/${slug}`,
              },
            ],
          },
        ]}
      />
      {theme ? (
        <section
          className='relative w-full overflow-hidden'
          style={{ background: theme.bg }}
        >
          {theme.quiet ? (
            <>
              {/* overhead arena spotlight */}
              <div
                aria-hidden='true'
                className='pointer-events-none absolute left-1/2 top-[-18%] h-[78%] w-[88%] -translate-x-1/2 rounded-[50%] opacity-55 blur-[100px]'
                style={{
                  background: `radial-gradient(circle, ${theme.glow}, transparent 72%)`,
                }}
              />
              {/* soft light pooling on the court */}
              <div
                aria-hidden='true'
                className='pointer-events-none absolute inset-x-0 bottom-0 h-[48%]'
                style={{
                  background:
                    'radial-gradient(120% 100% at 50% 108%, rgba(120,140,166,0.16), transparent 70%)',
                }}
              />
            </>
          ) : (
            <>
              {/* full-screen starfield — immersive, edge to edge */}
              <div
                aria-hidden='true'
                className='pointer-events-none absolute inset-0 opacity-80'
                style={{
                  backgroundImage:
                    'radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,0.55), transparent), radial-gradient(1.5px 1.5px at 28% 62%, rgba(255,255,255,0.5), transparent), radial-gradient(1px 1px at 47% 33%, rgba(255,255,255,0.45), transparent), radial-gradient(1px 1px at 63% 12%, rgba(255,255,255,0.4), transparent), radial-gradient(1.5px 1.5px at 78% 48%, rgba(255,255,255,0.5), transparent), radial-gradient(1px 1px at 88% 74%, rgba(255,255,255,0.4), transparent), radial-gradient(1px 1px at 36% 86%, rgba(255,255,255,0.35), transparent), radial-gradient(1px 1px at 70% 90%, rgba(255,255,255,0.35), transparent)',
                  backgroundSize: '420px 420px',
                }}
              />
              {/* soft brand glow */}
              <div
                aria-hidden='true'
                className='pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[620px] -translate-x-1/2 rounded-full opacity-40 blur-3xl'
                style={{
                  background: `radial-gradient(circle, ${theme.glow}, transparent 70%)`,
                }}
              />
            </>
          )}

          <div className='relative flex min-h-[calc(100vh-76px)] flex-col pb-12 pt-8'>
            <div className='mx-auto w-full max-w-[1760px] px-[clamp(1.5rem,5vw,7rem)]'>
              <div className='mb-6 flex items-center justify-between gap-4'>
                <Breadcrumb
                  variant='dark'
                  items={[
                    { label: locale === 'zh' ? '首页' : 'Home', href: '/' },
                    {
                      label: locale === 'zh' ? '游戏' : 'Games',
                      href: '/games',
                    },
                    { label: locale === 'zh' ? game.titleZh : game.title },
                  ]}
                />
                <ShareButtons
                  className='shrink-0'
                  title={locale === 'zh' ? game.titleZh : game.title}
                  variant='dark'
                />
              </div>
              <div className='mb-6 text-center'>
                <div
                  className={`mb-2 text-[11px] font-extrabold uppercase tracking-[0.18em] ${theme.eyebrow}`}
                >
                  {locale === 'zh' ? '小游戏' : 'Mini Game'}
                </div>
                <h1 className='text-[clamp(28px,3.4vw,40px)] font-extrabold tracking-[-0.02em] text-white'>
                  {locale === 'zh' ? game.titleZh : game.title}
                </h1>
                <p className='mx-auto mt-3 max-w-[520px] text-[15px] leading-relaxed text-white/55'>
                  {locale === 'zh' ? game.descZh : game.desc}
                </p>
              </div>
            </div>
            <div
              className={`relative flex flex-1 ${theme.quiet ? 'w-full' : 'items-center justify-center px-4'}`}
            >
              <Game locale={locale} />
            </div>
            {howTo ? <HowToPlay dark items={howTo} /> : null}
            <div className='mx-auto mt-12 w-full max-w-[1760px] px-[clamp(1.5rem,5vw,7rem)]'>
              <RelatedItems
                type='game'
                slug={slug}
                locale={locale}
                variant='dark'
              />
            </div>
          </div>
        </section>
      ) : (
        <div className='mx-auto w-full max-w-[1760px] px-[clamp(1.5rem,5vw,7rem)] py-10'>
          <div className='mb-6 flex items-center justify-between gap-4'>
            <Breadcrumb
              items={[
                { label: locale === 'zh' ? '首页' : 'Home', href: '/' },
                { label: locale === 'zh' ? '游戏' : 'Games', href: '/games' },
                { label: locale === 'zh' ? game.titleZh : game.title },
              ]}
            />
            <ShareButtons
              className='shrink-0'
              title={locale === 'zh' ? game.titleZh : game.title}
            />
          </div>
          <div className='mb-8 text-center'>
            <div className='mb-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-accent'>
              {locale === 'zh' ? '小游戏' : 'Mini Game'}
            </div>
            <h1 className='text-[clamp(28px,3.4vw,40px)] font-extrabold tracking-[-0.02em] text-foreground'>
              {locale === 'zh' ? game.titleZh : game.title}
            </h1>
            <p className='mx-auto mt-3 max-w-[520px] text-[15px] leading-relaxed text-secondary'>
              {locale === 'zh' ? game.descZh : game.desc}
            </p>
          </div>
          <Game locale={locale} />
          {howTo ? <HowToPlay items={howTo} /> : null}
          <RelatedItems
            type='game'
            slug={slug}
            locale={locale}
            className='mt-12'
          />
        </div>
      )}
    </PageShell>
  );
}

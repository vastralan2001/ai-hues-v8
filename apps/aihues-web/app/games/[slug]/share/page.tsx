import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import Breadcrumb from '@/components/Breadcrumb';
import ShareButtons from '@/components/ShareButtons';
import { GameSharePreview } from '@/components/games/GameSharePreview';
import { StoryShareCard } from '@/components/StoryShareCard';
import { PageShell } from '@/components/SiteChrome';
import type { Locale } from '@/lib/dict';
import { GAME_THEMES, REACT_GAMES } from '@/lib/games';

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
  return {
    title: `Share ${game.title} | AIHues`,
    description: game.desc,
  };
}

export default async function GameSharePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ score?: string; text?: string }>;
}) {
  const { slug } = await params;
  const { score, text } = await searchParams;
  const game = REACT_GAMES[slug];
  if (!game) notFound();

  const locale = 'en' as Locale;
  const title = locale === 'zh' ? game.titleZh : game.title;
  const desc = locale === 'zh' ? game.descZh : game.desc;
  const theme = game.theme ? GAME_THEMES[game.theme] : null;
  const shareText =
    text ||
    (score
      ? `I scored ${score} in ${title} on AIHues`
      : `Play ${title} on AIHues`);
  const pageUrl = `https://aihues.com/games/${slug}`;

  const media = score ? (
    <div
      className='flex h-28 w-28 items-center justify-center rounded-[22px] border-2 border-white bg-bg text-[44px] font-black shadow-xl'
      style={{ color: theme?.glow ?? 'var(--color-accent)' }}
    >
      {score}
    </div>
  ) : (
    <div
      className='flex h-28 w-28 items-center justify-center rounded-[22px] border-2 border-white bg-bg text-[44px] shadow-xl'
      style={{ color: theme?.glow ?? 'var(--color-accent)' }}
    >
      🎮
    </div>
  );

  return (
    <PageShell variant='default' locale={locale}>
      <section className='mx-auto min-h-[calc(100vh-140px)] max-w-[720px] px-6 py-10'>
        <Breadcrumb
          items={[
            { label: locale === 'zh' ? '首页' : 'Home', href: '/' },
            { label: locale === 'zh' ? '游戏' : 'Games', href: '/games' },
            { label: title, href: `/games/${slug}` },
            { label: locale === 'zh' ? '分享' : 'Share' },
          ]}
        />

        <div className='mt-10'>
          <StoryShareCard
            seed={`game-${slug}`}
            sky={theme?.sky ?? ['#f3f1ea', '#faf9f5']}
            accent={theme?.glow ?? 'var(--color-accent)'}
            variant={theme?.variant ?? 'day'}
            backgroundImage={theme?.backgroundImage}
            eyebrow={locale === 'zh' ? '小游戏' : 'Mini Game'}
            title={title}
            subtitle={desc}
            media={media}
          >
            <div className='text-center'>
              {score && (
                <div className='mb-5 text-[12px] font-bold uppercase tracking-[0.16em] text-muted'>
                  {locale === 'zh' ? '得分' : 'Score'}:{' '}
                  <span
                    className='text-[18px] font-black'
                    style={{ color: theme?.glow ?? 'var(--color-accent)' }}
                  >
                    {score}
                  </span>
                </div>
              )}

              <div className='flex flex-col items-center gap-4'>
                <ShareButtons title={shareText} url={pageUrl} />
                <Link
                  href={`/games/${slug}`}
                  className='inline-flex items-center rounded-[12px] px-7 py-2.5 text-[14px] font-semibold text-white transition-transform hover:-translate-y-0.5'
                  style={{
                    background: theme?.glow ?? 'var(--color-accent)',
                  }}
                >
                  {locale === 'zh' ? '开始玩' : 'Play now'}
                </Link>
              </div>
            </div>
          </StoryShareCard>
        </div>

        <GameSharePreview slug={slug} locale={locale} />

        <p className='mt-6 text-center text-[12px] text-muted'>
          {locale === 'zh'
            ? '分享给你的朋友，挑战他们的最高分。'
            : 'Share with friends and challenge their high score.'}
        </p>
      </section>
    </PageShell>
  );
}

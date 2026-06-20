import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import BasketballGame from '@/components/games/BasketballGame';
import ChessGame from '@/components/games/ChessGame';
import ColorHuntGame from '@/components/games/ColorHuntGame';
import DailyFortuneGame from '@/components/games/DailyFortuneGame';
import DoodleJumpGame from '@/components/games/DoodleJumpGame';
import SlotMachineGame from '@/components/games/SlotMachineGame';
import SnakeGame from '@/components/games/SnakeGame';
import { PageShell } from '@/components/SiteChrome';
import type { Locale } from '@/lib/dict';

type Theme =
  | 'space'
  | 'gold'
  | 'vegas'
  | 'court'
  | 'grid'
  | 'spectrum'
  | 'royal';

interface PlayableGame {
  Component: React.ComponentType<{ locale: Locale }>;
  title: string;
  titleZh: string;
  desc: string;
  descZh: string;
  theme?: Theme;
}

const REACT_GAMES: Record<string, PlayableGame> = {
  'doodle-jump': {
    Component: DoodleJumpGame,
    title: 'Doodle Jump',
    titleZh: 'Doodle Jump',
    desc: 'Hop from ledge to ledge across a starry sky — how high can you climb?',
    descZh: '在星空下的平台间不断跳跃,看你能跳多高?',
    theme: 'space',
  },
  'daily-luck': {
    Component: DailyFortuneGame,
    title: 'Daily Fortune',
    titleZh: '每日运势',
    desc: 'Draw your fortune for the day — luck, wisdom and credits await.',
    descZh: '抽一签,看看今日运势、智慧与积分奖励。',
    theme: 'gold',
  },
  'slot-machine': {
    Component: SlotMachineGame,
    title: 'Lucky Slots',
    titleZh: '幸运老虎机',
    desc: 'Spin the reels across eight paylines — match three to win big.',
    descZh: '转动转盘,八条线任意连成三个即可中奖。',
    theme: 'vegas',
  },
  basketball: {
    Component: BasketballGame,
    title: 'Basketball Shootout',
    titleZh: '投篮挑战',
    desc: 'Time the sweeping arrow and sink the shot — 60 seconds on the clock.',
    descZh: '把握摆动的箭头瞄准入筐,限时 60 秒。',
    theme: 'court',
  },
  snake: {
    Component: SnakeGame,
    title: 'Snake',
    titleZh: '贪吃蛇',
    desc: 'Glide, grow, and feast on glowing pellets — just don’t bite your tail.',
    descZh: '滑行、变长、吃掉发光的食物——别咬到自己的尾巴。',
    theme: 'grid',
  },
  'color-hunt': {
    Component: ColorHuntGame,
    title: 'Color Hunt',
    titleZh: '找色差',
    desc: 'Spot the one tile with a slightly different shade.',
    descZh: '找出唯一一个颜色略有不同的方块。',
    theme: 'spectrum',
  },
  chess: {
    Component: ChessGame,
    title: 'Chess',
    titleZh: '国际象棋',
    desc: 'Play Stockfish 17, watch engines battle, or read the live evaluation.',
    descZh: '与 Stockfish 17 对弈、观看引擎对战，或查看实时局面评估。',
    theme: 'royal',
  },
};

const THEMES: Record<
  Theme,
  { bg: string; glow: string; eyebrow: string; quiet?: boolean }
> = {
  space: {
    bg: 'radial-gradient(125% 80% at 50% -10%, #121a33 0%, #0b0e18 45%, #06080e 100%)',
    glow: '#2b6fd6',
    eyebrow: 'text-[#7cc0ee]',
  },
  gold: {
    bg: 'radial-gradient(125% 80% at 50% -10%, #2c1c30 0%, #1a1018 48%, #0e0a0d 100%)',
    glow: '#d9982e',
    eyebrow: 'text-[#e7c873]',
  },
  vegas: {
    bg: 'radial-gradient(125% 80% at 50% -10%, #3a1218 0%, #1c0a0e 48%, #0d0507 100%)',
    glow: '#e0b34a',
    eyebrow: 'text-[#e7c873]',
  },
  court: {
    bg: 'radial-gradient(125% 95% at 50% 42%, #252c36 0%, #171c23 46%, #0c0e12 100%)',
    glow: '#5a6b82',
    eyebrow: 'text-white/45',
    quiet: true,
  },
  grid: {
    bg: 'radial-gradient(125% 95% at 50% 42%, #18211c 0%, #121815 46%, #0a0e0c 100%)',
    glow: '#3ba776',
    eyebrow: 'text-[#83d8ad]',
    quiet: true,
  },
  spectrum: {
    bg: 'radial-gradient(125% 95% at 50% 40%, #20242e 0%, #14171e 46%, #0b0d12 100%)',
    glow: '#6a86c0',
    eyebrow: 'text-[#9fb4dd]',
    quiet: true,
  },
  royal: {
    bg: 'radial-gradient(125% 95% at 50% 38%, #232233 0%, #16151f 46%, #0b0a10 100%)',
    glow: '#8b7bd8',
    eyebrow: 'text-[#b9aef0]',
    quiet: true,
  },
};

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
  const theme = game.theme ? THEMES[game.theme] : null;

  return (
    <PageShell variant='games' locale={locale}>
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

          <div className='relative flex min-h-[calc(100vh-76px)] flex-col pt-8'>
            <div className='mx-auto w-full max-w-[1100px] px-6'>
              <Link
                href='/games'
                className='mb-4 inline-flex items-center gap-1.5 self-start text-[13px] font-semibold text-white/55 transition-colors hover:text-white'
              >
                ← {locale === 'zh' ? '返回游戏中心' : 'Back to Games'}
              </Link>
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
          </div>
        </section>
      ) : (
        <div className='mx-auto max-w-[1100px] px-6 py-10'>
          <Link
            href='/games'
            className='mb-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-secondary transition-colors hover:text-accent'
          >
            ← {locale === 'zh' ? '返回游戏中心' : 'Back to Games'}
          </Link>
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
        </div>
      )}
    </PageShell>
  );
}

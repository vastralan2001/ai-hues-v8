import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import BasketballGame from '@/components/games/BasketballGame';
import TetrisGame from '@/components/games/TetrisGame';
import BrickBreakerGame from '@/components/games/BrickBreakerGame';
import BulletStormGame from '@/components/games/BulletStormGame';
import ChessGame from '@/components/games/ChessGame';
import ColorHuntGame from '@/components/games/ColorHuntGame';
import ComboRushGame from '@/components/games/ComboRushGame';
import DailyFortuneGame from '@/components/games/DailyFortuneGame';
import DepthChargeGame from '@/components/games/DepthChargeGame';
import DodgeArenaGame from '@/components/games/DodgeArenaGame';
import DoodleJumpGame from '@/components/games/DoodleJumpGame';
import FlappyGame from '@/components/games/FlappyGame';
import FruitSlashGame from '@/components/games/FruitSlashGame';
import GameOfLifeGame from '@/components/games/GameOfLifeGame';
import HundredFloorsGame from '@/components/games/HundredFloorsGame';
import MinesweeperGame from '@/components/games/MinesweeperGame';
import RadishSmashGame from '@/components/games/RadishSmashGame';
import SkyStrikeGame from '@/components/games/SkyStrikeGame';
import SlotMachineGame from '@/components/games/SlotMachineGame';
import SnakeGame from '@/components/games/SnakeGame';
import SudokuGame from '@/components/games/SudokuGame';
import Breadcrumb from '@/components/Breadcrumb';
import { JsonLd } from '@/components/JsonLd';
import RelatedItems from '@/components/RelatedItems';
import ShareButtons from '@/components/ShareButtons';
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
    desc: 'Play the computer, watch engines battle, or read the live evaluation.',
    descZh: '与电脑对弈、观看引擎对战，或查看实时局面评估。',
    theme: 'royal',
  },
  flappy: {
    Component: FlappyGame,
    title: 'Flappy',
    titleZh: '飞翔小鸟',
    desc: 'Flap through the gaps without crashing — pick a difficulty and chase your best.',
    descZh: '拍翅穿过缝隙别撞管——选个难度，刷新你的最高分。',
    theme: 'space',
  },
  'block-drop': {
    Component: TetrisGame,
    title: 'Tetris',
    titleZh: '俄罗斯方块',
    desc: 'Rotate and stack the falling tetrominoes, clear lines, and climb the levels.',
    descZh: '旋转、堆叠坠落的方块，消除整行，挑战更高等级。',
    theme: 'grid',
  },
  'brick-breaker': {
    Component: BrickBreakerGame,
    title: 'Brick Breaker',
    titleZh: '打砖块',
    desc: 'Bounce the ball, smash every brick, and clear the board across rising difficulty.',
    descZh: '弹起小球击碎每一块砖，在不断升级的难度中清空全场。',
    theme: 'spectrum',
  },
  'fruit-slash': {
    Component: FruitSlashGame,
    title: 'Fruit Slash',
    titleZh: '水果忍者',
    desc: 'Swipe to slice the flying fruit, chain combos, and dodge the bombs.',
    descZh: '挥刀切开飞起的水果、串联连击，别切到炸弹。',
    theme: 'spectrum',
  },
  minesweeper: {
    Component: MinesweeperGame,
    title: 'Minesweeper',
    titleZh: '扫雷',
    desc: 'Clear every safe tile without setting off a mine — flag the ones you fear.',
    descZh: '翻开所有安全格子别踩到地雷——给可疑的格子插上旗。',
    theme: 'grid',
  },
  sudoku: {
    Component: SudokuGame,
    title: 'Sudoku',
    titleZh: '数独',
    desc: 'Fill every row, column and box with 1–9 — pick a difficulty and beat your time.',
    descZh: '让每行、每列、每个九宫格都填满 1–9——选个难度，刷新你的用时。',
    theme: 'grid',
  },
  'sky-strike': {
    Component: SkyStrikeGame,
    title: 'Sky Strike',
    titleZh: '雷霆战机',
    desc: 'Fly, fire, and blast through enemy waves to the boss — drag to dodge.',
    descZh: '驾机开火，杀穿一波波敌人直面 BOSS——拖动闪避。',
    theme: 'space',
  },
  'bullet-storm': {
    Component: BulletStormGame,
    title: 'Bullet Storm',
    titleZh: '弹幕风暴',
    desc: 'Weave through a storm of bullets and survive as long as you can.',
    descZh: '在漫天弹幕中穿梭，活得越久越好。',
    theme: 'space',
  },
  'dodge-arena': {
    Component: DodgeArenaGame,
    title: 'Dodge Arena',
    titleZh: '躲避球',
    desc: 'Dodge a relentless barrage, trigger skills, and outlast rising difficulty.',
    descZh: '躲开无尽弹球、释放技能，在不断升级的难度中坚持到底。',
    theme: 'court',
  },
  'hundred-floors': {
    Component: HundredFloorsGame,
    title: 'Hundred Floors',
    titleZh: '是男人就下一百层',
    desc: 'Drop floor by floor, dodge the spikes, and mind the closing ceiling.',
    descZh: '一层层往下跳，躲开尖刺，小心步步逼近的天花板。',
    theme: 'space',
  },
  'depth-charge': {
    Component: DepthChargeGame,
    title: 'Depth Charge',
    titleZh: '深水炸弹',
    desc: 'Time your charges and sink the targets lurking in the deep.',
    descZh: '把握时机投下炸弹，击沉潜伏深海的目标。',
    theme: 'space',
  },
  'combo-rush': {
    Component: ComboRushGame,
    title: 'Combo Rush',
    titleZh: '连招大师',
    desc: 'Nail the timed inputs and chain the longest combo you can.',
    descZh: '精准命中限时指令，串起尽可能长的连招。',
    theme: 'royal',
  },
  'radish-smash': {
    Component: RadishSmashGame,
    title: 'Radish Smash',
    titleZh: '打萝卜',
    desc: 'Whack the radishes as they pop up — rack up combos before time runs out.',
    descZh: '萝卜冒头就敲——在时间耗尽前打出连击。',
    theme: 'grid',
  },
  'game-of-life': {
    Component: GameOfLifeGame,
    title: 'Game of Life',
    titleZh: '生命游戏',
    desc: 'Seed cells, press play, and watch Conway’s colony breathe and evolve.',
    descZh: '画下细胞、点击开始，看康威的细胞群呼吸、演化。',
    theme: 'grid',
  },
};

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
    <div className='mx-auto mt-12 w-full max-w-[1100px] px-6'>
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
  const howTo = GAME_HOWTO[slug];
  const theme = game.theme ? THEMES[game.theme] : null;

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
            <div className='mx-auto w-full max-w-[1100px] px-6'>
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
            <div className='mx-auto mt-12 w-full max-w-[1100px] px-6'>
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
        <div className='mx-auto max-w-[1100px] px-6 py-10'>
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

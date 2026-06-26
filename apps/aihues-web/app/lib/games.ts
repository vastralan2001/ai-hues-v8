import type { Locale } from '@/lib/dict';

import BasketballGame from '@/components/games/BasketballGame';
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
import TetrisGame from '@/components/games/TetrisGame';

export type Theme =
  | 'space'
  | 'gold'
  | 'vegas'
  | 'court'
  | 'grid'
  | 'spectrum'
  | 'royal';

export interface PlayableGame {
  Component: React.ComponentType<{ locale: Locale }>;
  title: string;
  titleZh: string;
  desc: string;
  descZh: string;
  theme?: Theme;
}

export const REACT_GAMES: Record<string, PlayableGame> = {
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

export const GAME_THEMES: Record<
  Theme,
  {
    bg: string;
    glow: string;
    eyebrow: string;
    quiet?: boolean;
    sky: [string, string];
    variant?: 'day' | 'night';
    backgroundImage?: string;
  }
> = {
  space: {
    bg: 'radial-gradient(125% 80% at 50% -10%, #121a33 0%, #0b0e18 45%, #06080e 100%)',
    glow: '#2b6fd6',
    eyebrow: 'text-[#7cc0ee]',
    sky: ['#1a2238', '#0b0e18'],
    variant: 'night',
    backgroundImage:
      'https://images.unsplash.com/photo-1502790671504-542ad42d5189?auto=format&fit=crop&w=1200&q=80',
  },
  gold: {
    bg: 'radial-gradient(125% 80% at 50% -10%, #2c1c30 0%, #1a1018 48%, #0e0a0d 100%)',
    glow: '#d9982e',
    eyebrow: 'text-[#e7c873]',
    sky: ['#2c1c30', '#1a1018'],
    variant: 'night',
    backgroundImage:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
  },
  vegas: {
    bg: 'radial-gradient(125% 80% at 50% -10%, #3a1218 0%, #1c0a0e 48%, #0d0507 100%)',
    glow: '#e0b34a',
    eyebrow: 'text-[#e7c873]',
    sky: ['#3a1218', '#1c0a0e'],
    variant: 'night',
    backgroundImage:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80',
  },
  court: {
    bg: 'radial-gradient(125% 95% at 50% 42%, #252c36 0%, #171c23 46%, #0c0e12 100%)',
    glow: '#5a6b82',
    eyebrow: 'text-white/45',
    quiet: true,
    sky: ['#e8edf3', '#d7dde8'],
    variant: 'day',
    backgroundImage:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  },
  grid: {
    bg: 'radial-gradient(125% 95% at 50% 42%, #18211c 0%, #121815 46%, #0a0e0c 100%)',
    glow: '#3ba776',
    eyebrow: 'text-[#83d8ad]',
    quiet: true,
    sky: ['#e8f0ec', '#dbe8e2'],
    variant: 'day',
    backgroundImage:
      'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1200&q=80',
  },
  spectrum: {
    bg: 'radial-gradient(125% 95% at 50% 40%, #20242e 0%, #14171e 46%, #0b0d12 100%)',
    glow: '#6a86c0',
    eyebrow: 'text-[#9fb4dd]',
    quiet: true,
    sky: ['#eaeef6', '#dde4f2'],
    variant: 'day',
    backgroundImage:
      'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?auto=format&fit=crop&w=1200&q=80',
  },
  royal: {
    bg: 'radial-gradient(125% 95% at 50% 38%, #232233 0%, #16151f 46%, #0b0a10 100%)',
    glow: '#8b7bd8',
    eyebrow: 'text-[#b9aef0]',
    quiet: true,
    sky: ['#edeaf5', '#e2ddf0'],
    variant: 'day',
    backgroundImage:
      'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?auto=format&fit=crop&w=1200&q=80',
  },
};

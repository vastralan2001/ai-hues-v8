/* Single source of truth for game-card copy — the second-line meta and the
   personalised call-to-action — shared by the homepage Game Center and the
   /games aggregation page so the two stay in sync. English-first for the
   global audience, with a zh fallback. */

export interface GameCardCopy {
  /** Second descriptive line under the card description. */
  meta: string;
  metaZh: string;
  /** Personalised call-to-action label. */
  cta: string;
  ctaZh: string;
}

export const GAME_CARD_COPY: Record<string, GameCardCopy> = {
  'doodle-jump': {
    meta: 'Endless climb · 3 speeds · Arrows / tap',
    metaZh: '无尽上跳 · 3 档速度 · 方向键 / 点触',
    cta: 'Start hopping →',
    ctaZh: '开始跳跃 →',
  },
  'daily-luck': {
    meta: '30 fortunes · Daily draw · Streak bonus',
    metaZh: '30 签 · 每日一抽 · 连签奖励',
    cta: 'Draw a fortune →',
    ctaZh: '抽一签 →',
  },
  'slot-machine': {
    meta: '3×3 reels · 3 free spins a day · Leaderboard',
    metaZh: '3×3 转轮 · 每日 3 次 · 排行榜',
    cta: 'Spin the reels →',
    ctaZh: '转一把 →',
  },
  basketball: {
    meta: '60-second dash · Physics shots · Leaderboard',
    metaZh: '60 秒挑战 · 物理投篮 · 排行榜',
    cta: 'Take the shot →',
    ctaZh: '来投篮 →',
  },
  snake: {
    meta: 'Endless · 3 speeds · Arrows / WASD / swipe',
    metaZh: '无尽 · 3 档速度 · 方向键 / WASD / 滑动',
    cta: 'Slither in →',
    ctaZh: '开溜 →',
  },
  'color-hunt': {
    meta: 'Stages & Sprint · ΔE color science',
    metaZh: '关卡 & 冲刺 · ΔE 色彩学',
    cta: 'Spot the tile →',
    ctaZh: '找不同 →',
  },
  chess: {
    meta: 'Play the engine · Spectate · Live eval',
    metaZh: '人机对弈 · 观战 · 实时评估',
    cta: 'Play a game →',
    ctaZh: '来一局 →',
  },
  flappy: {
    meta: '4 difficulties · Tap / Space · Endless',
    metaZh: '4 档难度 · 点触 / 空格 · 无尽',
    cta: 'Flap away →',
    ctaZh: '拍翅起飞 →',
  },
  'block-drop': {
    meta: '7 pieces · Levels & speed-up · Arrows',
    metaZh: '7 种方块 · 升级提速 · 方向键',
    cta: 'Stack them up →',
    ctaZh: '开始堆叠 →',
  },
  'brick-breaker': {
    meta: '3 difficulties · Random maps · Drag / arrows',
    metaZh: '3 档难度 · 随机关卡 · 拖动 / 方向键',
    cta: 'Break out →',
    ctaZh: '砸砖块 →',
  },
  'fruit-slash': {
    meta: 'Swipe combos · Dodge bombs · 3 lives',
    metaZh: '滑动连击 · 躲炸弹 · 3 条命',
    cta: 'Slice fruit →',
    ctaZh: '切水果 →',
  },
  minesweeper: {
    meta: '3 sizes · Flag & dig · Best time',
    metaZh: '3 种尺寸 · 标记 & 挖掘 · 最佳用时',
    cta: 'Clear the field →',
    ctaZh: '开始扫雷 →',
  },
  sudoku: {
    meta: '4 difficulties · Notes · Best time',
    metaZh: '4 档难度 · 笔记 · 最佳用时',
    cta: 'Fill the grid →',
    ctaZh: '填数独 →',
  },
  'sky-strike': {
    meta: 'Enemy waves & boss · Skills · Drag to fly',
    metaZh: '波次 & BOSS · 技能 · 拖动驾驶',
    cta: 'Scramble jets →',
    ctaZh: '升空作战 →',
  },
  'bullet-storm': {
    meta: 'Bullet hell · Survive · Best time',
    metaZh: '弹幕地狱 · 生存 · 最佳用时',
    cta: 'Brave the storm →',
    ctaZh: '入场闪避 →',
  },
  'dodge-arena': {
    meta: 'Skills · HP bar · Rising difficulty',
    metaZh: '技能 · 血条 · 动态难度',
    cta: 'Enter the arena →',
    ctaZh: '进入竞技场 →',
  },
  'hundred-floors': {
    meta: 'Descend · Mind the ceiling · Best depth',
    metaZh: '下坠 · 当心天花板 · 最深纪录',
    cta: 'Start the drop →',
    ctaZh: '开始下坠 →',
  },
  'depth-charge': {
    meta: 'Time your drops · Sink targets · High score',
    metaZh: '把握时机 · 击沉目标 · 高分',
    cta: 'Drop charges →',
    ctaZh: '投放炸弹 →',
  },
  'combo-rush': {
    meta: 'Timed inputs · Chain combos · High score',
    metaZh: '限时指令 · 连招 · 高分',
    cta: 'Start the combo →',
    ctaZh: '开搓连招 →',
  },
  'radish-smash': {
    meta: 'Beat the clock · Combos · Avoid bombs',
    metaZh: '限时挑战 · 连击 · 躲炸弹',
    cta: 'Start smashing →',
    ctaZh: '开锤 →',
  },
  'game-of-life': {
    meta: 'Conway’s rules · Draw cells · Play / pause',
    metaZh: '康威规则 · 绘制细胞 · 播放 / 暂停',
    cta: 'Seed life →',
    ctaZh: '播下生命 →',
  },
};

export function gameCardCopy(slug: string): GameCardCopy | undefined {
  return GAME_CARD_COPY[slug];
}

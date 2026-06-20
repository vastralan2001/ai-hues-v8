'use client';

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import {
  Activity,
  ArrowLeftRight,
  Flag,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
} from 'lucide-react';
import { Chess, type Square } from 'chess.js';

import type { Locale } from '@/lib/dict';
import {
  StockfishEngine,
  type EngineInfo,
  type SearchResult,
} from '@/lib/chess-engine';

/* Chess — a Stockfish 17.1 (WASM) powered board, Kimi-styled and borderless to
   match the other games. The square board letterboxes into the stage, blends
   into the themed background via translucent squares and a soft glowing edge,
   and renders vector-styled pieces with sliding moves, capture sparks and a
   check glow. Three ways to play share one engine: Play (human vs engine,
   pick a side and a level), Spectate (engine vs engine from any position) and
   a live eval bar that scores the position. */

const CELL = 80;
const BOARD = CELL * 8;
const GUT = 26;
const GAP = 16;
const MARGIN = 18;
const ANIM_MS = 175;
const EVAL_DEPTH = 14;
const SPECTATE_MIN_MS = 650;

const FILES = 'abcdefgh';
const GLYPH: Record<string, string> = {
  k: '♚',
  q: '♛',
  r: '♜',
  b: '♝',
  n: '♞',
  p: '♟',
};

type Mode = 'play' | 'spectate';
type Color = 'w' | 'b';
interface Piece {
  type: string;
  color: Color;
}

const LEVELS = [
  { skill: 0, depth: 5, movetime: 200 },
  { skill: 3, depth: 6, movetime: 260 },
  { skill: 6, depth: 8, movetime: 350 },
  { skill: 9, depth: 10, movetime: 480 },
  { skill: 12, depth: 12, movetime: 650 },
  { skill: 15, depth: 14, movetime: 850 },
  { skill: 18, depth: 16, movetime: 1100 },
  { skill: 20, depth: 18, movetime: 1500 },
];

const PRESET_FENS: { key: string; fen: string }[] = [
  {
    key: 'standard',
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  },
  {
    key: 'sicilian',
    fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2',
  },
  { key: 'rookEnd', fen: '4k3/8/8/8/8/8/4P3/R3K2R w KQ - 0 1' },
  { key: 'queenEnd', fen: '8/8/4k3/8/8/3K4/8/3Q4 w - - 0 1' },
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  r: number;
  c: string;
}
interface Anim {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  piece: Piece;
  t: number;
  dur: number;
}
interface CaptureFade {
  x: number;
  y: number;
  piece: Piece;
  t: number;
}
interface ChessView {
  dpr: number;
  cw: number;
  ch: number;
  scale: number;
  offX: number;
  offY: number;
  board: (Piece | null)[][];
  lastFrom: string | null;
  lastTo: string | null;
  selected: string | null;
  targets: { to: string; capture: boolean }[];
  checkSq: string | null;
  anim: Anim | null;
  captureFade: CaptureFade | null;
  particles: Particle[];
  evalCur: number;
  evalTarget: number;
  last: number;
}

const T = {
  en: {
    play: 'Play',
    spectate: 'Spectate',
    side: 'Your side',
    white: 'White',
    black: 'Black',
    random: 'Random',
    level: 'Level',
    levelNames: [
      'Beginner',
      'Casual',
      'Club',
      'Intermediate',
      'Strong',
      'Expert',
      'Master',
      'Maximum',
    ],
    whiteEngine: 'White engine',
    blackEngine: 'Black engine',
    startPos: 'Start position',
    presets: {
      standard: 'Standard',
      sicilian: 'Sicilian',
      rookEnd: 'Rook endgame',
      queenEnd: 'Queen endgame',
      custom: 'Custom FEN',
    },
    fenPlaceholder: 'Paste a FEN to start from any position',
    fenInvalid: 'That FEN is not valid.',
    evalBar: 'Eval bar',
    start: 'Start',
    loading: 'Loading engine…',
    engineFail: 'Engine failed to load. Please refresh.',
    whiteMove: 'White to move',
    blackMove: 'Black to move',
    thinking: 'Thinking',
    youWin: 'You win',
    youLose: 'Checkmate — you lose',
    whiteWins: 'White wins',
    blackWins: 'Black wins',
    drawStalemate: 'Draw — stalemate',
    drawMaterial: 'Draw — insufficient material',
    drawRepetition: 'Draw — repetition',
    drawFifty: 'Draw — 50-move rule',
    draw: 'Draw',
    resigned: 'You resigned',
    newGame: 'New game',
    setup: 'Change setup',
    undo: 'Undo',
    flip: 'Flip',
    resign: 'Resign',
    pause: 'Pause',
    resume: 'Resume',
    step: 'Step',
    restart: 'Restart',
    moves: 'Moves',
    sub: 'Play Stockfish 17, watch two engines battle, or read the live evaluation.',
    rulesTitle: 'How it works',
    rules: [
      'Play: pick your colour and a level, then move by tapping a piece and its target.',
      'Spectate: set each engine’s level and a start position — even a custom FEN.',
      'The eval bar scores the position live; white’s share rises as white takes over.',
      'Powered by Stockfish 17.1 running entirely in your browser.',
    ],
  },
  zh: {
    play: '对战',
    spectate: '观战',
    side: '你的执子',
    white: '白方',
    black: '黑方',
    random: '随机',
    level: '难度',
    levelNames: [
      '入门',
      '休闲',
      '俱乐部',
      '进阶',
      '强手',
      '专家',
      '大师',
      '满级',
    ],
    whiteEngine: '白方引擎',
    blackEngine: '黑方引擎',
    startPos: '起始局面',
    presets: {
      standard: '标准开局',
      sicilian: '西西里',
      rookEnd: '车残局',
      queenEnd: '后残局',
      custom: '自定义 FEN',
    },
    fenPlaceholder: '粘贴 FEN，从任意局面开始',
    fenInvalid: 'FEN 不合法。',
    evalBar: '评估条',
    start: '开始',
    loading: '正在加载引擎…',
    engineFail: '引擎加载失败，请刷新页面。',
    whiteMove: '白方走子',
    blackMove: '黑方走子',
    thinking: '思考中',
    youWin: '你赢了',
    youLose: '被将死——你输了',
    whiteWins: '白方胜',
    blackWins: '黑方胜',
    drawStalemate: '和棋——逼和',
    drawMaterial: '和棋——子力不足',
    drawRepetition: '和棋——三次重复',
    drawFifty: '和棋——50 回合规则',
    draw: '和棋',
    resigned: '你认输了',
    newGame: '再来一局',
    setup: '重新设置',
    undo: '悔棋',
    flip: '翻转',
    resign: '认输',
    pause: '暂停',
    resume: '继续',
    step: '单步',
    restart: '重新开始',
    moves: '棋谱',
    sub: '与 Stockfish 17 对弈、观看双引擎对战，或查看实时局面评估。',
    rulesTitle: '玩法说明',
    rules: [
      '对战：选择执子与难度，点选棋子和目标格即可走子。',
      '观战：分别设置双方引擎难度与起始局面，支持自定义 FEN。',
      '评估条实时显示局面优势，白方占优时白色部分上升。',
      '由完全在浏览器中运行的 Stockfish 17.1 驱动。',
    ],
  },
} as const;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const rnd = () => Math.random();
const nowMs = () => performance.now();
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function isValidFen(fen: string): boolean {
  try {
    new Chess(fen.trim());
    return true;
  } catch {
    return false;
  }
}

function sqToScreen(sq: string, flipped: boolean) {
  const c = FILES.indexOf(sq[0]);
  const rank = parseInt(sq[1], 10) - 1;
  const r = 7 - rank;
  return { sc: flipped ? 7 - c : c, sr: flipped ? 7 - r : r };
}

export default function ChessGame({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const tx = T[zh ? 'zh' : 'en'];

  const fieldRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gRef = useRef<ChessView | null>(null);
  const rafRef = useRef<number>(0);

  const chessRef = useRef<Chess | null>(null);
  if (chessRef.current == null) {
    chessRef.current = new Chess();
  }
  const engineRef = useRef<StockfishEngine | null>(null);
  const enginePendingRef = useRef<Promise<unknown>>(Promise.resolve());

  const phaseRef = useRef<'idle' | 'playing' | 'over'>('idle');
  const modeRef = useRef<Mode>('play');
  const humanColorRef = useRef<Color>('w');
  const levelRef = useRef(3);
  const wLevelRef = useRef(5);
  const bLevelRef = useRef(5);
  const evalOnRef = useRef(true);
  const flippedRef = useRef(false);
  const pausedRef = useRef(false);
  const thinkingRef = useRef(false);
  const engineReadyRef = useRef(false);

  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle');
  const [mode, setMode] = useState<Mode>('play');
  const [humanColor, setHumanColor] = useState<Color | 'random'>('w');
  const [level, setLevel] = useState(3);
  const [wLevel, setWLevel] = useState(5);
  const [bLevel, setBLevel] = useState(5);
  const [evalOn, setEvalOn] = useState(true);
  const [paused, setPaused] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [engineReady, setEngineReady] = useState(false);
  const [engineError, setEngineError] = useState(false);

  const [presetKey, setPresetKey] = useState('standard');
  const [customFen, setCustomFen] = useState('');
  const [moveList, setMoveList] = useState<string[]>([]);
  const [statusText, setStatusText] = useState('');
  const [turn, setTurn] = useState<Color>('w');
  const [result, setResult] = useState('');
  const [evalText, setEvalText] = useState('0.0');
  const [evalDepth, setEvalDepth] = useState(0);
  const [promotion, setPromotion] = useState<{
    from: string;
    to: string;
  } | null>(null);

  const movesEndRef = useRef<HTMLDivElement | null>(null);

  /* ── engine lifecycle ── */
  useEffect(() => {
    const eng = new StockfishEngine();
    engineRef.current = eng;
    let alive = true;
    eng
      .init()
      .then(() => {
        if (!alive) return;
        engineReadyRef.current = true;
        setEngineReady(true);
      })
      .catch(() => {
        if (alive) setEngineError(true);
      });
    return () => {
      alive = false;
      eng.quit();
    };
  }, []);

  useEffect(() => {
    const v = movesEndRef.current;
    if (v) v.scrollTop = v.scrollHeight;
  }, [moveList]);

  /* ── ref/state sync helpers ── */
  function setPhaseBoth(p: 'idle' | 'playing' | 'over') {
    phaseRef.current = p;
    setPhase(p);
  }
  function setThinkingBoth(v: boolean) {
    thinkingRef.current = v;
    setThinking(v);
  }

  /* ── geometry ── */
  function makeView(
    dpr: number,
    cw: number,
    ch: number,
    scale: number,
    offX: number,
    offY: number
  ): ChessView {
    return {
      dpr,
      cw,
      ch,
      scale,
      offX,
      offY,
      board: chessRef.current!.board() as (Piece | null)[][],
      lastFrom: null,
      lastTo: null,
      selected: null,
      targets: [],
      checkSq: null,
      anim: null,
      captureFade: null,
      particles: [],
      evalCur: 0.5,
      evalTarget: 0.5,
      last: 0,
    };
  }

  function sizeNow() {
    const el = fieldRef.current;
    const cv = canvasRef.current;
    if (!el || !cv) return;
    const rect = el.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = rect.width;
    const ch = rect.height;
    cv.width = Math.round(cw * dpr);
    cv.height = Math.round(ch * dpr);
    const ev = evalOnRef.current;
    const leftLogical = ev ? -(GAP + GUT) : 0;
    const contentW = (ev ? GUT + GAP : 0) + BOARD;
    const scale = Math.min(
      (cw - 2 * MARGIN) / contentW,
      (ch - 2 * MARGIN) / BOARD
    );
    const offX = (cw - contentW * scale) / 2 - leftLogical * scale;
    const offY = (ch - BOARD * scale) / 2;
    if (!gRef.current) {
      gRef.current = makeView(dpr, cw, ch, scale, offX, offY);
    } else {
      Object.assign(gRef.current, { dpr, cw, ch, scale, offX, offY });
    }
  }

  function hitTest(clientX: number, clientY: number): string | null {
    const g = gRef.current;
    const cv = canvasRef.current;
    if (!g || !cv) return null;
    const rect = cv.getBoundingClientRect();
    const lx = (clientX - rect.left - g.offX) / g.scale;
    const ly = (clientY - rect.top - g.offY) / g.scale;
    if (lx < 0 || lx >= BOARD || ly < 0 || ly >= BOARD) return null;
    const sc = Math.floor(lx / CELL);
    const sr = Math.floor(ly / CELL);
    const c = flippedRef.current ? 7 - sc : sc;
    const r = flippedRef.current ? 7 - sr : sr;
    return FILES[c] + (8 - r);
  }

  function computeCheckSq(): string | null {
    const chess = chessRef.current!;
    if (!chess.isCheck()) return null;
    const turn = chess.turn();
    const b = chess.board() as (Piece | null)[][];
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++) {
        const pc = b[r][c];
        if (pc && pc.type === 'k' && pc.color === turn)
          return FILES[c] + (8 - r);
      }
    return null;
  }

  /* ── rendering ── */
  function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawPiece(
    ctx: CanvasRenderingContext2D,
    piece: Piece,
    cx: number,
    cy: number,
    s = 1,
    alpha = 1
  ) {
    const size = CELL * 0.86 * s;
    const ch = GLYPH[piece.type] + '︎';
    const cyG = cy - size * 0.03;
    const white = piece.color === 'w';
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = `${size}px "Segoe UI Symbol","Noto Sans Symbols 2","Arial Unicode MS",serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.save();
    ctx.globalAlpha = alpha * 0.32;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(
      cx,
      cy + size * 0.4,
      size * 0.29,
      size * 0.095,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.55)';
    ctx.shadowBlur = size * 0.11;
    ctx.shadowOffsetY = size * 0.06;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillText(ch, cx, cyG);
    ctx.restore();

    const grad = ctx.createLinearGradient(
      cx,
      cyG - size * 0.48,
      cx,
      cyG + size * 0.46
    );
    if (white) {
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, '#eef1f6');
      grad.addColorStop(1, '#b4bdca');
    } else {
      grad.addColorStop(0, '#727a88');
      grad.addColorStop(0.5, '#3b4250');
      grad.addColorStop(1, '#0d1015');
    }
    ctx.fillStyle = grad;
    ctx.fillText(ch, cx, cyG);

    ctx.lineWidth = size * 0.04;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = white ? 'rgba(48,54,66,0.85)' : 'rgba(0,0,0,0.95)';
    ctx.strokeText(ch, cx, cyG);

    ctx.save();
    ctx.beginPath();
    ctx.rect(cx - size * 0.62, cyG - size * 0.62, size * 1.24, size * 0.4);
    ctx.clip();
    ctx.fillStyle = white ? 'rgba(255,255,255,0.7)' : 'rgba(214,222,235,0.22)';
    ctx.fillText(ch, cx, cyG - size * 0.014);
    ctx.restore();

    ctx.restore();
  }

  function sqXY(sq: string) {
    const { sc, sr } = sqToScreen(sq, flippedRef.current);
    return { x: sc * CELL, y: sr * CELL };
  }

  function drawEvalBar(ctx: CanvasRenderingContext2D, g: ChessView) {
    const x = -(GAP + GUT);
    const w = GUT;
    const h = BOARD;
    roundRect(ctx, x, 0, w, h, 7);
    ctx.fillStyle = 'rgba(10,12,17,0.6)';
    ctx.fill();
    const frac = Math.max(0, Math.min(1, g.evalCur));
    ctx.save();
    roundRect(ctx, x, 0, w, h, 7);
    ctx.clip();
    ctx.fillStyle = 'rgba(244,246,250,0.93)';
    ctx.fillRect(x, h - h * frac, w, h * frac);
    ctx.restore();
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, h / 2);
    ctx.lineTo(x + w, h / 2);
    ctx.stroke();
  }

  function drawBoardBase(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    ctx.fillRect(-3, -3, BOARD + 6, BOARD + 6);
    for (let sr = 0; sr < 8; sr++)
      for (let sc = 0; sc < 8; sc++) {
        const light = (sc + sr) % 2 === 0;
        ctx.fillStyle = light
          ? 'rgba(236,240,248,0.21)'
          : 'rgba(34,42,62,0.55)';
        ctx.fillRect(sc * CELL, sr * CELL, CELL, CELL);
      }
    ctx.save();
    ctx.shadowColor = 'rgba(122,150,210,0.42)';
    ctx.shadowBlur = 11;
    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, BOARD - 2, BOARD - 2);
    ctx.restore();
  }

  function drawCoords(ctx: CanvasRenderingContext2D) {
    ctx.font = '600 11px ui-sans-serif,system-ui,sans-serif';
    for (let i = 0; i < 8; i++) {
      const fileIdx = flippedRef.current ? 7 - i : i;
      const lightB = (i + 7) % 2 === 0;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = lightB ? 'rgba(28,36,54,0.55)' : 'rgba(232,236,244,0.5)';
      ctx.fillText(FILES[fileIdx], i * CELL + 4, BOARD - 5);
      const rankIdx = flippedRef.current ? i : 7 - i;
      const lightL = i % 2 === 0;
      ctx.textBaseline = 'top';
      ctx.fillStyle = lightL ? 'rgba(28,36,54,0.55)' : 'rgba(232,236,244,0.5)';
      ctx.fillText(String(rankIdx + 1), 3, i * CELL + 4);
    }
  }

  function drawHighlights(ctx: CanvasRenderingContext2D, g: ChessView) {
    if (g.lastFrom) {
      const p = sqXY(g.lastFrom);
      ctx.fillStyle = 'rgba(130,170,255,0.2)';
      ctx.fillRect(p.x, p.y, CELL, CELL);
    }
    if (g.lastTo) {
      const p = sqXY(g.lastTo);
      ctx.fillStyle = 'rgba(130,170,255,0.28)';
      ctx.fillRect(p.x, p.y, CELL, CELL);
    }
    if (g.checkSq) {
      const p = sqXY(g.checkSq);
      const cx = p.x + CELL / 2;
      const cy = p.y + CELL / 2;
      const rg = ctx.createRadialGradient(cx, cy, 4, cx, cy, CELL * 0.72);
      rg.addColorStop(0, 'rgba(255,86,86,0.75)');
      rg.addColorStop(1, 'rgba(255,64,64,0)');
      ctx.fillStyle = rg;
      ctx.fillRect(p.x - 6, p.y - 6, CELL + 12, CELL + 12);
    }
    if (g.selected) {
      const p = sqXY(g.selected);
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.fillRect(p.x, p.y, CELL, CELL);
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 3;
      ctx.strokeRect(p.x + 1.5, p.y + 1.5, CELL - 3, CELL - 3);
    }
    for (const tg of g.targets) {
      const p = sqXY(tg.to);
      const cx = p.x + CELL / 2;
      const cy = p.y + CELL / 2;
      if (tg.capture) {
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, cy, CELL * 0.43, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.fillStyle = 'rgba(18,26,44,0.4)';
        ctx.beginPath();
        ctx.arc(cx, cy, CELL * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.16)';
        ctx.beginPath();
        ctx.arc(cx, cy, CELL * 0.15, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function drawPieces(ctx: CanvasRenderingContext2D, g: ChessView) {
    const animTo = g.anim && g.anim.t < 1 ? g.lastTo : null;
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++) {
        const pc = g.board[r][c];
        if (!pc) continue;
        const sq = FILES[c] + (8 - r);
        if (animTo && sq === animTo) continue;
        const sc = flippedRef.current ? 7 - c : c;
        const sr = flippedRef.current ? 7 - r : r;
        drawPiece(ctx, pc, sc * CELL + CELL / 2, sr * CELL + CELL / 2);
      }
    if (g.captureFade && g.captureFade.t < 1) {
      const f = g.captureFade;
      drawPiece(ctx, f.piece, f.x, f.y, 1 - 0.3 * f.t, 1 - f.t);
    }
    if (g.anim && g.anim.t < 1) {
      const a = g.anim;
      const tt = easeOut(a.t);
      drawPiece(
        ctx,
        a.piece,
        a.fromX + (a.toX - a.fromX) * tt,
        a.fromY + (a.toY - a.fromY) * tt,
        1 + 0.05 * Math.sin(a.t * Math.PI)
      );
    }
  }

  function render(g: ChessView, ctx: CanvasRenderingContext2D) {
    const { dpr, cw, ch, scale, offX, offY } = g;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cw, ch);
    if (phaseRef.current === 'idle') return;
    ctx.setTransform(scale * dpr, 0, 0, scale * dpr, offX * dpr, offY * dpr);
    if (evalOnRef.current) drawEvalBar(ctx, g);
    drawBoardBase(ctx);
    drawHighlights(ctx, g);
    drawCoords(ctx);
    drawPieces(ctx, g);
    for (const p of g.particles) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * Math.max(0.2, p.life), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function update(g: ChessView, dtMs: number) {
    const k = dtMs / 16.67;
    if (g.anim) {
      g.anim.t += dtMs / g.anim.dur;
      if (g.anim.t >= 1) g.anim = null;
    }
    if (g.captureFade) {
      g.captureFade.t += dtMs / 150;
      if (g.captureFade.t >= 1) g.captureFade = null;
    }
    for (let i = g.particles.length - 1; i >= 0; i--) {
      const p = g.particles[i];
      p.vy += 0.12 * k;
      p.x += p.vx * k;
      p.y += p.vy * k;
      p.life -= 0.02 * k;
      if (p.life <= 0) g.particles.splice(i, 1);
    }
    g.evalCur += (g.evalTarget - g.evalCur) * Math.min(1, 0.12 * k);
  }

  function frame(ts: number) {
    const g = gRef.current;
    const cv = canvasRef.current;
    if (g && cv) {
      const ctx = cv.getContext('2d');
      if (ctx) {
        const last = g.last || ts;
        const dtMs = Math.min(ts - last, 60);
        g.last = ts;
        update(g, dtMs);
        render(g, ctx);
      }
    }
    rafRef.current = requestAnimationFrame(frame);
  }

  useEffect(() => {
    sizeNow();
    const field = fieldRef.current;
    const ro = new ResizeObserver(() => sizeNow());
    if (field) ro.observe(field);
    rafRef.current = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── eval conversion ── */
  function infoToWhite(info: EngineInfo, turn: Color) {
    if (info.scoreMate != null) {
      const m = turn === 'w' ? info.scoreMate : -info.scoreMate;
      return {
        prob: m > 0 ? 1 : m < 0 ? 0 : 0.5,
        text: (m >= 0 ? 'M' : '-M') + Math.abs(m),
      };
    }
    if (info.scoreCp != null) {
      const cp = turn === 'w' ? info.scoreCp : -info.scoreCp;
      const v = cp / 100;
      return {
        prob: 1 / (1 + Math.pow(10, -cp / 400)),
        text: (v > 0 ? '+' : '') + v.toFixed(1),
      };
    }
    return { prob: 0.5, text: '0.0' };
  }

  function applyInfo(info: EngineInfo, turn: Color) {
    const w = infoToWhite(info, turn);
    const g = gRef.current;
    if (g) g.evalTarget = w.prob;
    setEvalText(w.text);
    setEvalDepth(info.depth);
  }

  function applyResult(res: SearchResult, turn: Color) {
    if (res.info) applyInfo(res.info, turn);
  }

  /* ── engine serialization ── */
  async function engineExclusive(
    fn: () => Promise<SearchResult>
  ): Promise<SearchResult | null> {
    const eng = engineRef.current;
    if (!eng || !engineReadyRef.current) return null;
    eng.stop();
    try {
      await enginePendingRef.current;
    } catch {
      /* ignore */
    }
    const p = fn();
    enginePendingRef.current = p.catch(() => undefined);
    return p;
  }

  /* ── move application ── */
  function spawnParticles(g: ChessView, x: number, y: number) {
    for (let i = 0; i < 14; i++) {
      const a = rnd() * Math.PI * 2;
      const s = rnd() * 2.6;
      g.particles.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 1.2,
        life: 1,
        r: 1.4 + rnd() * 2.2,
        c: i % 3 === 0 ? 'rgba(255,210,120,0.9)' : 'rgba(255,255,255,0.85)',
      });
    }
  }

  function pushMove(mv: {
    from: string;
    to: string;
    color: Color;
    piece: string;
    captured?: string;
    promotion?: string;
    flags: string;
  }) {
    const g = gRef.current;
    if (g) {
      const f = sqToScreen(mv.from, flippedRef.current);
      const t = sqToScreen(mv.to, flippedRef.current);
      if (mv.captured) {
        let capSq = mv.to;
        if (mv.flags.includes('e')) capSq = mv.to[0] + mv.from[1];
        const cs = sqToScreen(capSq, flippedRef.current);
        const cx = cs.sc * CELL + CELL / 2;
        const cy = cs.sr * CELL + CELL / 2;
        g.captureFade = {
          x: cx,
          y: cy,
          piece: { type: mv.captured, color: mv.color === 'w' ? 'b' : 'w' },
          t: 0,
        };
        spawnParticles(g, cx, cy);
      }
      g.anim = {
        fromX: f.sc * CELL + CELL / 2,
        fromY: f.sr * CELL + CELL / 2,
        toX: t.sc * CELL + CELL / 2,
        toY: t.sr * CELL + CELL / 2,
        piece: { type: mv.promotion || mv.piece, color: mv.color },
        t: 0,
        dur: ANIM_MS,
      };
      g.board = chessRef.current!.board() as (Piece | null)[][];
      g.lastFrom = mv.from;
      g.lastTo = mv.to;
      g.selected = null;
      g.targets = [];
      g.checkSq = computeCheckSq();
    }
    setMoveList(chessRef.current!.history());
    setStatusFromGame();
  }

  function setStatusFromGame() {
    const chess = chessRef.current!;
    setTurn(chess.turn());
    if (chess.isGameOver()) return;
    setStatusText(chess.turn() === 'w' ? tx.whiteMove : tx.blackMove);
  }

  function gameResultText() {
    const chess = chessRef.current!;
    if (chess.isCheckmate()) {
      const winner: Color = chess.turn() === 'w' ? 'b' : 'w';
      if (modeRef.current === 'play')
        return winner === humanColorRef.current ? tx.youWin : tx.youLose;
      return winner === 'w' ? tx.whiteWins : tx.blackWins;
    }
    if (chess.isStalemate()) return tx.drawStalemate;
    if (chess.isInsufficientMaterial()) return tx.drawMaterial;
    if (chess.isThreefoldRepetition()) return tx.drawRepetition;
    if (chess.isDraw()) return tx.drawFifty;
    return tx.draw;
  }

  function finishGame() {
    if (phaseRef.current !== 'playing') return;
    setResult(gameResultText());
    setThinkingBoth(false);
    setPhaseBoth('over');
  }

  function applyUci(uci: string) {
    const from = uci.slice(0, 2);
    const to = uci.slice(2, 4);
    const promotion = uci.length > 4 ? uci[4] : undefined;
    try {
      const mv = chessRef.current!.move({ from, to, promotion });
      if (mv) pushMove(mv as never);
    } catch {
      /* illegal — ignore */
    }
  }

  /* ── play (human vs engine) ── */
  async function startAnalysis() {
    const chess = chessRef.current!;
    if (phaseRef.current !== 'playing' || !evalOnRef.current) return;
    const turn = chess.turn();
    await engineExclusive(() => {
      engineRef.current!.setSkill(20);
      return engineRef.current!.search(
        chess.fen(),
        { depth: EVAL_DEPTH },
        (info) => applyInfo(info, turn)
      );
    });
  }

  async function playEngineMove() {
    const chess = chessRef.current!;
    if (phaseRef.current !== 'playing' || chess.isGameOver()) return;
    const lvl = LEVELS[levelRef.current - 1];
    const turn = chess.turn();
    setThinkingBoth(true);
    const res = await engineExclusive(() => {
      engineRef.current!.setSkill(lvl.skill);
      return engineRef.current!.search(
        chess.fen(),
        { depth: lvl.depth, movetime: lvl.movetime },
        (info) => applyInfo(info, turn)
      );
    });
    setThinkingBoth(false);
    if (!res || !res.bestmove || phaseRef.current !== 'playing') return;
    applyUci(res.bestmove);
    applyResult(res, turn);
    afterMove();
  }

  function afterMove() {
    const chess = chessRef.current!;
    if (chess.isGameOver()) {
      finishGame();
      return;
    }
    if (modeRef.current === 'play') {
      if (chess.turn() === humanColorRef.current) {
        if (evalOnRef.current) startAnalysis();
      } else {
        playEngineMove();
      }
    }
  }

  function selectSquare(sq: string) {
    const g = gRef.current;
    const chess = chessRef.current!;
    if (!g) return;
    const moves = chess.moves({ square: sq as Square, verbose: true }) as {
      to: string;
      captured?: string;
      flags: string;
    }[];
    if (!moves.length) return;
    g.selected = sq;
    g.targets = moves.map((m) => ({
      to: m.to,
      capture: !!m.captured || m.flags.includes('e'),
    }));
  }

  function doHumanMove(from: string, to: string, promotion?: string) {
    try {
      const mv = chessRef.current!.move({ from, to, promotion });
      if (!mv) return;
      pushMove(mv as never);
      afterMove();
    } catch {
      /* ignore */
    }
  }

  function onBoardPointer(e: ReactPointerEvent) {
    if (phaseRef.current !== 'playing' || modeRef.current !== 'play') return;
    const chess = chessRef.current!;
    if (chess.turn() !== humanColorRef.current || thinkingRef.current) return;
    const sq = hitTest(e.clientX, e.clientY);
    if (!sq) return;
    const g = gRef.current;
    if (!g) return;
    const piece = chess.get(sq as Square) as Piece | undefined;
    if (g.selected) {
      const target = g.targets.find((t) => t.to === sq);
      if (target) {
        const moving = chess.get(g.selected as Square) as Piece | undefined;
        const isPromo =
          moving?.type === 'p' && (sq[1] === '8' || sq[1] === '1');
        if (isPromo) {
          setPromotion({ from: g.selected, to: sq });
          return;
        }
        doHumanMove(g.selected, sq);
        return;
      }
      if (piece && piece.color === humanColorRef.current) selectSquare(sq);
      else {
        g.selected = null;
        g.targets = [];
      }
    } else if (piece && piece.color === humanColorRef.current) {
      selectSquare(sq);
    }
  }

  function choosePromotion(piece: string) {
    if (!promotion) return;
    const { from, to } = promotion;
    setPromotion(null);
    doHumanMove(from, to, piece);
  }

  /* ── spectate (engine vs engine) ── */
  async function spectateOneMove() {
    const chess = chessRef.current!;
    if (phaseRef.current !== 'playing' || chess.isGameOver()) return;
    const turn = chess.turn();
    const lvl =
      LEVELS[(turn === 'w' ? wLevelRef.current : bLevelRef.current) - 1];
    setThinkingBoth(true);
    const t0 = nowMs();
    const res = await engineExclusive(() => {
      engineRef.current!.setSkill(lvl.skill);
      return engineRef.current!.search(
        chess.fen(),
        { depth: lvl.depth, movetime: lvl.movetime },
        (info) => applyInfo(info, turn)
      );
    });
    setThinkingBoth(false);
    if (!res || !res.bestmove) return;
    if (phaseRef.current !== 'playing' || modeRef.current !== 'spectate')
      return;
    const wait = SPECTATE_MIN_MS - (nowMs() - t0);
    if (wait > 0) await sleep(wait);
    if (pausedRef.current || phaseRef.current !== 'playing') return;
    applyUci(res.bestmove);
    applyResult(res, turn);
  }

  async function spectateLoop() {
    const chess = chessRef.current!;
    while (
      phaseRef.current === 'playing' &&
      modeRef.current === 'spectate' &&
      !pausedRef.current &&
      !chess.isGameOver()
    ) {
      await spectateOneMove();
    }
    if (
      phaseRef.current === 'playing' &&
      chess.isGameOver() &&
      modeRef.current === 'spectate'
    )
      finishGame();
  }

  /* ── controls ── */
  function toggleEval() {
    const v = !evalOnRef.current;
    evalOnRef.current = v;
    setEvalOn(v);
    sizeNow();
    if (phaseRef.current === 'playing' && modeRef.current === 'play') {
      const chess = chessRef.current!;
      if (chess.turn() === humanColorRef.current) {
        if (v) startAnalysis();
        else engineRef.current?.stop();
      }
    }
  }

  function toggleFlip() {
    flippedRef.current = !flippedRef.current;
  }

  function togglePause() {
    if (modeRef.current !== 'spectate' || phaseRef.current !== 'playing')
      return;
    const v = !pausedRef.current;
    pausedRef.current = v;
    setPaused(v);
    if (v) engineRef.current?.stop();
    else spectateLoop();
  }

  function stepSpectate() {
    if (modeRef.current !== 'spectate' || phaseRef.current !== 'playing')
      return;
    if (!pausedRef.current) return;
    spectateOneMove();
  }

  function refreshView() {
    const chess = chessRef.current!;
    const g = gRef.current;
    if (g) {
      g.board = chess.board() as (Piece | null)[][];
      const h = chess.history({ verbose: true }) as {
        from: string;
        to: string;
      }[];
      const lm = h[h.length - 1];
      g.lastFrom = lm ? lm.from : null;
      g.lastTo = lm ? lm.to : null;
      g.selected = null;
      g.targets = [];
      g.anim = null;
      g.captureFade = null;
      g.checkSq = computeCheckSq();
    }
    setMoveList(chess.history());
    setStatusFromGame();
  }

  function undo() {
    if (modeRef.current !== 'play' || phaseRef.current === 'idle') return;
    const chess = chessRef.current!;
    engineRef.current?.stop();
    let n = 0;
    while (n < 2 && chess.history().length > 0) {
      chess.undo();
      n++;
      if (chess.turn() === humanColorRef.current) break;
    }
    if (phaseRef.current === 'over') setPhaseBoth('playing');
    refreshView();
    if (evalOnRef.current && chess.turn() === humanColorRef.current)
      startAnalysis();
  }

  function resign() {
    if (modeRef.current !== 'play' || phaseRef.current !== 'playing') return;
    engineRef.current?.stop();
    setResult(tx.youLose);
    setStatusText(tx.resigned);
    setThinkingBoth(false);
    setPhaseBoth('over');
  }

  /* ── start / lifecycle ── */
  function resolvedHumanColor(): Color {
    if (humanColor === 'random') return rnd() < 0.5 ? 'w' : 'b';
    return humanColor;
  }

  function activeFen(): string {
    if (mode === 'spectate') {
      const c = customFen.trim();
      if (c && isValidFen(c)) return c;
      return (
        PRESET_FENS.find((p) => p.key === presetKey)?.fen ?? PRESET_FENS[0].fen
      );
    }
    return PRESET_FENS[0].fen;
  }

  function startGame() {
    if (!engineReadyRef.current) return;
    const chess = chessRef.current!;
    try {
      chess.load(activeFen());
    } catch {
      return;
    }
    engineRef.current?.newGame();
    modeRef.current = mode;
    levelRef.current = level;
    wLevelRef.current = wLevel;
    bLevelRef.current = bLevel;
    const hc = resolvedHumanColor();
    humanColorRef.current = hc;
    const flip = mode === 'play' ? hc === 'b' : false;
    flippedRef.current = flip;
    pausedRef.current = false;
    setPaused(false);
    setResult('');
    setMoveList(chess.history());
    const g = gRef.current;
    if (g) {
      g.board = chess.board() as (Piece | null)[][];
      g.lastFrom = null;
      g.lastTo = null;
      g.selected = null;
      g.targets = [];
      g.anim = null;
      g.captureFade = null;
      g.particles = [];
      g.checkSq = computeCheckSq();
      g.evalCur = 0.5;
      g.evalTarget = 0.5;
    }
    setEvalText('0.0');
    setEvalDepth(0);
    setPhaseBoth('playing');
    setStatusFromGame();
    requestAnimationFrame(() => sizeNow());
    if (mode === 'play') {
      if (chess.turn() === hc) {
        if (evalOnRef.current) startAnalysis();
      } else playEngineMove();
    } else {
      spectateLoop();
    }
  }

  function backToSetup() {
    engineRef.current?.stop();
    pausedRef.current = false;
    setPaused(false);
    setResult('');
    setPhaseBoth('idle');
  }

  /* ── keyboard ── */
  const handlersRef = useRef<Record<string, () => void>>({});
  useEffect(() => {
    handlersRef.current = {
      togglePause,
      stepSpectate,
      undo,
      toggleFlip,
      toggleEval,
    };
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phaseRef.current === 'idle') return;
      const h = handlersRef.current;
      if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
        if (modeRef.current === 'spectate') {
          h.togglePause();
          e.preventDefault();
        }
      } else if (e.key === 'ArrowRight' && modeRef.current === 'spectate') {
        h.stepSpectate();
        e.preventDefault();
      } else if (
        (e.key === 'z' || e.key === 'Z') &&
        modeRef.current === 'play'
      ) {
        h.undo();
      } else if (e.key === 'f' || e.key === 'F') {
        h.toggleFlip();
      } else if (e.key === 'e' || e.key === 'E') {
        h.toggleEval();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* ── derived UI ── */
  const fenInvalid = customFen.trim().length > 0 && !isValidFen(customFen);

  return (
    <div className='relative flex min-h-[480px] w-full flex-col touch-none select-none'>
      {/* top bar: status + controls */}
      <div className='mx-auto flex w-full max-w-[940px] shrink-0 flex-wrap items-center justify-between gap-2 px-1 py-2 text-white'>
        <div className='flex items-center gap-2'>
          {phase !== 'idle' && (
            <>
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${
                  turn === 'w' ? 'bg-white' : 'bg-white/40'
                } ring-1 ring-white/30`}
              />
              <span className='text-[14px] font-semibold text-white/85'>
                {phase === 'over' ? result : statusText}
              </span>
              {thinking && phase === 'playing' && (
                <span className='ch-think text-[12px] font-medium text-white/45'>
                  {tx.thinking}
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              )}
              {evalOn && (
                <span className='ml-1 rounded-full bg-white/10 px-2 py-0.5 text-[12px] font-semibold tabular-nums text-white/70'>
                  {evalText}
                  {evalDepth > 0 && (
                    <span className='ml-1 text-white/35'>d{evalDepth}</span>
                  )}
                </span>
              )}
            </>
          )}
        </div>

        {phase !== 'idle' && (
          <div className='flex items-center gap-1.5'>
            <CtrlButton
              active={evalOn}
              label={tx.evalBar}
              onClick={toggleEval}
              icon={<Activity size={15} />}
            />
            <CtrlButton
              label={tx.flip}
              onClick={toggleFlip}
              icon={<ArrowLeftRight size={15} />}
            />
            {mode === 'play' ? (
              <>
                <CtrlButton
                  label={tx.undo}
                  onClick={undo}
                  icon={<RotateCcw size={15} />}
                />
                {phase === 'playing' && (
                  <CtrlButton
                    label={tx.resign}
                    onClick={resign}
                    icon={<Flag size={15} />}
                  />
                )}
              </>
            ) : (
              phase === 'playing' && (
                <>
                  <CtrlButton
                    label={paused ? tx.resume : tx.pause}
                    onClick={togglePause}
                    icon={paused ? <Play size={15} /> : <Pause size={15} />}
                  />
                  <CtrlButton
                    label={tx.step}
                    onClick={stepSpectate}
                    disabled={!paused}
                    icon={<SkipForward size={15} />}
                  />
                </>
              )
            )}
            <button
              type='button'
              onClick={backToSetup}
              className='ml-0.5 rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-white/70 transition-colors hover:bg-white/20'
            >
              {tx.setup}
            </button>
          </div>
        )}
      </div>

      {/* board + side panel */}
      <div className='relative flex min-h-0 flex-1 gap-4'>
        <div
          ref={fieldRef}
          className='relative min-h-0 flex-1'
          onPointerDown={onBoardPointer}
        >
          <canvas ref={canvasRef} className='absolute inset-0 h-full w-full' />

          {promotion && (
            <div className='absolute inset-0 z-20 flex items-center justify-center bg-black/45'>
              <div className='ch-in flex gap-2 rounded-2xl bg-[#1a1e27] p-3 ring-1 ring-white/12'>
                {['q', 'r', 'b', 'n'].map((p) => (
                  <button
                    key={p}
                    type='button'
                    onClick={() => choosePromotion(p)}
                    className='flex h-16 w-16 items-center justify-center rounded-xl bg-white/8 text-[40px] leading-none text-white transition-colors hover:bg-white/18'
                    style={{
                      fontFamily:
                        '"Segoe UI Symbol","Noto Sans Symbols 2",serif',
                    }}
                  >
                    {GLYPH[p]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {phase === 'over' && (
            <div className='pointer-events-none absolute inset-x-0 top-3 z-10 flex justify-center'>
              <div className='ch-in pointer-events-auto flex flex-col items-center gap-3 rounded-2xl bg-black/55 px-7 py-5 text-center ring-1 ring-white/12 backdrop-blur-sm'>
                <div className='text-[20px] font-bold text-white/90'>
                  {result}
                </div>
                <div className='flex gap-2'>
                  <button
                    type='button'
                    onClick={startGame}
                    className='ch-btn rounded-full bg-white px-6 py-2.5 text-[14px] font-semibold text-[#121212]'
                  >
                    {tx.newGame}
                  </button>
                  <button
                    type='button'
                    onClick={backToSetup}
                    className='rounded-full bg-white/10 px-6 py-2.5 text-[14px] font-semibold text-white/80 transition-colors hover:bg-white/20'
                  >
                    {tx.setup}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* moves panel (wide screens) */}
        {phase !== 'idle' && (
          <div className='hidden w-[210px] shrink-0 flex-col lg:flex'>
            <div className='mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/40'>
              {tx.moves}
            </div>
            <div
              ref={movesEndRef}
              className='min-h-0 flex-1 overflow-y-auto rounded-[14px] bg-white/[0.04] p-3 ring-1 ring-white/10'
            >
              {moveList.length === 0 ? (
                <div className='text-[13px] text-white/30'>—</div>
              ) : (
                <ol className='space-y-0.5'>
                  {Array.from({ length: Math.ceil(moveList.length / 2) }).map(
                    (_, i) => (
                      <li
                        key={i}
                        className='flex items-center gap-2 text-[13px] tabular-nums'
                      >
                        <span className='w-6 shrink-0 text-right text-white/35'>
                          {i + 1}.
                        </span>
                        <span className='flex-1 font-medium text-white/80'>
                          {moveList[i * 2]}
                        </span>
                        <span className='flex-1 font-medium text-white/65'>
                          {moveList[i * 2 + 1] ?? ''}
                        </span>
                      </li>
                    )
                  )}
                </ol>
              )}
            </div>
          </div>
        )}
      </div>

      {/* idle setup */}
      {phase === 'idle' && (
        <div className='ch-in absolute inset-0 flex flex-col items-center justify-center gap-5 overflow-y-auto px-6 py-6 text-center'>
          <div className='flex gap-1.5 rounded-full bg-white/[0.06] p-1 ring-1 ring-white/10'>
            {(['play', 'spectate'] as Mode[]).map((m) => (
              <button
                key={m}
                type='button'
                onClick={() => setMode(m)}
                className={`rounded-full px-5 py-1.5 text-[13px] font-semibold transition-colors ${
                  mode === m
                    ? 'bg-white text-[#121212]'
                    : 'text-white/65 hover:text-white'
                }`}
              >
                {m === 'play' ? tx.play : tx.spectate}
              </button>
            ))}
          </div>

          <p className='max-w-[540px] text-[14px] leading-relaxed text-white/70'>
            {tx.sub}
          </p>

          <div className='w-full max-w-[440px] space-y-4 rounded-[16px] bg-white/[0.05] px-5 py-5 text-left ring-1 ring-white/10'>
            {mode === 'play' ? (
              <>
                <div>
                  <div className='mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/45'>
                    {tx.side}
                  </div>
                  <div className='flex gap-1.5'>
                    {(['w', 'b', 'random'] as const).map((s) => (
                      <button
                        key={s}
                        type='button'
                        onClick={() => setHumanColor(s)}
                        className={`flex-1 rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors ${
                          humanColor === s
                            ? 'bg-white text-[#121212]'
                            : 'bg-white/10 text-white/65 hover:bg-white/20'
                        }`}
                      >
                        {s === 'w'
                          ? tx.white
                          : s === 'b'
                            ? tx.black
                            : tx.random}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className='mb-2 flex items-baseline justify-between'>
                    <span className='text-[12px] font-semibold uppercase tracking-[0.14em] text-white/45'>
                      {tx.level}
                    </span>
                    <span className='text-[12px] font-medium text-white/55'>
                      {tx.levelNames[level - 1]}
                    </span>
                  </div>
                  <LevelRow value={level} onChange={setLevel} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className='mb-2 flex items-baseline justify-between'>
                    <span className='text-[12px] font-semibold uppercase tracking-[0.14em] text-white/45'>
                      {tx.whiteEngine}
                    </span>
                    <span className='text-[12px] font-medium text-white/55'>
                      {tx.levelNames[wLevel - 1]}
                    </span>
                  </div>
                  <LevelRow value={wLevel} onChange={setWLevel} />
                </div>
                <div>
                  <div className='mb-2 flex items-baseline justify-between'>
                    <span className='text-[12px] font-semibold uppercase tracking-[0.14em] text-white/45'>
                      {tx.blackEngine}
                    </span>
                    <span className='text-[12px] font-medium text-white/55'>
                      {tx.levelNames[bLevel - 1]}
                    </span>
                  </div>
                  <LevelRow value={bLevel} onChange={setBLevel} />
                </div>
                <div>
                  <div className='mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/45'>
                    {tx.startPos}
                  </div>
                  <div className='flex flex-wrap gap-1.5'>
                    {PRESET_FENS.map((p) => (
                      <button
                        key={p.key}
                        type='button'
                        onClick={() => {
                          setPresetKey(p.key);
                          setCustomFen('');
                        }}
                        className={`rounded-lg px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                          presetKey === p.key && !customFen.trim()
                            ? 'bg-white text-[#121212]'
                            : 'bg-white/10 text-white/65 hover:bg-white/20'
                        }`}
                      >
                        {tx.presets[p.key as keyof typeof tx.presets]}
                      </button>
                    ))}
                  </div>
                  <input
                    value={customFen}
                    onChange={(e) => setCustomFen(e.target.value)}
                    placeholder={tx.fenPlaceholder}
                    spellCheck={false}
                    className={`mt-2 w-full rounded-lg bg-black/25 px-3 py-2 text-[12px] text-white/85 outline-none ring-1 transition-colors placeholder:text-white/30 ${
                      fenInvalid
                        ? 'ring-[#ff6b70]/70'
                        : 'ring-white/12 focus:ring-white/30'
                    }`}
                  />
                  {fenInvalid && (
                    <div className='mt-1 text-[11px] text-[#ff8a8e]'>
                      {tx.fenInvalid}
                    </div>
                  )}
                </div>
              </>
            )}

            <label className='flex cursor-pointer items-center justify-between pt-1'>
              <span className='text-[13px] font-medium text-white/70'>
                {tx.evalBar}
              </span>
              <button
                type='button'
                role='switch'
                aria-checked={evalOn}
                onClick={() => {
                  evalOnRef.current = !evalOnRef.current;
                  setEvalOn(evalOnRef.current);
                }}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  evalOn ? 'bg-white' : 'bg-white/20'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-[#121212] transition-transform ${
                    evalOn ? 'translate-x-[22px]' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </label>
          </div>

          <button
            type='button'
            onClick={startGame}
            disabled={!engineReady || (mode === 'spectate' && fenInvalid)}
            className='ch-btn inline-flex items-center gap-2 rounded-full bg-white px-9 py-3 text-[15px] font-semibold text-[#121212] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101319]'
          >
            {engineError ? tx.engineFail : engineReady ? tx.start : tx.loading}
          </button>
        </div>
      )}

      <style>{`
        @keyframes chIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
        .ch-in { animation: chIn 0.18s cubic-bezier(0.23,1,0.32,1) both; }
        .ch-btn { transition: transform 0.15s cubic-bezier(0.23,1,0.32,1), background-color 0.2s ease; }
        .ch-btn:hover:not(:disabled) { transform: scale(1.02); background-color: rgba(255,255,255,0.9); }
        .ch-btn:active:not(:disabled) { transform: scale(0.97); }
        .ch-think span { animation: chBlink 1.2s infinite; }
        .ch-think span:nth-child(2) { animation-delay: 0.2s; }
        .ch-think span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes chBlink { 0%, 60%, 100% { opacity: 0.2; } 30% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .ch-in, .ch-btn, .ch-think span { animation: none !important; transition: none !important; }
          .ch-btn:hover, .ch-btn:active { transform: none; }
        }
      `}</style>
    </div>
  );
}

function LevelRow({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className='flex flex-wrap gap-1.5'>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((l) => (
        <button
          key={l}
          type='button'
          onClick={() => onChange(l)}
          className={`h-8 w-8 rounded-lg text-[13px] font-semibold transition-colors ${
            value === l
              ? 'bg-white text-[#121212]'
              : 'bg-white/10 text-white/65 hover:bg-white/20'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

function CtrlButton({
  icon,
  label,
  onClick,
  active,
  disabled,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[12px] font-semibold transition-colors disabled:opacity-40 ${
        active
          ? 'bg-white text-[#121212]'
          : 'bg-white/10 text-white/75 hover:bg-white/20'
      }`}
    >
      {icon}
      <span className='hidden text-[12px] sm:inline'>{label}</span>
    </button>
  );
}

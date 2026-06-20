'use client';

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import {
  ArrowLeftRight,
  Flag,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  SkipForward,
} from 'lucide-react';
import { Chess, type Square } from 'chess.js';

import type { Locale } from '@/lib/dict';
import {
  ChessEngine,
  type EngineInfo,
  type SearchResult,
} from '@/lib/chess-engine';

/* Chess — a WASM-engine board, Kimi-styled and borderless to match the other
   games. The square board blends into the themed background with translucent
   squares and a soft glowing edge, and renders 3D-shaded pieces with sliding
   moves, capture sparks and a check glow. Three modes share one engine: Play
   (human vs engine), Spectate (engine vs engine from any position) and Eval (a
   sandbox/analysis board with a live evaluation bar and best-move hint that can
   hand the current position to Play or Spectate). */

const CELL = 80;
const BOARD = CELL * 8;
const ANIM_MS = 175;
const EVAL_DEPTH = 15;
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

type Mode = 'play' | 'spectate' | 'eval';
type Phase = 'setup' | 'active' | 'over';
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
  scale: number;
  board: (Piece | null)[][];
  lastFrom: string | null;
  lastTo: string | null;
  selected: string | null;
  targets: { to: string; capture: boolean }[];
  checkSq: string | null;
  arrow: { from: string; to: string } | null;
  anim: Anim | null;
  captureFade: CaptureFade | null;
  particles: Particle[];
  last: number;
}

const T = {
  en: {
    modePlay: 'Play',
    modeSpectate: 'Spectate',
    modeEval: 'Eval',
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
    whiteEngine: 'White',
    blackEngine: 'Black',
    startPos: 'Position',
    presets: {
      standard: 'Standard',
      sicilian: 'Sicilian',
      rookEnd: 'Rook endgame',
      queenEnd: 'Queen endgame',
    },
    fenPlaceholder: 'Paste a FEN…',
    load: 'Load',
    fenInvalid: 'Invalid FEN',
    start: 'Start',
    loading: 'Loading…',
    engineFail: 'Engine failed to load — please refresh.',
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
    undo: 'Undo',
    flip: 'Flip',
    resign: 'Resign',
    pause: 'Pause',
    resume: 'Resume',
    step: 'Step',
    restart: 'Restart',
    reset: 'Reset',
    moves: 'Moves',
    best: 'Best',
    playFromHere: 'Play from here',
    spectateFromHere: 'Spectate from here',
    evalHint: 'Move either side freely; the bar reads the live evaluation.',
  },
  zh: {
    modePlay: '对战',
    modeSpectate: '观战',
    modeEval: '评估',
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
    whiteEngine: '白方',
    blackEngine: '黑方',
    startPos: '局面',
    presets: {
      standard: '标准',
      sicilian: '西西里',
      rookEnd: '车残局',
      queenEnd: '后残局',
    },
    fenPlaceholder: '粘贴 FEN…',
    load: '加载',
    fenInvalid: 'FEN 不合法',
    start: '开始',
    loading: '加载中…',
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
    undo: '悔棋',
    flip: '翻转',
    resign: '认输',
    pause: '暂停',
    resume: '继续',
    step: '单步',
    restart: '重新开始',
    reset: '重置',
    moves: '棋谱',
    best: '推荐',
    playFromHere: '从此局面对战',
    spectateFromHere: '从此局面观战',
    evalHint: '可自由移动双方棋子，评估条实时显示优势。',
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
  const boardPxRef = useRef(0);

  const chessRef = useRef<Chess | null>(null);
  if (chessRef.current == null) {
    chessRef.current = new Chess();
  }
  const engineRef = useRef<ChessEngine | null>(null);
  const enginePendingRef = useRef<Promise<unknown>>(Promise.resolve());

  const modeRef = useRef<Mode>('play');
  const phaseRef = useRef<Phase>('setup');
  const humanColorRef = useRef<Color>('w');
  const levelRef = useRef(3);
  const wLevelRef = useRef(5);
  const bLevelRef = useRef(5);
  const pausedRef = useRef(false);
  const thinkingRef = useRef(false);
  const engineReadyRef = useRef(false);
  const flippedRef = useRef(false);

  const [mode, setMode] = useState<Mode>('play');
  const [phase, setPhase] = useState<Phase>('setup');
  const [humanColor, setHumanColor] = useState<Color | 'random'>('w');
  const [level, setLevel] = useState(3);
  const [wLevel, setWLevel] = useState(5);
  const [bLevel, setBLevel] = useState(5);
  const [paused, setPaused] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [engineReady, setEngineReady] = useState(false);
  const [engineError, setEngineError] = useState(false);

  const [presetKey, setPresetKey] = useState('standard');
  const [fenInput, setFenInput] = useState('');
  const [moveList, setMoveList] = useState<string[]>([]);
  const [statusText, setStatusText] = useState('');
  const [result, setResult] = useState('');
  const [turn, setTurn] = useState<Color>('w');
  const [evalFrac, setEvalFrac] = useState(0.5);
  const [evalText, setEvalText] = useState('0.0');
  const [evalDepth, setEvalDepth] = useState(0);
  const [boardPx, setBoardPx] = useState(0);
  const [promotion, setPromotion] = useState<{
    from: string;
    to: string;
  } | null>(null);

  const movesEndRef = useRef<HTMLDivElement | null>(null);

  /* ── engine lifecycle ── */
  useEffect(() => {
    const eng = new ChessEngine();
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

  function setPhaseBoth(p: Phase) {
    phaseRef.current = p;
    setPhase(p);
  }
  function setThinkingBoth(v: boolean) {
    thinkingRef.current = v;
    setThinking(v);
  }
  function setPausedBoth(v: boolean) {
    pausedRef.current = v;
    setPaused(v);
  }

  /* ── geometry (measured square board) ── */
  function makeView(dpr: number, scale: number): ChessView {
    return {
      dpr,
      scale,
      board: chessRef.current!.board() as (Piece | null)[][],
      lastFrom: null,
      lastTo: null,
      selected: null,
      targets: [],
      checkSq: null,
      arrow: null,
      anim: null,
      captureFade: null,
      particles: [],
      last: 0,
    };
  }

  function sizeNow() {
    const field = fieldRef.current;
    const cv = canvasRef.current;
    if (!field || !cv) return;
    const r = field.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const evalReserve = modeRef.current === 'eval' ? 22 : 0;
    const availW = r.width - evalReserve;
    const bp = Math.max(180, Math.floor(Math.min(availW, r.height) - 2));
    cv.width = Math.round(bp * dpr);
    cv.height = Math.round(bp * dpr);
    cv.style.width = bp + 'px';
    cv.style.height = bp + 'px';
    if (bp !== boardPxRef.current) {
      boardPxRef.current = bp;
      setBoardPx(bp);
    }
    const scale = bp / BOARD;
    if (!gRef.current) gRef.current = makeView(dpr, scale);
    else Object.assign(gRef.current, { dpr, scale });
  }

  function hitTest(clientX: number, clientY: number): string | null {
    const cv = canvasRef.current;
    if (!cv) return null;
    const r = cv.getBoundingClientRect();
    const cell = r.width / 8;
    const sc = Math.floor((clientX - r.left) / cell);
    const sr = Math.floor((clientY - r.top) / cell);
    if (sc < 0 || sc > 7 || sr < 0 || sr > 7) return null;
    const c = flippedRef.current ? 7 - sc : sc;
    const rr = flippedRef.current ? 7 - sr : sr;
    return FILES[c] + (8 - rr);
  }

  function computeCheckSq(): string | null {
    const chess = chessRef.current!;
    if (!chess.isCheck()) return null;
    const t = chess.turn();
    const b = chess.board() as (Piece | null)[][];
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++) {
        const pc = b[r][c];
        if (pc && pc.type === 'k' && pc.color === t) return FILES[c] + (8 - r);
      }
    return null;
  }

  /* ── rendering ── */
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

  function drawArrow(ctx: CanvasRenderingContext2D, from: string, to: string) {
    const a = sqXY(from);
    const b = sqXY(to);
    const x1 = a.x + CELL / 2;
    const y1 = a.y + CELL / 2;
    const x2 = b.x + CELL / 2;
    const y2 = b.y + CELL / 2;
    const ang = Math.atan2(y2 - y1, x2 - x1);
    const head = 22;
    const shorten = 26;
    const ex = x2 - Math.cos(ang) * shorten;
    const ey = y2 - Math.sin(ang) * shorten;
    ctx.save();
    ctx.strokeStyle = 'rgba(122,150,230,0.85)';
    ctx.fillStyle = 'rgba(122,150,230,0.85)';
    ctx.lineWidth = 11;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2 - Math.cos(ang) * 4, y2 - Math.sin(ang) * 4);
    ctx.lineTo(
      ex - Math.cos(ang - Math.PI / 2) * head * 0.6,
      ey - Math.sin(ang - Math.PI / 2) * head * 0.6
    );
    ctx.lineTo(
      ex - Math.cos(ang + Math.PI / 2) * head * 0.6,
      ey - Math.sin(ang + Math.PI / 2) * head * 0.6
    );
    ctx.closePath();
    ctx.fill();
    ctx.restore();
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
    const { dpr, scale } = g;
    ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);
    ctx.clearRect(0, 0, BOARD, BOARD);
    drawBoardBase(ctx);
    drawHighlights(ctx, g);
    drawCoords(ctx);
    if (g.arrow && !g.anim) drawArrow(ctx, g.arrow.from, g.arrow.to);
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
  function infoToWhite(info: EngineInfo, t: Color) {
    if (info.scoreMate != null) {
      const m = t === 'w' ? info.scoreMate : -info.scoreMate;
      return {
        prob: m > 0 ? 1 : m < 0 ? 0 : 0.5,
        text: (m >= 0 ? 'M' : '-M') + Math.abs(m),
      };
    }
    if (info.scoreCp != null) {
      const cp = t === 'w' ? info.scoreCp : -info.scoreCp;
      const v = cp / 100;
      return {
        prob: 1 / (1 + Math.pow(10, -cp / 400)),
        text: (v > 0 ? '+' : '') + v.toFixed(1),
      };
    }
    return { prob: 0.5, text: '0.0' };
  }

  function applyInfo(info: EngineInfo, t: Color) {
    const w = infoToWhite(info, t);
    setEvalFrac(w.prob);
    setEvalText(w.text);
    setEvalDepth(info.depth);
    if (modeRef.current === 'eval' && info.pv && info.pv[0]) {
      const u = info.pv[0];
      const g = gRef.current;
      if (g) g.arrow = { from: u.slice(0, 2), to: u.slice(2, 4) };
    }
  }

  function applyResult(res: SearchResult, t: Color) {
    if (res.info) applyInfo(res.info, t);
  }

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
      g.arrow = null;
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
      g.arrow = null;
      g.checkSq = computeCheckSq();
    }
    setMoveList(chess.history());
    setStatusFromGame();
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
    if (phaseRef.current !== 'active') return;
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
      /* ignore */
    }
  }

  /* ── engine: play / spectate / analysis ── */
  async function playEngineMove() {
    const chess = chessRef.current!;
    if (
      phaseRef.current !== 'active' ||
      modeRef.current !== 'play' ||
      chess.isGameOver()
    )
      return;
    const lvl = LEVELS[levelRef.current - 1];
    const t = chess.turn();
    setThinkingBoth(true);
    const res = await engineExclusive(() => {
      engineRef.current!.setSkill(lvl.skill);
      return engineRef.current!.search(
        chess.fen(),
        { depth: lvl.depth, movetime: lvl.movetime },
        (info) => applyInfo(info, t)
      );
    });
    setThinkingBoth(false);
    if (!res || !res.bestmove || phaseRef.current !== 'active') return;
    if (modeRef.current !== 'play') return;
    applyUci(res.bestmove);
    if (chess.isGameOver()) finishGame();
  }

  async function analyzePosition() {
    const chess = chessRef.current!;
    if (modeRef.current !== 'eval') return;
    const t = chess.turn();
    setThinkingBoth(true);
    const res = await engineExclusive(() => {
      engineRef.current!.setSkill(20);
      return engineRef.current!.search(
        chess.fen(),
        { depth: EVAL_DEPTH },
        (info) => applyInfo(info, t)
      );
    });
    setThinkingBoth(false);
    if (res && modeRef.current === 'eval') applyResult(res, t);
  }

  async function spectateOneMove(force = false) {
    const chess = chessRef.current!;
    if (
      phaseRef.current !== 'active' ||
      modeRef.current !== 'spectate' ||
      chess.isGameOver()
    )
      return;
    const t = chess.turn();
    const lvl = LEVELS[(t === 'w' ? wLevelRef.current : bLevelRef.current) - 1];
    setThinkingBoth(true);
    const t0 = nowMs();
    const res = await engineExclusive(() => {
      engineRef.current!.setSkill(lvl.skill);
      return engineRef.current!.search(
        chess.fen(),
        { depth: lvl.depth, movetime: lvl.movetime },
        (info) => applyInfo(info, t)
      );
    });
    setThinkingBoth(false);
    if (!res || !res.bestmove) return;
    if (phaseRef.current !== 'active' || modeRef.current !== 'spectate') return;
    const wait = SPECTATE_MIN_MS - (nowMs() - t0);
    if (wait > 0) await sleep(wait);
    if (!force && pausedRef.current) return;
    if (phaseRef.current !== 'active' || modeRef.current !== 'spectate') return;
    applyUci(res.bestmove);
    applyResult(res, t);
  }

  async function spectateLoop() {
    const chess = chessRef.current!;
    while (
      phaseRef.current === 'active' &&
      modeRef.current === 'spectate' &&
      !pausedRef.current &&
      !chess.isGameOver()
    ) {
      await spectateOneMove();
    }
    if (
      phaseRef.current === 'active' &&
      modeRef.current === 'spectate' &&
      chess.isGameOver()
    )
      finishGame();
  }

  /* ── human interaction ── */
  function movableColor(): Color | null {
    const chess = chessRef.current!;
    if (chess.isGameOver()) return null;
    if (modeRef.current === 'eval') return chess.turn();
    if (modeRef.current === 'play') {
      if (phaseRef.current === 'setup') return chess.turn();
      if (
        phaseRef.current === 'active' &&
        !thinkingRef.current &&
        chess.turn() === humanColorRef.current
      )
        return humanColorRef.current;
    }
    return null;
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

  function afterHumanMove() {
    const chess = chessRef.current!;
    if (modeRef.current === 'play') {
      if (chess.isGameOver()) finishGame();
      else if (chess.turn() !== humanColorRef.current) playEngineMove();
    } else if (modeRef.current === 'eval') {
      analyzePosition();
    }
  }

  function doHumanMove(from: string, to: string, promotion?: string) {
    const chess = chessRef.current!;
    const autoStart =
      modeRef.current === 'play' && phaseRef.current === 'setup';
    const mover = chess.turn();
    let mv;
    try {
      mv = chess.move({ from, to, promotion });
    } catch {
      return;
    }
    if (!mv) return;
    if (autoStart) {
      humanColorRef.current = mover;
      flippedRef.current = mover === 'b';
      engineRef.current?.newGame();
      setResult('');
      setPhaseBoth('active');
    }
    pushMove(mv as never);
    afterHumanMove();
  }

  function onBoardPointer(e: ReactPointerEvent) {
    const can = movableColor();
    if (!can) return;
    const sq = hitTest(e.clientX, e.clientY);
    if (!sq) return;
    const g = gRef.current;
    const chess = chessRef.current!;
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
      if (piece && piece.color === can) selectSquare(sq);
      else {
        g.selected = null;
        g.targets = [];
      }
    } else if (piece && piece.color === can) {
      selectSquare(sq);
    }
  }

  function choosePromotion(piece: string) {
    if (!promotion) return;
    const { from, to } = promotion;
    setPromotion(null);
    doHumanMove(from, to, piece);
  }

  /* ── controls ── */
  function toggleFlip() {
    flippedRef.current = !flippedRef.current;
    const g = gRef.current;
    if (g) g.selected = null;
  }

  function togglePause() {
    if (modeRef.current !== 'spectate' || phaseRef.current !== 'active') return;
    const v = !pausedRef.current;
    setPausedBoth(v);
    if (v) engineRef.current?.stop();
    else spectateLoop();
  }

  function stepSpectate() {
    if (modeRef.current !== 'spectate' || phaseRef.current !== 'active') return;
    if (!pausedRef.current) return;
    spectateOneMove(true);
  }

  function undo() {
    const chess = chessRef.current!;
    engineRef.current?.stop();
    if (modeRef.current === 'play') {
      let n = 0;
      while (n < 2 && chess.history().length > 0) {
        chess.undo();
        n++;
        if (chess.turn() === humanColorRef.current) break;
      }
      if (phaseRef.current === 'over') setPhaseBoth('active');
      refreshView();
    } else if (modeRef.current === 'eval') {
      if (chess.history().length > 0) chess.undo();
      refreshView();
      analyzePosition();
    }
  }

  function resign() {
    if (modeRef.current !== 'play' || phaseRef.current !== 'active') return;
    engineRef.current?.stop();
    setResult(tx.youLose);
    setStatusText(tx.resigned);
    setThinkingBoth(false);
    setPhaseBoth('over');
  }

  function loadPosition(fen: string) {
    const chess = chessRef.current!;
    try {
      chess.load(fen);
    } catch {
      return;
    }
    engineRef.current?.stop();
    refreshView();
    if (modeRef.current === 'eval') analyzePosition();
  }

  function resetBoard() {
    chessRef.current!.reset();
    setPresetKey('standard');
    engineRef.current?.stop();
    refreshView();
    if (modeRef.current === 'eval') analyzePosition();
  }

  function resolvedHumanColor(): Color {
    if (humanColor === 'random') return rnd() < 0.5 ? 'w' : 'b';
    return humanColor;
  }

  function startGame() {
    if (!engineReadyRef.current) return;
    const chess = chessRef.current!;
    engineRef.current?.newGame();
    if (modeRef.current === 'play') {
      const hc = resolvedHumanColor();
      humanColorRef.current = hc;
      flippedRef.current = hc === 'b';
    }
    setPausedBoth(false);
    setResult('');
    setPhaseBoth('active');
    refreshView();
    requestAnimationFrame(() => sizeNow());
    if (modeRef.current === 'play') {
      if (!chess.isGameOver() && chess.turn() !== humanColorRef.current)
        playEngineMove();
    } else if (modeRef.current === 'spectate') {
      spectateLoop();
    }
  }

  function newGame() {
    chessRef.current!.reset();
    setPresetKey('standard');
    engineRef.current?.stop();
    setPausedBoth(false);
    setResult('');
    flippedRef.current = false;
    setPhaseBoth('setup');
    refreshView();
  }

  function switchMode(m: Mode) {
    if (m === modeRef.current) return;
    engineRef.current?.stop();
    setPausedBoth(false);
    setThinkingBoth(false);
    setResult('');
    modeRef.current = m;
    setMode(m);
    const g = gRef.current;
    if (g) g.arrow = null;
    if (m === 'eval') {
      setPhaseBoth('active');
      refreshView();
      requestAnimationFrame(() => sizeNow());
      analyzePosition();
    } else {
      setPhaseBoth('setup');
      refreshView();
      requestAnimationFrame(() => sizeNow());
    }
  }

  /* ── keyboard ── */
  const handlersRef = useRef<Record<string, () => void>>({});
  useEffect(() => {
    handlersRef.current = { togglePause, stepSpectate, undo, toggleFlip };
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const h = handlersRef.current;
      if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
        if (modeRef.current === 'spectate' && phaseRef.current === 'active') {
          h.togglePause();
          e.preventDefault();
        }
      } else if (e.key === 'ArrowRight' && modeRef.current === 'spectate') {
        h.stepSpectate();
        e.preventDefault();
      } else if (e.key === 'z' || e.key === 'Z') {
        h.undo();
      } else if (e.key === 'f' || e.key === 'F') {
        h.toggleFlip();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* ── derived UI ── */
  const fenTrim = fenInput.trim();
  const fenBad = fenTrim.length > 0 && !isValidFen(fenTrim);
  const showEvalBar = mode === 'eval';
  const showEvalNum = mode === 'eval' || mode === 'spectate';
  const modes: Mode[] = ['play', 'spectate', 'eval'];
  const modeLabel: Record<Mode, string> = {
    play: tx.modePlay,
    spectate: tx.modeSpectate,
    eval: tx.modeEval,
  };

  return (
    <div className='relative flex min-h-[540px] w-full touch-none select-none flex-col gap-4 lg:h-full lg:flex-row lg:items-stretch'>
      {/* sidebar: mode + controls + moves */}
      <div className='flex w-full shrink-0 flex-col gap-3 text-white lg:w-[300px]'>
        <div className='flex gap-1 rounded-full bg-white/[0.06] p-1 ring-1 ring-white/10'>
          {modes.map((m) => (
            <button
              key={m}
              type='button'
              onClick={() => switchMode(m)}
              className={`flex-1 rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                mode === m
                  ? 'bg-white text-[#121212]'
                  : 'text-white/65 hover:text-white'
              }`}
            >
              {modeLabel[m]}
            </button>
          ))}
        </div>

        <div className='flex items-center gap-2'>
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${
              turn === 'w' ? 'bg-white' : 'bg-white/40'
            } ring-1 ring-white/30`}
          />
          <span className='text-[14px] font-semibold text-white/85'>
            {phase === 'over' ? result : statusText}
          </span>
          {thinking && phase !== 'over' && (
            <span className='ch-think text-[12px] font-medium text-white/45'>
              {tx.thinking}
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          )}
          <span className='flex-1' />
          {showEvalNum && (
            <span className='rounded-full bg-white/10 px-2 py-0.5 text-[12px] font-semibold tabular-nums text-white/70'>
              {evalText}
              {evalDepth > 0 && (
                <span className='ml-1 text-white/35'>d{evalDepth}</span>
              )}
            </span>
          )}
          <button
            type='button'
            onClick={toggleFlip}
            title={tx.flip}
            aria-label={tx.flip}
            className='flex items-center rounded-full bg-white/10 px-2.5 py-1.5 text-white/75 transition-colors hover:bg-white/20'
          >
            <ArrowLeftRight size={15} />
          </button>
        </div>

        <div className='rounded-[16px] bg-white/[0.04] p-3.5 ring-1 ring-white/10'>
          {mode === 'play' && phase === 'setup' && (
            <div className='space-y-3'>
              <div>
                <div className='mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/40'>
                  {tx.side}
                </div>
                <div className='flex gap-1'>
                  {(['w', 'b', 'random'] as const).map((s) => (
                    <Pill
                      key={s}
                      active={humanColor === s}
                      onClick={() => setHumanColor(s)}
                    >
                      {s === 'w' ? tx.white : s === 'b' ? tx.black : tx.random}
                    </Pill>
                  ))}
                </div>
              </div>
              <div>
                <div className='mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/40'>
                  {tx.level} ·{' '}
                  <span className='text-white/55'>
                    {tx.levelNames[level - 1]}
                  </span>
                </div>
                <LevelRow value={level} onChange={setLevel} />
              </div>
              <button
                type='button'
                onClick={startGame}
                disabled={!engineReady}
                className='ch-btn w-full rounded-full bg-white py-2 text-[13px] font-semibold text-[#121212] disabled:cursor-not-allowed disabled:opacity-50'
              >
                {engineError
                  ? tx.engineFail
                  : engineReady
                    ? tx.start
                    : tx.loading}
              </button>
              <p className='text-[12px] leading-relaxed text-white/40'>
                {zh
                  ? '或直接在棋盘上走一子开始'
                  : 'or just move a piece to begin'}
              </p>
            </div>
          )}

          {mode === 'play' && phase !== 'setup' && (
            <div className='flex flex-wrap gap-2'>
              <CtrlButton
                label={tx.undo}
                onClick={undo}
                icon={<RotateCcw size={15} />}
              />
              {phase === 'active' && (
                <CtrlButton
                  label={tx.resign}
                  onClick={resign}
                  icon={<Flag size={15} />}
                />
              )}
              <CtrlButton
                label={tx.newGame}
                onClick={newGame}
                icon={<RefreshCw size={15} />}
              />
            </div>
          )}

          {mode === 'spectate' && phase === 'setup' && (
            <div className='space-y-3'>
              <div>
                <div className='mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/40'>
                  {tx.whiteEngine} ·{' '}
                  <span className='text-white/55'>
                    {tx.levelNames[wLevel - 1]}
                  </span>
                </div>
                <LevelRow value={wLevel} onChange={setWLevel} />
              </div>
              <div>
                <div className='mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/40'>
                  {tx.blackEngine} ·{' '}
                  <span className='text-white/55'>
                    {tx.levelNames[bLevel - 1]}
                  </span>
                </div>
                <LevelRow value={bLevel} onChange={setBLevel} />
              </div>
              <div>
                <div className='mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white/40'>
                  {tx.startPos}
                </div>
                <div className='flex flex-wrap gap-1'>
                  {PRESET_FENS.map((p) => (
                    <Pill
                      key={p.key}
                      active={presetKey === p.key && !fenTrim}
                      onClick={() => {
                        setPresetKey(p.key);
                        setFenInput('');
                        loadPosition(p.fen);
                      }}
                    >
                      {tx.presets[p.key as keyof typeof tx.presets]}
                    </Pill>
                  ))}
                </div>
                <div className='mt-2'>
                  <FenLoader
                    value={fenInput}
                    bad={fenBad}
                    tx={tx}
                    onChange={setFenInput}
                    onLoad={() => {
                      if (!fenBad && fenTrim) loadPosition(fenTrim);
                    }}
                  />
                </div>
              </div>
              <button
                type='button'
                onClick={startGame}
                disabled={!engineReady}
                className='ch-btn w-full rounded-full bg-white py-2 text-[13px] font-semibold text-[#121212] disabled:cursor-not-allowed disabled:opacity-50'
              >
                {engineError
                  ? tx.engineFail
                  : engineReady
                    ? tx.start
                    : tx.loading}
              </button>
            </div>
          )}

          {mode === 'spectate' && phase !== 'setup' && (
            <div className='flex flex-wrap gap-2'>
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
              <CtrlButton
                label={tx.restart}
                onClick={newGame}
                icon={<RefreshCw size={15} />}
              />
            </div>
          )}

          {mode === 'eval' && (
            <div className='space-y-2.5'>
              <div className='flex flex-wrap gap-2'>
                <CtrlButton
                  label={tx.reset}
                  onClick={resetBoard}
                  icon={<RefreshCw size={15} />}
                />
                <CtrlButton
                  label={tx.undo}
                  onClick={undo}
                  icon={<RotateCcw size={15} />}
                />
              </div>
              <FenLoader
                value={fenInput}
                bad={fenBad}
                tx={tx}
                onChange={setFenInput}
                onLoad={() => {
                  if (!fenBad && fenTrim) loadPosition(fenTrim);
                }}
              />
              <div className='flex flex-col gap-2 pt-0.5'>
                <button
                  type='button'
                  onClick={() => switchMode('play')}
                  className='ch-btn w-full rounded-full bg-white py-2 text-[13px] font-semibold text-[#121212]'
                >
                  {tx.playFromHere}
                </button>
                <button
                  type='button'
                  onClick={() => switchMode('spectate')}
                  className='w-full rounded-full bg-white/12 py-2 text-[13px] font-semibold text-white/85 transition-colors hover:bg-white/20'
                >
                  {tx.spectateFromHere}
                </button>
              </div>
              <p className='text-[12px] leading-relaxed text-white/40'>
                {tx.evalHint}
              </p>
            </div>
          )}
        </div>

        <div className='hidden min-h-0 flex-1 flex-col lg:flex'>
          <div className='mb-2 flex items-center justify-between'>
            <span className='text-[11px] font-bold uppercase tracking-[0.16em] text-white/40'>
              {tx.moves}
            </span>
            {mode === 'eval' && evalDepth > 0 && (
              <span className='text-[11px] font-medium text-white/45'>
                {tx.best} · d{evalDepth}
              </span>
            )}
          </div>
          <div
            ref={movesEndRef}
            className='min-h-0 flex-1 overflow-y-auto rounded-[14px] bg-white/[0.04] p-3 ring-1 ring-white/10'
          >
            {moveList.length === 0 ? (
              <div className='text-[13px] leading-relaxed text-white/30'>
                {mode === 'eval' ? tx.evalHint : '—'}
              </div>
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
      </div>

      {/* board area */}
      <div
        ref={fieldRef}
        className='relative flex min-h-[320px] flex-1 items-center justify-center lg:min-h-0'
      >
        <div className='flex items-center gap-2'>
          {showEvalBar && (
            <div
              className='relative w-3.5 shrink-0 overflow-hidden rounded-full bg-[#0b0d12] ring-1 ring-white/10'
              style={{ height: boardPx || '70%' }}
            >
              <div
                className='absolute inset-x-0 bottom-0 bg-[#f4f6fa] transition-[height] duration-300 ease-out'
                style={{ height: `${evalFrac * 100}%` }}
              />
              <div className='absolute inset-x-0 top-1/2 h-px bg-white/25' />
            </div>
          )}

          <div
            className='relative shrink-0'
            style={{
              width: boardPx || undefined,
              height: boardPx || undefined,
            }}
            onPointerDown={onBoardPointer}
          >
            <canvas ref={canvasRef} className='block' />

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
                <div className='ch-in pointer-events-auto flex items-center gap-3 rounded-2xl bg-black/55 px-6 py-3.5 text-center ring-1 ring-white/12 backdrop-blur-sm'>
                  <span className='text-[16px] font-bold text-white/90'>
                    {result}
                  </span>
                  <button
                    type='button'
                    onClick={newGame}
                    className='ch-btn rounded-full bg-white px-4 py-2 text-[13px] font-semibold text-[#121212]'
                  >
                    {mode === 'spectate' ? tx.restart : tx.newGame}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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

function Pill({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors ${
        active
          ? 'bg-white text-[#121212]'
          : 'bg-white/10 text-white/65 hover:bg-white/20'
      }`}
    >
      {children}
    </button>
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
    <div className='flex flex-wrap gap-1'>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((l) => (
        <button
          key={l}
          type='button'
          onClick={() => onChange(l)}
          className={`h-7 w-7 rounded-md text-[12px] font-semibold transition-colors ${
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

function FenLoader({
  value,
  bad,
  tx,
  onChange,
  onLoad,
}: {
  value: string;
  bad: boolean;
  tx: { fenPlaceholder: string; load: string; fenInvalid: string };
  onChange: (v: string) => void;
  onLoad: () => void;
}) {
  return (
    <span className='flex items-center gap-1'>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onLoad();
        }}
        placeholder={bad ? tx.fenInvalid : tx.fenPlaceholder}
        spellCheck={false}
        className={`w-[150px] rounded-lg bg-black/25 px-2.5 py-1.5 text-[12px] text-white/85 outline-none ring-1 transition-colors placeholder:text-white/30 focus:w-[230px] ${
          bad ? 'ring-[#ff6b70]/70' : 'ring-white/12 focus:ring-white/30'
        }`}
      />
      <button
        type='button'
        onClick={onLoad}
        disabled={bad || value.trim().length === 0}
        className='rounded-lg bg-white/10 px-2.5 py-1.5 text-[12px] font-semibold text-white/75 transition-colors hover:bg-white/20 disabled:opacity-40'
      >
        {tx.load}
      </button>
    </span>
  );
}

function CtrlButton({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      title={label}
      className='flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-semibold text-white/75 transition-colors hover:bg-white/20 disabled:opacity-40'
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

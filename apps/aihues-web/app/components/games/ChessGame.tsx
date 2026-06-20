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
  Eye,
  EyeOff,
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
const PIECE_VALUE: Record<string, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};
const START_COUNT: Record<string, number> = {
  p: 8,
  n: 2,
  b: 2,
  r: 2,
  q: 1,
  k: 1,
};
const PIECE_FONT = '"Segoe UI Symbol","Noto Sans Symbols 2",serif';

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
  drag: {
    type: string;
    color: Color;
    from: string | null;
    x: number;
    y: number;
  } | null;
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
    evalToggle: 'Show evaluation',
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
    evalHint:
      'Play makes moves by the rules. Use Move to drag pieces freely, or pick a piece to add; drag off the board to delete.',
    toMove: 'To move',
    playTool: 'Play',
    move: 'Move',
    erase: 'Erase',
    clearBoard: 'Clear',
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
    evalToggle: '显示局面分',
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
    evalHint:
      '走棋按规则走子；移动可自由拖动棋子，点选棋子可添加，拖出棋盘即删除。',
    toMove: '走子方',
    playTool: '走棋',
    move: '移动',
    erase: '擦除',
    clearBoard: '清空',
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

/* Original geometric piece silhouettes, drawn in a 100×100 box (centred at
   x=50, base at y≈88) and built from primitives so they can be filled +
   outlined as one union. */
function buildPiece(type: string): Path2D {
  const p = new Path2D();
  const ball = (x: number, y: number, r: number) => {
    p.moveTo(x + r, y);
    p.arc(x, y, r, 0, Math.PI * 2);
  };
  // shared base — a rounded, lightly flared plinth + a neck ring
  p.moveTo(30, 88);
  p.bezierCurveTo(26, 88, 26, 84, 31, 82);
  p.lineTo(69, 82);
  p.bezierCurveTo(74, 84, 74, 88, 70, 88);
  p.closePath();
  p.moveTo(36, 82);
  p.bezierCurveTo(34, 79, 35, 77, 38, 76);
  p.lineTo(62, 76);
  p.bezierCurveTo(65, 77, 66, 79, 64, 82);
  p.closePath();

  if (type === 'p') {
    p.moveTo(39, 76);
    p.bezierCurveTo(41, 68, 35, 62, 43, 56);
    p.lineTo(57, 56);
    p.bezierCurveTo(65, 62, 59, 68, 61, 76);
    p.closePath();
    p.moveTo(42, 57);
    p.bezierCurveTo(43, 53, 57, 53, 58, 57);
    p.bezierCurveTo(57, 59, 43, 59, 42, 57);
    p.closePath();
    ball(50, 43, 11.5);
  } else if (type === 'r') {
    p.moveTo(39, 76);
    p.bezierCurveTo(37, 62, 37, 54, 40, 49);
    p.lineTo(60, 49);
    p.bezierCurveTo(63, 54, 63, 62, 61, 76);
    p.closePath();
    p.moveTo(36, 49);
    p.quadraticCurveTo(35, 45, 38, 43);
    p.lineTo(62, 43);
    p.quadraticCurveTo(65, 45, 64, 49);
    p.closePath();
    p.moveTo(35, 43);
    p.lineTo(65, 43);
    p.lineTo(65, 37);
    p.lineTo(35, 37);
    p.closePath();
    p.rect(35, 28, 8, 10);
    p.rect(46, 28, 8, 10);
    p.rect(57, 28, 8, 10);
  } else if (type === 'b') {
    p.moveTo(40, 76);
    p.bezierCurveTo(42, 66, 36, 60, 44, 54);
    p.lineTo(56, 54);
    p.bezierCurveTo(64, 60, 58, 66, 60, 76);
    p.closePath();
    p.moveTo(43, 55);
    p.bezierCurveTo(44, 51, 56, 51, 57, 55);
    p.bezierCurveTo(56, 57, 44, 57, 43, 55);
    p.closePath();
    p.moveTo(50, 22);
    p.bezierCurveTo(59, 30, 61, 42, 50, 50);
    p.bezierCurveTo(39, 42, 41, 30, 50, 22);
    p.closePath();
    ball(50, 19, 3.6);
  } else if (type === 'q') {
    p.moveTo(38, 76);
    p.bezierCurveTo(41, 63, 35, 55, 43, 49);
    p.lineTo(57, 49);
    p.bezierCurveTo(65, 55, 59, 63, 62, 76);
    p.closePath();
    p.moveTo(42, 50);
    p.bezierCurveTo(43, 46, 57, 46, 58, 50);
    p.bezierCurveTo(57, 52, 43, 52, 42, 50);
    p.closePath();
    p.moveTo(40, 49);
    p.quadraticCurveTo(34, 40, 33, 33);
    p.lineTo(67, 33);
    p.quadraticCurveTo(66, 40, 60, 49);
    p.closePath();
    ball(32, 30, 4.4);
    ball(41, 27, 4.4);
    ball(50, 26, 4.4);
    ball(59, 27, 4.4);
    ball(68, 30, 4.4);
  } else if (type === 'k') {
    p.moveTo(38, 76);
    p.bezierCurveTo(41, 63, 35, 55, 43, 49);
    p.lineTo(57, 49);
    p.bezierCurveTo(65, 55, 59, 63, 62, 76);
    p.closePath();
    p.moveTo(42, 50);
    p.bezierCurveTo(43, 46, 57, 46, 58, 50);
    p.bezierCurveTo(57, 52, 43, 52, 42, 50);
    p.closePath();
    p.moveTo(40, 49);
    p.quadraticCurveTo(38, 41, 41, 35);
    p.lineTo(59, 35);
    p.quadraticCurveTo(62, 41, 60, 49);
    p.closePath();
    p.rect(46.5, 13, 7, 23);
    p.rect(40, 19, 20, 6.5);
  } else if (type === 'n') {
    // horse head facing left, smooth profile
    p.moveTo(40, 76);
    p.bezierCurveTo(44, 66, 42, 58, 39, 52);
    p.bezierCurveTo(34, 51, 28, 51, 24, 50);
    p.bezierCurveTo(19, 49, 18, 44, 21, 41);
    p.bezierCurveTo(24, 40, 30, 41, 33, 39);
    p.bezierCurveTo(33, 35, 31, 32, 33, 29);
    p.bezierCurveTo(31, 26, 31, 23, 33, 22);
    p.lineTo(38, 29);
    p.bezierCurveTo(39, 24, 42, 20, 46, 19);
    p.bezierCurveTo(53, 20, 58, 28, 61, 38);
    p.bezierCurveTo(63, 49, 63, 59, 62, 68);
    p.bezierCurveTo(62, 72, 62, 75, 60, 76);
    p.closePath();
  }
  return p;
}

export default function ChessGame({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const tx = T[zh ? 'zh' : 'en'];

  const fieldRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gRef = useRef<ChessView | null>(null);
  const rafRef = useRef<number>(0);
  const piecePathsRef = useRef<Record<string, Path2D>>({});

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
  const brushRef = useRef<
    'play' | 'move' | 'erase' | { type: string; color: Color }
  >('play');
  const editorTurnRef = useRef<Color>('w');
  const editorEditedRef = useRef(false);

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
  const [brush, setBrushState] = useState<
    'play' | 'move' | 'erase' | { type: string; color: Color }
  >('play');
  const [editorTurn, setEditorTurnState] = useState<Color>('w');
  const [material, setMaterial] = useState<{
    capW: string[];
    capB: string[];
    adv: number;
  }>({ capW: [], capB: [], adv: 0 });
  const [promotion, setPromotion] = useState<{
    from: string;
    to: string;
  } | null>(null);
  const [playEval, setPlayEval] = useState(false);

  const movesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const m: Record<string, Path2D> = {};
    for (const t of ['k', 'q', 'r', 'b', 'n', 'p']) m[t] = buildPiece(t);
    piecePathsRef.current = m;
  }, []);

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
      drag: null,
      last: 0,
    };
  }

  function sizeNow() {
    const cv = canvasRef.current;
    if (!cv) return;
    const r = cv.getBoundingClientRect();
    const size = Math.min(r.width, r.height);
    if (size < 2) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const target = Math.round(size * dpr);
    if (cv.width !== target) {
      cv.width = target;
      cv.height = target;
    }
    const scale = size / BOARD;
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

  function clientToLogical(clientX: number, clientY: number) {
    const cv = canvasRef.current;
    if (!cv) return { x: 0, y: 0, on: false };
    const r = cv.getBoundingClientRect();
    const px = (clientX - r.left) / r.width;
    const py = (clientY - r.top) / r.height;
    const on = px >= 0 && px <= 1 && py >= 0 && py <= 1;
    return { x: px * BOARD, y: py * BOARD, on };
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
    const white = piece.color === 'w';
    const path = piecePathsRef.current[piece.type] ?? buildPiece(piece.type);
    const k = (CELL * 1.08 * s) / 100;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(cx, cy);
    ctx.scale(k, k);
    ctx.translate(-50, -52);

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 5.5;
    ctx.strokeStyle = white ? 'rgba(52,59,72,0.95)' : 'rgba(3,5,9,0.98)';
    ctx.stroke(path);

    const grad = ctx.createLinearGradient(0, 16, 0, 90);
    if (white) {
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(1, '#c4ccd7');
    } else {
      grad.addColorStop(0, '#5a6273');
      grad.addColorStop(1, '#12151c');
    }
    ctx.fillStyle = grad;
    ctx.fill(path);

    ctx.save();
    ctx.beginPath();
    ctx.rect(6, 8, 88, 36);
    ctx.clip();
    ctx.fillStyle = white ? 'rgba(255,255,255,0.5)' : 'rgba(205,214,228,0.14)';
    ctx.fill(path);
    ctx.restore();

    if (piece.type === 'b') {
      ctx.lineWidth = 2.6;
      ctx.strokeStyle = white ? 'rgba(52,59,72,0.8)' : 'rgba(3,5,9,0.85)';
      ctx.beginPath();
      ctx.moveTo(46, 32);
      ctx.lineTo(54, 40);
      ctx.stroke();
    } else if (piece.type === 'n') {
      ctx.fillStyle = white ? 'rgba(52,59,72,0.9)' : 'rgba(214,222,234,0.85)';
      ctx.beginPath();
      ctx.arc(33, 33, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

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
        if (g.drag && g.drag.from === sq) continue;
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
    if (g.drag) {
      drawPiece(
        ctx,
        { type: g.drag.type, color: g.drag.color },
        g.drag.x,
        g.drag.y,
        1.08,
        0.96
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

  function updateMaterial() {
    const b = chessRef.current!.board() as (Piece | null)[][];
    const wc: Record<string, number> = { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 };
    const bc: Record<string, number> = { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 };
    let wv = 0;
    let bv = 0;
    for (const row of b)
      for (const pc of row)
        if (pc) {
          if (pc.color === 'w') {
            wc[pc.type]++;
            wv += PIECE_VALUE[pc.type] || 0;
          } else {
            bc[pc.type]++;
            bv += PIECE_VALUE[pc.type] || 0;
          }
        }
    const capW: string[] = [];
    const capB: string[] = [];
    for (const t of ['q', 'r', 'b', 'n', 'p']) {
      for (let i = 0; i < Math.max(0, START_COUNT[t] - bc[t]); i++)
        capW.push(t);
      for (let i = 0; i < Math.max(0, START_COUNT[t] - wc[t]); i++)
        capB.push(t);
    }
    setMaterial({ capW, capB, adv: wv - bv });
  }

  function setStatusFromGame() {
    const chess = chessRef.current!;
    const t = modeRef.current === 'eval' ? editorTurnRef.current : chess.turn();
    setTurn(t);
    updateMaterial();
    if (modeRef.current !== 'eval') {
      if (chess.isGameOver()) return;
      setStatusText(t === 'w' ? tx.whiteMove : tx.blackMove);
      return;
    }
    if (!editorEditedRef.current && chess.isGameOver())
      setStatusText(gameResultText());
    else setStatusText(t === 'w' ? tx.whiteMove : tx.blackMove);
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

  function hasBothKings() {
    const b = chessRef.current!.board() as (Piece | null)[][];
    let wk = false;
    let bk = false;
    for (const row of b)
      for (const pc of row)
        if (pc && pc.type === 'k') {
          if (pc.color === 'w') wk = true;
          else bk = true;
        }
    return wk && bk;
  }

  function editorFen() {
    const board = chessRef.current!.fen().split(' ')[0];
    return `${board} ${editorTurnRef.current} - - 0 1`;
  }

  async function analyzePosition() {
    if (modeRef.current !== 'eval') return;
    const g = gRef.current;
    if (!hasBothKings()) {
      setEvalText('—');
      setEvalFrac(0.5);
      if (g) g.arrow = null;
      return;
    }
    const t = editorTurnRef.current;
    const fen = editorEditedRef.current ? editorFen() : chessRef.current!.fen();
    setThinkingBoth(true);
    const res = await engineExclusive(() => {
      engineRef.current!.setSkill(20);
      return engineRef.current!.search(fen, { depth: EVAL_DEPTH }, (info) =>
        applyInfo(info, t)
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
    if (modeRef.current === 'eval') {
      onEvalPointerDown(e);
      return;
    }
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
    if (modeRef.current === 'eval') doLegalEditMove(from, to, piece);
    else doHumanMove(from, to, piece);
  }

  /* ── eval position editor ── */
  function syncEditorTurn() {
    editorTurnRef.current = chessRef.current!.turn();
    setEditorTurnState(editorTurnRef.current);
    editorEditedRef.current = false;
  }

  function doLegalEditMove(from: string, to: string, promotion?: string) {
    const chess = chessRef.current!;
    let mv;
    try {
      mv = chess.move({ from, to, promotion });
    } catch {
      return;
    }
    if (!mv) return;
    syncEditorTurn();
    pushMove(mv as never);
    analyzePosition();
  }

  function onEvalLegalMove(sq: string | null) {
    const g = gRef.current;
    const chess = chessRef.current!;
    if (!g) return;
    if (!sq) {
      g.selected = null;
      g.targets = [];
      return;
    }
    const piece = chess.get(sq as Square) as Piece | undefined;
    const turn = chess.turn();
    if (g.selected) {
      const target = g.targets.find((t) => t.to === sq);
      if (target) {
        const moving = chess.get(g.selected as Square) as Piece | undefined;
        const isPromo =
          moving?.type === 'p' && (sq[1] === '8' || sq[1] === '1');
        if (isPromo) {
          setPromotion({ from: g.selected, to: sq });
          g.selected = null;
          g.targets = [];
          return;
        }
        doLegalEditMove(g.selected, sq);
        return;
      }
      if (piece && piece.color === turn) selectSquare(sq);
      else {
        g.selected = null;
        g.targets = [];
      }
    } else if (piece && piece.color === turn) {
      selectSquare(sq);
    }
  }

  function setBrush(
    b: 'play' | 'move' | 'erase' | { type: string; color: Color }
  ) {
    brushRef.current = b;
    setBrushState(b);
    const g = gRef.current;
    if (g) {
      g.selected = null;
      g.targets = [];
    }
  }

  function setEditorTurn(c: Color) {
    editorTurnRef.current = c;
    setEditorTurnState(c);
    editorEditedRef.current = true;
    if (modeRef.current === 'eval') analyzePosition();
  }

  function afterEdit() {
    editorEditedRef.current = true;
    engineRef.current?.stop();
    refreshView();
    analyzePosition();
  }

  function editPlace(sq: string, piece: { type: string; color: Color } | null) {
    const chess = chessRef.current!;
    if (piece === null) {
      chess.remove(sq as Square);
      afterEdit();
      return;
    }
    const prev = chess.get(sq as Square) as Piece | undefined;
    chess.remove(sq as Square);
    if (
      !chess.put(
        { type: piece.type, color: piece.color } as never,
        sq as Square
      )
    ) {
      if (prev) chess.put(prev as never, sq as Square);
      return;
    }
    afterEdit();
  }

  function editRemove(sq: string) {
    chessRef.current!.remove(sq as Square);
    afterEdit();
  }

  function editMove(from: string, to: string) {
    const chess = chessRef.current!;
    const pc = chess.get(from as Square) as Piece | undefined;
    if (!pc) return;
    const prevTo = chess.get(to as Square) as Piece | undefined;
    chess.remove(from as Square);
    chess.remove(to as Square);
    if (!chess.put({ type: pc.type, color: pc.color } as never, to as Square)) {
      chess.put({ type: pc.type, color: pc.color } as never, from as Square);
      if (prevTo) chess.put(prevTo as never, to as Square);
      return;
    }
    afterEdit();
  }

  function clearBoard() {
    chessRef.current!.clear();
    afterEdit();
  }

  function onEvalPointerDown(e: ReactPointerEvent) {
    const sq = hitTest(e.clientX, e.clientY);
    const g = gRef.current;
    if (!g) return;
    const b = brushRef.current;
    if (b === 'erase') {
      if (sq) editPlace(sq, null);
      return;
    }
    if (typeof b === 'object') {
      if (sq) editPlace(sq, b);
      return;
    }
    if (b === 'play') {
      onEvalLegalMove(sq);
      return;
    }
    // Move tool: free click-to-move + deselect, with drag as a shortcut.
    if (g.selected) {
      if (!sq || sq === g.selected) {
        g.selected = null;
        g.targets = [];
        return;
      }
      const from = g.selected;
      g.selected = null;
      g.targets = [];
      editMove(from, sq);
      return;
    }
    if (!sq) return;
    const pc = chessRef.current!.get(sq as Square) as Piece | undefined;
    if (!pc) return;
    const l = clientToLogical(e.clientX, e.clientY);
    g.drag = { type: pc.type, color: pc.color, from: sq, x: l.x, y: l.y };
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  }

  function onBoardPointerMove(e: ReactPointerEvent) {
    const g = gRef.current;
    if (!g || !g.drag) return;
    const l = clientToLogical(e.clientX, e.clientY);
    g.drag.x = l.x;
    g.drag.y = l.y;
  }

  function onBoardPointerUp(e: ReactPointerEvent) {
    const g = gRef.current;
    if (!g || !g.drag) return;
    const from = g.drag.from;
    g.drag = null;
    if (!from) return;
    const sq = hitTest(e.clientX, e.clientY);
    if (!sq) {
      editRemove(from);
      return;
    }
    if (sq === from) {
      g.selected = from;
      g.targets = [];
      return;
    }
    editMove(from, sq);
  }

  function onBoardPointerCancel() {
    const g = gRef.current;
    if (g) g.drag = null;
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
      syncEditorTurn();
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
    if (modeRef.current === 'eval') syncEditorTurn();
    refreshView();
    if (modeRef.current === 'eval') analyzePosition();
  }

  function resetBoard() {
    chessRef.current!.reset();
    setPresetKey('standard');
    engineRef.current?.stop();
    if (modeRef.current === 'eval') syncEditorTurn();
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
    setBrush('play');
    modeRef.current = m;
    setMode(m);
    const g = gRef.current;
    if (g) {
      g.arrow = null;
      g.drag = null;
    }
    if (m === 'eval') {
      syncEditorTurn();
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
  const showEval = mode !== 'play' || playEval;
  const modes: Mode[] = ['play', 'spectate', 'eval'];
  const modeLabel: Record<Mode, string> = {
    play: tx.modePlay,
    spectate: tx.modeSpectate,
    eval: tx.modeEval,
  };

  return (
    <div className='relative flex min-h-[520px] w-full touch-none select-none flex-col items-center gap-4 py-1 lg:h-full lg:flex-row lg:items-center lg:justify-center lg:gap-6'>
      {/* sidebar: mode + controls + moves */}
      <div className='flex w-full max-w-[min(92vw,520px)] shrink-0 flex-col gap-3 text-white lg:h-[min(74vh,600px)] lg:w-[300px]'>
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
          {showEval && (
            <span className='rounded-full bg-white/10 px-2 py-0.5 text-[12px] font-semibold tabular-nums text-white/70'>
              {evalText}
            </span>
          )}
          {mode === 'play' && (
            <button
              type='button'
              onClick={() => setPlayEval((v) => !v)}
              title={tx.evalToggle}
              aria-label={tx.evalToggle}
              className={`flex items-center rounded-full px-2.5 py-1.5 transition-colors ${
                playEval
                  ? 'bg-white/20 text-white'
                  : 'bg-white/10 text-white/55 hover:bg-white/20'
              }`}
            >
              {playEval ? <Eye size={15} /> : <EyeOff size={15} />}
            </button>
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

        {(material.capW.length > 0 ||
          material.capB.length > 0 ||
          material.adv !== 0) && (
          <div className='flex flex-col gap-1 rounded-[14px] bg-white/[0.04] px-3 py-2 ring-1 ring-white/10'>
            <CapturedRow
              pieces={material.capW}
              dark
              adv={material.adv > 0 ? material.adv : 0}
            />
            <CapturedRow
              pieces={material.capB}
              adv={material.adv < 0 ? -material.adv : 0}
            />
          </div>
        )}

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
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <span className='text-[11px] font-bold uppercase tracking-[0.14em] text-white/40'>
                  {tx.toMove}
                </span>
                <Pill
                  active={editorTurn === 'w'}
                  onClick={() => setEditorTurn('w')}
                >
                  {tx.white}
                </Pill>
                <Pill
                  active={editorTurn === 'b'}
                  onClick={() => setEditorTurn('b')}
                >
                  {tx.black}
                </Pill>
                <span className='flex-1' />
                <button
                  type='button'
                  onClick={resetBoard}
                  title={tx.reset}
                  aria-label={tx.reset}
                  className='flex h-7 w-7 items-center justify-center rounded-md bg-white/10 text-white/70 transition-colors hover:bg-white/20'
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  type='button'
                  onClick={undo}
                  title={tx.undo}
                  aria-label={tx.undo}
                  className='flex h-7 w-7 items-center justify-center rounded-md bg-white/10 text-white/70 transition-colors hover:bg-white/20'
                >
                  <RotateCcw size={14} />
                </button>
              </div>
              <div className='space-y-1.5'>
                {(['w', 'b'] as const).map((col) => (
                  <div key={col} className='flex gap-1'>
                    {(['k', 'q', 'r', 'b', 'n', 'p'] as const).map((t) => {
                      const on =
                        typeof brush === 'object' &&
                        brush?.color === col &&
                        brush?.type === t;
                      return (
                        <button
                          key={col + t}
                          type='button'
                          onClick={() =>
                            setBrush(on ? 'play' : { type: t, color: col })
                          }
                          className={`flex h-7 flex-1 items-center justify-center rounded-md text-[19px] leading-none transition-colors ${
                            on
                              ? 'bg-white text-[#121212]'
                              : col === 'w'
                                ? 'bg-white/10 text-white hover:bg-white/20'
                                : 'bg-white/10 text-white/45 hover:bg-white/20'
                          }`}
                          style={{
                            fontFamily:
                              '"Segoe UI Symbol","Noto Sans Symbols 2",serif',
                          }}
                        >
                          {GLYPH[t]}
                        </button>
                      );
                    })}
                  </div>
                ))}
                <div className='flex gap-1'>
                  <button
                    type='button'
                    onClick={() => setBrush('play')}
                    className={`flex-1 rounded-md py-1.5 text-[11px] font-semibold transition-colors ${
                      brush === 'play'
                        ? 'bg-white text-[#121212]'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {tx.playTool}
                  </button>
                  <button
                    type='button'
                    onClick={() => setBrush('move')}
                    className={`flex-1 rounded-md py-1.5 text-[11px] font-semibold transition-colors ${
                      brush === 'move'
                        ? 'bg-white text-[#121212]'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {tx.move}
                  </button>
                  <button
                    type='button'
                    onClick={() =>
                      setBrush(brush === 'erase' ? 'play' : 'erase')
                    }
                    className={`flex-1 rounded-md py-1.5 text-[11px] font-semibold transition-colors ${
                      brush === 'erase'
                        ? 'bg-white text-[#121212]'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {tx.erase}
                  </button>
                  <button
                    type='button'
                    onClick={clearBoard}
                    className='flex-1 rounded-md bg-white/10 py-1.5 text-[11px] font-semibold text-white/70 transition-colors hover:bg-white/20'
                  >
                    {tx.clearBoard}
                  </button>
                </div>
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
              <div className='grid grid-cols-2 gap-2 pt-0.5'>
                <button
                  type='button'
                  onClick={() => switchMode('play')}
                  className='ch-btn rounded-full bg-white px-2 py-1.5 text-[12px] font-semibold text-[#121212]'
                >
                  {tx.playFromHere}
                </button>
                <button
                  type='button'
                  onClick={() => switchMode('spectate')}
                  className='rounded-full bg-white/12 px-2 py-1.5 text-[12px] font-semibold text-white/85 transition-colors hover:bg-white/20'
                >
                  {tx.spectateFromHere}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className='hidden min-h-0 flex-1 flex-col lg:flex'>
          <div className='mb-2 flex items-center justify-between'>
            <span className='text-[11px] font-bold uppercase tracking-[0.16em] text-white/40'>
              {tx.moves}
            </span>
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
                      className='flex items-center gap-2 rounded px-1.5 py-1 text-[13px] tabular-nums odd:bg-white/[0.03]'
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

      {/* board + eval bar */}
      <div className='order-first flex shrink-0 items-stretch gap-2'>
        <div className='relative w-[22px] shrink-0 overflow-hidden rounded-[5px] bg-[#0b0d12] ring-1 ring-white/10'>
          <div
            className='absolute inset-x-0 bottom-0 bg-[#f4f6fa] transition-[height] duration-300 ease-out'
            style={{ height: `${showEval ? evalFrac * 100 : 0}%` }}
          />
          <div className='absolute inset-x-0 top-1/2 h-px bg-black/15' />
          {showEval && evalText !== '—' && (
            <span
              className={`absolute inset-x-0 text-center text-[9px] font-bold leading-none tabular-nums ${
                evalFrac >= 0.5
                  ? 'bottom-1 text-[#11141a]'
                  : 'top-1 text-white/90'
              }`}
            >
              {evalText.replace(/^[+-]/, '')}
            </span>
          )}
        </div>

        <div
          ref={fieldRef}
          className='relative aspect-square w-[min(90vw,520px)] shrink-0 lg:w-auto lg:h-[min(74vh,600px)]'
          onPointerDown={onBoardPointer}
          onPointerMove={onBoardPointerMove}
          onPointerUp={onBoardPointerUp}
          onPointerCancel={onBoardPointerCancel}
        >
          <canvas
            ref={canvasRef}
            className='absolute inset-0 block h-full w-full'
          />

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

function CapturedRow({
  pieces,
  dark,
  adv,
}: {
  pieces: string[];
  dark?: boolean;
  adv: number;
}) {
  return (
    <div className='flex h-4 items-center'>
      <span
        className={`flex text-[15px] leading-none ${
          dark ? 'text-white/40' : 'text-white/90'
        }`}
        style={{ fontFamily: PIECE_FONT }}
      >
        {pieces.map((t, i) => (
          <span key={i} className='-ml-1 first:ml-0'>
            {GLYPH[t]}
          </span>
        ))}
      </span>
      {adv > 0 && (
        <span className='ml-1.5 text-[11px] font-bold text-white/65'>
          +{adv}
        </span>
      )}
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

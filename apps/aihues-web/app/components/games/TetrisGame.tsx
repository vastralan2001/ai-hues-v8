'use client';

import { useEffect, useRef, useState } from 'react';

import { useOptionalGameSession } from '@/components/games/GameSessionProvider';
import type { Locale } from '@/lib/dict';
import {
  COLORS,
  COLS,
  rotateCW as rotateShape,
  ROWS,
  SHAPES,
} from '@/lib/tetris';

/* Tetris — ported from kimi.com/share/d1p9t3051tqdukda9ns0. Core logic kept; visuals upgraded to the aihues aesthetic. The tetromino set, colours and rotation now come from the shared @/lib/tetris core, used by the home demo too. */

type Phase = 'idle' | 'playing' | 'over';

const BEST_KEY = 'aihues_block-drop_best';

// Line-clear scoring per cleared count (× level), exactly as the source.
const LINE_SCORE = [0, 100, 300, 500, 800];

interface Piece {
  shape: number[][];
  id: number; // 1..7 → COLORS[id-1]
  x: number;
  y: number;
}
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  r: number;
  color: string;
}
interface BGame {
  W: number;
  H: number;
  board: number[][];
  piece: Piece | null;
  particles: Particle[];
  score: number;
  level: number;
  lines: number;
  dropInterval: number;
  acc: number; // ms accumulated toward next gravity step
  flash: number; // line-clear flash timer (0..1)
  t: number;
}

type Action = 'left' | 'right' | 'rotate' | 'soft' | 'hard';

type Difficulty = 'easy' | 'normal' | 'hard';
// Base gravity interval (ms) per difficulty; the current speed is the easiest.
const DIFF_BASE: Record<Difficulty, number> = {
  easy: 1000,
  normal: 640,
  hard: 380,
};
const DIFF_ORDER: Difficulty[] = ['easy', 'normal', 'hard'];
const DIFF_DOT: Record<Difficulty, string> = {
  easy: '#5cb85c',
  normal: '#e0a32e',
  hard: '#d9534f',
};

const T = {
  en: {
    best: 'Best',
    score: 'Score',
    level: 'Level',
    lines: 'Lines',
    next: 'Next',
    tagline: 'Clear lines before the stack tops out',
    start: 'Start',
    again: 'Play again',
    over: 'Game Over',
    hint: 'Arrows to move · Up to rotate · Space to drop',
    left: 'Move left',
    right: 'Move right',
    rotate: 'Rotate',
    soft: 'Soft drop',
    hard: 'Hard drop',
    easy: 'Easy',
    normal: 'Normal',
    hardLevel: 'Hard',
  },
  zh: {
    best: '最高',
    score: '分数',
    level: '等级',
    lines: '行数',
    next: '下一个',
    tagline: '在方块堆顶之前消除整行',
    start: '开始',
    again: '再来一局',
    over: '游戏结束',
    hint: '方向键移动 · 上键旋转 · 空格速降',
    left: '左移',
    right: '右移',
    rotate: '旋转',
    soft: '下移',
    hard: '速降',
    easy: '简单',
    normal: '中等',
    hardLevel: '困难',
  },
} as const;

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className='flex flex-col items-center'>
      <span className='text-[11px] font-medium uppercase tracking-[0.12em] text-white/45'>
        {label}
      </span>
      <span className='text-[20px] font-bold leading-tight text-white/90 tabular-nums'>
        {value}
      </span>
    </div>
  );
}

export default function TetrisGame({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const tx = T[zh ? 'zh' : 'en'];

  const fieldRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nextCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const gRef = useRef<BGame | null>(null);
  const rafRef = useRef(0);
  const phaseRef = useRef<Phase>('idle');
  const bestRef = useRef(0);
  const startRef = useRef<() => void>(() => {});
  const actRef = useRef<(a: Action) => void>(() => {});
  const nextTypeRef = useRef(0); // index into SHAPES for the upcoming piece
  const diffRef = useRef<Difficulty>('easy');

  const [phase, setPhase] = useState<Phase>('idle');
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [nextType, setNextType] = useState(0);
  const [diff, setDiff] = useState<Difficulty>('easy');

  const gameSession = useOptionalGameSession();

  useEffect(() => {
    gameSession?.reportScore(score);
  }, [score, gameSession]);

  useEffect(() => {
    if (phase === 'over') {
      gameSession?.reportGameOver(score);
    }
  }, [phase, score, gameSession]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const b = Number(localStorage.getItem(BEST_KEY) || 0) || 0;
      bestRef.current = b;
      setBest(b);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const field = fieldRef.current;
    if (!canvas || !field) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setPhaseBoth = (p: Phase) => {
      phaseRef.current = p;
      setPhase(p);
    };

    // DPR-aware sizing driven by ResizeObserver; the well keeps a 1:2 ratio.
    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = field.clientWidth;
      const h = field.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const g = gRef.current;
      if (g) {
        g.W = w;
        g.H = h;
      }
    };
    const ro = new ResizeObserver(size);
    ro.observe(field);
    size();

    const newPiece = (id: number): Piece => {
      const shape = SHAPES[id - 1];
      return {
        shape,
        id,
        x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
        y: 0,
      };
    };

    // Validity check — bounds + collision, identical to the source.
    const valid = (p: Piece, dx: number, dy: number, shape?: number[][]) => {
      const s = shape || p.shape;
      const nx = p.x + dx;
      const ny = p.y + dy;
      const g = gRef.current;
      if (!g) return false;
      for (let y = 0; y < s.length; y++) {
        for (let x = 0; x < s[y].length; x++) {
          if (!s[y][x]) continue;
          const bx = nx + x;
          const by = ny + y;
          if (bx < 0 || bx >= COLS || by >= ROWS) return false;
          if (by >= 0 && g.board[by][bx]) return false;
        }
      }
      return true;
    };

    const burst = (cx: number, cy: number, color: string, n: number) => {
      const g = gRef.current;
      if (!g) return;
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = Math.random() * 5 + 1;
        g.particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 1,
          r: Math.random() * 3 + 1,
          color,
        });
      }
      if (g.particles.length > 240)
        g.particles.splice(0, g.particles.length - 240);
    };

    const cell = (g: BGame) => {
      const cw = g.W / COLS;
      const ch = g.H / ROWS;
      return Math.min(cw, ch);
    };
    const originX = (g: BGame) => (g.W - cell(g) * COLS) / 2;
    const originY = (g: BGame) => (g.H - cell(g) * ROWS) / 2;

    const endGame = () => {
      const g = gRef.current;
      if (!g) return;
      if (g.score > bestRef.current) {
        bestRef.current = g.score;
        setBest(g.score);
        try {
          localStorage.setItem(BEST_KEY, String(g.score));
        } catch {
          /* ignore */
        }
      }
      setPhaseBoth('over');
    };

    const spawn = () => {
      const g = gRef.current;
      if (!g) return;
      g.piece = newPiece(nextTypeRef.current + 1);
      nextTypeRef.current = Math.floor(Math.random() * SHAPES.length);
      setNextType(nextTypeRef.current);
      if (!valid(g.piece, 0, 0)) endGame();
    };

    // Lock the active piece, clear full lines, score, ramp level/speed.
    const place = () => {
      const g = gRef.current;
      if (!g || !g.piece) return;
      const p = g.piece;
      const cs = cell(g);
      const ox = originX(g);
      const oy = originY(g);
      for (let y = 0; y < p.shape.length; y++) {
        for (let x = 0; x < p.shape[y].length; x++) {
          if (!p.shape[y][x]) continue;
          const by = p.y + y;
          const bx = p.x + x;
          if (by >= 0) g.board[by][bx] = p.id;
        }
      }

      let cleared = 0;
      for (let y = ROWS - 1; y >= 0; y--) {
        if (g.board[y].every((c) => c !== 0)) {
          for (let x = 0; x < COLS; x++) {
            burst(
              ox + x * cs + cs / 2,
              oy + y * cs + cs / 2,
              COLORS[g.board[y][x] - 1],
              3
            );
          }
          g.board.splice(y, 1);
          g.board.unshift(Array(COLS).fill(0));
          cleared++;
          y++;
        }
      }

      if (cleared > 0) {
        g.flash = 1;
        g.lines += cleared;
        g.score += LINE_SCORE[cleared] * g.level;
        g.level = Math.floor(g.lines / 10) + 1;
        // Speed ramp folds the source's default slider (5) into the base.
        g.dropInterval = Math.max(
          80,
          DIFF_BASE[diffRef.current] - (g.level - 1) * 90
        );
        setScore(g.score);
        setLines(g.lines);
        setLevel(g.level);
      }

      spawn();
    };

    const move = (dx: number, dy: number) => {
      const g = gRef.current;
      if (!g || !g.piece) return false;
      if (valid(g.piece, dx, dy)) {
        g.piece.x += dx;
        g.piece.y += dy;
        return true;
      }
      return false;
    };

    const rotate = () => {
      const g = gRef.current;
      if (!g || !g.piece) return;
      const r = rotateShape(g.piece.shape);
      // Source rejects invalid rotations; add light wall-kicks (±1, ±2) so
      // pieces against a wall still turn — keeps spawn/collision rules intact.
      for (const dx of [0, -1, 1, -2, 2]) {
        if (valid(g.piece, dx, 0, r)) {
          g.piece.shape = r;
          g.piece.x += dx;
          return;
        }
      }
    };

    const drop = () => {
      if (!move(0, 1)) place();
    };

    const hardDrop = () => {
      const g = gRef.current;
      if (!g || !g.piece) return;
      while (move(0, 1)) {
        g.score += 2; // small reward for distance, like classic Tetris
      }
      setScore(g.score);
      place();
    };

    actRef.current = (a: Action) => {
      if (phaseRef.current !== 'playing') return;
      if (a === 'left') move(-1, 0);
      else if (a === 'right') move(1, 0);
      else if (a === 'rotate') rotate();
      else if (a === 'soft') drop();
      else if (a === 'hard') hardDrop();
    };

    const reset = () => {
      const w = field.clientWidth;
      const h = field.clientHeight;
      nextTypeRef.current = Math.floor(Math.random() * SHAPES.length);
      gRef.current = {
        W: w,
        H: h,
        board: Array.from({ length: ROWS }, () => Array(COLS).fill(0)),
        piece: null,
        particles: [],
        score: 0,
        level: 1,
        lines: 0,
        dropInterval: DIFF_BASE[diffRef.current],
        acc: 0,
        flash: 0,
        t: 0,
      };
      setScore(0);
      setLevel(1);
      setLines(0);
      spawn();
    };

    const roundRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) => {
      const rr = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + rr, y);
      ctx.arcTo(x + w, y, x + w, y + h, rr);
      ctx.arcTo(x + w, y + h, x, y + h, rr);
      ctx.arcTo(x, y + h, x, y, rr);
      ctx.arcTo(x, y, x + w, y, rr);
      ctx.closePath();
    };

    // Glowing rounded block with a top sheen.
    const drawBlock = (
      px: number,
      py: number,
      cs: number,
      color: string,
      glow: boolean
    ) => {
      const pad = Math.max(1, cs * 0.06);
      const x = px + pad;
      const y = py + pad;
      const s = cs - pad * 2;
      ctx.save();
      if (glow) {
        ctx.shadowColor = color;
        ctx.shadowBlur = Math.max(6, cs * 0.4);
      }
      ctx.fillStyle = color;
      roundRect(x, y, s, s, cs * 0.18);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = 'rgba(255,255,255,0.28)';
      roundRect(x + s * 0.12, y + s * 0.1, s * 0.76, s * 0.32, cs * 0.12);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.lineWidth = 1;
      roundRect(x, y, s, s, cs * 0.18);
      ctx.stroke();
    };

    const render = () => {
      const g = gRef.current;
      if (!g) return;
      const { W, H } = g;
      ctx.clearRect(0, 0, W, H);
      const cs = cell(g);
      const ox = originX(g);
      const oy = originY(g);
      const wellW = cs * COLS;
      const wellH = cs * ROWS;

      // Well backdrop.
      const bg = ctx.createLinearGradient(0, oy, 0, oy + wellH);
      bg.addColorStop(0, 'rgba(255,255,255,0.05)');
      bg.addColorStop(1, 'rgba(255,255,255,0.02)');
      ctx.fillStyle = bg;
      roundRect(ox, oy, wellW, wellH, 14);
      ctx.fill();

      // Faint grid.
      ctx.save();
      roundRect(ox, oy, wellW, wellH, 14);
      ctx.clip();
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      for (let i = 1; i < COLS; i++) {
        ctx.beginPath();
        ctx.moveTo(ox + i * cs, oy);
        ctx.lineTo(ox + i * cs, oy + wellH);
        ctx.stroke();
      }
      for (let i = 1; i < ROWS; i++) {
        ctx.beginPath();
        ctx.moveTo(ox, oy + i * cs);
        ctx.lineTo(ox + wellW, oy + i * cs);
        ctx.stroke();
      }
      ctx.restore();

      // Settled blocks.
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          if (g.board[y][x]) {
            drawBlock(
              ox + x * cs,
              oy + y * cs,
              cs,
              COLORS[g.board[y][x] - 1],
              false
            );
          }
        }
      }

      const p = g.piece;
      if (p) {
        // Ghost piece — project the active piece straight down.
        let gy = 0;
        while (valid(p, 0, gy + 1)) gy++;
        ctx.save();
        ctx.globalAlpha = 0.22;
        for (let y = 0; y < p.shape.length; y++) {
          for (let x = 0; x < p.shape[y].length; x++) {
            if (!p.shape[y][x]) continue;
            const by = p.y + gy + y;
            if (by < 0) continue;
            drawBlock(
              ox + (p.x + x) * cs,
              oy + by * cs,
              cs,
              COLORS[p.id - 1],
              false
            );
          }
        }
        ctx.restore();

        // Active piece.
        for (let y = 0; y < p.shape.length; y++) {
          for (let x = 0; x < p.shape[y].length; x++) {
            if (!p.shape[y][x]) continue;
            const by = p.y + y;
            if (by < 0) continue;
            drawBlock(
              ox + (p.x + x) * cs,
              oy + by * cs,
              cs,
              COLORS[p.id - 1],
              true
            );
          }
        }
      }

      // Line-clear flash.
      if (g.flash > 0) {
        ctx.save();
        roundRect(ox, oy, wellW, wellH, 14);
        ctx.clip();
        ctx.fillStyle = `rgba(255,255,255,${(g.flash * 0.45).toFixed(3)})`;
        ctx.fillRect(ox, oy, wellW, wellH);
        ctx.restore();
      }

      // Particles — clipped to the well so bursts never scatter colour into
      // the letterbox around the playfield.
      ctx.save();
      roundRect(ox, oy, wellW, wellH, 14);
      ctx.clip();
      for (const pt of g.particles) {
        ctx.globalAlpha = Math.max(0, pt.life);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.restore();

      // Well border.
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth = 1.5;
      roundRect(ox, oy, wellW, wellH, 14);
      ctx.stroke();
    };

    let lastTs = 0;
    const frame = (ts: number) => {
      rafRef.current = requestAnimationFrame(frame);
      const g = gRef.current;
      if (!g) return;
      const dt = lastTs ? Math.min(2.5, (ts - lastTs) / 16.667) : 1;
      const dtMs = lastTs ? Math.min(60, ts - lastTs) : 16.667;
      lastTs = ts;
      g.t += dt;

      if (phaseRef.current === 'playing') {
        // Gravity step on the source's time threshold.
        g.acc += dtMs;
        if (g.acc >= g.dropInterval) {
          g.acc = 0;
          drop();
        }
      }
      if (g.flash > 0) g.flash = Math.max(0, g.flash - 0.06 * dt);
      for (let i = g.particles.length - 1; i >= 0; i--) {
        const pt = g.particles[i];
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.vy += 0.15 * dt;
        pt.life -= 0.03 * dt;
        if (pt.life <= 0) g.particles.splice(i, 1);
      }
      render();
    };

    reset();
    startRef.current = () => {
      reset();
      lastTs = 0;
      setPhaseBoth('playing');
    };

    const onKey = (e: KeyboardEvent) => {
      if (phaseRef.current !== 'playing') return;
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          actRef.current('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          actRef.current('right');
          break;
        case 'ArrowUp':
          e.preventDefault();
          actRef.current('rotate');
          break;
        case 'ArrowDown':
          e.preventDefault();
          actRef.current('soft');
          break;
        case ' ':
          e.preventDefault();
          actRef.current('hard');
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  // Next-piece preview — its own DPR-aware canvas, redrawn when nextType changes.
  useEffect(() => {
    const cv = nextCanvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const css = 64;
    cv.width = Math.round(css * dpr);
    cv.height = Math.round(css * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, css, css);
    if (phase !== 'playing') return;
    const shape = SHAPES[nextType];
    const color = COLORS[nextType];
    const cols = shape[0].length;
    const rows = shape.length;
    const cs = Math.floor(Math.min(css / 4, css / Math.max(cols, rows)));
    const ox = (css - cols * cs) / 2;
    const oy = (css - rows * cs) / 2;
    const round = (x: number, y: number, w: number, h: number, r: number) => {
      const rr = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + rr, y);
      ctx.arcTo(x + w, y, x + w, y + h, rr);
      ctx.arcTo(x + w, y + h, x, y + h, rr);
      ctx.arcTo(x, y + h, x, y, rr);
      ctx.arcTo(x, y, x + w, y, rr);
      ctx.closePath();
    };
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (!shape[y][x]) continue;
        const pad = Math.max(1, cs * 0.08);
        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur = 6;
        ctx.fillStyle = color;
        round(
          ox + x * cs + pad,
          oy + y * cs + pad,
          cs - pad * 2,
          cs - pad * 2,
          cs * 0.2
        );
        ctx.fill();
        ctx.restore();
      }
    }
  }, [nextType, phase]);

  const ctrl =
    'flex items-center justify-center rounded-2xl bg-white/10 text-white/85 transition-colors hover:bg-white/20 active:bg-white/30 disabled:opacity-40';

  return (
    <div className='relative flex min-h-[560px] w-full flex-col touch-none select-none'>
      <div className='mx-auto flex w-full max-w-[420px] shrink-0 items-center justify-between gap-3 px-1 pb-3'>
        <div className='flex flex-1 items-center justify-around gap-2'>
          <Stat label={tx.score} value={score} />
          <Stat label={tx.level} value={level} />
          <Stat label={tx.lines} value={lines} />
        </div>
        <div className='flex flex-col items-center'>
          <span className='text-[11px] font-medium uppercase tracking-[0.12em] text-white/45'>
            {tx.next}
          </span>
          <canvas
            ref={nextCanvasRef}
            className='mt-1 h-[64px] w-[64px] rounded-xl bg-white/5'
          />
        </div>
      </div>

      <div
        ref={fieldRef}
        className='relative mx-auto min-h-0 w-full max-w-[420px] flex-1 overflow-hidden rounded-[18px] bg-black/20'
      >
        <canvas ref={canvasRef} className='absolute inset-0 h-full w-full' />

        <div className='pointer-events-none absolute right-2 top-2 rounded-full bg-white/10 px-3 py-1 text-[12px] font-medium text-white/70'>
          {tx.best} {best}
        </div>

        {phase === 'idle' && (
          <div className='bd-in absolute inset-0 flex flex-col items-center justify-center gap-5 bg-black/35 px-6 text-center'>
            <p className='text-[12px] font-bold uppercase tracking-[0.18em] text-white/55'>
              {tx.tagline}
            </p>
            <div className='flex flex-wrap items-center justify-center gap-2'>
              {DIFF_ORDER.map((d) => (
                <button
                  key={d}
                  type='button'
                  onClick={() => {
                    diffRef.current = d;
                    setDiff(d);
                  }}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-bold transition-colors ${
                    diff === d
                      ? 'bg-white text-[#121212]'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  <span
                    className='h-2.5 w-2.5 rounded-full'
                    style={{ background: DIFF_DOT[d] }}
                  />
                  {d === 'easy'
                    ? tx.easy
                    : d === 'normal'
                      ? tx.normal
                      : tx.hardLevel}
                </button>
              ))}
            </div>
            <button
              type='button'
              onClick={() => startRef.current()}
              className='bd-cta rounded-full bg-white px-9 py-3 text-[15px] font-bold text-[#121212]'
            >
              {tx.start}
            </button>
            <p className='text-[13px] text-white/55'>{tx.hint}</p>
          </div>
        )}

        {phase === 'over' && (
          <div className='bd-in absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/45 px-6 text-center'>
            <span className='text-[15px] font-bold uppercase tracking-[0.18em] text-white/55'>
              {tx.over}
            </span>
            <span className='text-[64px] font-extrabold leading-none text-white'>
              {score}
            </span>
            <span className='rounded-full bg-white/10 px-4 py-1 text-[13px] font-medium text-white/70'>
              {tx.best} {best}
            </span>
            <div className='flex flex-wrap items-center justify-center gap-2'>
              {DIFF_ORDER.map((d) => (
                <button
                  key={d}
                  type='button'
                  onClick={() => {
                    diffRef.current = d;
                    setDiff(d);
                  }}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-bold transition-colors ${
                    diff === d
                      ? 'bg-white text-[#121212]'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  <span
                    className='h-2.5 w-2.5 rounded-full'
                    style={{ background: DIFF_DOT[d] }}
                  />
                  {d === 'easy'
                    ? tx.easy
                    : d === 'normal'
                      ? tx.normal
                      : tx.hardLevel}
                </button>
              ))}
            </div>
            <button
              type='button'
              onClick={() => startRef.current()}
              className='bd-cta mt-1 rounded-full bg-white px-9 py-3 text-[15px] font-bold text-[#121212]'
            >
              {tx.again}
            </button>
          </div>
        )}
      </div>

      <div className='mx-auto mt-3 grid w-full max-w-[420px] shrink-0 grid-cols-5 gap-2'>
        <button
          type='button'
          aria-label={tx.left}
          disabled={phase !== 'playing'}
          onPointerDown={(e) => {
            e.preventDefault();
            actRef.current('left');
          }}
          className={`${ctrl} h-14 text-[22px]`}
        >
          ←
        </button>
        <button
          type='button'
          aria-label={tx.right}
          disabled={phase !== 'playing'}
          onPointerDown={(e) => {
            e.preventDefault();
            actRef.current('right');
          }}
          className={`${ctrl} h-14 text-[22px]`}
        >
          →
        </button>
        <button
          type='button'
          aria-label={tx.rotate}
          disabled={phase !== 'playing'}
          onPointerDown={(e) => {
            e.preventDefault();
            actRef.current('rotate');
          }}
          className={`${ctrl} h-14 text-[22px]`}
        >
          ↻
        </button>
        <button
          type='button'
          aria-label={tx.soft}
          disabled={phase !== 'playing'}
          onPointerDown={(e) => {
            e.preventDefault();
            actRef.current('soft');
          }}
          className={`${ctrl} h-14 text-[22px]`}
        >
          ↓
        </button>
        <button
          type='button'
          aria-label={tx.hard}
          disabled={phase !== 'playing'}
          onPointerDown={(e) => {
            e.preventDefault();
            actRef.current('hard');
          }}
          className={`${ctrl} h-14 text-[22px]`}
        >
          ⇩
        </button>
      </div>

      <style>{`
        @keyframes bdIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .bd-in { animation: bdIn .28s cubic-bezier(0.23,1,0.32,1); }
        .bd-cta { transition: transform .15s cubic-bezier(0.23,1,0.32,1); }
        .bd-cta:hover { transform: translateY(-2px); }
        .bd-cta:active { transform: scale(.97); }
        @media (prefers-reduced-motion: reduce) { .bd-in { animation: none; } .bd-cta { transition: none; } }
      `}</style>
    </div>
  );
}

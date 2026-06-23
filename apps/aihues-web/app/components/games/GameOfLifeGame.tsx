'use client';

import { useEffect, useRef, useState } from 'react';
import { Eraser, Pause, Play, Shuffle, StepForward } from 'lucide-react';

import type { Locale } from '@/lib/dict';

/* Game of Life — ported from kimi.com/share/d39b1vdo082s225p6f00. Core logic kept; visuals upgraded to the aihues aesthetic. */

const COLS = 40;
const ROWS = 40;
const SPEEDS = { slow: 4, normal: 9, fast: 18 } as const;
type Speed = keyof typeof SPEEDS;
const SPEED_ORDER: Speed[] = ['slow', 'normal', 'fast'];
const SPEED_KEY = 'aihues_life_speed';

const C = {
  pool: 'rgba(139,123,216,0.07)',
  grid: 'rgba(255,255,255,0.05)',
  edge: 'rgba(255,255,255,0.16)',
  edgeGlow: 'rgba(139,123,216,0.4)',
  cellCore: '#cdc4f5',
  cellEdge: '#8b7bd8',
  cellGlow: 'rgba(139,123,216,0.55)',
};

interface LGame {
  dpr: number;
  cw: number;
  ch: number;
  scale: number;
  offX: number;
  offY: number;
  side: number;
  cell: number;
  grid: Uint8Array;
  pulse: number;
}

const T = {
  en: {
    play: 'Play',
    pause: 'Pause',
    step: 'Step',
    clear: 'Clear',
    random: 'Random',
    speed: 'Speed',
    slow: 'Slow',
    normal: 'Normal',
    fast: 'Fast',
    generation: 'Generation',
    population: 'Population',
    hint: 'Tap or drag the grid to draw and erase cells.',
  },
  zh: {
    play: '开始',
    pause: '暂停',
    step: '单步',
    clear: '清空',
    random: '随机',
    speed: '速度',
    slow: '慢',
    normal: '中',
    fast: '快',
    generation: '世代',
    population: '存活',
    hint: '点击或拖动网格即可绘制与擦除细胞。',
  },
} as const;

const idx = (r: number, c: number) => r * COLS + c;

function makeGrid(): Uint8Array {
  return new Uint8Array(ROWS * COLS);
}

function countNeighbors(grid: Uint8Array, row: number, col: number): number {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue;
      const r = row + i;
      const c = col + j;
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
        count += grid[idx(r, c)];
      }
    }
  }
  return count;
}

// B3/S23 — bounded grid, faithful to the source.
function nextGeneration(grid: Uint8Array): Uint8Array {
  const next = makeGrid();
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const n = countNeighbors(grid, row, col);
      const alive = grid[idx(row, col)] === 1;
      if (alive) {
        if (n === 2 || n === 3) next[idx(row, col)] = 1;
      } else if (n === 3) {
        next[idx(row, col)] = 1;
      }
    }
  }
  return next;
}

function population(grid: Uint8Array): number {
  let p = 0;
  for (let i = 0; i < grid.length; i++) p += grid[i];
  return p;
}

export default function GameOfLifeGame({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const tx = T[zh ? 'zh' : 'en'];

  const fieldRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gRef = useRef<LGame | null>(null);
  const rafRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const runningRef = useRef(false);
  const speedRef = useRef<Speed>('normal');
  const drawingRef = useRef(false);
  const paintRef = useRef<0 | 1>(1);
  const lastCellRef = useRef<string | null>(null);

  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState<Speed>('normal');
  const [gen, setGen] = useState(0);
  const [pop, setPop] = useState(0);

  // Action handles, populated inside the setup effect so the impure / timer
  // logic never runs during render.
  const toggleRunRef = useRef<() => void>(() => {});
  const stepRef = useRef<() => void>(() => {});
  const clearRef = useRef<() => void>(() => {});
  const randomRef = useRef<() => void>(() => {});
  const restartTimerRef = useRef<() => void>(() => {});

  const pickSpeed = (s: Speed) => {
    speedRef.current = s;
    setSpeed(s);
    try {
      localStorage.setItem(SPEED_KEY, s);
    } catch {
      /* ignore */
    }
    restartTimerRef.current();
  };

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(SPEED_KEY);
      } catch {
        stored = null;
      }
      if (stored === 'slow' || stored === 'normal' || stored === 'fast') {
        speedRef.current = stored;
        setSpeed(stored);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const field = fieldRef.current;
    const canvas = canvasRef.current;
    if (!field || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Advance one generation (B3/S23), updating the HUD from the live grid.
    const advance = () => {
      const g = gRef.current;
      if (!g) return;
      g.grid = nextGeneration(g.grid);
      g.pulse = 1;
      setGen((v) => v + 1);
      setPop(population(g.grid));
    };

    const stopTimer = () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    const startTimer = () => {
      stopTimer();
      const ms = 1000 / SPEEDS[speedRef.current];
      timerRef.current = setInterval(() => advance(), ms);
    };
    const setRunningBoth = (run: boolean) => {
      runningRef.current = run;
      setRunning(run);
      if (run) startTimer();
      else stopTimer();
    };

    toggleRunRef.current = () => setRunningBoth(!runningRef.current);
    stepRef.current = () => {
      if (runningRef.current) return;
      advance();
    };
    clearRef.current = () => {
      const g = gRef.current;
      if (!g) return;
      setRunningBoth(false);
      g.grid = makeGrid();
      g.pulse = 0;
      setGen(0);
      setPop(0);
    };
    randomRef.current = () => {
      const g = gRef.current;
      if (!g) return;
      const grid = makeGrid();
      for (let i = 0; i < grid.length; i++) {
        grid[i] = Math.random() > 0.7 ? 1 : 0;
      }
      g.grid = grid;
      g.pulse = 1;
      setGen(0);
      setPop(population(grid));
    };
    restartTimerRef.current = () => {
      if (runningRef.current) startTimer();
    };

    const sizeNow = () => {
      const rect = field.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = rect.width;
      const ch = rect.height;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      const M = 18;
      const side = Math.max(40, Math.min(cw - 2 * M, ch - 2 * M));
      const cell = side / COLS;
      const offX = (cw - cell * COLS) / 2;
      const offY = (ch - cell * ROWS) / 2;
      if (!gRef.current) {
        gRef.current = {
          dpr,
          cw,
          ch,
          scale: 1,
          offX,
          offY,
          side: cell * COLS,
          cell,
          grid: makeGrid(),
          pulse: 0,
        };
      } else {
        Object.assign(gRef.current, {
          dpr,
          cw,
          ch,
          offX,
          offY,
          side: cell * COLS,
          cell,
        });
      }
    };

    const drawRoundedCell = (x: number, y: number, size: number, r: number) => {
      const rr = Math.min(r, size / 2);
      ctx.beginPath();
      ctx.moveTo(x + rr, y);
      ctx.arcTo(x + size, y, x + size, y + size, rr);
      ctx.arcTo(x + size, y + size, x, y + size, rr);
      ctx.arcTo(x, y + size, x, y, rr);
      ctx.arcTo(x, y, x + size, y, rr);
      ctx.closePath();
    };

    const render = () => {
      const g = gRef.current;
      if (!g) return;
      const { cw, ch, dpr, offX, offY, cell } = g;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);

      const w = cell * COLS;
      const h = cell * ROWS;

      // soft light pool so the board reads as a region within the themed bg
      ctx.save();
      ctx.translate(offX, offY);
      const cx = w / 2;
      const cy = h / 2;
      ctx.fillStyle = 'rgba(255,255,255,0.03)';
      ctx.fillRect(0, 0, w, h);
      const pool = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.72);
      pool.addColorStop(0, C.pool);
      pool.addColorStop(1, 'rgba(139,123,216,0)');
      ctx.fillStyle = pool;
      ctx.fillRect(0, 0, w, h);

      // subtle grid lines
      ctx.strokeStyle = C.grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i <= COLS; i++) {
        const x = Math.round(i * cell) + 0.5;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let j = 0; j <= ROWS; j++) {
        const y = Math.round(j * cell) + 0.5;
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      // alive cells — soft glowing rounded squares with an accent core
      const grid = g.grid;
      const inset = Math.max(1, cell * 0.12);
      const cs = cell - inset * 2;
      const radius = cs * 0.32;
      const glow = 0.85 + g.pulse * 0.6;
      ctx.save();
      ctx.shadowColor = C.cellGlow;
      ctx.shadowBlur = Math.max(5, cell * 0.55 * glow);
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          if (grid[idx(row, col)] !== 1) continue;
          const x = col * cell + inset;
          const y = row * cell + inset;
          const grad = ctx.createRadialGradient(
            x + cs * 0.35,
            y + cs * 0.35,
            cs * 0.1,
            x + cs / 2,
            y + cs / 2,
            cs * 0.75
          );
          grad.addColorStop(0, C.cellCore);
          grad.addColorStop(1, C.cellEdge);
          ctx.fillStyle = grad;
          drawRoundedCell(x, y, cs, radius);
          ctx.fill();
        }
      }
      ctx.restore();

      // soft glowing boundary — marks the field without a hard frame
      ctx.save();
      ctx.shadowColor = C.edgeGlow;
      ctx.shadowBlur = 9;
      ctx.strokeStyle = C.edge;
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, w - 2, h - 2);
      ctx.restore();

      ctx.restore();
    };

    const frame = () => {
      const g = gRef.current;
      if (g && g.pulse > 0) g.pulse = Math.max(0, g.pulse - 0.06);
      render();
      rafRef.current = requestAnimationFrame(frame);
    };

    sizeNow();
    const ro = new ResizeObserver(() => sizeNow());
    ro.observe(field);

    const cellFromEvent = (clientX: number, clientY: number) => {
      const g = gRef.current;
      if (!g) return null;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left - g.offX;
      const y = clientY - rect.top - g.offY;
      const col = Math.floor(x / g.cell);
      const row = Math.floor(y / g.cell);
      if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return null;
      return { row, col };
    };

    const paintAt = (clientX: number, clientY: number, fresh: boolean) => {
      const g = gRef.current;
      if (!g) return;
      const pos = cellFromEvent(clientX, clientY);
      if (!pos) return;
      const key = `${pos.row}-${pos.col}`;
      if (fresh) {
        // first cell of a stroke decides paint vs. erase by toggling it
        const cur = g.grid[idx(pos.row, pos.col)];
        paintRef.current = cur ? 0 : 1;
      } else if (key === lastCellRef.current) {
        return;
      }
      g.grid[idx(pos.row, pos.col)] = paintRef.current;
      lastCellRef.current = key;
      g.pulse = Math.max(g.pulse, 0.6);
      setPop(population(g.grid));
    };

    const onPointerDown = (e: PointerEvent) => {
      drawingRef.current = true;
      lastCellRef.current = null;
      canvas.setPointerCapture?.(e.pointerId);
      paintAt(e.clientX, e.clientY, true);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!drawingRef.current) return;
      paintAt(e.clientX, e.clientY, false);
    };
    const endStroke = () => {
      drawingRef.current = false;
      lastCellRef.current = null;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', endStroke);
    canvas.addEventListener('pointercancel', endStroke);
    canvas.addEventListener('pointerleave', endStroke);

    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setRunningBoth(!runningRef.current);
      }
    };
    window.addEventListener('keydown', onKey);

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      stopTimer();
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', endStroke);
      canvas.removeEventListener('pointercancel', endStroke);
      canvas.removeEventListener('pointerleave', endStroke);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className='relative mx-auto flex min-h-[520px] w-full max-w-[680px] flex-col touch-none select-none'>
      <div className='flex h-[52px] w-full shrink-0 items-center justify-between px-1 text-white'>
        <span className='flex items-baseline gap-2'>
          <span className='text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45'>
            {tx.generation}
          </span>
          <span className='text-[24px] font-bold leading-none tabular-nums text-white/90'>
            {gen}
          </span>
        </span>
        <span className='flex items-baseline gap-2'>
          <span className='text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45'>
            {tx.population}
          </span>
          <span className='text-[24px] font-bold leading-none tabular-nums text-white/90'>
            {pop}
          </span>
        </span>
      </div>

      <div ref={fieldRef} className='relative min-h-0 flex-1'>
        <canvas
          ref={canvasRef}
          className='absolute inset-0 h-full w-full cursor-crosshair'
        />
      </div>

      <div className='mt-3 flex shrink-0 flex-col items-center gap-3'>
        <div className='flex flex-wrap items-center justify-center gap-2'>
          <button
            type='button'
            onClick={() => toggleRunRef.current()}
            aria-label={running ? tx.pause : tx.play}
            className='lf-btn inline-flex items-center gap-1.5 rounded-full bg-white px-6 py-2.5 text-[14px] font-semibold text-[#121212]'
          >
            {running ? <Pause size={15} /> : <Play size={15} />}
            {running ? tx.pause : tx.play}
            <kbd className='ml-1 hidden rounded bg-black/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#121212]/55 sm:inline-block'>
              Space
            </kbd>
          </button>
          <button
            type='button'
            onClick={() => stepRef.current()}
            disabled={running}
            aria-label={tx.step}
            className='lf-pill inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2.5 text-[14px] font-semibold text-white/80 transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40'
          >
            <StepForward size={15} />
            {tx.step}
          </button>
          <button
            type='button'
            onClick={() => randomRef.current()}
            aria-label={tx.random}
            className='lf-pill inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2.5 text-[14px] font-semibold text-white/80 transition-colors hover:bg-white/20'
          >
            <Shuffle size={15} />
            {tx.random}
          </button>
          <button
            type='button'
            onClick={() => clearRef.current()}
            aria-label={tx.clear}
            className='lf-pill inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2.5 text-[14px] font-semibold text-white/80 transition-colors hover:bg-white/20'
          >
            <Eraser size={15} />
            {tx.clear}
          </button>
        </div>

        <div className='flex items-center gap-2'>
          <span className='text-[12px] font-semibold uppercase tracking-[0.14em] text-white/40'>
            {tx.speed}
          </span>
          {SPEED_ORDER.map((s) => (
            <button
              key={s}
              type='button'
              onClick={() => pickSpeed(s)}
              className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                speed === s
                  ? 'bg-white text-[#121212]'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {tx[s]}
            </button>
          ))}
        </div>

        <p className='text-center text-[12px] text-white/45'>{tx.hint}</p>
      </div>

      <style>{`
        .lf-btn { transition: transform 0.15s cubic-bezier(0.23, 1, 0.32, 1), background-color 0.2s ease; }
        .lf-btn:hover { transform: scale(1.02); background-color: rgba(255, 255, 255, 0.9); }
        .lf-btn:active { transform: scale(0.97); }
        .lf-pill { transition: transform 0.15s cubic-bezier(0.23, 1, 0.32, 1), background-color 0.2s ease; }
        .lf-pill:active { transform: scale(0.97); }
        @media (prefers-reduced-motion: reduce) {
          .lf-btn, .lf-pill { transition: none; }
          .lf-btn:hover, .lf-btn:active, .lf-pill:active { transform: none; }
        }
      `}</style>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';

import type { Locale } from '@/lib/dict';

/* Brick Breaker — ported from kimi.com/share/d1t8gbb67tiadll2ta60. Core logic kept; visuals upgraded to the aihues aesthetic. */

type Phase = 'idle' | 'playing' | 'over';
type DiffKey = 'easy' | 'medium' | 'hard';

const DIFFS: Record<
  DiffKey,
  { ballSpeed: number; paddleW: number; rows: number; cols: number }
> = {
  easy: { ballSpeed: 2.2, paddleW: 120, rows: 4, cols: 8 },
  medium: { ballSpeed: 2.7, paddleW: 100, rows: 5, cols: 10 },
  hard: { ballSpeed: 3.2, paddleW: 80, rows: 6, cols: 12 },
};
const DIFF_ORDER: DiffKey[] = ['easy', 'medium', 'hard'];
const LIVES = 3;
const UNBREAKABLE_RATE = 0.2;
const TOP_OFFSET = 64;
const BRICK_H = 26;
const BEST_KEY = 'aihues_brick-breaker_best';

const ROW_HUES = [188, 168, 280, 320, 30, 50];

interface Brick {
  x: number;
  y: number;
  w: number;
  h: number;
  type: 0 | 1 | 2;
  maxHits: number;
  hits: number;
  points: number;
  hue: number;
}
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  r: number;
  hue: number;
}
interface Trail {
  x: number;
  y: number;
}
interface BGame {
  W: number;
  H: number;
  paddle: { x: number; w: number; h: number };
  ball: {
    x: number;
    y: number;
    dx: number;
    dy: number;
    r: number;
    speed: number;
  };
  launched: boolean;
  bricks: Brick[];
  particles: Particle[];
  trail: Trail[];
  score: number;
  lives: number;
}

const T = {
  en: {
    best: 'Best',
    score: 'Score',
    lives: 'Lives',
    choose: 'Choose your difficulty',
    hint: 'Drag to move · Tap or Space to launch',
    start: 'Start',
    again: 'Play again',
    win: 'Cleared!',
    lose: 'Game over',
    final: 'Final score',
    diffs: { easy: 'Easy', medium: 'Medium', hard: 'Hard' },
  },
  zh: {
    best: '最高',
    score: '得分',
    lives: '生命',
    choose: '选择难度',
    hint: '拖动移动挡板 · 点击或空格发球',
    start: '开始',
    again: '再来一局',
    win: '恭喜通关！',
    lose: '游戏结束',
    final: '最终得分',
    diffs: { easy: '简单', medium: '中等', hard: '困难' },
  },
} as const;

function buildMap(rows: number, cols: number, rate: number): number[][] {
  const total = rows * cols;
  let unbreakable = 0;
  const grid: number[][] = Array.from({ length: rows }, () =>
    Array<number>(cols).fill(0)
  );

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (unbreakable / total < rate && Math.random() < rate) {
        grid[r][c] = 1;
        unbreakable++;
      }
    }
  }

  const queue: Array<[number, number]> = [];
  const visited: boolean[][] = Array.from({ length: rows }, () =>
    Array<boolean>(cols).fill(false)
  );
  for (let c = 0; c < cols; c++) {
    if (grid[0][c] === 0) {
      queue.push([0, c]);
      visited[0][c] = true;
    }
  }
  while (queue.length) {
    const cell = queue.shift();
    if (!cell) break;
    const [r, c] = cell;
    const steps: Array<[number, number]> = [
      [0, 1],
      [1, 0],
      [-1, 0],
      [0, -1],
    ];
    for (const [dr, dc] of steps) {
      const nr = r + dr;
      const nc = c + dc;
      if (
        nr >= 0 &&
        nr < rows &&
        nc >= 0 &&
        nc < cols &&
        grid[nr][nc] === 0 &&
        !visited[nr][nc]
      ) {
        visited[nr][nc] = true;
        queue.push([nr, nc]);
      }
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 0 && !visited[r][c]) {
        if (unbreakable / total < rate) {
          grid[r][c] = 1;
          unbreakable++;
        } else {
          grid[r][c] = -1;
        }
      }
    }
  }
  return grid;
}

export default function BrickBreakerGame({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const tx = T[zh ? 'zh' : 'en'];

  const fieldRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gRef = useRef<BGame | null>(null);
  const rafRef = useRef(0);
  const phaseRef = useRef<Phase>('idle');
  const diffRef = useRef<DiffKey>('medium');
  const bestRef = useRef(0);
  const startRef = useRef<() => void>(() => {});
  const keysRef = useRef({ left: false, right: false });

  const [phase, setPhase] = useState<Phase>('idle');
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [diff, setDiff] = useState<DiffKey>('medium');
  const [won, setWon] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const field = fieldRef.current;
    if (!canvas || !field) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let bestSynced = false;
    try {
      bestRef.current = Number(localStorage.getItem(BEST_KEY) || 0) || 0;
    } catch {
      /* ignore */
    }

    const setPhaseBoth = (p: Phase) => {
      phaseRef.current = p;
      setPhase(p);
    };

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

    const reset = () => {
      const w = field.clientWidth;
      const h = field.clientHeight;
      const cfg = DIFFS[diffRef.current];
      const paddleW = Math.min(cfg.paddleW, w * 0.5);
      const ballSpeed = cfg.ballSpeed * (w / 360);
      const ballR = Math.max(6, w * 0.018);

      const map = buildMap(cfg.rows, cfg.cols, UNBREAKABLE_RATE);
      const brickW = w / cfg.cols;
      const bricks: Brick[] = [];
      for (let r = 0; r < cfg.rows; r++) {
        for (let c = 0; c < cfg.cols; c++) {
          if (map[r][c] === -1) continue;
          if (map[r][c] === 1) {
            bricks.push({
              x: c * brickW + 1,
              y: TOP_OFFSET + r * BRICK_H + 1,
              w: brickW - 2,
              h: BRICK_H - 2,
              type: 1,
              maxHits: -1,
              hits: 0,
              points: 0,
              hue: 0,
            });
          } else {
            const rnd = Math.random();
            const tough = rnd > 0.85;
            bricks.push({
              x: c * brickW + 1,
              y: TOP_OFFSET + r * BRICK_H + 1,
              w: brickW - 2,
              h: BRICK_H - 2,
              type: tough ? 2 : 0,
              maxHits: tough ? 3 : 1,
              hits: 0,
              points: (cfg.rows - r) * 10,
              hue: tough ? 45 : ROW_HUES[r % ROW_HUES.length],
            });
          }
        }
      }

      gRef.current = {
        W: w,
        H: h,
        paddle: { x: w / 2 - paddleW / 2, w: paddleW, h: 12 },
        ball: {
          x: w / 2,
          y: h - 30 - ballR,
          dx: 0,
          dy: 0,
          r: ballR,
          speed: ballSpeed,
        },
        launched: false,
        bricks,
        particles: [],
        trail: [],
        score: 0,
        lives: LIVES,
      };
      setScore(0);
      setLives(LIVES);
      setWon(false);
    };

    const burst = (x: number, y: number, hue: number) => {
      const g = gRef.current;
      if (!g) return;
      for (let i = 0; i < 16; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = Math.random() * 4 + 1;
        g.particles.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 1,
          r: Math.random() * 2.5 + 1,
          hue,
        });
      }
    };

    const launch = () => {
      const g = gRef.current;
      if (!g || phaseRef.current !== 'playing' || g.launched) return;
      g.launched = true;
      g.ball.dx = g.ball.speed * (Math.random() > 0.5 ? 1 : -1);
      g.ball.dy = -g.ball.speed;
    };

    const endGame = (win: boolean) => {
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
      setWon(win);
      setPhaseBoth('over');
    };

    const resetBall = () => {
      const g = gRef.current;
      if (!g) return;
      g.launched = false;
      g.ball.x = g.paddle.x + g.paddle.w / 2;
      g.ball.y = g.H - 30 - g.ball.r;
      g.ball.dx = 0;
      g.ball.dy = 0;
      g.trail = [];
    };

    const update = (dt: number) => {
      const g = gRef.current;
      if (!g) return;
      const speed = 3.2 * dt;
      if (keysRef.current.left) g.paddle.x -= speed * 4;
      if (keysRef.current.right) g.paddle.x += speed * 4;
      g.paddle.x = Math.max(0, Math.min(g.W - g.paddle.w, g.paddle.x));
      const paddleY = g.H - 22;

      if (!g.launched) {
        g.ball.x = g.paddle.x + g.paddle.w / 2;
        g.ball.y = paddleY - g.ball.r - 2;
        return;
      }

      const ball = g.ball;
      let nx = ball.x + ball.dx * dt;
      let ny = ball.y + ball.dy * dt;

      if (nx - ball.r < 0) {
        ball.dx = Math.abs(ball.dx);
        nx = ball.r;
      } else if (nx + ball.r > g.W) {
        ball.dx = -Math.abs(ball.dx);
        nx = g.W - ball.r;
      }
      if (ny - ball.r < 0) {
        ball.dy = Math.abs(ball.dy);
        ny = ball.r;
      }

      if (ny + ball.r > g.H) {
        g.lives--;
        setLives(g.lives);
        if (g.lives <= 0) {
          endGame(false);
          return;
        }
        resetBall();
        return;
      }

      if (
        ny + ball.r > paddleY &&
        ball.y + ball.r <= paddleY + 4 &&
        nx > g.paddle.x &&
        nx < g.paddle.x + g.paddle.w
      ) {
        ball.dy = -Math.abs(ball.dy);
        const hit = (nx - g.paddle.x) / g.paddle.w;
        ball.dx = 8 * (hit - 0.5) * ball.speed;
        ny = paddleY - ball.r;
      }

      for (let i = g.bricks.length - 1; i >= 0; i--) {
        const b = g.bricks[i];
        if (
          nx + ball.r > b.x &&
          nx - ball.r < b.x + b.w &&
          ny + ball.r > b.y &&
          ny - ball.r < b.y + b.h
        ) {
          const overlapX = Math.min(
            nx + ball.r - b.x,
            b.x + b.w - (nx - ball.r)
          );
          const overlapY = Math.min(
            ny + ball.r - b.y,
            b.y + b.h - (ny - ball.r)
          );
          if (overlapX < overlapY) {
            ball.dx = -ball.dx;
            nx = ball.x + ball.dx * dt;
          } else {
            ball.dy = -ball.dy;
            ny = ball.y + ball.dy * dt;
          }
          if (b.type === 1) {
            burst(nx, ny, 0);
            break;
          }
          b.hits++;
          if (b.hits >= b.maxHits) {
            g.score += b.points;
            setScore(g.score);
            burst(b.x + b.w / 2, b.y + b.h / 2, b.hue);
            g.bricks.splice(i, 1);
          } else {
            burst(nx, ny, b.hue);
          }
          if (g.bricks.filter((br) => br.type !== 1).length === 0) {
            endGame(true);
            return;
          }
          break;
        }
      }

      ball.x = nx;
      ball.y = ny;
      g.trail.push({ x: ball.x, y: ball.y });
      if (g.trail.length > 10) g.trail.shift();
    };

    const render = () => {
      const g = gRef.current;
      if (!g) return;
      const { W, H } = g;
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#161427');
      bg.addColorStop(1, '#0c0a18');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      for (const b of g.bricks) {
        ctx.save();
        if (b.type === 1) {
          ctx.fillStyle = '#3a3a46';
          ctx.shadowColor = 'rgba(120,120,140,0.4)';
          ctx.shadowBlur = 6;
          ctx.fillRect(b.x, b.y, b.w, b.h);
          ctx.restore();
          continue;
        }
        const remain = b.maxHits - b.hits;
        const light = b.type === 2 ? 40 + remain * 8 : 56;
        const fill = `hsl(${b.hue}, 80%, ${light}%)`;
        ctx.shadowColor = `hsla(${b.hue}, 90%, 60%, 0.8)`;
        ctx.shadowBlur = 14;
        ctx.fillStyle = fill;
        ctx.beginPath();
        const rad = 4;
        ctx.moveTo(b.x + rad, b.y);
        ctx.arcTo(b.x + b.w, b.y, b.x + b.w, b.y + b.h, rad);
        ctx.arcTo(b.x + b.w, b.y + b.h, b.x, b.y + b.h, rad);
        ctx.arcTo(b.x, b.y + b.h, b.x, b.y, rad);
        ctx.arcTo(b.x, b.y, b.x + b.w, b.y, rad);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255,255,255,0.22)';
        ctx.fillRect(b.x + 2, b.y + 2, b.w - 4, b.h * 0.34);
        if (b.type === 2) {
          ctx.fillStyle = 'rgba(0,0,0,0.7)';
          ctx.font = 'bold 12px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(String(remain), b.x + b.w / 2, b.y + b.h / 2);
        }
        ctx.restore();
      }

      for (let i = 0; i < g.trail.length; i++) {
        const t = g.trail[i];
        const a = (i / g.trail.length) * 0.5;
        ctx.globalAlpha = a;
        ctx.fillStyle = '#7df9ff';
        ctx.beginPath();
        ctx.arc(t.x, t.y, g.ball.r * (i / g.trail.length), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      const p = g.paddle;
      const paddleY = H - 22;
      ctx.save();
      ctx.shadowColor = 'rgba(125,249,255,0.7)';
      ctx.shadowBlur = 16;
      const pg = ctx.createLinearGradient(0, paddleY, 0, paddleY + p.h);
      pg.addColorStop(0, '#bff7ff');
      pg.addColorStop(1, '#22c3d6');
      ctx.fillStyle = pg;
      ctx.beginPath();
      const pr = p.h / 2;
      ctx.moveTo(p.x + pr, paddleY);
      ctx.arcTo(p.x + p.w, paddleY, p.x + p.w, paddleY + p.h, pr);
      ctx.arcTo(p.x + p.w, paddleY + p.h, p.x, paddleY + p.h, pr);
      ctx.arcTo(p.x, paddleY + p.h, p.x, paddleY, pr);
      ctx.arcTo(p.x, paddleY, p.x + p.w, paddleY, pr);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      const ball = g.ball;
      ctx.save();
      ctx.shadowColor = 'rgba(125,249,255,0.95)';
      ctx.shadowBlur = 20;
      const bgr = ctx.createRadialGradient(
        ball.x - ball.r * 0.3,
        ball.y - ball.r * 0.3,
        1,
        ball.x,
        ball.y,
        ball.r
      );
      bgr.addColorStop(0, '#ffffff');
      bgr.addColorStop(1, '#5fe0ff');
      ctx.fillStyle = bgr;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      for (const pt of g.particles) {
        ctx.globalAlpha = Math.max(0, pt.life);
        ctx.fillStyle = pt.hue
          ? `hsl(${pt.hue}, 90%, 65%)`
          : 'rgba(200,200,210,0.9)';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const ro = new ResizeObserver(() => {
      const g = gRef.current;
      const prevW = g ? g.W : 0;
      const prevH = g ? g.H : 0;
      size();
      if (g && prevW > 0) {
        const sx = g.W / prevW;
        const sy = g.H / prevH;
        for (const b of g.bricks) {
          b.x *= sx;
          b.y = TOP_OFFSET + (b.y - TOP_OFFSET) * sy;
          b.w *= sx;
        }
        g.paddle.x *= sx;
        g.paddle.w *= sx;
        g.ball.x *= sx;
        g.ball.y *= sy;
        g.ball.speed *= sx;
        g.ball.dx *= sx;
        g.ball.dy *= sx;
        g.ball.r *= sx;
      }
    });
    ro.observe(field);
    size();

    let lastTs = 0;
    const frame = (ts: number) => {
      rafRef.current = requestAnimationFrame(frame);
      if (!bestSynced) {
        bestSynced = true;
        if (bestRef.current > 0) setBest(bestRef.current);
      }
      const g = gRef.current;
      if (!g) return;
      const dt = lastTs ? Math.min(2.2, (ts - lastTs) / 16.667) : 1;
      lastTs = ts;
      if (phaseRef.current === 'playing') update(dt);
      for (let i = g.particles.length - 1; i >= 0; i--) {
        const pt = g.particles[i];
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.vy += 0.08 * dt;
        pt.life -= 0.04 * dt;
        if (pt.life <= 0) g.particles.splice(i, 1);
      }
      render();
    };

    reset();
    startRef.current = () => {
      reset();
      setPhaseBoth('playing');
    };

    const movePaddle = (clientX: number) => {
      const g = gRef.current;
      if (!g) return;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      g.paddle.x = Math.max(0, Math.min(g.W - g.paddle.w, x - g.paddle.w / 2));
    };

    const onPointerDown = (e: PointerEvent) => {
      if (phaseRef.current !== 'playing') return;
      movePaddle(e.clientX);
      launch();
    };
    const onPointerMove = (e: PointerEvent) => {
      if (phaseRef.current !== 'playing') return;
      movePaddle(e.clientX);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (phaseRef.current !== 'playing') return;
      if (e.touches.length) {
        e.preventDefault();
        movePaddle(e.touches[0].clientX);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft') keysRef.current.left = true;
      else if (e.code === 'ArrowRight') keysRef.current.right = true;
      else if (e.code === 'Space') {
        e.preventDefault();
        launch();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft') keysRef.current.left = false;
      else if (e.code === 'ArrowRight') keysRef.current.right = false;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  return (
    <div className='relative flex min-h-[480px] w-full flex-col touch-none select-none'>
      <div className='mx-auto flex h-[52px] w-full max-w-[560px] shrink-0 items-center justify-between px-1 text-white'>
        {phase === 'playing' ? (
          <>
            <span className='flex items-baseline gap-2'>
              <span className='text-[12px] font-medium uppercase tracking-[0.14em] text-white/45'>
                {tx.score}
              </span>
              <span className='text-[26px] font-bold leading-none text-white/90 tabular-nums'>
                {score}
              </span>
            </span>
            <span className='flex items-center gap-2'>
              <span
                className='text-[15px] leading-none'
                aria-label={`${lives} ${tx.lives}`}
              >
                {'❤️'.repeat(Math.max(0, lives))}
              </span>
              <span className='rounded-full bg-white/10 px-3 py-1 text-[13px] font-medium text-white/70'>
                {tx.best} {best}
              </span>
            </span>
          </>
        ) : null}
      </div>

      <div
        ref={fieldRef}
        className='relative min-h-0 flex-1 overflow-hidden rounded-[18px]'
      >
        <canvas ref={canvasRef} className='absolute inset-0 h-full w-full' />

        {phase === 'idle' && (
          <div className='bb-in absolute inset-0 flex flex-col items-center justify-center gap-5 bg-black/35 px-6 text-center'>
            <p className='text-[12px] font-bold uppercase tracking-[0.18em] text-white/55'>
              {tx.choose}
            </p>
            <div className='flex flex-wrap justify-center gap-2'>
              {DIFF_ORDER.map((d) => (
                <button
                  key={d}
                  type='button'
                  onClick={() => {
                    diffRef.current = d;
                    setDiff(d);
                  }}
                  className={`rounded-full px-5 py-2 text-[14px] font-semibold transition-colors ${
                    diff === d
                      ? 'bg-white text-[#121212]'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {tx.diffs[d]}
                </button>
              ))}
            </div>
            <button
              type='button'
              onClick={() => startRef.current()}
              className='bb-cta rounded-full bg-white px-9 py-3 text-[15px] font-bold text-[#121212]'
            >
              {tx.start}
            </button>
            <p className='text-[13px] text-white/55'>{tx.hint}</p>
          </div>
        )}

        {phase === 'over' && (
          <div className='bb-in absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/45 px-6 text-center'>
            <span className='text-[28px] font-extrabold leading-none text-white'>
              {won ? tx.win : tx.lose}
            </span>
            <span className='text-[15px] text-white/60'>{tx.final}</span>
            <span className='text-[64px] font-extrabold leading-none text-white'>
              {score}
            </span>
            <span className='rounded-full bg-white/10 px-4 py-1 text-[13px] font-medium text-white/70'>
              {tx.best} {best}
            </span>
            <button
              type='button'
              onClick={() => startRef.current()}
              className='bb-cta mt-1 rounded-full bg-white px-9 py-3 text-[15px] font-bold text-[#121212]'
            >
              {tx.again}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bbIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .bb-in { animation: bbIn .28s cubic-bezier(0.23,1,0.32,1); }
        .bb-cta { transition: transform .15s cubic-bezier(0.23,1,0.32,1); }
        .bb-cta:hover { transform: translateY(-2px); }
        .bb-cta:active { transform: scale(.97); }
        @media (prefers-reduced-motion: reduce) { .bb-in { animation: none; } .bb-cta { transition: none; } }
      `}</style>
    </div>
  );
}

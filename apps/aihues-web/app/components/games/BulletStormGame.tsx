'use client';

import { useEffect, useRef, useState } from 'react';

import type { Locale } from '@/lib/dict';

/* Bullet Storm — ported from kimi.com/share/d1qtfk2f7cark99o3vd0. Core logic kept; visuals upgraded to the aihues aesthetic. */

type Phase = 'idle' | 'playing' | 'over';
type DiffKey = 'easy' | 'normal' | 'hard' | 'insane';

interface DiffCfg {
  baseSpeed: number;
  speedMul: number;
  baseInterval: number;
  bulletSize: number;
  scoreMul: number;
}

const DIFFS: Record<DiffKey, DiffCfg> = {
  easy: {
    baseSpeed: 1.5,
    speedMul: 0.02,
    baseInterval: 800,
    bulletSize: 1.2,
    scoreMul: 0.8,
  },
  normal: {
    baseSpeed: 2,
    speedMul: 0.03,
    baseInterval: 600,
    bulletSize: 1.0,
    scoreMul: 1.0,
  },
  hard: {
    baseSpeed: 2.5,
    speedMul: 0.05,
    baseInterval: 500,
    bulletSize: 0.9,
    scoreMul: 1.2,
  },
  insane: {
    baseSpeed: 3,
    speedMul: 0.08,
    baseInterval: 400,
    bulletSize: 0.8,
    scoreMul: 1.5,
  },
};
const DIFF_ORDER: DiffKey[] = ['easy', 'normal', 'hard', 'insane'];
const BEST_KEY = 'aihues_bullet-storm_best';
const INV_MS = 2000;

interface Bullet {
  x: number;
  y: number;
  r: number;
  speed: number;
  angle: number;
  hue: number;
}
interface Star {
  x: number;
  y: number;
  r: number;
  tw: number;
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
interface BGame {
  W: number;
  H: number;
  player: { x: number; y: number; r: number };
  bullets: Bullet[];
  particles: Particle[];
  stars: Star[];
  score: number;
  lives: number;
  invUntil: number;
  startTs: number;
  elapsed: number;
  lastSpawn: number;
  flash: number;
}

const fmt = (ms: number) => {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

const T = {
  en: {
    best: 'Best',
    time: 'Time',
    choose: 'Choose your difficulty',
    drag: 'Drag anywhere to move — dodge the bullets',
    start: 'Start',
    again: 'Play again',
    survived: 'Survived',
    diffs: { easy: 'Easy', normal: 'Normal', hard: 'Hard', insane: 'Insane' },
  },
  zh: {
    best: '最高',
    time: '时间',
    choose: '选择难度',
    drag: '拖动屏幕移动 — 躲开弹幕',
    start: '开始',
    again: '再来一局',
    survived: '存活',
    diffs: { easy: '简单', normal: '普通', hard: '困难', insane: '极限' },
  },
} as const;

export default function BulletStormGame({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const tx = T[zh ? 'zh' : 'en'];

  const fieldRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gRef = useRef<BGame | null>(null);
  const rafRef = useRef(0);
  const phaseRef = useRef<Phase>('idle');
  const diffRef = useRef<DiffKey>('normal');
  const bestRef = useRef(0);
  const startRef = useRef<() => void>(() => {});

  const [phase, setPhase] = useState<Phase>('idle');
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [lives, setLives] = useState(0);
  const [time, setTime] = useState(0);
  const [diff, setDiff] = useState<DiffKey>('normal');

  useEffect(() => {
    const b = Number(localStorage.getItem(BEST_KEY) || 0) || 0;
    bestRef.current = b;
    queueMicrotask(() => setBest(b));
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
        g.player.x = Math.max(g.player.r, Math.min(w - g.player.r, g.player.x));
        g.player.y = Math.max(g.player.r, Math.min(h - g.player.r, g.player.y));
      }
    };
    const ro = new ResizeObserver(size);
    ro.observe(field);
    size();

    const makeStars = (w: number, h: number): Star[] =>
      Array.from({ length: 90 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.3,
        tw: Math.random() * Math.PI * 2,
      }));

    const reset = () => {
      const w = field.clientWidth;
      const h = field.clientHeight;
      const now = performance.now();
      gRef.current = {
        W: w,
        H: h,
        player: {
          x: w / 2,
          y: h - Math.min(120, h * 0.25),
          r: Math.max(14, w * 0.026),
        },
        bullets: [],
        particles: [],
        stars: makeStars(w, h),
        score: 0,
        lives: 3,
        invUntil: 0,
        startTs: now,
        elapsed: 0,
        lastSpawn: now,
        flash: 0,
      };
      setScore(0);
      setLives(3);
      setTime(0);
    };

    // dynamic difficulty ramps with elapsed time + score (capped ×5)
    const dynDiff = (g: BGame, cfg: DiffCfg) => {
      const timeFactor = g.elapsed / 10000;
      const scoreFactor = g.score / 50;
      return Math.min(1 + (timeFactor + scoreFactor) * cfg.speedMul, 5);
    };

    const spawnBullet = (g: BGame, cfg: DiffCfg) => {
      const dyn = dynDiff(g, cfg);
      const fromTop = Math.random() < 0.5;
      const angle = fromTop
        ? Math.PI / 2 + (Math.random() - 0.5) * (Math.PI / 3)
        : (Math.random() - 0.5) * (Math.PI / 3);
      g.bullets.push({
        x: fromTop ? Math.random() * g.W : 0,
        y: fromTop ? 0 : Math.random() * g.H,
        r: (8 + Math.random() * 4) * cfg.bulletSize,
        speed: (cfg.baseSpeed + Math.random() * 2) * dyn,
        angle,
        hue: Math.floor(Math.random() * 360),
      });
    };

    const burst = (g: BGame, x: number, y: number, hue: number) => {
      const dyn = dynDiff(g, DIFFS[diffRef.current]);
      for (let i = 0; i < 14; i++)
        g.particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 9 * dyn,
          vy: (Math.random() - 0.5) * 9 * dyn,
          life: 1,
          r: Math.random() * 3 + 1.5,
          hue,
        });
    };

    const endGame = (g: BGame) => {
      if (g.elapsed > bestRef.current) {
        bestRef.current = g.elapsed;
        setBest(g.elapsed);
        try {
          localStorage.setItem(BEST_KEY, String(g.elapsed));
        } catch {
          /* ignore */
        }
      }
      setPhaseBoth('over');
    };

    const update = (g: BGame, dt: number, now: number) => {
      const cfg = DIFFS[diffRef.current];
      g.elapsed = now - g.startTs;
      setTime(g.elapsed);
      const dyn = dynDiff(g, cfg);
      const inv = now < g.invUntil;
      if (g.flash > 0) g.flash = Math.max(0, g.flash - 0.06 * dt);

      for (let i = g.bullets.length - 1; i >= 0; i--) {
        const b = g.bullets[i];
        b.x += Math.cos(b.angle) * b.speed * dt;
        b.y += Math.sin(b.angle) * b.speed * dt;

        if (b.x < -50 || b.x > g.W + 50 || b.y < -50 || b.y > g.H + 50) {
          g.bullets.splice(i, 1);
          g.score += Math.floor(cfg.scoreMul * dyn);
          setScore(g.score);
          continue;
        }

        if (!inv) {
          const dx = b.x - g.player.x;
          const dy = b.y - g.player.y;
          if (Math.hypot(dx, dy) < g.player.r + b.r) {
            burst(g, b.x, b.y, b.hue);
            g.bullets.splice(i, 1);
            g.lives--;
            g.flash = 1;
            setLives(g.lives);
            if (g.lives <= 0) {
              endGame(g);
              return;
            }
            g.invUntil = now + INV_MS;
          }
        }
      }

      const interval = Math.max(150, cfg.baseInterval / dyn);
      if (now - g.lastSpawn > interval) {
        spawnBullet(g, cfg);
        g.lastSpawn = now;
      }
    };

    const render = (g: BGame, now: number) => {
      const { W, H } = g;
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#141433');
      sky.addColorStop(1, '#0a0a1f');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      for (const s of g.stars) {
        ctx.globalAlpha = 0.3 + 0.45 * Math.sin(now * 0.0015 + s.tw);
        ctx.fillStyle = '#c8d4ff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      for (const b of g.bullets) {
        ctx.save();
        ctx.shadowBlur = 18;
        ctx.shadowColor = `hsl(${b.hue} 100% 60%)`;
        ctx.fillStyle = `hsl(${b.hue} 100% 65%)`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.25, b.y - b.r * 0.25, b.r * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      const p = g.player;
      const inv = now < g.invUntil;
      ctx.save();
      ctx.globalAlpha = inv ? 0.35 + 0.45 * Math.sin(now * 0.02) : 1;
      if (inv) {
        ctx.strokeStyle = 'rgba(120,230,255,0.8)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + 8, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.shadowBlur = 22;
      ctx.shadowColor = inv
        ? 'rgba(120,230,255,0.95)'
        : 'rgba(80,255,190,0.95)';
      const core = ctx.createRadialGradient(p.x, p.y, 1, p.x, p.y, p.r);
      core.addColorStop(0, '#ffffff');
      core.addColorStop(0.5, inv ? '#7be8ff' : '#5cffc0');
      core.addColorStop(1, inv ? '#2aa9d6' : '#15a874');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      for (const pt of g.particles) {
        ctx.globalAlpha = Math.max(0, pt.life);
        ctx.fillStyle = `hsl(${pt.hue} 100% 65%)`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (g.flash > 0) {
        ctx.fillStyle = `rgba(255,60,90,${0.4 * g.flash})`;
        ctx.fillRect(0, 0, W, H);
      }
    };

    let lastTs = 0;
    const frame = (ts: number) => {
      rafRef.current = requestAnimationFrame(frame);
      const g = gRef.current;
      if (!g) return;
      const dt = lastTs ? Math.min(2.2, (ts - lastTs) / 16.667) : 1;
      lastTs = ts;
      if (phaseRef.current === 'playing') update(g, dt, ts);
      for (let i = g.particles.length - 1; i >= 0; i--) {
        const pt = g.particles[i];
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.life -= 0.025 * dt;
        pt.r *= 0.96;
        if (pt.life <= 0) g.particles.splice(i, 1);
      }
      render(g, ts);
    };

    reset();
    startRef.current = () => {
      reset();
      setPhaseBoth('playing');
    };

    // follow the finger/pointer: move player by drag delta, clamped to bounds
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    const onDown = (e: PointerEvent) => {
      if (phaseRef.current !== 'playing') return;
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      const g = gRef.current;
      if (!g || !dragging || phaseRef.current !== 'playing') return;
      e.preventDefault();
      g.player.x = Math.max(
        g.player.r,
        Math.min(g.W - g.player.r, g.player.x + (e.clientX - lastX))
      );
      g.player.y = Math.max(
        g.player.r,
        Math.min(g.H - g.player.r, g.player.y + (e.clientY - lastY))
      );
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = () => {
      dragging = false;
    };
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, []);

  return (
    <div className='relative flex min-h-[480px] w-full flex-col touch-none select-none'>
      <div className='mx-auto flex h-[52px] w-full max-w-[560px] shrink-0 items-center justify-between px-1 text-white'>
        {phase === 'playing' ? (
          <>
            <span className='flex items-baseline gap-2'>
              <span className='text-[26px] font-bold leading-none text-white/90 tabular-nums'>
                {fmt(time)}
              </span>
              <span className='text-[13px] font-medium text-white/55 tabular-nums'>
                {score}
              </span>
            </span>
            <span className='flex items-center gap-2'>
              <span
                className='text-[15px] leading-none'
                aria-label={`${lives} lives`}
              >
                {'❤️'.repeat(Math.max(0, lives))}
              </span>
              <span className='rounded-full bg-white/10 px-3 py-1 text-[13px] font-medium text-white/70 tabular-nums'>
                {tx.best} {fmt(best)}
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
          <div className='bs-in absolute inset-0 flex flex-col items-center justify-center gap-5 bg-black/35 px-6 text-center'>
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
              className='bs-cta rounded-full bg-white px-9 py-3 text-[15px] font-bold text-[#121212]'
            >
              {tx.start}
            </button>
            <p className='text-[13px] text-white/55'>{tx.drag}</p>
          </div>
        )}

        {phase === 'over' && (
          <div className='bs-in absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/45 px-6 text-center'>
            <span className='text-[12px] font-bold uppercase tracking-[0.18em] text-white/55'>
              {tx.survived}
            </span>
            <span className='text-[56px] font-extrabold leading-none text-white tabular-nums'>
              {fmt(time)}
            </span>
            <span className='rounded-full bg-white/10 px-4 py-1 text-[13px] font-medium text-white/70 tabular-nums'>
              {tx.best} {fmt(best)}
            </span>
            <button
              type='button'
              onClick={() => startRef.current()}
              className='bs-cta mt-1 rounded-full bg-white px-9 py-3 text-[15px] font-bold text-[#121212]'
            >
              {tx.again}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bsIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .bs-in { animation: bsIn .28s cubic-bezier(0.23,1,0.32,1); }
        .bs-cta { transition: transform .15s cubic-bezier(0.23,1,0.32,1); }
        .bs-cta:hover { transform: translateY(-2px); }
        .bs-cta:active { transform: scale(.97); }
        @media (prefers-reduced-motion: reduce) { .bs-in { animation: none; } .bs-cta { transition: none; } }
      `}</style>
    </div>
  );
}

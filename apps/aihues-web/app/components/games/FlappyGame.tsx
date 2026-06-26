'use client';

import { useEffect, useRef, useState } from 'react';

import { useOptionalGameSession } from '@/components/games/GameSessionProvider';
import type { Locale } from '@/lib/dict';

/* Flappy — ported from kimi.com/share/d1r75cbduqbc808mrkdg.
   Core logic kept faithful (bird gravity/jump, pipe gap+speed per difficulty,
   lives + invincibility window, scoring); visuals upgraded to the aihues
   night-sky look: deep-blue gradient, twinkling stars, a glowing orb bird,
   neon pipes and a +1 spark burst on each life lost. */

type Phase = 'idle' | 'playing' | 'over';
type DiffKey = 'easy' | 'normal' | 'hard' | 'insane';

const DIFFS: Record<
  DiffKey,
  { gap: number; speed: number; gravity: number; jump: number; lives: number }
> = {
  easy: { gap: 280, speed: 1.8, gravity: 0.26, jump: -5.9, lives: 5 },
  normal: { gap: 248, speed: 2.3, gravity: 0.32, jump: -6.5, lives: 4 },
  hard: { gap: 216, speed: 2.9, gravity: 0.37, jump: -7.1, lives: 3 },
  insane: { gap: 196, speed: 3.6, gravity: 0.42, jump: -7.6, lives: 1 },
};
const DIFF_ORDER: DiffKey[] = ['easy', 'normal', 'hard', 'insane'];
const PIPE_W = 68;
const BEST_KEY = 'aihues_flappy_best';

interface Pipe {
  x: number;
  top: number;
  bottom: number;
  passed: boolean;
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
}
interface FGame {
  W: number;
  H: number;
  bird: { x: number; y: number; vy: number; r: number };
  pipes: Pipe[];
  stars: Star[];
  particles: Particle[];
  score: number;
  lives: number;
  inv: number;
  t: number;
}

const T = {
  en: {
    best: 'Best',
    choose: 'Choose your difficulty',
    flap: 'Tap or press Space to flap',
    start: 'Start',
    again: 'Play again',
    diffs: { easy: 'Easy', normal: 'Normal', hard: 'Hard', insane: 'Insane' },
  },
  zh: {
    best: '最高',
    choose: '选择难度',
    flap: '点击屏幕或按空格拍翅',
    start: '开始',
    again: '再来一局',
    diffs: { easy: '简单', normal: '普通', hard: '困难', insane: '地狱' },
  },
} as const;

export default function FlappyGame({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const tx = T[zh ? 'zh' : 'en'];

  const fieldRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gRef = useRef<FGame | null>(null);
  const rafRef = useRef(0);
  const phaseRef = useRef<Phase>('idle');
  const diffRef = useRef<DiffKey>('normal');
  const bestRef = useRef(0);
  const startRef = useRef<() => void>(() => {});

  const [phase, setPhase] = useState<Phase>('idle');
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [lives, setLives] = useState(0);
  const [diff, setDiff] = useState<DiffKey>('normal');

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

    const makeStars = (w: number, h: number): Star[] =>
      Array.from({ length: 70 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.3,
        tw: Math.random() * Math.PI * 2,
      }));

    const reset = () => {
      const w = field.clientWidth;
      const h = field.clientHeight;
      const cfg = DIFFS[diffRef.current];
      gRef.current = {
        W: w,
        H: h,
        bird: { x: w * 0.28, y: h / 2, vy: 0, r: Math.max(9, w * 0.015) },
        pipes: [],
        stars: makeStars(w, h),
        particles: [],
        score: 0,
        lives: cfg.lives,
        inv: 0,
        t: 0,
      };
      setScore(0);
      setLives(cfg.lives);
    };

    const spawnPipe = () => {
      const g = gRef.current;
      if (!g) return;
      const cfg = DIFFS[diffRef.current];
      const min = 56;
      const max = Math.max(min + 20, g.H - cfg.gap - min);
      const top = Math.random() * (max - min) + min;
      g.pipes.push({ x: g.W, top, bottom: g.H - top - cfg.gap, passed: false });
    };

    const burst = (x: number, y: number) => {
      const g = gRef.current;
      if (!g) return;
      for (let i = 0; i < 20; i++)
        g.particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 7,
          vy: (Math.random() - 0.5) * 7,
          life: 1,
          r: Math.random() * 3 + 1,
        });
    };

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

    const loseLife = () => {
      const g = gRef.current;
      if (!g) return;
      burst(g.bird.x, g.bird.y);
      g.lives--;
      setLives(g.lives);
      if (g.lives <= 0) {
        endGame();
        return;
      }
      g.bird.y = g.H / 2;
      g.bird.vy = 0;
      g.pipes = [];
      g.inv = 2;
    };

    const flap = () => {
      const g = gRef.current;
      if (!g || phaseRef.current !== 'playing') return;
      g.bird.vy = DIFFS[diffRef.current].jump;
    };

    const update = (dt: number) => {
      const g = gRef.current;
      if (!g) return;
      const cfg = DIFFS[diffRef.current];
      if (g.inv > 0) g.inv -= dt / 60;
      const inv = g.inv > 0;
      g.bird.vy += cfg.gravity * dt;
      g.bird.y += g.bird.vy * dt;
      if (!inv && (g.bird.y - g.bird.r < 0 || g.bird.y + g.bird.r > g.H)) {
        loseLife();
        return;
      }
      for (let i = g.pipes.length - 1; i >= 0; i--) {
        const p = g.pipes[i];
        p.x -= cfg.speed * dt;
        if (!p.passed && p.x + PIPE_W < g.bird.x) {
          p.passed = true;
          g.score++;
          setScore(g.score);
        }
        if (
          !inv &&
          g.bird.x + g.bird.r > p.x &&
          g.bird.x - g.bird.r < p.x + PIPE_W &&
          (g.bird.y - g.bird.r < p.top || g.bird.y + g.bird.r > g.H - p.bottom)
        ) {
          loseLife();
          return;
        }
        if (p.x + PIPE_W < 0) g.pipes.splice(i, 1);
      }
      const last = g.pipes[g.pipes.length - 1];
      if (!last || last.x < g.W - 250) spawnPipe();
    };

    const render = () => {
      const g = gRef.current;
      if (!g) return;
      const { W, H } = g;
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#0e1d40');
      sky.addColorStop(1, '#0a1126');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);
      for (const s of g.stars) {
        ctx.globalAlpha = 0.35 + 0.4 * Math.sin(g.t * 0.05 + s.tw);
        ctx.fillStyle = '#cfe0ff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      for (const p of g.pipes) {
        ctx.save();
        ctx.shadowColor = 'rgba(70,224,160,0.55)';
        ctx.shadowBlur = 14;
        ctx.fillStyle = '#1f9d6b';
        ctx.fillRect(p.x, 0, PIPE_W, p.top);
        ctx.fillRect(p.x, H - p.bottom, PIPE_W, p.bottom);
        ctx.restore();
        ctx.fillStyle = '#46e8a0';
        ctx.fillRect(p.x - 4, p.top - 16, PIPE_W + 8, 16);
        ctx.fillRect(p.x - 4, H - p.bottom, PIPE_W + 8, 16);
      }
      const b = g.bird;
      const inv = g.inv > 0;
      ctx.globalAlpha = inv ? 0.4 + 0.4 * Math.sin(g.t * 0.6) : 1;
      ctx.save();
      ctx.shadowColor = 'rgba(255,205,80,0.85)';
      ctx.shadowBlur = 18;
      const bg = ctx.createRadialGradient(b.x - 4, b.y - 4, 2, b.x, b.y, b.r);
      bg.addColorStop(0, '#fff3c4');
      bg.addColorStop(1, '#f1b21f');
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(b.x + 5, b.y - 4, b.r * 0.28, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0a0f0c';
      ctx.beginPath();
      ctx.arc(b.x + 6, b.y - 4, b.r * 0.14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ff8a3c';
      ctx.beginPath();
      ctx.moveTo(b.x + b.r - 2, b.y - 3);
      ctx.lineTo(b.x + b.r + 9, b.y);
      ctx.lineTo(b.x + b.r - 2, b.y + 3);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      for (const pt of g.particles) {
        ctx.globalAlpha = Math.max(0, pt.life);
        ctx.fillStyle = '#ffd24a';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    let lastTs = 0;
    const frame = (ts: number) => {
      rafRef.current = requestAnimationFrame(frame);
      const g = gRef.current;
      if (!g) return;
      const dt = lastTs ? Math.min(2.2, (ts - lastTs) / 16.667) : 1;
      lastTs = ts;
      g.t += dt;
      if (phaseRef.current === 'playing') update(dt);
      for (let i = g.particles.length - 1; i >= 0; i--) {
        const pt = g.particles[i];
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.life -= 0.03 * dt;
        if (pt.life <= 0) g.particles.splice(i, 1);
      }
      render();
    };

    reset();
    startRef.current = () => {
      reset();
      setPhaseBoth('playing');
    };

    const onPointer = () => {
      if (phaseRef.current === 'playing') flap();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (phaseRef.current === 'playing') flap();
      }
    };
    canvas.addEventListener('pointerdown', onPointer);
    window.addEventListener('keydown', onKey);
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onPointer);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className='relative flex min-h-[480px] w-full flex-col touch-none select-none'>
      <div className='mx-auto flex h-[52px] w-full max-w-[560px] shrink-0 items-center justify-between px-1 text-white'>
        {phase === 'playing' ? (
          <>
            <span className='text-[26px] font-bold leading-none text-white/90 tabular-nums'>
              {score}
            </span>
            <span className='flex items-center gap-2'>
              <span
                className='text-[15px] leading-none'
                aria-label={`${lives} lives`}
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
          <div className='fl-in absolute inset-0 flex flex-col items-center justify-center gap-5 bg-black/35 px-6 text-center'>
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
              className='fl-cta rounded-full bg-white px-9 py-3 text-[15px] font-bold text-[#121212]'
            >
              {tx.start}
            </button>
            <p className='text-[13px] text-white/55'>{tx.flap}</p>
          </div>
        )}

        {phase === 'over' && (
          <div className='fl-in absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/45 px-6 text-center'>
            <span className='text-[64px] font-extrabold leading-none text-white'>
              {score}
            </span>
            <span className='rounded-full bg-white/10 px-4 py-1 text-[13px] font-medium text-white/70'>
              {tx.best} {best}
            </span>
            <button
              type='button'
              onClick={() => startRef.current()}
              className='fl-cta mt-1 rounded-full bg-white px-9 py-3 text-[15px] font-bold text-[#121212]'
            >
              {tx.again}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes flIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .fl-in { animation: flIn .28s cubic-bezier(0.23,1,0.32,1); }
        .fl-cta { transition: transform .15s cubic-bezier(0.23,1,0.32,1); }
        .fl-cta:hover { transform: translateY(-2px); }
        .fl-cta:active { transform: scale(.97); }
        @media (prefers-reduced-motion: reduce) { .fl-in { animation: none; } .fl-cta { transition: none; } }
      `}</style>
    </div>
  );
}

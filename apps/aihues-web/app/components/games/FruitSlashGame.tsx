'use client';

import { useEffect, useRef, useState } from 'react';

import type { Locale } from '@/lib/dict';

/* Fruit Slash — ported from kimi.com/share/d3e0fokn907c4b3ri9qg. Core logic kept; visuals upgraded to the aihues aesthetic. */

type Phase = 'idle' | 'playing' | 'over';

const MAX_LIVES = 3;
const MAX_ENERGY = 40;
const START_ENERGY = 20;
const BURST_SECONDS = 10;
const BASE_SPAWN = 0.018;
const TRAIL_MAX = 14;
const BEST_KEY = 'aihues_fruit-slash_best';

interface Kind {
  hue: number;
  points: number;
  bomb?: boolean;
}

const KINDS: Kind[] = [
  { hue: 14, points: 10 }, // carrot orange
  { hue: 122, points: 15 }, // broccoli green
  { hue: 48, points: 20 }, // corn gold
  { hue: 96, points: 10 }, // cucumber lime
  { hue: 6, points: 15 }, // tomato red
  { hue: 28, points: 20 }, // potato amber
  { hue: 320, points: 25 }, // mushroom magenta
];
const BOMB: Kind = { hue: 0, points: -50, bomb: true };

interface Fruit {
  kind: Kind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  g: number;
  r: number;
  rot: number;
  spin: number;
  sliced: boolean;
  st: number;
  hx: number;
  hy: number;
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
interface Pop {
  x: number;
  y: number;
  life: number;
  n: number;
}
interface TrailPt {
  x: number;
  y: number;
}
interface FGame {
  W: number;
  H: number;
  fruits: Fruit[];
  particles: Particle[];
  pops: Pop[];
  trail: TrailPt[];
  score: number;
  combo: number;
  lives: number;
  energy: number;
  burst: number;
  spawn: number;
  shake: number;
  t: number;
}

const T = {
  en: {
    best: 'Best',
    title: 'Fruit Slash',
    how: 'Drag across the fruit to slice · dodge the bombs',
    start: 'Start',
    again: 'Play again',
    combo: 'Combo',
    burst: 'Frenzy',
  },
  zh: {
    best: '最高',
    title: '水果忍者',
    how: '拖动划过水果切开 · 躲开炸弹',
    start: '开始',
    again: '再来一局',
    combo: '连击',
    burst: '爆发',
  },
} as const;

export default function FruitSlashGame({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const tx = T[zh ? 'zh' : 'en'];

  const readBest = () => {
    if (typeof window === 'undefined') return 0;
    return Number(window.localStorage.getItem(BEST_KEY) || 0) || 0;
  };

  const fieldRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gRef = useRef<FGame | null>(null);
  const rafRef = useRef(0);
  const phaseRef = useRef<Phase>('idle');
  const bestRef = useRef(readBest());
  const startRef = useRef<() => void>(() => {});

  const [phase, setPhase] = useState<Phase>('idle');
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(readBest);
  const [lives, setLives] = useState(MAX_LIVES);
  const [combo, setCombo] = useState(0);
  const [energy, setEnergy] = useState(START_ENERGY);
  const [burst, setBurst] = useState(false);

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

    const reset = () => {
      const w = field.clientWidth;
      const h = field.clientHeight;
      gRef.current = {
        W: w,
        H: h,
        fruits: [],
        particles: [],
        pops: [],
        trail: [],
        score: 0,
        combo: 0,
        lives: MAX_LIVES,
        energy: START_ENERGY,
        burst: 0,
        spawn: BASE_SPAWN,
        shake: 0,
        t: 0,
      };
      setScore(0);
      setCombo(0);
      setLives(MAX_LIVES);
      setEnergy(START_ENERGY);
      setBurst(false);
    };

    const splatter = (x: number, y: number, hue: number, n: number) => {
      const g = gRef.current;
      if (!g) return;
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = Math.random() * 6 + 1.5;
        g.particles.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 1.5,
          life: 1,
          r: Math.random() * 3.2 + 1.4,
          hue,
        });
      }
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
      g.lives--;
      setLives(g.lives);
      g.shake = 18;
      if (g.lives <= 0) endGame();
    };

    // Faithful to source: energy pool drives lives + a frenzy "burst" mode.
    const changeEnergy = (delta: number) => {
      const g = gRef.current;
      if (!g || g.burst > 0) return;
      g.energy = Math.max(0, Math.min(MAX_ENERGY, g.energy + delta));
      setEnergy(g.energy);
      if (g.energy === 0) {
        g.energy = START_ENERGY;
        setEnergy(g.energy);
        loseLife();
      } else if (g.energy === MAX_ENERGY) {
        g.energy = Math.max(0, g.energy - 20);
        setEnergy(g.energy);
        g.burst = BURST_SECONDS;
        setBurst(true);
      }
    };

    const spawnFruit = () => {
      const g = gRef.current;
      if (!g) return;
      const kind =
        g.burst > 0
          ? KINDS[Math.floor(Math.random() * KINDS.length)]
          : Math.random() < 0.13
            ? BOMB
            : KINDS[Math.floor(Math.random() * KINDS.length)];
      const r = Math.max(24, Math.min(46, g.W * 0.072)) + Math.random() * 8;
      const launch = Math.max(9, g.H * 0.016);
      g.fruits.push({
        kind,
        x: r + Math.random() * (g.W - r * 2),
        y: g.H + r,
        vx: (Math.random() - 0.5) * 3.4,
        vy: -(launch + Math.random() * launch * 0.6),
        g: Math.max(0.22, g.H * 0.00042),
        r,
        rot: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.18,
        sliced: false,
        st: 0,
        hx: 0,
        hy: 0,
      });
    };

    const distToSeg = (
      px: number,
      py: number,
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ) => {
      const A = px - x1;
      const B = py - y1;
      const C = x2 - x1;
      const D = y2 - y1;
      const lenSq = C * C + D * D;
      let param = lenSq !== 0 ? (A * C + B * D) / lenSq : -1;
      param = Math.max(0, Math.min(1, param));
      const xx = x1 + param * C;
      const yy = y1 + param * D;
      const dx = px - xx;
      const dy = py - yy;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const sliceAlong = (x1: number, y1: number, x2: number, y2: number) => {
      const g = gRef.current;
      if (!g) return;
      const ang = Math.atan2(y2 - y1, x2 - x1);
      for (const f of g.fruits) {
        if (f.sliced) continue;
        if (distToSeg(f.x, f.y, x1, y1, x2, y2) < f.r) {
          f.sliced = true;
          f.st = 0;
          f.hx = Math.cos(ang);
          f.hy = Math.sin(ang);
          g.score += f.kind.points;
          setScore(g.score);
          if (f.kind.bomb) {
            g.combo = 0;
            setCombo(0);
            splatter(f.x, f.y, 0, 30);
            g.shake = 22;
            changeEnergy(-5);
            loseLife();
          } else {
            g.combo++;
            setCombo(g.combo);
            g.pops.push({ x: f.x, y: f.y, life: 1, n: g.combo });
            splatter(f.x, f.y, f.kind.hue, 16);
            changeEnergy(1);
          }
        }
      }
    };

    const update = (dt: number) => {
      const g = gRef.current;
      if (!g) return;

      if (g.burst > 0) {
        g.burst -= dt / 60;
        if (g.burst <= 0) {
          g.burst = 0;
          setBurst(false);
        }
      }

      // Difficulty ramp: spawn rate creeps up over time.
      const ramp = Math.min(0.05, g.score * 0.00004 + g.t * 0.0000008);
      const rate = g.burst > 0 ? 0.13 : g.spawn + ramp;
      if (Math.random() < rate * dt) spawnFruit();

      for (let i = g.fruits.length - 1; i >= 0; i--) {
        const f = g.fruits[i];
        if (!f.sliced) {
          f.x += f.vx * dt;
          f.y += f.vy * dt;
          f.vy += f.g * dt;
          f.rot += f.spin * dt;
          // Missed (fell back past the bottom while still rising-then-falling).
          if (f.vy > 0 && f.y - f.r > g.H) {
            g.fruits.splice(i, 1);
            if (g.burst <= 0) {
              if (f.kind.bomb) {
                changeEnergy(1);
              } else {
                changeEnergy(-1);
                g.combo = 0;
                setCombo(0);
              }
            }
          }
        } else {
          f.st += dt;
          f.x += f.vx * 1.4 * dt;
          f.y += f.vy * dt;
          f.vy += f.g * 1.8 * dt;
          if (f.st > 34) g.fruits.splice(i, 1);
        }
      }
    };

    const drawFruit = (f: Fruit) => {
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.rot);
      const alpha = f.sliced ? Math.max(0, 1 - f.st / 34) : 1;
      ctx.globalAlpha = alpha;
      if (f.kind.bomb) {
        ctx.shadowColor = 'rgba(40,44,52,0.9)';
        ctx.shadowBlur = 16;
        const bg = ctx.createRadialGradient(
          -f.r * 0.3,
          -f.r * 0.3,
          f.r * 0.2,
          0,
          0,
          f.r
        );
        bg.addColorStop(0, '#4a4f59');
        bg.addColorStop(1, '#15171d');
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(0, 0, f.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#ff5a3c';
        ctx.lineWidth = Math.max(2, f.r * 0.12);
        ctx.beginPath();
        ctx.moveTo(0, -f.r);
        ctx.lineTo(f.r * 0.36, -f.r * 1.4);
        ctx.stroke();
        ctx.fillStyle = '#ffd24a';
        ctx.beginPath();
        ctx.arc(f.r * 0.4, -f.r * 1.42, f.r * 0.16, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return;
      }
      const draw = (cx: number) => {
        const bg = ctx.createRadialGradient(
          cx - f.r * 0.3,
          -f.r * 0.3,
          f.r * 0.2,
          cx,
          0,
          f.r
        );
        bg.addColorStop(0, `hsl(${f.kind.hue},95%,72%)`);
        bg.addColorStop(1, `hsl(${f.kind.hue},80%,46%)`);
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(cx, 0, f.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.beginPath();
        ctx.ellipse(
          cx - f.r * 0.32,
          -f.r * 0.34,
          f.r * 0.22,
          f.r * 0.14,
          -0.6,
          0,
          Math.PI * 2
        );
        ctx.fill();
      };
      ctx.shadowColor = `hsla(${f.kind.hue},90%,60%,0.85)`;
      ctx.shadowBlur = 18;
      if (!f.sliced) {
        draw(0);
      } else {
        // Two halves drift apart along the slash normal.
        const off = f.st * 0.9 + 4;
        const nx = -f.hy;
        const ny = f.hx;
        ctx.save();
        ctx.translate(nx * off, ny * off);
        draw(0);
        ctx.restore();
        ctx.save();
        ctx.translate(-nx * off, -ny * off);
        draw(0);
        ctx.restore();
      }
      ctx.restore();
    };

    const render = () => {
      const g = gRef.current;
      if (!g) return;
      const { W, H } = g;
      ctx.save();
      if (g.shake > 0) {
        const m = g.shake * 0.35;
        ctx.translate((Math.random() - 0.5) * m, (Math.random() - 0.5) * m);
        g.shake -= 1;
      }

      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, g.burst > 0 ? '#241430' : '#16171f');
      sky.addColorStop(1, g.burst > 0 ? '#0c0810' : '#0a0b10');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      for (const f of g.fruits) drawFruit(f);

      for (const p of g.particles) {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = `hsl(${p.hue},90%,62%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      for (const pop of g.pops) {
        if (pop.n < 2) continue;
        ctx.globalAlpha = Math.max(0, pop.life);
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.round(18 + pop.n)}px ui-sans-serif, system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${pop.n}x`, pop.x, pop.y - (1 - pop.life) * 30);
      }
      ctx.globalAlpha = 1;

      // Glowing blade trail along the recent pointer path.
      if (g.trail.length > 1) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = 'rgba(150,210,255,0.9)';
        ctx.shadowBlur = 16;
        for (let i = 1; i < g.trail.length; i++) {
          const a = g.trail[i - 1];
          const b = g.trail[i];
          const k = i / g.trail.length;
          ctx.strokeStyle = `rgba(220,240,255,${k * 0.9})`;
          ctx.lineWidth = 1 + k * 7;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        ctx.restore();
      }
      ctx.restore();
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
        const p = g.particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 0.22 * dt;
        p.vx *= 0.985;
        p.life -= 0.026 * dt;
        p.r *= 0.99;
        if (p.life <= 0) g.particles.splice(i, 1);
      }
      for (let i = g.pops.length - 1; i >= 0; i--) {
        g.pops[i].life -= 0.03 * dt;
        if (g.pops[i].life <= 0) g.pops.splice(i, 1);
      }
      render();
    };

    reset();
    startRef.current = () => {
      reset();
      setPhaseBoth('playing');
    };

    let dragging = false;
    let last: TrailPt | null = null;
    const posOf = (e: PointerEvent): TrailPt => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const pushTrail = (p: TrailPt) => {
      const g = gRef.current;
      if (!g) return;
      g.trail.push(p);
      while (g.trail.length > TRAIL_MAX) g.trail.shift();
    };
    const onDown = (e: PointerEvent) => {
      if (phaseRef.current !== 'playing') return;
      dragging = true;
      canvas.setPointerCapture?.(e.pointerId);
      last = posOf(e);
      const g = gRef.current;
      if (g) g.trail = [last];
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging || phaseRef.current !== 'playing') return;
      e.preventDefault();
      const p = posOf(e);
      pushTrail(p);
      if (last) sliceAlong(last.x, last.y, p.x, p.y);
      last = p;
    };
    const onUp = () => {
      dragging = false;
      last = null;
      const g = gRef.current;
      if (g) g.trail = [];
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

  const energyPct = Math.round((energy / MAX_ENERGY) * 100);

  return (
    <div className='relative flex min-h-[480px] w-full flex-col touch-none select-none'>
      <div className='mx-auto flex h-[52px] w-full max-w-[560px] shrink-0 items-center justify-between gap-3 px-1 text-white'>
        {phase === 'playing' ? (
          <>
            <span className='flex items-baseline gap-2'>
              <span className='text-[26px] font-bold leading-none text-white/90 tabular-nums'>
                {score}
              </span>
              {combo >= 2 && (
                <span className='text-[14px] font-semibold leading-none text-[#9fe0ff]'>
                  {combo}x {tx.combo}
                </span>
              )}
            </span>
            <span className='flex items-center gap-2'>
              {burst && (
                <span className='rounded-full bg-[#ff5aa8]/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#ff8ac4]'>
                  {tx.burst}
                </span>
              )}
              <span
                className='h-[7px] w-[64px] overflow-hidden rounded-full bg-white/15 ring-1 ring-white/10'
                aria-label={`energy ${energyPct}%`}
              >
                <span
                  className='block h-full rounded-full bg-[#ffce4a] transition-[width] duration-200'
                  style={{ width: `${energyPct}%` }}
                />
              </span>
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
          <div className='fs-in absolute inset-0 flex flex-col items-center justify-center gap-5 bg-black/35 px-6 text-center'>
            <p className='text-[12px] font-bold uppercase tracking-[0.18em] text-white/55'>
              {tx.title}
            </p>
            <button
              type='button'
              onClick={() => startRef.current()}
              className='fs-cta rounded-full bg-white px-9 py-3 text-[15px] font-bold text-[#121212]'
            >
              {tx.start}
            </button>
            <p className='text-[13px] text-white/55'>{tx.how}</p>
          </div>
        )}

        {phase === 'over' && (
          <div className='fs-in absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/45 px-6 text-center'>
            <span className='text-[64px] font-extrabold leading-none text-white'>
              {score}
            </span>
            <span className='rounded-full bg-white/10 px-4 py-1 text-[13px] font-medium text-white/70'>
              {tx.best} {best}
            </span>
            <button
              type='button'
              onClick={() => startRef.current()}
              className='fs-cta mt-1 rounded-full bg-white px-9 py-3 text-[15px] font-bold text-[#121212]'
            >
              {tx.again}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fsIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .fs-in { animation: fsIn .28s cubic-bezier(0.23,1,0.32,1); }
        .fs-cta { transition: transform .15s cubic-bezier(0.23,1,0.32,1); }
        .fs-cta:hover { transform: translateY(-2px); }
        .fs-cta:active { transform: scale(.97); }
        @media (prefers-reduced-motion: reduce) { .fs-in { animation: none; } .fs-cta { transition: none; } }
      `}</style>
    </div>
  );
}

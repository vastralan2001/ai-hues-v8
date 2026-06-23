'use client';

import { useEffect, useRef, useState } from 'react';

import type { Locale } from '@/lib/dict';

/* Depth Charge — ported from kimi.com/share/d2r5dbmn3mk9hjcjm6l0. Core logic kept; visuals upgraded to the aihues aesthetic. */

type Phase = 'idle' | 'playing' | 'over';

const GAME_TIME = 120;
const RELOAD = 3;
const SLOTS = 5;
const BOMB_SPEED = 7;
const SHIP_SMOOTH = 0.15;
const SPAWN_EVERY = 1.5;
const NORMAL_VALUE = 50;
const SPECIAL_VALUE = 500;
const SHIP_W = 70;
const SHIP_H = 25;
const SHIP_Y = 64;
const BEST_KEY = 'aihues_depth-charge_best';

interface Bomb {
  x: number;
  y: number;
}
interface Sub {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  dir: number;
  special: boolean;
  value: number;
  ph: number;
}
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  color: string;
}
interface Bubble {
  x: number;
  y: number;
  r: number;
  sp: number;
}
interface Ping {
  x: number;
  y: number;
  life: number;
}
interface DGame {
  W: number;
  H: number;
  shipX: number;
  shipTarget: number;
  bombs: Bomb[];
  subs: Sub[];
  particles: Particle[];
  bubbles: Bubble[];
  pings: Ping[];
  cooldowns: number[];
  score: number;
  timeLeft: number;
  spawn: number;
  t: number;
}

const T = {
  en: {
    best: 'Best',
    title: 'Sink the subs',
    how: 'Drag to steer the ship • tap or press Space to drop a charge',
    start: 'Start',
    again: 'Play again',
    time: 'Time',
    over: "Time's up!",
  },
  zh: {
    best: '最高',
    title: '击沉潜艇',
    how: '拖动操控战舰 • 点击或按空格投放炸弹',
    start: '开始',
    again: '再来一局',
    time: '时间',
    over: '时间到!',
  },
} as const;

function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function loadBest(): number {
  if (typeof window === 'undefined') return 0;
  try {
    return Number(window.localStorage.getItem(BEST_KEY) || 0) || 0;
  } catch {
    return 0;
  }
}

export default function DepthChargeGame({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const tx = T[zh ? 'zh' : 'en'];

  const fieldRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gRef = useRef<DGame | null>(null);
  const rafRef = useRef(0);
  const phaseRef = useRef<Phase>('idle');
  const bestRef = useRef(loadBest());
  const startRef = useRef<() => void>(() => {});

  const [phase, setPhase] = useState<Phase>('idle');
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(loadBest);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [slots, setSlots] = useState<number[]>(() => Array(SLOTS).fill(0));

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
        const wasMid = g.W ? g.shipX / g.W : 0.5;
        g.W = w;
        g.H = h;
        g.shipX = Math.min(Math.max(SHIP_W / 2, wasMid * w), w - SHIP_W / 2);
        g.shipTarget = g.shipX;
      }
    };
    const ro = new ResizeObserver(size);
    ro.observe(field);
    size();

    const makeBubbles = (w: number, h: number): Bubble[] =>
      Array.from({ length: 26 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2.6 + 0.8,
        sp: Math.random() * 0.5 + 0.25,
      }));

    const reset = () => {
      const w = field.clientWidth;
      const h = field.clientHeight;
      gRef.current = {
        W: w,
        H: h,
        shipX: w / 2,
        shipTarget: w / 2,
        bombs: [],
        subs: [],
        particles: [],
        bubbles: makeBubbles(w, h),
        pings: [],
        cooldowns: Array(SLOTS).fill(0),
        score: 0,
        timeLeft: GAME_TIME,
        spawn: SPAWN_EVERY,
        t: 0,
      };
      setScore(0);
      setTimeLeft(GAME_TIME);
      setSlots(Array(SLOTS).fill(0));
    };

    const spawnSub = () => {
      const g = gRef.current;
      if (!g) return;
      const special = Math.random() < 0.08;
      const w = special ? 100 : 80;
      const fromLeft = Math.random() > 0.5;
      const speed = 2 + (Math.random() - 0.5) * 3;
      g.subs.push({
        x: fromLeft ? -w : g.W + w,
        y: 120 + Math.random() * Math.max(40, g.H - 240),
        w,
        h: 25,
        vx: Math.abs(speed) < 0.6 ? 1.2 : Math.abs(speed),
        dir: fromLeft ? 1 : -1,
        special,
        value: special ? SPECIAL_VALUE : NORMAL_VALUE,
        ph: Math.random() * Math.PI * 2,
      });
    };

    const explode = (x: number, y: number, special: boolean) => {
      const g = gRef.current;
      if (!g) return;
      const count = special ? 26 : 16;
      const color = special ? '#ffe24a' : '#ff7a2c';
      for (let i = 0; i < count; i++)
        g.particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 11,
          vy: (Math.random() - 0.5) * 11,
          r: Math.random() * 4 + 2,
          life: 1,
          color,
        });
      g.pings.push({ x, y, life: 1 });
    };

    const dropBomb = () => {
      const g = gRef.current;
      if (!g || phaseRef.current !== 'playing') return;
      for (let i = 0; i < g.cooldowns.length; i++) {
        if (g.cooldowns[i] <= 0) {
          g.bombs.push({ x: g.shipX, y: SHIP_Y + 15 });
          g.cooldowns[i] = RELOAD;
          setSlots(g.cooldowns.slice());
          return;
        }
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

    const update = (dt: number) => {
      const g = gRef.current;
      if (!g) return;
      const dts = dt / 60;

      g.timeLeft = Math.max(0, g.timeLeft - dts);
      setTimeLeft(g.timeLeft);
      if (g.timeLeft <= 0) {
        endGame();
        return;
      }

      let cdChanged = false;
      for (let i = 0; i < g.cooldowns.length; i++) {
        if (g.cooldowns[i] > 0) {
          g.cooldowns[i] = Math.max(0, g.cooldowns[i] - dts);
          cdChanged = true;
        }
      }
      if (cdChanged) setSlots(g.cooldowns.slice());

      g.shipX += (g.shipTarget - g.shipX) * (1 - Math.pow(1 - SHIP_SMOOTH, dt));

      for (let i = g.bombs.length - 1; i >= 0; i--) {
        const b = g.bombs[i];
        b.y += BOMB_SPEED * dt;
        if (b.y > g.H) g.bombs.splice(i, 1);
      }

      for (let i = g.subs.length - 1; i >= 0; i--) {
        const s = g.subs[i];
        s.x += s.vx * s.dir * dt;
        s.ph += dt * 0.06;
        if ((s.dir > 0 && s.x > g.W + s.w) || (s.dir < 0 && s.x + s.w < -s.w))
          g.subs.splice(i, 1);
      }

      for (let i = g.bombs.length - 1; i >= 0; i--) {
        const b = g.bombs[i];
        for (let j = g.subs.length - 1; j >= 0; j--) {
          const s = g.subs[j];
          if (b.x > s.x && b.x < s.x + s.w && b.y > s.y && b.y < s.y + s.h) {
            explode(b.x, s.y + s.h / 2, s.special);
            g.score += s.value;
            setScore(g.score);
            g.subs.splice(j, 1);
            g.bombs.splice(i, 1);
            break;
          }
        }
      }

      g.spawn -= dts;
      if (g.spawn <= 0) {
        spawnSub();
        g.spawn += SPAWN_EVERY;
      }
    };

    const drawShip = (x: number) => {
      ctx.save();
      ctx.shadowColor = 'rgba(120,200,255,0.6)';
      ctx.shadowBlur = 14;
      ctx.fillStyle = '#e8f3ff';
      const hw = SHIP_W / 2;
      ctx.beginPath();
      ctx.moveTo(x - hw, SHIP_Y - SHIP_H / 2);
      ctx.lineTo(x + hw, SHIP_Y - SHIP_H / 2);
      ctx.lineTo(x + hw - 12, SHIP_Y + SHIP_H / 2);
      ctx.lineTo(x - hw + 12, SHIP_Y + SHIP_H / 2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#bcd8f2';
      ctx.fillRect(x - 18, SHIP_Y - SHIP_H / 2 - 14, 36, 14);
      ctx.fillStyle = '#7fd0ff';
      ctx.fillRect(x - 4, SHIP_Y - SHIP_H / 2 - 26, 8, 12);
      ctx.restore();
    };

    const drawSub = (s: Sub) => {
      const cx = s.x + s.w / 2;
      const cy = s.y + s.h / 2 + Math.sin(s.ph) * 2;
      ctx.save();
      if (s.special) {
        ctx.shadowColor = 'rgba(255,226,74,0.9)';
        ctx.shadowBlur = 18;
        ctx.fillStyle = '#ffe24a';
      } else {
        ctx.shadowColor = 'rgba(70,232,160,0.55)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#46e8a0';
      }
      ctx.beginPath();
      const r = s.h / 2;
      ctx.moveTo(s.x + r, cy - r);
      ctx.lineTo(s.x + s.w - r, cy - r);
      ctx.arc(s.x + s.w - r, cy, r, -Math.PI / 2, Math.PI / 2);
      ctx.lineTo(s.x + r, cy + r);
      ctx.arc(s.x + r, cy, r, Math.PI / 2, -Math.PI / 2);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(cx - 18, cy - r - 9, 36, 10);
      ctx.restore();
      ctx.fillStyle = 'rgba(8,22,40,0.85)';
      const wins = s.special ? 5 : 4;
      for (let i = 0; i < wins; i++) {
        ctx.beginPath();
        ctx.arc(
          s.x + 16 + i * ((s.w - 28) / (wins - 1)),
          cy,
          3.4,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      ctx.fillStyle = s.special ? '#fff7cf' : '#d9fff0';
      ctx.font = 'bold 13px ui-sans-serif, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(String(s.value), cx, cy - r - 16);
      ctx.textAlign = 'left';
    };

    const render = () => {
      const g = gRef.current;
      if (!g) return;
      const { W, H } = g;

      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#0c3a63');
      grad.addColorStop(0.28, '#0a2748');
      grad.addColorStop(0.62, '#08182f');
      grad.addColorStop(1, '#040b1a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = 'rgba(150,210,255,0.35)';
      ctx.lineWidth = 2;
      for (let i = 0; i < W; i += 50) {
        const wave = Math.sin(g.t * 0.05 + i * 0.02) * 3;
        ctx.beginPath();
        ctx.moveTo(i, 30 + wave);
        ctx.lineTo(i + 26, 30 + wave);
        ctx.stroke();
      }

      for (const bub of g.bubbles) {
        ctx.globalAlpha = 0.18 + 0.12 * Math.sin(g.t * 0.05 + bub.x);
        ctx.fillStyle = '#bfe6ff';
        ctx.beginPath();
        ctx.arc(bub.x, bub.y, bub.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      for (const p of g.pings) {
        ctx.globalAlpha = Math.max(0, p.life) * 0.6;
        ctx.strokeStyle = '#7fd0ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, (1 - p.life) * 70 + 6, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      for (const s of g.subs) drawSub(s);

      for (const b of g.bombs) {
        ctx.save();
        ctx.shadowColor = 'rgba(255,90,90,0.9)';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#ff5a5a';
        ctx.beginPath();
        ctx.arc(b.x, b.y + 5, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,140,140,0.5)';
        ctx.fillRect(b.x - 1.2, b.y - 7, 2.4, 9);
        ctx.restore();
      }

      drawShip(g.shipX);

      for (const pt of g.particles) {
        ctx.globalAlpha = Math.max(0, pt.life);
        ctx.fillStyle = pt.color;
        ctx.shadowColor = pt.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
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
        pt.vx *= Math.pow(0.9, dt);
        pt.vy *= Math.pow(0.9, dt);
        pt.r *= Math.pow(0.95, dt);
        pt.life -= 0.033 * dt;
        if (pt.life <= 0) g.particles.splice(i, 1);
      }
      for (let i = g.pings.length - 1; i >= 0; i--) {
        const p = g.pings[i];
        p.life -= 0.02 * dt;
        if (p.life <= 0) g.pings.splice(i, 1);
      }
      for (const bub of g.bubbles) {
        bub.y -= bub.sp * dt;
        if (bub.y < -bub.r) {
          bub.y = g.H + bub.r;
          bub.x = Math.random() * g.W;
        }
      }
      render();
    };

    reset();
    startRef.current = () => {
      reset();
      setPhaseBoth('playing');
    };

    const xFromEvent = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return e.clientX - rect.left;
    };
    const steer = (x: number) => {
      const g = gRef.current;
      if (!g) return;
      g.shipTarget = Math.min(Math.max(SHIP_W / 2, x), g.W - SHIP_W / 2);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (phaseRef.current !== 'playing') return;
      const x = xFromEvent(e);
      steer(x);
      dropBomb();
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };
    const onPointerMove = (e: PointerEvent) => {
      if (phaseRef.current !== 'playing') return;
      if (e.buttons === 0 && e.pointerType === 'mouse') return;
      steer(xFromEvent(e));
    };
    const onKey = (e: KeyboardEvent) => {
      const g = gRef.current;
      if (!g) return;
      if (e.code === 'Space') {
        e.preventDefault();
        dropBomb();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        steer(g.shipTarget - g.W * 0.08);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        steer(g.shipTarget + g.W * 0.08);
      }
    };
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    window.addEventListener('keydown', onKey);
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const low = timeLeft <= 10;

  return (
    <div className='relative flex min-h-[480px] w-full flex-col touch-none select-none'>
      <div className='mx-auto flex h-[52px] w-full max-w-[560px] shrink-0 items-center justify-between px-1 text-white'>
        {phase === 'playing' ? (
          <>
            <span className='text-[26px] font-bold leading-none text-white/90 tabular-nums'>
              {score}
            </span>
            <span className='flex items-center gap-2'>
              <span className='flex items-center gap-1' aria-label='charges'>
                {slots.map((cd, i) => (
                  <span
                    key={i}
                    className='relative h-[18px] w-[26px] overflow-hidden rounded-[3px] border'
                    style={{
                      borderColor:
                        cd <= 0
                          ? 'rgba(255,90,90,0.9)'
                          : 'rgba(255,255,255,0.25)',
                      background:
                        cd <= 0
                          ? 'rgba(255,90,90,0.85)'
                          : 'rgba(255,255,255,0.12)',
                      boxShadow:
                        cd <= 0 ? '0 0 8px rgba(255,90,90,0.7)' : 'none',
                    }}
                  >
                    {cd > 0 && (
                      <span
                        className='absolute bottom-0 left-0 w-full bg-[#46e8a0]'
                        style={{ height: `${(1 - cd / RELOAD) * 100}%` }}
                      />
                    )}
                  </span>
                ))}
              </span>
              <span
                className={`text-[18px] font-bold leading-none tabular-nums ${
                  low ? 'text-[#ff7a7a]' : 'text-[#7fe0c0]'
                }`}
              >
                {tx.time} {fmtTime(timeLeft)}
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
          <div className='dc-in absolute inset-0 flex flex-col items-center justify-center gap-5 bg-black/35 px-6 text-center'>
            <p className='text-[12px] font-bold uppercase tracking-[0.18em] text-white/55'>
              {tx.title}
            </p>
            <button
              type='button'
              onClick={() => startRef.current()}
              className='dc-cta rounded-full bg-white px-9 py-3 text-[15px] font-bold text-[#121212]'
            >
              {tx.start}
            </button>
            <p className='max-w-[320px] text-[13px] leading-relaxed text-white/55'>
              {tx.how}
            </p>
          </div>
        )}

        {phase === 'over' && (
          <div className='dc-in absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/45 px-6 text-center'>
            <p className='text-[13px] font-bold uppercase tracking-[0.18em] text-white/55'>
              {tx.over}
            </p>
            <span className='text-[64px] font-extrabold leading-none text-white'>
              {score}
            </span>
            <span className='rounded-full bg-white/10 px-4 py-1 text-[13px] font-medium text-white/70'>
              {tx.best} {best}
            </span>
            <button
              type='button'
              onClick={() => startRef.current()}
              className='dc-cta mt-1 rounded-full bg-white px-9 py-3 text-[15px] font-bold text-[#121212]'
            >
              {tx.again}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes dcIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .dc-in { animation: dcIn .28s cubic-bezier(0.23,1,0.32,1); }
        .dc-cta { transition: transform .15s cubic-bezier(0.23,1,0.32,1); }
        .dc-cta:hover { transform: translateY(-2px); }
        .dc-cta:active { transform: scale(.97); }
        @media (prefers-reduced-motion: reduce) { .dc-in { animation: none; } .dc-cta { transition: none; } }
      `}</style>
    </div>
  );
}

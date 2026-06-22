'use client';

import { useEffect, useRef, useState } from 'react';

import type { Locale } from '@/lib/dict';

/* Dodge Arena — ported from kimi.com/share/d2v302367ticohdlm39g. Core logic kept; visuals upgraded to the aihues aesthetic. */

type Phase = 'idle' | 'playing' | 'over';
type BallType = 'n' | 'f' | 's';
type SkillId = 1 | 2 | 3;

const BEST_KEY = 'aihues_dodge-arena_best';

const BALL_COLORS: Record<BallType, { core: string; glow: string }> = {
  n: { core: '#46e8a0', glow: 'rgba(70,232,160,0.85)' },
  f: { core: '#ff6b6b', glow: 'rgba(255,107,107,0.9)' },
  s: { core: '#b08bff', glow: 'rgba(176,139,255,0.9)' },
};

interface Ball {
  x: number;
  y: number;
  r: number;
  baseSp: number;
  type: BallType;
  trail: { x: number; y: number }[];
}
interface Heart {
  x: number;
  y: number;
  r: number;
  sp: number;
}
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  r: number;
  c: string;
}
interface Skills {
  cd1: number;
  cd2: number;
  cd3: number;
  slow: number;
  small: number;
}
interface DGame {
  W: number;
  H: number;
  player: { x: number; y: number; r: number; inv: number; life: number };
  pointerX: number;
  balls: Ball[];
  hearts: Heart[];
  particles: Particle[];
  skills: Skills;
  vacuum: number;
  lastMake: number;
  lastHeart: number;
  t: number;
  score: number;
  flash: number;
}

/* cooldowns / durations are expressed in 60fps frames, matching the source */
const CD = { s1: 600, s2: 360, s3: 600 } as const;
const DUR = { vacuum: 120, slow: 180, small: 300, inv: 90 } as const;
const PLAYER_R = 18;
const PLAYER_R_SMALL = 12;

const diff = (t: number) => ({
  baseSp: 2 + t * 0.01,
  baseInt: Math.max(0.4, 1.2 - t * 0.02),
  baseR: 8 + Math.min(6, t * 0.2),
});

const T = {
  en: {
    score: 'Score',
    best: 'Best',
    hp: 'HP',
    ready: 'Dodge the incoming orbs',
    hint: 'Drag to move · Space / 1·2·3 for skills',
    start: 'Start',
    again: 'Play again',
    skills: { 1: 'Clear', 2: 'Slow', 3: 'Shrink' } as Record<SkillId, string>,
    timeUnit: 's',
  },
  zh: {
    score: '得分',
    best: '最高',
    hp: '生命',
    ready: '躲开飞来的光球',
    hint: '拖动移动 · 空格 / 1·2·3 放技能',
    start: '开始',
    again: '再来一局',
    skills: { 1: '清屏', 2: '减速', 3: '缩小' } as Record<SkillId, string>,
    timeUnit: '秒',
  },
} as const;

export default function DodgeArenaGame({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const tx = T[zh ? 'zh' : 'en'];

  const fieldRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gRef = useRef<DGame | null>(null);
  const rafRef = useRef(0);
  const phaseRef = useRef<Phase>('idle');
  const bestRef = useRef(0);
  const startRef = useRef<() => void>(() => {});
  const skillRef = useRef<(id: SkillId) => void>(() => {});

  const [phase, setPhase] = useState<Phase>('idle');
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    if (typeof window === 'undefined') return 0;
    return Number(window.localStorage.getItem(BEST_KEY) || 0) || 0;
  });
  const [life, setLife] = useState(3);
  const [time, setTime] = useState(0);
  const [cool, setCool] = useState({ cd1: 0, cd2: 0, cd3: 0 });

  useEffect(() => {
    bestRef.current = best;
  }, [best]);

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
        g.player.y = h - 80;
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
        player: { x: w / 2, y: h - 80, r: PLAYER_R, inv: 0, life: 3 },
        pointerX: w / 2,
        balls: [],
        hearts: [],
        particles: [],
        skills: { cd1: 0, cd2: 0, cd3: 0, slow: 0, small: 0 },
        vacuum: 0,
        lastMake: 0,
        lastHeart: 0,
        t: 0,
        score: 0,
        flash: 0,
      };
      setScore(0);
      setLife(3);
      setTime(0);
      setCool({ cd1: 0, cd2: 0, cd3: 0 });
    };

    const spawnBall = (t: number): Ball => {
      const g = gRef.current!;
      const d = diff(t);
      const r = 6 + Math.random() * (d.baseR - 6);
      let baseSp = d.baseSp + Math.random() * 1.5;
      const roll = Math.random();
      const type: BallType =
        roll < 0.75 ? 'n' : Math.random() < 0.6 ? 'f' : 's';
      if (type === 'f') baseSp *= 1.3;
      return {
        x: Math.random() * (g.W - 2 * r) + r,
        y: -r,
        r,
        baseSp,
        type,
        trail: [],
      };
    };

    const makeBalls = (t: number) => {
      const g = gRef.current!;
      if (g.vacuum > 0) return;
      const d = diff(t);
      if (t - g.lastMake < d.baseInt) return;
      g.lastMake = t;
      const gap = 80 + Math.min(120, t * 3);
      const left = Math.random() * (g.W - gap);
      const right = left + gap;
      const count = 2 + Math.floor(t / 12);
      for (let i = 0; i < count; i++) {
        const o = spawnBall(t);
        while (o.x - o.r < right && o.x + o.r > left && Math.random() < 0.9) {
          o.x = Math.random() * (g.W - 2 * o.r) + o.r;
        }
        g.balls.push(o);
      }
    };

    const makeHeart = (t: number) => {
      const g = gRef.current!;
      if (g.vacuum > 0) return;
      if (t - g.lastHeart < 5) return;
      if (Math.random() < 0.0015) {
        g.hearts.push({
          x: Math.random() * (g.W - 28) + 14,
          y: -14,
          r: 14,
          sp: 2,
        });
        g.lastHeart = t;
      }
    };

    const burst = (x: number, y: number, c: string, n: number) => {
      const g = gRef.current!;
      for (let i = 0; i < n; i++)
        g.particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          life: 1,
          r: Math.random() * 3 + 1,
          c,
        });
    };

    const endGame = () => {
      const g = gRef.current!;
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

    const useSkill = (id: SkillId) => {
      const g = gRef.current;
      if (!g || phaseRef.current !== 'playing') return;
      const s = g.skills;
      if (id === 1 && s.cd1 === 0) {
        for (const o of g.balls) burst(o.x, o.y, BALL_COLORS[o.type].core, 6);
        g.balls.length = 0;
        g.hearts.length = 0;
        g.score += 5;
        setScore(g.score);
        g.vacuum = DUR.vacuum;
        s.cd1 = CD.s1;
      } else if (id === 2 && s.cd2 === 0) {
        s.slow = DUR.slow;
        s.cd2 = CD.s2;
      } else if (id === 3 && s.cd3 === 0) {
        s.small = DUR.small;
        s.cd3 = CD.s3;
      }
      setCool({ cd1: s.cd1, cd2: s.cd2, cd3: s.cd3 });
    };
    skillRef.current = useSkill;

    const update = (dt: number) => {
      const g = gRef.current;
      if (!g) return;
      g.t += dt / 60;
      const t = g.t;
      const p = g.player;
      const s = g.skills;

      p.x += (g.pointerX - p.x) * Math.min(1, 0.12 * dt);
      p.x = Math.max(p.r, Math.min(g.W - p.r, p.x));
      p.inv = Math.max(0, p.inv - dt);
      if (g.vacuum > 0) g.vacuum = Math.max(0, g.vacuum - dt);
      if (g.flash > 0) g.flash = Math.max(0, g.flash - dt);

      const before = { cd1: s.cd1, cd2: s.cd2, cd3: s.cd3 };
      s.cd1 = Math.max(0, s.cd1 - dt);
      s.cd2 = Math.max(0, s.cd2 - dt);
      s.cd3 = Math.max(0, s.cd3 - dt);
      s.slow = Math.max(0, s.slow - dt);
      s.small = Math.max(0, s.small - dt);
      if (
        (before.cd1 > 0 && s.cd1 === 0) ||
        (before.cd2 > 0 && s.cd2 === 0) ||
        (before.cd3 > 0 && s.cd3 === 0)
      )
        setCool({ cd1: s.cd1, cd2: s.cd2, cd3: s.cd3 });

      const rate = s.slow > 0 ? 0.4 : 1;
      p.r = s.small > 0 ? PLAYER_R_SMALL : PLAYER_R;

      makeBalls(t);
      for (let i = g.balls.length - 1; i >= 0; i--) {
        const o = g.balls[i];
        o.trail.push({ x: o.x, y: o.y });
        if (o.trail.length > 6) o.trail.shift();
        o.y += o.baseSp * rate * dt;
        const dx = o.x - p.x;
        const dy = o.y - p.y;
        if (Math.hypot(dx, dy) < o.r + p.r && p.inv === 0) {
          p.life--;
          p.inv = DUR.inv;
          g.flash = 18;
          burst(p.x, p.y, '#ffd24a', 16);
          setLife(p.life);
          if (p.life <= 0) {
            endGame();
            return;
          }
        }
        if (o.y > g.H + o.r) {
          g.balls.splice(i, 1);
          g.score += 10;
        }
      }
      setScore(g.score);

      makeHeart(t);
      for (let i = g.hearts.length - 1; i >= 0; i--) {
        const h = g.hearts[i];
        h.y += h.sp * dt;
        const dx = h.x - p.x;
        const dy = h.y - p.y;
        if (Math.hypot(dx, dy) < h.r + p.r) {
          p.life++;
          burst(h.x, h.y, '#ff6b9d', 12);
          g.hearts.splice(i, 1);
          g.score += 3;
          setLife(p.life);
        } else if (h.y > g.H + h.r) {
          g.hearts.splice(i, 1);
        }
      }

      setTime(Math.floor(t));
    };

    const drawBall = (o: Ball) => {
      const col = BALL_COLORS[o.type];
      for (let j = 0; j < o.trail.length; j++) {
        const tp = o.trail[j];
        ctx.globalAlpha = ((j + 1) / o.trail.length) * 0.32;
        ctx.fillStyle = col.core;
        ctx.beginPath();
        ctx.arc(
          tp.x,
          tp.y,
          o.r * (0.4 + 0.5 * (j / o.trail.length)),
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.save();
      ctx.shadowColor = col.glow;
      ctx.shadowBlur = 16;
      const gr = ctx.createRadialGradient(
        o.x - o.r * 0.3,
        o.y - o.r * 0.3,
        1,
        o.x,
        o.y,
        o.r
      );
      gr.addColorStop(0, '#ffffff');
      gr.addColorStop(0.4, col.core);
      gr.addColorStop(1, col.core);
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      const g = gRef.current;
      if (!g) return;
      const { W, H } = g;
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#16172b');
      bg.addColorStop(1, '#0b0c18');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      if (g.vacuum > 0) {
        ctx.globalAlpha = 0.18 * (g.vacuum / DUR.vacuum);
        ctx.fillStyle = '#7cdcff';
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;
      }

      for (const h of g.hearts) {
        ctx.save();
        ctx.shadowColor = 'rgba(255,107,157,0.9)';
        ctx.shadowBlur = 16;
        ctx.fillStyle = '#ff6b9d';
        ctx.beginPath();
        const r = h.r;
        ctx.fillRect(h.x - r * 0.3, h.y - r * 0.6, r * 0.6, r * 1.2);
        ctx.fillRect(h.x - r * 0.6, h.y - r * 0.3, r * 1.2, r * 0.6);
        ctx.restore();
      }

      for (const o of g.balls) drawBall(o);

      const p = g.player;
      const inv = p.inv > 0;
      ctx.globalAlpha = inv ? 0.45 + 0.45 * Math.sin(g.t * 30) : 1;
      ctx.save();
      ctx.shadowColor = 'rgba(255,215,0,0.9)';
      ctx.shadowBlur = 22;
      const pg = ctx.createRadialGradient(
        p.x - p.r * 0.3,
        p.y - p.r * 0.3,
        1,
        p.x,
        p.y,
        p.r
      );
      pg.addColorStop(0, '#fff7cf');
      pg.addColorStop(1, '#ffce2e');
      ctx.fillStyle = pg;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.globalAlpha = 1;

      for (const pt of g.particles) {
        ctx.globalAlpha = Math.max(0, pt.life);
        ctx.fillStyle = pt.c;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (g.flash > 0) {
        ctx.fillStyle = `rgba(255,80,80,${0.32 * (g.flash / 18)})`;
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

    const pointerFromEvent = (e: PointerEvent) => {
      const g = gRef.current;
      if (!g) return;
      const rect = canvas.getBoundingClientRect();
      g.pointerX = e.clientX - rect.left;
    };
    let dragging = false;
    const onDown = (e: PointerEvent) => {
      if (phaseRef.current !== 'playing') return;
      dragging = true;
      canvas.setPointerCapture?.(e.pointerId);
      pointerFromEvent(e);
    };
    const onMove = (e: PointerEvent) => {
      if (dragging) pointerFromEvent(e);
    };
    const onUp = () => {
      dragging = false;
    };
    const onKey = (e: KeyboardEvent) => {
      if (phaseRef.current !== 'playing') return;
      if (e.code === 'Digit1' || e.code === 'Space') {
        e.preventDefault();
        skillRef.current(1);
      } else if (e.code === 'Digit2') {
        e.preventDefault();
        skillRef.current(2);
      } else if (e.code === 'Digit3') {
        e.preventDefault();
        skillRef.current(3);
      }
    };
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('keydown', onKey);
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const skillMeta: { id: SkillId; cd: number; max: number }[] = [
    { id: 1, cd: cool.cd1, max: CD.s1 },
    { id: 2, cd: cool.cd2, max: CD.s2 },
    { id: 3, cd: cool.cd3, max: CD.s3 },
  ];

  return (
    <div className='relative flex min-h-[480px] w-full flex-col touch-none select-none'>
      <div className='mx-auto flex h-[52px] w-full max-w-[560px] shrink-0 items-center justify-between px-1 text-white'>
        {phase === 'playing' ? (
          <>
            <span className='flex items-baseline gap-1.5'>
              <span className='text-[26px] font-bold leading-none text-white/90 tabular-nums'>
                {score}
              </span>
              <span className='text-[12px] font-medium uppercase tracking-wide text-white/45'>
                {tx.score}
              </span>
            </span>
            <span className='flex items-center gap-2'>
              <span className='tabular-nums rounded-full bg-white/10 px-3 py-1 text-[13px] font-medium text-white/70'>
                {time}
                {tx.timeUnit}
              </span>
              <span className='tabular-nums rounded-full bg-white/10 px-3 py-1 text-[13px] font-medium text-white/70'>
                {tx.best} {best}
              </span>
            </span>
          </>
        ) : null}
      </div>

      {phase === 'playing' ? (
        <div className='mx-auto mb-2 flex w-full max-w-[560px] shrink-0 items-center gap-2 px-1'>
          <span className='text-[11px] font-medium uppercase tracking-wide text-white/45'>
            {tx.hp}
          </span>
          <div className='h-2.5 flex-1 overflow-hidden rounded-full bg-white/10'>
            <div
              className='da-hp h-full rounded-full'
              style={{
                width: `${Math.min(100, (Math.max(0, life) / 5) * 100)}%`,
              }}
            />
          </div>
          <span className='text-[13px] tabular-nums text-white/80'>
            {Math.max(0, life)}
          </span>
        </div>
      ) : null}

      <div
        ref={fieldRef}
        className='relative min-h-0 flex-1 overflow-hidden rounded-[18px]'
      >
        <canvas ref={canvasRef} className='absolute inset-0 h-full w-full' />

        {phase === 'playing' ? (
          <div className='absolute inset-x-0 bottom-3 flex items-center justify-center gap-2.5 px-3'>
            {skillMeta.map(({ id, cd, max }) => {
              const ready = cd === 0;
              return (
                <button
                  key={id}
                  type='button'
                  onPointerDown={(e) => {
                    e.preventDefault();
                    skillRef.current(id);
                  }}
                  className={`da-skill relative w-[30%] max-w-[120px] overflow-hidden rounded-full px-2 py-2 text-[13px] font-semibold transition-colors ${
                    ready
                      ? 'bg-white/15 text-white hover:bg-white/25'
                      : 'bg-white/5 text-white/40'
                  }`}
                >
                  {!ready && (
                    <span
                      className='absolute inset-y-0 left-0 bg-white/10'
                      style={{ width: `${(cd / max) * 100}%` }}
                    />
                  )}
                  <span className='relative'>{tx.skills[id]}</span>
                </button>
              );
            })}
          </div>
        ) : null}

        {phase === 'idle' && (
          <div className='da-in absolute inset-0 flex flex-col items-center justify-center gap-5 bg-black/35 px-6 text-center'>
            <p className='text-[12px] font-bold uppercase tracking-[0.18em] text-white/55'>
              {tx.ready}
            </p>
            <button
              type='button'
              onClick={() => startRef.current()}
              className='da-cta rounded-full bg-white px-9 py-3 text-[15px] font-bold text-[#121212]'
            >
              {tx.start}
            </button>
            <p className='text-[13px] text-white/55'>{tx.hint}</p>
          </div>
        )}

        {phase === 'over' && (
          <div className='da-in absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/45 px-6 text-center'>
            <span className='text-[64px] font-extrabold leading-none text-white'>
              {score}
            </span>
            <span className='rounded-full bg-white/10 px-4 py-1 text-[13px] font-medium text-white/70'>
              {tx.best} {best}
            </span>
            <button
              type='button'
              onClick={() => startRef.current()}
              className='da-cta mt-1 rounded-full bg-white px-9 py-3 text-[15px] font-bold text-[#121212]'
            >
              {tx.again}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes daIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .da-in { animation: daIn .28s cubic-bezier(0.23,1,0.32,1); }
        .da-cta { transition: transform .15s cubic-bezier(0.23,1,0.32,1); }
        .da-cta:hover { transform: translateY(-2px); }
        .da-cta:active { transform: scale(.97); }
        .da-skill:active { transform: scale(.96); }
        .da-hp { background: linear-gradient(90deg, #ff6b9d, #ffce2e); transition: width .2s ease; }
        @media (prefers-reduced-motion: reduce) { .da-in { animation: none; } .da-cta, .da-skill, .da-hp { transition: none; } }
      `}</style>
    </div>
  );
}

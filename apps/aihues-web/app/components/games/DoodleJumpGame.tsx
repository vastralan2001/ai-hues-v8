'use client';

import { useEffect, useRef, useState } from 'react';

import type { Locale } from '@/lib/dict';

/* ──────────────────────────────────────────────────────────────
   Doodle Jump — Kimi edition.
   The original game logic (platform generation, physics, hazard &
   death rules) is preserved exactly. Only the rendering is enriched:
   parallax twinkling starfield, nebula depth, a drifting moon,
   glossy rounded ledges, burst particles and a squash-&-stretch
   Kimi blue-ball character. Rendered natively in-page (no iframe).
   ────────────────────────────────────────────────────────────── */

type Difficulty = 'easy' | 'medium' | 'hard';
type Phase = 'start' | 'playing' | 'over';

const MAX_JUMP_HEIGHT = 200;

interface Cfg {
  g: number;
  maxGap: number;
  width: number;
  density: number;
  spikeW: number;
}
const CFG: Record<Difficulty, Cfg> = {
  easy: { g: 0.35, maxGap: 175, width: 130, density: 14, spikeW: 80 },
  medium: { g: 0.4, maxGap: 185, width: 110, density: 12, spikeW: 100 },
  hard: { g: 0.45, maxGap: 195, width: 90, density: 10, spikeW: 120 },
};
const calcJumpVelocity = (g: number) => -Math.sqrt(2 * g * MAX_JUMP_HEIGHT);

// platform attribute bits (unchanged from the original)
const NORMAL = 0;
const FRAGILE = 1;
const MOVING = 2;
const SPRING = 4;
const SPIKE = 8;

function randomType(prevSpring: boolean): number {
  let t = NORMAL;
  if (Math.random() < 0.25) {
    if (Math.random() < 0.3) t |= FRAGILE;
    if (Math.random() < 0.3) t |= MOVING;
    if (Math.random() < 0.2) t |= SPRING;
  } else if (prevSpring) {
    t = SPIKE;
    if (Math.random() < 0.5) t |= MOVING;
  }
  return t;
}

function getColor(type: number): string {
  if (type === NORMAL) return '#8B4513';
  if (type === FRAGILE) return '#F06292';
  if (type === MOVING) return '#42A5F5';
  if (type === SPRING) return '#FF9800';
  if (type === SPIKE) return '#B71C1C';
  if (type === (FRAGILE | MOVING)) return '#AB47BC';
  if (type === (FRAGILE | SPRING)) return '#FFA726';
  if (type === (MOVING | SPRING)) return '#66BB6A';
  if (type === (MOVING | SPIKE)) return '#26C6DA';
  if (type === (FRAGILE | MOVING | SPRING)) return '#EC407A';
  return '#8B4513';
}

interface Platform {
  x: number;
  y: number;
  w: number;
  h: number;
  type: number;
  vx: number;
  color: string;
}
interface Star {
  x: number;
  y: number;
  r: number;
  alpha: number;
  tw: number;
}
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}
interface Player {
  x: number;
  y: number;
  w: number;
  h: number;
  vy: number;
  vx: number;
}
interface Game {
  w: number;
  h: number;
  dpr: number;
  G: number;
  JUMP: number;
  MAX_GAP: number;
  WIDTH: number;
  DENSITY: number;
  SPIKE_W: number;
  player: Player;
  platforms: Platform[];
  stars: Star[];
  particles: Particle[];
  cameraY: number;
  score: number;
  lastSpring: boolean;
  tick: number;
}

const TXT = {
  en: {
    title: 'Doodle Jump',
    tagline: 'Hop from ledge to ledge — how high can you climb?',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    height: 'Height',
    best: 'Best',
    over: 'Game Over',
    again: 'Jump again',
    hintKeys: '← → or A / D to steer',
    hintTouch: 'Drag left / right to steer',
    m: 'm',
  },
  zh: {
    title: 'Doodle Jump',
    tagline: '在平台间不断跳跃,看你能跳多高?',
    easy: '简单',
    medium: '中等',
    hard: '困难',
    height: '高度',
    best: '最佳',
    over: '游戏结束',
    again: '再跳一次',
    hintKeys: '← → 或 A / D 控制方向',
    hintTouch: '左右拖动控制方向',
    m: '米',
  },
} as const;

export default function DoodleJumpGame({ locale }: { locale: Locale }) {
  const tx = TXT[locale === 'zh' ? 'zh' : 'en'];
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gRef = useRef<Game | null>(null);
  const rafRef = useRef<number>(0);
  const phaseRef = useRef<Phase>('start');
  const keysRef = useRef<Record<string, boolean>>({});
  const touchRef = useRef<{ active: boolean; lastX: number }>({
    active: false,
    lastX: 0,
  });

  const [phase, setPhase] = useState<Phase>('start');
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const v = Number(localStorage.getItem('aihues_doodle_best') || '0');
      if (!Number.isNaN(v)) setBest(v);
      setIsTouch(window.matchMedia('(pointer: coarse)').matches);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  function setPhaseBoth(p: Phase) {
    phaseRef.current = p;
    setPhase(p);
  }

  function initStars(g: Game) {
    g.stars = [];
    for (let i = 0; i < 150; i++) {
      g.stars.push({
        x: Math.random() * g.w,
        y: Math.random() * g.h * 2,
        r: Math.random() * 1.4 + 0.3,
        alpha: 0.3 + Math.random() * 0.7,
        tw: Math.random() * Math.PI * 2,
      });
    }
  }

  function makePlatform(
    x: number,
    y: number,
    w: number,
    type: number
  ): Platform {
    return {
      x,
      y,
      w,
      h: 15,
      type,
      vx:
        type & MOVING
          ? (Math.random() < 0.5 ? 1 : -1) * (0.8 + Math.random() * 0.4)
          : 0,
      color: getColor(type),
    };
  }

  function initPlatforms(g: Game) {
    g.platforms = [];
    g.platforms.push(
      makePlatform(
        g.w / 2 - (g.WIDTH * 1.2) / 2,
        g.h - 100,
        g.WIDTH * 1.2,
        NORMAL
      )
    );
    let lastY = g.h - 100;
    let lastSpring = false;
    for (let i = 0; i < 15; i++) {
      lastY -= 100 + Math.random() * (g.MAX_GAP - 100);
      const type = randomType(lastSpring);
      const isSpike = Boolean(type & SPIKE);
      const w = isSpike ? g.SPIKE_W : g.WIDTH;
      g.platforms.push(makePlatform(Math.random() * (g.w - w), lastY, w, type));
      lastSpring = Boolean(type & SPRING);
    }
    g.lastSpring = lastSpring;
  }

  function resetGame(g: Game, d: Difficulty) {
    const c = CFG[d];
    g.G = c.g;
    g.MAX_GAP = c.maxGap;
    g.WIDTH = c.width;
    g.DENSITY = c.density;
    g.SPIKE_W = c.spikeW;
    g.JUMP = calcJumpVelocity(c.g);
    g.player = { x: g.w / 2, y: g.h - 150, w: 50, h: 50, vy: 0, vx: 0 };
    g.cameraY = 0;
    g.score = 0;
    g.lastSpring = false;
    g.particles = [];
    initStars(g);
    initPlatforms(g);
  }

  function endGame(g: Game) {
    if (phaseRef.current !== 'playing') return;
    let stored = 0;
    try {
      stored = Number(localStorage.getItem('aihues_doodle_best') || '0') || 0;
    } catch {
      stored = 0;
    }
    if (g.score > stored) {
      try {
        localStorage.setItem('aihues_doodle_best', String(g.score));
      } catch {
        /* ignore */
      }
      setBest(g.score);
    } else {
      setBest(stored);
    }
    setPhaseBoth('over');
  }

  /* ── update — original mechanics preserved exactly ── */
  function update(g: Game) {
    if (phaseRef.current !== 'playing') return;
    const p = g.player;
    const k = keysRef.current;

    p.vy += g.G;
    if (!touchRef.current.active) p.vx *= 0.98;
    if (k['ArrowLeft'] || k['a'] || k['A']) p.vx -= 0.5;
    if (k['ArrowRight'] || k['d'] || k['D']) p.vx += 0.5;
    p.vx = Math.max(-6, Math.min(6, p.vx));

    p.y += p.vy;
    p.x += p.vx;
    if (p.x < -p.w) p.x = g.w;
    if (p.x > g.w) p.x = -p.w;

    for (const pl of g.platforms) {
      if (pl.type & MOVING) {
        pl.x += pl.vx;
        if (pl.x <= 0 || pl.x + pl.w >= g.w) pl.vx *= -1;
      }
    }

    for (let i = g.platforms.length - 1; i >= 0; i--) {
      const pl = g.platforms[i];
      // cull platforms that have scrolled below the viewport — the camera is
      // up-only, so they can never be reached again. Keeps the array (and the
      // per-frame collision loop) bounded, preventing slowdown over time.
      if (pl.y > g.cameraY + g.h + 80) {
        g.platforms.splice(i, 1);
        continue;
      }
      if (
        !(
          p.vy > 0 &&
          p.y + p.h > pl.y &&
          p.y + p.h < pl.y + pl.h + 10 &&
          p.x + p.w > pl.x &&
          p.x < pl.x + pl.w
        )
      )
        continue;
      if (pl.type & SPIKE) {
        spawnBurst(g, p.x + p.w / 2, pl.y, '#ff5a5a', 26, 5);
        endGame(g);
        return;
      }
      const mult = pl.type & SPRING ? 1.4 : 1;
      p.vy = g.JUMP * mult;
      if (pl.type & SPRING)
        spawnBurst(g, p.x + p.w / 2, pl.y, '#ffca5a', 16, 4);
      else spawnBurst(g, p.x + p.w / 2, pl.y, 'rgba(255,255,255,0.85)', 7, 2.4);
      const hgt = Math.max(0, Math.floor((g.h - p.y) / 10));
      if (hgt > g.score) {
        g.score = hgt;
        setScore(hgt);
      }
      if (pl.type & FRAGILE) {
        spawnBurst(g, pl.x + pl.w / 2, pl.y, pl.color, 16, 3.2);
        g.platforms.splice(i, 1);
      }
    }

    // camera follows upward only — never rubber-bands down on a fall
    if (p.y - g.h / 2 < g.cameraY) g.cameraY = p.y - g.h / 2;

    const addSafePlatform = (
      spikeY: number,
      spikeX: number,
      spikeW: number
    ) => {
      const safeW = g.WIDTH + 40;
      const leftSpace = spikeX - 50;
      const rightSpace = g.w - (spikeX + spikeW + 50);
      if (leftSpace >= safeW) {
        g.platforms.push(
          makePlatform(
            Math.random() * (leftSpace - safeW) + 25,
            spikeY,
            safeW,
            NORMAL
          )
        );
      } else if (rightSpace >= safeW) {
        g.platforms.push(
          makePlatform(
            spikeX + spikeW + 25 + Math.random() * (rightSpace - safeW),
            spikeY,
            safeW,
            NORMAL
          )
        );
      }
    };

    const visible = g.platforms.filter(
      (pl) => pl.y > g.cameraY - 300 && pl.y < g.cameraY + g.h + 300
    );
    if (visible.length < g.DENSITY) {
      const highest = g.platforms.length
        ? g.platforms.reduce((a, b) => (b.y < a.y ? b : a))
        : ({ y: g.h - 100, type: 0 } as Platform);
      const gap = 100 + Math.random() * (g.MAX_GAP - 100);
      const nextY = highest.y - gap;
      const type = randomType(Boolean(highest.type & SPRING));
      const isSpike = Boolean(type & SPIKE);
      const w = isSpike ? g.SPIKE_W : g.WIDTH;
      const nextX = Math.random() * (g.w - w);
      g.platforms.push(makePlatform(nextX, nextY, w, type));
      if (isSpike) addSafePlatform(nextY, nextX, w);
    }

    // fall death — once the ball drops below the visible screen, it's gone
    if (p.y > g.cameraY + g.h) endGame(g);
  }

  /* ── draw — enriched starfield + particles ── */
  function draw(g: Game, ctx: CanvasRenderingContext2D) {
    const { w, h } = g;
    g.tick++;

    // deep night sky
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#080b12');
    grad.addColorStop(0.55, '#0d1117');
    grad.addColorStop(1, '#161b22');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // nebula depth (soft, gently drifts with altitude)
    const drift = (-g.cameraY * 0.04) % (h * 1.5);
    softGlow(
      ctx,
      w * 0.24,
      h * 0.32 + drift * 0.2,
      w * 0.7,
      'rgba(56,104,196,0.16)'
    );
    softGlow(
      ctx,
      w * 0.82,
      h * 0.66 - drift * 0.15,
      w * 0.6,
      'rgba(140,92,196,0.13)'
    );

    // twinkling parallax starfield — wraps infinitely so stars never run out
    const period = g.h * 2;
    for (const s of g.stars) {
      const tw = 0.4 + 0.6 * Math.sin(g.tick * 0.05 + s.tw);
      let sy = (s.y - g.cameraY * 0.5) % period;
      if (sy < 0) sy += period;
      ctx.fillStyle = `rgba(255,255,255,${(s.alpha * tw).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(s.x, sy, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // moon — a distant body on a slow parallax that recurs through the sky,
    // so it drifts naturally as you climb (never pinned at a fixed height)
    const moonX = w * 0.72;
    const moonPeriod = h * 4;
    const moonY =
      (((h * 0.15 - g.cameraY * 0.32) % moonPeriod) + moonPeriod) % moonPeriod;
    if (moonY > -70 && moonY < h + 70) {
      softGlow(ctx, moonX, moonY, 122, 'rgba(214,226,245,0.22)');
      const mg = ctx.createRadialGradient(
        moonX - 16,
        moonY - 16,
        6,
        moonX,
        moonY,
        52
      );
      mg.addColorStop(0, '#fcfdff');
      mg.addColorStop(0.65, '#e1e8f3');
      mg.addColorStop(1, '#b7c1d6');
      ctx.fillStyle = mg;
      ctx.beginPath();
      ctx.arc(moonX, moonY, 46, 0, Math.PI * 2);
      ctx.fill();
      const craters: [number, number, number][] = [
        [-15, -9, 8],
        [16, 7, 6],
        [1, 18, 5],
        [-9, 15, 3.5],
        [19, -13, 3.5],
      ];
      for (const [cx, cy, cr] of craters) {
        ctx.fillStyle = 'rgba(148,158,182,0.4)';
        ctx.beginPath();
        ctx.arc(moonX + cx, moonY + cy, cr, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.45)';
        ctx.beginPath();
        ctx.arc(
          moonX + cx - cr * 0.3,
          moonY + cy - cr * 0.3,
          cr * 0.55,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }

    // occasional shooting star
    const ss = g.tick % 420;
    if (ss < 26) {
      const t = ss / 26;
      const sx = w * 0.12 + t * w * 0.7;
      const sy = h * 0.14 + t * h * 0.22;
      ctx.strokeStyle = `rgba(255,255,255,${(1 - t) * 0.7})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx - 30, sy - 12);
      ctx.stroke();
    }

    // world (camera-translated)
    ctx.save();
    ctx.translate(0, -g.cameraY);
    for (const pl of g.platforms) drawPlatform(ctx, pl);

    stepParticles(g);
    for (const pt of g.particles) {
      ctx.globalAlpha = Math.max(0, Math.min(1, pt.life));
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    drawPlayer(ctx, g.player);
    ctx.restore();
  }

  function frame() {
    const g = gRef.current;
    const canvas = canvasRef.current;
    if (!g || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    update(g);
    ctx.save();
    ctx.scale(g.dpr, g.dpr);
    draw(g, ctx);
    ctx.restore();
    rafRef.current = requestAnimationFrame(frame);
  }

  /* ── sizing ── */
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    function sizeNow() {
      const wrapEl = wrapRef.current;
      const cv = canvasRef.current;
      if (!wrapEl || !cv) return;
      const rect = wrapEl.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(rect.width * dpr);
      cv.height = Math.round(rect.height * dpr);
      cv.style.width = `${rect.width}px`;
      cv.style.height = `${rect.height}px`;
      if (!gRef.current) {
        gRef.current = {
          w: rect.width,
          h: rect.height,
          dpr,
          G: CFG.medium.g,
          JUMP: calcJumpVelocity(CFG.medium.g),
          MAX_GAP: CFG.medium.maxGap,
          WIDTH: CFG.medium.width,
          DENSITY: CFG.medium.density,
          SPIKE_W: CFG.medium.spikeW,
          player: {
            x: rect.width / 2,
            y: rect.height - 150,
            w: 50,
            h: 50,
            vy: 0,
            vx: 0,
          },
          platforms: [],
          stars: [],
          particles: [],
          cameraY: 0,
          score: 0,
          lastSpring: false,
          tick: 0,
        };
        initStars(gRef.current);
      } else {
        gRef.current.w = rect.width;
        gRef.current.h = rect.height;
        gRef.current.dpr = dpr;
      }
    }
    sizeNow();
    const ro = new ResizeObserver(() => sizeNow());
    ro.observe(wrap);
    rafRef.current = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── input ── */
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
    };
    const up = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  function onPointerDown(e: React.PointerEvent) {
    touchRef.current = { active: true, lastX: e.clientX };
  }
  function onPointerMove(e: React.PointerEvent) {
    const g = gRef.current;
    if (!touchRef.current.active || !g || phaseRef.current !== 'playing')
      return;
    g.player.vx += (e.clientX - touchRef.current.lastX) * 0.15;
    touchRef.current.lastX = e.clientX;
  }
  function onPointerUp() {
    touchRef.current.active = false;
  }

  function start(d: Difficulty) {
    const g = gRef.current;
    if (!g) return;
    resetGame(g, d);
    setScore(0);
    setPhaseBoth('playing');
  }

  return (
    <div className='flex w-full justify-center'>
      <div
        ref={wrapRef}
        className='relative h-[min(80vh,780px)] w-full max-w-[440px] overflow-hidden rounded-[24px]'
      >
        <canvas
          ref={canvasRef}
          className='absolute inset-0 touch-none select-none'
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        />

        {(phase === 'playing' || phase === 'over') && (
          <div className='pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4'>
            <span className='text-[28px] font-extrabold leading-none text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]'>
              {score}
              <span className='ml-1 text-[14px] font-semibold opacity-80'>
                {tx.m}
              </span>
            </span>
            <span className='rounded-full bg-white/10 px-3 py-1 text-[12px] font-semibold text-white/85 backdrop-blur-sm'>
              {tx.best} {best}
              {tx.m}
            </span>
          </div>
        )}

        {phase === 'start' && (
          <div className='absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[rgba(8,11,18,0.4)] px-6 text-center backdrop-blur-[1px]'>
            <div className='flex items-center gap-3 text-[30px] font-extrabold tracking-tight text-white'>
              <span className='h-7 w-7 rounded-full bg-gradient-to-br from-[#81d4fa] to-[#29b6f6] shadow-[0_0_16px_rgba(41,182,246,0.8)]' />
              {tx.title}
            </div>
            <p className='max-w-[280px] text-[14px] leading-relaxed text-white/70'>
              {tx.tagline}
            </p>
            <div className='flex flex-wrap items-center justify-center gap-2.5'>
              <DiffBtn d='easy' label={tx.easy} onClick={start} />
              <DiffBtn d='medium' label={tx.medium} onClick={start} />
              <DiffBtn d='hard' label={tx.hard} onClick={start} />
            </div>
            <p className='text-[12px] text-white/55'>
              {isTouch ? tx.hintTouch : tx.hintKeys}
            </p>
          </div>
        )}

        {phase === 'over' && (
          <div className='absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[rgba(8,11,18,0.6)] px-6 text-center backdrop-blur-[2px]'>
            <div className='text-[24px] font-extrabold text-white'>
              {tx.over}
            </div>
            <div className='text-[48px] font-extrabold leading-none text-white'>
              {score}
              <span className='ml-1 text-[16px] font-semibold opacity-80'>
                {tx.m}
              </span>
            </div>
            <div className='mb-2 text-[13px] font-semibold text-white/60'>
              {tx.best} · {best}
              {tx.m}
            </div>
            <div className='flex flex-wrap items-center justify-center gap-2.5'>
              <DiffBtn d='easy' label={tx.easy} onClick={start} />
              <DiffBtn d='medium' label={tx.medium} onClick={start} />
              <DiffBtn d='hard' label={tx.hard} onClick={start} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── module-scope drawing + ui helpers ── */
const DIFF_DOT: Record<Difficulty, string> = {
  easy: '#5cb85c',
  medium: '#e0a32e',
  hard: '#d9534f',
};

function DiffBtn({
  d,
  label,
  onClick,
}: {
  d: Difficulty;
  label: string;
  onClick: (d: Difficulty) => void;
}) {
  return (
    <button
      type='button'
      onClick={() => onClick(d)}
      className='inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-[14px] font-bold text-white shadow-[0_8px_20px_-8px_rgba(194,80,46,0.8)] transition-all hover:-translate-y-0.5 hover:bg-accent-light active:translate-y-0'
    >
      <span
        className='h-2.5 w-2.5 rounded-full'
        style={{ background: DIFF_DOT[d] }}
      />
      {label}
    </button>
  );
}

const MOVING_BIT = MOVING;
const SPRING_BIT = SPRING;
const SPIKE_BIT = SPIKE;
const FRAGILE_BIT = FRAGILE;

function softGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string
) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, 'transparent');
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

function spawnBurst(
  g: Game,
  x: number,
  y: number,
  color: string,
  n: number,
  spread: number
) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = Math.random() * spread;
    g.particles.push({
      x,
      y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - 1,
      life: 0.7 + Math.random() * 0.5,
      color,
      size: 1.5 + Math.random() * 3,
    });
  }
  if (g.particles.length > 240) g.particles.splice(0, g.particles.length - 240);
}

function stepParticles(g: Game) {
  for (let i = g.particles.length - 1; i >= 0; i--) {
    const pt = g.particles[i];
    pt.vy += 0.12;
    pt.x += pt.vx;
    pt.y += pt.vy;
    pt.life -= 0.025;
    if (pt.life <= 0) g.particles.splice(i, 1);
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rr = Math.min(r, h / 2, w / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawPlayer(ctx: CanvasRenderingContext2D, player: Player) {
  ctx.save();
  ctx.translate(player.x + player.w / 2, player.y + player.h / 2);
  ctx.rotate(player.vx * 0.07);
  const sy = Math.max(0.82, Math.min(1.2, 1 - player.vy * 0.006));
  ctx.scale(1 / sy, sy);
  const r = 25;

  // soft outer glow
  softGlow(ctx, 0, 0, 42, 'rgba(70,185,255,0.42)');

  // glossy blue body
  const body = ctx.createRadialGradient(-7, -9, 3, 0, 3, r + 4);
  body.addColorStop(0, '#d6f0ff');
  body.addColorStop(0.45, '#6cc6f6');
  body.addColorStop(1, '#1f9be6');
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // lower rim light
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, r - 1, Math.PI * 1.05, Math.PI * 1.8);
  ctx.stroke();

  // top sheen
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.beginPath();
  ctx.ellipse(-8, -9, 7.5, 5, -0.5, 0, Math.PI * 2);
  ctx.fill();

  // blush
  ctx.fillStyle = 'rgba(255,128,150,0.32)';
  ctx.beginPath();
  ctx.arc(-13, 5, 4, 0, Math.PI * 2);
  ctx.arc(13, 5, 4, 0, Math.PI * 2);
  ctx.fill();

  // eyes (look toward movement) with shine
  const ex = Math.max(-2.4, Math.min(2.4, player.vx * 0.45));
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-7, -3, 6.4, 0, Math.PI * 2);
  ctx.arc(7, -3, 6.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0a2438';
  ctx.beginPath();
  ctx.arc(-7 + ex, -2.5, 3.4, 0, Math.PI * 2);
  ctx.arc(7 + ex, -2.5, 3.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.beginPath();
  ctx.arc(-8 + ex, -4, 1.3, 0, Math.PI * 2);
  ctx.arc(6 + ex, -4, 1.3, 0, Math.PI * 2);
  ctx.fill();

  // smile
  ctx.strokeStyle = '#0a557f';
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(0, 5, 6.5, 0.16 * Math.PI, 0.84 * Math.PI);
  ctx.stroke();

  ctx.restore();
}

function drawPlatform(ctx: CanvasRenderingContext2D, p: Platform) {
  // soft shadow
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  roundRect(ctx, p.x + 2, p.y + 3, p.w, p.h, 7);
  ctx.fill();
  // body
  ctx.fillStyle = p.color;
  roundRect(ctx, p.x, p.y, p.w, p.h, 7);
  ctx.fill();
  // glossy top highlight
  ctx.fillStyle = 'rgba(255,255,255,0.26)';
  roundRect(ctx, p.x + 2, p.y + 1.5, p.w - 4, p.h * 0.42, 5);
  ctx.fill();

  if (p.type & SPIKE_BIT) {
    ctx.fillStyle = '#FFEB3B';
    for (let i = 0; i < p.w; i += 15) {
      ctx.beginPath();
      ctx.moveTo(p.x + i + 7.5, p.y);
      ctx.lineTo(p.x + i, p.y - 10);
      ctx.lineTo(p.x + i + 15, p.y - 10);
      ctx.closePath();
      ctx.fill();
    }
  }
  if (p.type & FRAGILE_BIT) {
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(p.x + p.w * 0.42, p.y);
    ctx.lineTo(p.x + p.w * 0.5, p.y + p.h);
    ctx.moveTo(p.x + p.w * 0.64, p.y);
    ctx.lineTo(p.x + p.w * 0.58, p.y + p.h);
    ctx.stroke();
  }
  if (p.type & MOVING_BIT) {
    ctx.fillStyle = '#FFF';
    const cx = p.x + p.w / 2;
    const dir = p.vx >= 0 ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(cx + dir * 7, p.y + p.h / 2);
    ctx.lineTo(cx - dir * 4, p.y + p.h / 2 - 5);
    ctx.lineTo(cx - dir * 4, p.y + p.h / 2 + 5);
    ctx.closePath();
    ctx.fill();
  }
  if (p.type & SPRING_BIT) {
    const cx = p.x + p.w / 2;
    ctx.strokeStyle = '#FFD27A';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx - 7, p.y);
    ctx.lineTo(cx + 7, p.y - 5);
    ctx.lineTo(cx - 7, p.y - 10);
    ctx.lineTo(cx + 7, p.y - 14);
    ctx.stroke();
  }
}

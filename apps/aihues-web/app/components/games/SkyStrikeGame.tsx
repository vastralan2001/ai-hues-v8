'use client';

import { useEffect, useRef, useState } from 'react';

import type { Locale } from '@/lib/dict';

/* Sky Strike — ported from kimi.com/share/d1p9aedeik6gtjpr3mng. Core logic kept; visuals upgraded to the aihues aesthetic. */

type Phase = 'idle' | 'playing' | 'over';

const MAX_LIVES = 3;
const FIRE_INTERVAL = 11;
const BASE_SPAWN = 48;
const MIN_SPAWN = 18;
const SKILL_COOLDOWN = 600;
const BOSS_EVERY = 500;
const BEST_KEY = 'aihues_sky-strike_best';

interface Bullet {
  x: number;
  y: number;
  vy: number;
  r: number;
}
interface Enemy {
  x: number;
  y: number;
  w: number;
  h: number;
  vy: number;
  vx: number;
  hp: number;
  hue: number;
}
interface Boss {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  hp: number;
  maxHp: number;
  fireT: number;
}
interface Foe {
  x: number;
  y: number;
  vy: number;
  r: number;
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
interface Star {
  x: number;
  y: number;
  r: number;
  v: number;
  tw: number;
}
interface SGame {
  W: number;
  H: number;
  player: { x: number; y: number; w: number; h: number };
  bullets: Bullet[];
  enemies: Enemy[];
  foeShots: Foe[];
  boss: Boss | null;
  particles: Particle[];
  stars: Star[];
  score: number;
  lives: number;
  inv: number;
  fireT: number;
  spawnT: number;
  spawn: number;
  skill: number;
  bossAt: number;
  t: number;
}

const T = {
  en: {
    best: 'Best',
    title: 'Defend the void',
    how: 'Drag to fly · auto-fire · tap to unleash Nova',
    start: 'Start',
    again: 'Play again',
    skill: 'Nova',
    boss: 'BOSS',
  },
  zh: {
    best: '最高',
    title: '守卫星海',
    how: '拖动飞行 · 自动开火 · 点击释放新星',
    start: '开始',
    again: '再来一局',
    skill: '新星',
    boss: '首领',
  },
} as const;

export default function SkyStrikeGame({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const tx = T[zh ? 'zh' : 'en'];

  const fieldRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gRef = useRef<SGame | null>(null);
  const rafRef = useRef(0);
  const phaseRef = useRef<Phase>('idle');
  const bestRef = useRef(0);
  const startRef = useRef<() => void>(() => {});
  const skillRef = useRef<() => void>(() => {});

  const [phase, setPhase] = useState<Phase>('idle');
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [skillReady, setSkillReady] = useState(true);
  const [bossHp, setBossHp] = useState<number | null>(null);

  useEffect(() => {
    const b = Number(localStorage.getItem(BEST_KEY) || 0) || 0;
    bestRef.current = b;
    const id = requestAnimationFrame(() => setBest(b));
    return () => cancelAnimationFrame(id);
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
        g.player.y = h - g.player.h - Math.max(18, h * 0.04);
        g.player.x = Math.max(0, Math.min(w - g.player.w, g.player.x));
      }
    };
    const ro = new ResizeObserver(size);
    ro.observe(field);
    size();

    const makeStars = (w: number, h: number): Star[] =>
      Array.from({ length: 90 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5 + 0.3,
        v: Math.random() * 0.6 + 0.2,
        tw: Math.random() * Math.PI * 2,
      }));

    const reset = () => {
      const w = field.clientWidth;
      const h = field.clientHeight;
      const pw = Math.max(34, Math.min(56, w * 0.13));
      gRef.current = {
        W: w,
        H: h,
        player: {
          x: w / 2 - pw / 2,
          y: h - pw - Math.max(18, h * 0.04),
          w: pw,
          h: pw,
        },
        bullets: [],
        enemies: [],
        foeShots: [],
        boss: null,
        particles: [],
        stars: makeStars(w, h),
        score: 0,
        lives: MAX_LIVES,
        inv: 0,
        fireT: 0,
        spawnT: 0,
        spawn: BASE_SPAWN,
        skill: 0,
        bossAt: BOSS_EVERY,
        t: 0,
      };
      setScore(0);
      setLives(MAX_LIVES);
      setSkillReady(true);
      setBossHp(null);
    };

    const burst = (x: number, y: number, hue: number, n: number) => {
      const g = gRef.current;
      if (!g) return;
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = Math.random() * 5 + 1.5;
        g.particles.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 1,
          r: Math.random() * 2.6 + 1,
          hue,
        });
      }
    };

    const spawnEnemy = () => {
      const g = gRef.current;
      if (!g) return;
      const s = Math.max(34, Math.min(50, g.W * 0.12));
      g.enemies.push({
        x: Math.random() * (g.W - s),
        y: -s,
        w: s,
        h: s,
        vy: 1.4 + Math.random() * 1.6 + g.score * 0.0008,
        vx: (Math.random() - 0.5) * 1.2,
        hp: 1,
        hue: 180 + Math.random() * 40,
      });
    };

    const spawnBoss = () => {
      const g = gRef.current;
      if (!g) return;
      const w = Math.min(170, g.W * 0.5);
      const hp = 40 + Math.floor(g.score / BOSS_EVERY) * 14;
      g.boss = {
        x: g.W / 2 - w / 2,
        y: -w * 0.55,
        w,
        h: w * 0.55,
        vx: 1.6,
        hp,
        maxHp: hp,
        fireT: 0,
      };
      setBossHp(1);
    };

    const addScore = (n: number) => {
      const g = gRef.current;
      if (!g) return;
      g.score += n;
      setScore(g.score);
      g.spawn = Math.max(MIN_SPAWN, BASE_SPAWN - g.score * 0.04);
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

    const hitPlayer = () => {
      const g = gRef.current;
      if (!g || g.inv > 0) return;
      const p = g.player;
      burst(p.x + p.w / 2, p.y + p.h / 2, 8, 26);
      g.lives--;
      setLives(g.lives);
      g.inv = 90;
      if (g.lives <= 0) {
        endGame();
        return;
      }
      g.foeShots = [];
    };

    const fire = () => {
      const g = gRef.current;
      if (!g) return;
      const p = g.player;
      const r = Math.max(2.5, p.w * 0.08);
      g.bullets.push({ x: p.x + p.w / 2, y: p.y, vy: -9.5, r });
    };

    const triggerSkill = () => {
      const g = gRef.current;
      if (!g || phaseRef.current !== 'playing' || g.skill > 0) return;
      g.skill = SKILL_COOLDOWN;
      setSkillReady(false);
      const p = g.player;
      burst(p.x + p.w / 2, p.y, 280, 60);
      for (const e of g.enemies) {
        burst(e.x + e.w / 2, e.y + e.h / 2, e.hue, 16);
        addScore(10);
      }
      g.enemies = [];
      g.foeShots = [];
      if (g.boss) {
        g.boss.hp -= 12;
        burst(g.boss.x + g.boss.w / 2, g.boss.y + g.boss.h / 2, 300, 30);
      }
    };

    const hit = (
      ax: number,
      ay: number,
      aw: number,
      ah: number,
      bx: number,
      by: number,
      bw: number,
      bh: number
    ) => ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;

    const update = (dt: number) => {
      const g = gRef.current;
      if (!g) return;
      const p = g.player;
      if (g.inv > 0) g.inv -= dt;
      if (g.skill > 0) {
        g.skill -= dt;
        if (g.skill <= 0) {
          g.skill = 0;
          setSkillReady(true);
        }
      }

      g.fireT -= dt;
      if (g.fireT <= 0) {
        fire();
        g.fireT = FIRE_INTERVAL;
      }

      for (let i = g.bullets.length - 1; i >= 0; i--) {
        const b = g.bullets[i];
        b.y += b.vy * dt;
        if (b.y + b.r < 0) g.bullets.splice(i, 1);
      }

      if (!g.boss) {
        g.spawnT -= dt;
        if (g.spawnT <= 0) {
          spawnEnemy();
          g.spawnT = g.spawn;
        }
        if (g.score >= g.bossAt) {
          g.bossAt += BOSS_EVERY;
          spawnBoss();
        }
      }

      for (let i = g.enemies.length - 1; i >= 0; i--) {
        const e = g.enemies[i];
        e.y += e.vy * dt;
        e.x += e.vx * dt;
        if (e.x < 0 || e.x + e.w > g.W) e.vx *= -1;
        let dead = false;
        for (let j = g.bullets.length - 1; j >= 0; j--) {
          const b = g.bullets[j];
          if (hit(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2, e.x, e.y, e.w, e.h)) {
            g.bullets.splice(j, 1);
            burst(e.x + e.w / 2, e.y + e.h / 2, e.hue, 14);
            addScore(10);
            dead = true;
            break;
          }
        }
        if (dead) {
          g.enemies.splice(i, 1);
          continue;
        }
        if (g.inv <= 0 && hit(p.x, p.y, p.w, p.h, e.x, e.y, e.w, e.h)) {
          g.enemies.splice(i, 1);
          hitPlayer();
          return;
        }
        if (e.y > g.H) g.enemies.splice(i, 1);
      }

      const boss = g.boss;
      if (boss) {
        if (boss.y < g.H * 0.16) boss.y += 1.2 * dt;
        else {
          boss.x += boss.vx * dt;
          if (boss.x < 0 || boss.x + boss.w > g.W) boss.vx *= -1;
        }
        boss.fireT -= dt;
        if (boss.fireT <= 0) {
          boss.fireT = 38;
          const fx = boss.x + boss.w / 2;
          for (let k = -1; k <= 1; k++)
            g.foeShots.push({
              x: fx + k * 16,
              y: boss.y + boss.h,
              vy: 3.4 + Math.abs(k) * 0.4,
              r: 5,
            });
        }
        for (let j = g.bullets.length - 1; j >= 0; j--) {
          const b = g.bullets[j];
          if (
            hit(
              b.x - b.r,
              b.y - b.r,
              b.r * 2,
              b.r * 2,
              boss.x,
              boss.y,
              boss.w,
              boss.h
            )
          ) {
            g.bullets.splice(j, 1);
            boss.hp -= 1;
            burst(b.x, b.y, 300, 5);
          }
        }
        setBossHp(Math.max(0, boss.hp / boss.maxHp));
        if (boss.hp <= 0) {
          burst(boss.x + boss.w / 2, boss.y + boss.h / 2, 300, 80);
          addScore(150);
          g.boss = null;
          setBossHp(null);
        } else if (
          g.inv <= 0 &&
          hit(p.x, p.y, p.w, p.h, boss.x, boss.y, boss.w, boss.h)
        ) {
          hitPlayer();
          return;
        }
      }

      for (let i = g.foeShots.length - 1; i >= 0; i--) {
        const f = g.foeShots[i];
        f.y += f.vy * dt;
        if (f.y - f.r > g.H) {
          g.foeShots.splice(i, 1);
          continue;
        }
        if (
          g.inv <= 0 &&
          hit(p.x, p.y, p.w, p.h, f.x - f.r, f.y - f.r, f.r * 2, f.r * 2)
        ) {
          g.foeShots.splice(i, 1);
          hitPlayer();
          return;
        }
      }
    };

    const drawShip = (x: number, y: number, w: number, h: number) => {
      ctx.save();
      ctx.translate(x + w / 2, y + h / 2);
      ctx.shadowColor = 'rgba(90,200,255,0.9)';
      ctx.shadowBlur = 18;
      const body = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
      body.addColorStop(0, '#9fe9ff');
      body.addColorStop(1, '#2f7fff');
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.moveTo(0, -h / 2);
      ctx.lineTo(-w / 2, h / 2);
      ctx.lineTo(0, h * 0.28);
      ctx.lineTo(w / 2, h / 2);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(220,245,255,0.92)';
      ctx.beginPath();
      ctx.ellipse(0, -h * 0.04, w * 0.16, h * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      const g = gRef.current;
      if (!g) return;
      const { W, H } = g;
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#0a1838');
      sky.addColorStop(1, '#070b1c');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      for (const s of g.stars) {
        ctx.globalAlpha = 0.3 + 0.5 * Math.abs(Math.sin(g.t * 0.05 + s.tw));
        ctx.fillStyle = '#cfe0ff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      for (const e of g.enemies) {
        ctx.save();
        ctx.translate(e.x + e.w / 2, e.y + e.h / 2);
        ctx.shadowColor = `hsla(${e.hue},90%,60%,0.85)`;
        ctx.shadowBlur = 14;
        ctx.fillStyle = `hsl(${e.hue},85%,58%)`;
        ctx.beginPath();
        ctx.moveTo(0, e.h * 0.42);
        ctx.lineTo(-e.w / 2, -e.h * 0.42);
        ctx.lineTo(e.w / 2, -e.h * 0.42);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.beginPath();
        ctx.arc(0, -e.h * 0.06, e.w * 0.13, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      const boss = g.boss;
      if (boss) {
        ctx.save();
        ctx.translate(boss.x + boss.w / 2, boss.y + boss.h / 2);
        ctx.shadowColor = 'rgba(255,80,170,0.85)';
        ctx.shadowBlur = 26;
        const bg = ctx.createLinearGradient(0, -boss.h / 2, 0, boss.h / 2);
        bg.addColorStop(0, '#ff9ad1');
        bg.addColorStop(1, '#c01f7a');
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.moveTo(-boss.w / 2, -boss.h * 0.2);
        ctx.lineTo(0, -boss.h / 2);
        ctx.lineTo(boss.w / 2, -boss.h * 0.2);
        ctx.lineTo(boss.w * 0.32, boss.h / 2);
        ctx.lineTo(-boss.w * 0.32, boss.h / 2);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255,240,250,0.9)';
        ctx.beginPath();
        ctx.arc(0, 0, boss.w * 0.12, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      for (const f of g.foeShots) {
        ctx.save();
        ctx.shadowColor = 'rgba(255,120,90,0.9)';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#ff6a4d';
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      for (const b of g.bullets) {
        ctx.save();
        ctx.shadowColor = 'rgba(120,255,210,0.95)';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#9dffd9';
        ctx.beginPath();
        ctx.moveTo(b.x, b.y - b.r * 3);
        ctx.lineTo(b.x - b.r, b.y + b.r * 2);
        ctx.lineTo(b.x + b.r, b.y + b.r * 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      const p = g.player;
      const blink = g.inv > 0 && Math.floor(g.t * 0.3) % 2 === 0;
      if (!blink) {
        ctx.save();
        ctx.shadowColor = 'rgba(140,210,255,0.6)';
        ctx.shadowBlur = 16;
        ctx.fillStyle = 'rgba(150,220,255,0.5)';
        ctx.beginPath();
        ctx.moveTo(p.x + p.w * 0.32, p.y + p.h);
        ctx.lineTo(
          p.x + p.w / 2,
          p.y + p.h + p.h * 0.5 * (0.7 + 0.3 * Math.sin(g.t))
        );
        ctx.lineTo(p.x + p.w * 0.68, p.y + p.h);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        drawShip(p.x, p.y, p.w, p.h);
      }

      for (const pt of g.particles) {
        ctx.globalAlpha = Math.max(0, pt.life);
        ctx.fillStyle = `hsl(${pt.hue},90%,62%)`;
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
      for (const s of g.stars) {
        s.y += s.v * dt;
        if (s.y > g.H) {
          s.y = 0;
          s.x = Math.random() * g.W;
        }
      }
      if (phaseRef.current === 'playing') update(dt);
      for (let i = g.particles.length - 1; i >= 0; i--) {
        const pt = g.particles[i];
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.vx *= 0.96;
        pt.vy *= 0.96;
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
    skillRef.current = triggerSkill;

    let dragging = false;
    const moveTo = (clientX: number, clientY: number) => {
      const g = gRef.current;
      if (!g) return;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      g.player.x = Math.max(0, Math.min(g.W - g.player.w, x - g.player.w / 2));
      g.player.y = Math.max(
        g.H * 0.4,
        Math.min(g.H - g.player.h - 6, y - g.player.h / 2)
      );
    };
    const onDown = (e: PointerEvent) => {
      if (phaseRef.current !== 'playing') return;
      dragging = true;
      canvas.setPointerCapture?.(e.pointerId);
      moveTo(e.clientX, e.clientY);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      e.preventDefault();
      moveTo(e.clientX, e.clientY);
    };
    const onUp = () => {
      dragging = false;
    };
    const onKey = (e: KeyboardEvent) => {
      if (phaseRef.current !== 'playing') return;
      const g = gRef.current;
      if (!g) return;
      const step = Math.max(18, g.W * 0.06);
      if (e.code === 'ArrowLeft') {
        e.preventDefault();
        g.player.x = Math.max(0, g.player.x - step);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        g.player.x = Math.min(g.W - g.player.w, g.player.x + step);
      } else if (e.code === 'Space' || e.code === 'KeyJ') {
        e.preventDefault();
        triggerSkill();
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

        {phase === 'playing' && bossHp !== null && (
          <div className='pointer-events-none absolute inset-x-0 top-2 mx-auto flex w-[78%] max-w-[440px] flex-col items-center gap-1'>
            <span className='text-[11px] font-bold uppercase tracking-[0.22em] text-[#ff8ac4]'>
              {tx.boss}
            </span>
            <span className='h-[7px] w-full overflow-hidden rounded-full bg-white/15 ring-1 ring-white/10'>
              <span
                className='block h-full rounded-full bg-[#ff5aa8] transition-[width] duration-150'
                style={{ width: `${Math.round(bossHp * 100)}%` }}
              />
            </span>
          </div>
        )}

        {phase === 'playing' && (
          <button
            type='button'
            aria-label={tx.skill}
            onPointerDown={(e) => {
              e.preventDefault();
              skillRef.current();
            }}
            disabled={!skillReady}
            className={`sk-skill absolute bottom-4 right-4 flex h-16 w-16 items-center justify-center rounded-full text-[12px] font-bold uppercase tracking-wider ring-1 transition-colors ${
              skillReady
                ? 'bg-white/15 text-white ring-white/30'
                : 'bg-white/5 text-white/30 ring-white/10'
            }`}
          >
            {tx.skill}
          </button>
        )}

        {phase === 'idle' && (
          <div className='sk-in absolute inset-0 flex flex-col items-center justify-center gap-5 bg-black/35 px-6 text-center'>
            <p className='text-[12px] font-bold uppercase tracking-[0.18em] text-white/55'>
              {tx.title}
            </p>
            <button
              type='button'
              onClick={() => startRef.current()}
              className='sk-cta rounded-full bg-white px-9 py-3 text-[15px] font-bold text-[#121212]'
            >
              {tx.start}
            </button>
            <p className='text-[13px] text-white/55'>{tx.how}</p>
          </div>
        )}

        {phase === 'over' && (
          <div className='sk-in absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/45 px-6 text-center'>
            <span className='text-[64px] font-extrabold leading-none text-white'>
              {score}
            </span>
            <span className='rounded-full bg-white/10 px-4 py-1 text-[13px] font-medium text-white/70'>
              {tx.best} {best}
            </span>
            <button
              type='button'
              onClick={() => startRef.current()}
              className='sk-cta mt-1 rounded-full bg-white px-9 py-3 text-[15px] font-bold text-[#121212]'
            >
              {tx.again}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes skIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .sk-in { animation: skIn .28s cubic-bezier(0.23,1,0.32,1); }
        .sk-cta { transition: transform .15s cubic-bezier(0.23,1,0.32,1); }
        .sk-cta:hover { transform: translateY(-2px); }
        .sk-cta:active { transform: scale(.97); }
        .sk-skill { transition: transform .12s cubic-bezier(0.23,1,0.32,1); }
        .sk-skill:active { transform: scale(.92); }
        @media (prefers-reduced-motion: reduce) { .sk-in { animation: none; } .sk-cta, .sk-skill { transition: none; } }
      `}</style>
    </div>
  );
}

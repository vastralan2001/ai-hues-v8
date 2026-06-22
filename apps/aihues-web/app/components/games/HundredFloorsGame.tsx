'use client';

import { useEffect, useRef, useState } from 'react';

import type { Locale } from '@/lib/dict';

/* Hundred Floors — ported from kimi.com/share/d21nj4dm2cinpf7v5v60. Core logic kept; visuals upgraded to the aihues aesthetic. */

type Phase = 'idle' | 'playing' | 'over';
type DiffKey = 'easy' | 'normal' | 'hard' | 'insane';

const DIFFS: Record<DiffKey, { speed: number; heal: number }> = {
  easy: { speed: 0.6, heal: 4 },
  normal: { speed: 0.9, heal: 3 },
  hard: { speed: 1.2, heal: 2 },
  insane: { speed: 1.8, heal: 1 },
};
const DIFF_ORDER: DiffKey[] = ['easy', 'normal', 'hard', 'insane'];
const BEST_KEY = 'aihues_hundred-floors_best';

const readBest = (): number => {
  if (typeof window === 'undefined') return 0;
  return Number(window.localStorage.getItem(BEST_KEY) || 0) || 0;
};

const NORMAL = 0;
const NAIL = 1;
const SPRING = 2;
const FLIP = 3;
const CONVEYOR = 4;
type PType = 0 | 1 | 2 | 3 | 4;

const GRAVITY = 0.5;
const PLAYER_W = 30;
const PLAYER_H = 50;
const PLAYER_SPEED = 5;
const PLAT_H = 20;
const SPRING_VY = -8;
const FLIP_MS = 500;
const HEAL_EVERY = 100;
const CEIL_DMG = 20;
const NAIL_DMG = 20;

interface Platform {
  x: number;
  y: number;
  w: number;
  h: number;
  type: PType;
  dir: number;
  flipAt: number;
  flipped: boolean;
  hit: boolean;
}
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  r: number;
  hue: string;
}
interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  conveyor: number;
  onGround: boolean;
  currentFloor: number;
  cameraHit: boolean;
}
interface HGame {
  W: number;
  H: number;
  player: Player;
  platforms: Platform[];
  particles: Particle[];
  cameraY: number;
  score: number;
  hp: number;
  lastHealScore: number;
  recycledCount: number;
  floor: number;
  t: number;
  hurtFlash: number;
}

const T = {
  en: {
    best: 'Best',
    choose: 'Choose your difficulty',
    hint: 'Hold left / right or use arrow keys to descend',
    start: 'Start',
    again: 'Play again',
    floor: 'Floor',
    diffs: { easy: 'Easy', normal: 'Normal', hard: 'Hard', insane: 'Insane' },
  },
  zh: {
    best: '最高',
    choose: '选择难度',
    hint: '按住屏幕左右两侧或方向键下落',
    start: '开始',
    again: '再来一局',
    floor: '层数',
    diffs: { easy: '简单', normal: '普通', hard: '困难', insane: '地狱' },
  },
} as const;

export default function HundredFloorsGame({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const tx = T[zh ? 'zh' : 'en'];

  const fieldRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gRef = useRef<HGame | null>(null);
  const rafRef = useRef(0);
  const phaseRef = useRef<Phase>('idle');
  const diffRef = useRef<DiffKey>('normal');
  const startRef = useRef<() => void>(() => {});
  const leftRef = useRef(false);
  const rightRef = useRef(false);

  const [phase, setPhase] = useState<Phase>('idle');
  const [floor, setFloor] = useState(1);
  const [best, setBest] = useState(readBest);
  const [hp, setHp] = useState(100);
  const [diff, setDiff] = useState<DiffKey>('normal');
  const bestRef = useRef(best);

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
        g.player.x = Math.max(
          PLAYER_W / 2,
          Math.min(w - PLAYER_W / 2, g.player.x)
        );
      }
    };
    const ro = new ResizeObserver(size);
    ro.observe(field);
    size();

    const genPlatform = (w: number, y: number, lastType: PType): Platform => {
      const pw = 70 + Math.random() * 90;
      const px = Math.random() * (w - pw);
      let type: PType = NORMAL;
      if (lastType !== NAIL && Math.random() < 0.12) type = NAIL;
      else if (lastType !== SPRING && Math.random() < 0.24) type = SPRING;
      else if (lastType !== FLIP && Math.random() < 0.36) type = FLIP;
      else if (lastType !== CONVEYOR && Math.random() < 0.48) type = CONVEYOR;
      const dir = type === CONVEYOR ? (Math.random() < 0.5 ? -1 : 1) : 0;
      return {
        x: px,
        y,
        w: pw,
        h: PLAT_H,
        type,
        dir,
        flipAt: 0,
        flipped: false,
        hit: false,
      };
    };

    const reset = () => {
      const w = field.clientWidth;
      const h = field.clientHeight;
      const platforms: Platform[] = [];
      platforms.push({
        x: w / 2 - 75,
        y: 200,
        w: 150,
        h: PLAT_H,
        type: NORMAL,
        dir: 0,
        flipAt: 0,
        flipped: false,
        hit: false,
      });
      for (let i = 1; i < 20; i++) {
        platforms.push(genPlatform(w, 200 + i * 120, platforms[i - 1].type));
      }
      const first = platforms[0];
      gRef.current = {
        W: w,
        H: h,
        player: {
          x: first.x + first.w / 2,
          y: first.y,
          vx: 0,
          vy: 0,
          conveyor: 0,
          onGround: false,
          currentFloor: 0,
          cameraHit: false,
        },
        platforms,
        particles: [],
        cameraY: 0,
        score: 0,
        hp: 100,
        lastHealScore: 0,
        recycledCount: 0,
        floor: 1,
        t: 0,
        hurtFlash: 0,
      };
      setFloor(1);
      setHp(100);
    };

    const ensurePlatforms = () => {
      const g = gRef.current;
      if (!g) return;
      const bottom = g.cameraY + g.H;
      while (g.platforms[g.platforms.length - 1].y < bottom + 200) {
        const last = g.platforms[g.platforms.length - 1];
        g.platforms.push(
          genPlatform(g.W, last.y + 120 + Math.random() * 50, last.type)
        );
      }
    };

    const burst = (x: number, y: number, hue: string, n: number) => {
      const g = gRef.current;
      if (!g) return;
      for (let i = 0; i < n; i++)
        g.particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 7,
          vy: (Math.random() - 0.5) * 7,
          life: 1,
          r: Math.random() * 3 + 1,
          hue,
        });
    };

    const endGame = () => {
      const g = gRef.current;
      if (!g) return;
      if (g.floor > bestRef.current) {
        bestRef.current = g.floor;
        setBest(g.floor);
        try {
          localStorage.setItem(BEST_KEY, String(g.floor));
        } catch {
          /* ignore */
        }
      }
      setPhaseBoth('over');
    };

    const checkPlatforms = (g: HGame) => {
      const p = g.player;
      p.onGround = false;
      let onConveyor = false;
      let newFloorIndex = 0;

      for (let i = g.platforms.length - 1; i >= 0; i--) {
        const pl = g.platforms[i];
        if (pl.y + pl.h < g.cameraY - 50) {
          g.platforms.splice(i, 1);
          if (i <= p.currentFloor) g.recycledCount++;
          continue;
        }
        if (
          p.x + PLAYER_W / 2 > pl.x &&
          p.x - PLAYER_W / 2 < pl.x + pl.w &&
          p.y + p.vy >= pl.y &&
          p.y <= pl.y + pl.h
        ) {
          if (pl.type === NAIL) {
            if (!pl.hit) {
              pl.hit = true;
              g.hp -= NAIL_DMG;
              g.hurtFlash = 1;
              burst(p.x, pl.y - g.cameraY, '#ff5b6e', 16);
              if (g.hp <= 0) {
                g.hp = 0;
                endGame();
                return;
              }
            }
            p.y = pl.y;
            p.vy = 0;
            p.onGround = true;
            continue;
          }
          if (pl.type === SPRING && p.vy >= 0) {
            p.y = pl.y;
            p.vy = SPRING_VY;
            burst(p.x, pl.y - g.cameraY, '#5bffb0', 10);
            continue;
          }
          if (pl.type === FLIP && !pl.flipped && p.vy >= 0) {
            p.y = pl.y;
            p.vy = 0;
            p.onGround = true;
            if (!pl.flipAt) pl.flipAt = g.t + FLIP_MS;
          }
          if (pl.type === FLIP && pl.flipped) continue;
          if (pl.type === CONVEYOR && p.vy >= 0) {
            p.y = pl.y;
            p.vy = 0;
            p.onGround = true;
            p.conveyor = pl.dir;
            onConveyor = true;
          }
          if (p.vy >= 0) {
            p.y = pl.y;
            p.vy = 0;
            p.onGround = true;
            newFloorIndex = i;
          }
        }
      }
      if (!onConveyor) p.conveyor = 0;
      if (newFloorIndex > p.currentFloor) p.currentFloor = newFloorIndex;
    };

    const update = (dt: number) => {
      const g = gRef.current;
      if (!g) return;
      const cfg = DIFFS[diffRef.current];
      const p = g.player;

      p.vx = 0;
      if (leftRef.current) p.vx = -PLAYER_SPEED;
      if (rightRef.current) p.vx = PLAYER_SPEED;

      for (const pl of g.platforms) {
        if (pl.type === FLIP && pl.flipAt && !pl.flipped && g.t >= pl.flipAt) {
          pl.flipped = true;
          pl.flipAt = 0;
        }
      }

      g.cameraY += cfg.speed * dt;
      p.x += (p.vx + p.conveyor) * dt;
      p.y += p.vy * dt;
      p.vy += GRAVITY * dt;
      p.x = Math.max(PLAYER_W / 2, Math.min(g.W - PLAYER_W / 2, p.x));

      ensurePlatforms();
      checkPlatforms(g);
      if (phaseRef.current !== 'playing') return;

      g.score = Math.floor(g.cameraY / 10);

      if (g.score >= g.lastHealScore + HEAL_EVERY) {
        g.hp = Math.min(100, g.hp + cfg.heal);
        g.lastHealScore = Math.floor(g.score / HEAL_EVERY) * HEAL_EVERY;
      }

      g.floor = g.recycledCount + p.currentFloor + 1;

      if (g.floor > 1 && p.y - PLAYER_H <= g.cameraY && !p.cameraHit) {
        g.hp -= CEIL_DMG;
        p.cameraHit = true;
        g.hurtFlash = 1;
        burst(p.x, 6, '#ff5b6e', 14);
        if (g.hp <= 0) {
          g.hp = 0;
          endGame();
          return;
        }
      } else if (p.y - PLAYER_H > g.cameraY) {
        p.cameraHit = false;
      }

      setFloor(g.floor);
      setHp(g.hp);

      if (p.y - g.cameraY > g.H) {
        endGame();
      }
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

    const PLAT_STYLE: Record<PType, { fill: string; glow: string }> = {
      [NORMAL]: { fill: '#4b6cff', glow: 'rgba(75,108,255,0.55)' },
      [NAIL]: { fill: '#ff5b6e', glow: 'rgba(255,91,110,0.6)' },
      [SPRING]: { fill: '#36e0a0', glow: 'rgba(54,224,160,0.6)' },
      [FLIP]: { fill: '#ffa53c', glow: 'rgba(255,165,60,0.6)' },
      [CONVEYOR]: { fill: '#36c6ff', glow: 'rgba(54,198,255,0.6)' },
    };

    const render = () => {
      const g = gRef.current;
      if (!g) return;
      const { W, H, cameraY } = g;

      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#0a0f24');
      sky.addColorStop(1, '#05070f');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      for (let i = 0; i < 60; i++) {
        const py = (((i * 53 - cameraY * 0.25) % (H + 40)) + H + 40) % (H + 40);
        const px = (i * 71) % W;
        ctx.globalAlpha = 0.06 + 0.05 * Math.sin(g.t * 0.04 + i);
        ctx.fillStyle = '#9fb4ff';
        ctx.fillRect(px, py, 2, 2);
      }
      ctx.restore();

      const ceilGlow = g.floor > 1 ? 0.5 + 0.3 * Math.sin(g.t * 0.2) : 0.18;
      const cg = ctx.createLinearGradient(0, 0, 0, 26);
      cg.addColorStop(0, `rgba(255,91,110,${ceilGlow})`);
      cg.addColorStop(1, 'rgba(255,91,110,0)');
      ctx.fillStyle = cg;
      ctx.fillRect(0, 0, W, 26);

      for (const pl of g.platforms) {
        const sy = pl.y - cameraY;
        if (sy + pl.h < -50 || sy > H + 50) continue;
        const st = PLAT_STYLE[pl.type];
        const isFlipped = pl.type === FLIP && pl.flipped;

        ctx.save();
        ctx.shadowColor = st.glow;
        ctx.shadowBlur = isFlipped ? 4 : 16;
        ctx.fillStyle = isFlipped ? 'rgba(255,165,60,0.25)' : st.fill;
        roundRect(pl.x, sy, pl.w, pl.h, 7);
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        roundRect(pl.x + 3, sy + 2, pl.w - 6, 3, 2);
        ctx.fill();

        if (pl.type === NAIL) {
          ctx.fillStyle = '#ffd3d9';
          const spikeW = 10;
          const spikes = Math.floor(pl.w / spikeW);
          for (let i = 0; i < spikes; i++) {
            ctx.beginPath();
            ctx.moveTo(pl.x + i * spikeW, sy);
            ctx.lineTo(pl.x + (i + 0.5) * spikeW, sy - 11);
            ctx.lineTo(pl.x + (i + 1) * spikeW, sy);
            ctx.closePath();
            ctx.fill();
          }
        } else if (pl.type === SPRING) {
          ctx.fillStyle = '#d7fff0';
          roundRect(pl.x + pl.w / 2 - 10, sy - 7, 20, 7, 3);
          ctx.fill();
        } else if (pl.type === CONVEYOR) {
          ctx.fillStyle = 'rgba(255,255,255,0.85)';
          const triW = 12;
          const count = Math.floor(pl.w / triW);
          const shift = (g.t * 0.06 * pl.dir) % triW;
          const ty = sy + pl.h / 2;
          for (let i = 0; i < count; i++) {
            const tx2 = pl.x + i * triW + triW / 2 + shift;
            ctx.beginPath();
            if (pl.dir > 0) {
              ctx.moveTo(tx2 - 3, ty - 3);
              ctx.lineTo(tx2 + 3, ty);
              ctx.lineTo(tx2 - 3, ty + 3);
            } else {
              ctx.moveTo(tx2 + 3, ty - 3);
              ctx.lineTo(tx2 - 3, ty);
              ctx.lineTo(tx2 + 3, ty + 3);
            }
            ctx.closePath();
            ctx.fill();
          }
        } else if (pl.type === FLIP && !pl.flipped) {
          ctx.strokeStyle = 'rgba(255,255,255,0.8)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(pl.x + 10, sy + pl.h / 2);
          ctx.lineTo(pl.x + pl.w - 10, sy + pl.h / 2);
          ctx.stroke();
        }
      }

      const p = g.player;
      const px = p.x;
      const py = p.y - PLAYER_H - cameraY;
      ctx.save();
      ctx.shadowColor = 'rgba(120,170,255,0.9)';
      ctx.shadowBlur = 20;
      const body = ctx.createLinearGradient(px, py, px, py + PLAYER_H);
      body.addColorStop(0, '#cfe0ff');
      body.addColorStop(1, '#5b8bff');
      ctx.fillStyle = body;
      roundRect(px - PLAYER_W / 2, py, PLAYER_W, PLAYER_H, 8);
      ctx.fill();
      const head = ctx.createRadialGradient(
        px - 3,
        py - 13,
        2,
        px,
        py - 10,
        11
      );
      head.addColorStop(0, '#ffffff');
      head.addColorStop(1, '#7aa2ff');
      ctx.fillStyle = head;
      ctx.beginPath();
      ctx.arc(px, py - 10, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = '#0a0f24';
      ctx.beginPath();
      ctx.arc(px - 3, py - 11, 1.8, 0, Math.PI * 2);
      ctx.arc(px + 4, py - 11, 1.8, 0, Math.PI * 2);
      ctx.fill();

      for (const pt of g.particles) {
        ctx.globalAlpha = Math.max(0, pt.life);
        ctx.fillStyle = pt.hue;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (g.hurtFlash > 0) {
        ctx.fillStyle = `rgba(255,40,70,${0.32 * g.hurtFlash})`;
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
      g.t += dt * 16.667;
      if (g.hurtFlash > 0) g.hurtFlash = Math.max(0, g.hurtFlash - 0.05 * dt);
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

    const pointFromEvent = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const xr = e.clientX - rect.left;
      leftRef.current = xr < rect.width / 2;
      rightRef.current = xr >= rect.width / 2;
    };
    const onPointerDown = (e: PointerEvent) => {
      if (phaseRef.current !== 'playing') return;
      e.preventDefault();
      pointFromEvent(e);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (phaseRef.current !== 'playing') return;
      if (!leftRef.current && !rightRef.current) return;
      pointFromEvent(e);
    };
    const clearHold = () => {
      leftRef.current = false;
      rightRef.current = false;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        e.preventDefault();
        if (e.code === 'ArrowLeft') leftRef.current = true;
        else rightRef.current = true;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft') leftRef.current = false;
      if (e.code === 'ArrowRight') rightRef.current = false;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', clearHold);
    canvas.addEventListener('pointercancel', clearHold);
    canvas.addEventListener('pointerleave', clearHold);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', clearHold);
      canvas.removeEventListener('pointercancel', clearHold);
      canvas.removeEventListener('pointerleave', clearHold);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  const hpColor = hp > 50 ? '#36e0a0' : hp > 20 ? '#ffa53c' : '#ff5b6e';

  return (
    <div className='relative flex min-h-[480px] w-full flex-col touch-none select-none'>
      <div className='mx-auto flex h-[52px] w-full max-w-[560px] shrink-0 items-center justify-between px-1 text-white'>
        {phase === 'playing' ? (
          <>
            <span className='flex items-baseline gap-1.5'>
              <span className='text-[26px] font-bold leading-none text-white/90 tabular-nums'>
                {floor}
              </span>
              <span className='text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45'>
                {tx.floor}
              </span>
            </span>
            <span className='flex items-center gap-2'>
              <span
                className='h-2 w-24 overflow-hidden rounded-full bg-white/10'
                aria-label={`HP ${hp}`}
              >
                <span
                  className='block h-full rounded-full transition-[width] duration-150'
                  style={{
                    width: `${Math.max(0, Math.min(100, hp))}%`,
                    backgroundColor: hpColor,
                    boxShadow: `0 0 8px ${hpColor}`,
                  }}
                />
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
          <div className='hf-in absolute inset-0 flex flex-col items-center justify-center gap-5 bg-black/35 px-6 text-center'>
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
              className='hf-cta rounded-full bg-white px-9 py-3 text-[15px] font-bold text-[#121212]'
            >
              {tx.start}
            </button>
            <p className='text-[13px] text-white/55'>{tx.hint}</p>
          </div>
        )}

        {phase === 'over' && (
          <div className='hf-in absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/45 px-6 text-center'>
            <span className='flex items-baseline gap-2'>
              <span className='text-[64px] font-extrabold leading-none text-white'>
                {floor}
              </span>
              <span className='text-[14px] font-semibold uppercase tracking-[0.16em] text-white/45'>
                {tx.floor}
              </span>
            </span>
            <span className='rounded-full bg-white/10 px-4 py-1 text-[13px] font-medium text-white/70'>
              {tx.best} {best}
            </span>
            <button
              type='button'
              onClick={() => startRef.current()}
              className='hf-cta mt-1 rounded-full bg-white px-9 py-3 text-[15px] font-bold text-[#121212]'
            >
              {tx.again}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes hfIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .hf-in { animation: hfIn .28s cubic-bezier(0.23,1,0.32,1); }
        .hf-cta { transition: transform .15s cubic-bezier(0.23,1,0.32,1); }
        .hf-cta:hover { transform: translateY(-2px); }
        .hf-cta:active { transform: scale(.97); }
        @media (prefers-reduced-motion: reduce) { .hf-in { animation: none; } .hf-cta { transition: none; } }
      `}</style>
    </div>
  );
}

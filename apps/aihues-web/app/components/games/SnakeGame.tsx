'use client';

import { useEffect, useRef, useState } from 'react';

import type { Locale } from '@/lib/dict';

/* Snake — native port of the speed-select snake, Kimi-styled and borderless.
   A square grid letterboxes into the transparent stage and blends into the
   themed background via a soft light pool + edge-fading dots (no frame). The
   snake glides between cells (interpolated) as a glossy gradient body with a
   head and eyes; food is a pulsing glow orb; eating sparks a +10 burst. */

const GRID = 30;
const FIELD = 600;
const CELL = FIELD / GRID;

const SPEEDS = { slow: 180, normal: 120, fast: 70 } as const;
type Speed = keyof typeof SPEEDS;

// Kimi dark tokens + game-entity colors (snake green, food amber)
const C = {
  pool: 'rgba(127,216,171,0.06)',
  headA: '#46e89a',
  headB: '#27bd76',
  tail: '#1b7a4c',
  gloss: 'rgba(255,255,255,0.34)',
  glow: 'rgba(62,224,143,0.5)',
  eye: '#0a0f0c',
  eyeWhite: 'rgba(255,255,255,0.95)',
  foodCore: '#ffe7b3',
  foodMid: '#ffb24a',
  foodEdge: '#ff8a1f',
  foodGlow: 'rgba(255,178,74,0.55)',
  fx: '#ffd24a',
  fxGlow: 'rgba(255,205,80,0.85)',
};

type Cell = { x: number; y: number };
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  r: number;
  c: string;
}
interface Pulse {
  x: number;
  y: number;
  t: number;
}
interface Float {
  x: number;
  y: number;
  t: number;
  text: string;
}
interface SGame {
  dpr: number;
  cw: number;
  ch: number;
  scale: number;
  offX: number;
  offY: number;
  snake: Cell[];
  prev: Cell[];
  grew: boolean;
  dir: Cell;
  queue: Cell[];
  food: Cell;
  score: number;
  stepMs: number;
  stepAcc: number;
  foodPhase: number;
  particles: Particle[];
  pulses: Pulse[];
  floats: Float[];
  last: number;
}

const T = {
  en: {
    start: 'Start',
    again: 'Play again',
    over: 'Game over',
    best: 'Best',
    speed: 'Speed',
    slow: 'Slow',
    normal: 'Normal',
    fast: 'Fast',
    hint: 'Press an arrow key or WASD to start',
    sub: 'Eat the glowing pellets, grow long, and stay off the walls.',
    rulesTitle: 'How to play',
    rules: [
      'Eat the glowing pellets to grow and score +10 each.',
      'Steer with the arrow keys, WASD, the on-screen pad, or a swipe.',
      'Avoid the walls and your own tail.',
      'Pick a speed — faster scores quicker, with less room to react.',
    ],
  },
  zh: {
    start: '开始',
    again: '再来一局',
    over: '游戏结束',
    best: '最佳',
    speed: '速度',
    slow: '慢',
    normal: '中',
    fast: '快',
    hint: '按方向键或 WASD 开始移动',
    sub: '吃到发光的食物,不断变长,别撞到边界。',
    rulesTitle: '玩法规则',
    rules: [
      '吃到发光的食物即可成长,每个 +10 分。',
      '用方向键、WASD、屏幕按钮或滑动来转向。',
      '不要撞到边界或自己的身体。',
      '选择速度——越快得分越快,反应时间也越短。',
    ],
  },
} as const;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const opp = (a: Cell, b: Cell) => a.x === -b.x && a.y === -b.y;
const center = (c: Cell) => ({
  x: c.x * CELL + CELL / 2,
  y: c.y * CELL + CELL / 2,
});

export default function SnakeGame({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const tx = T[zh ? 'zh' : 'en'];
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gRef = useRef<SGame | null>(null);
  const rafRef = useRef<number>(0);
  const phaseRef = useRef<'idle' | 'playing' | 'over'>('idle');
  const speedRef = useRef<Speed>('normal');
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle');
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [speed, setSpeed] = useState<Speed>('normal');
  const [awaiting, setAwaiting] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const v = Number(localStorage.getItem('aihues_snake_best') || '0');
      if (!Number.isNaN(v)) setBest(v);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  function setPhaseBoth(p: 'idle' | 'playing' | 'over') {
    phaseRef.current = p;
    setPhase(p);
  }

  function pickSpeed(s: Speed) {
    speedRef.current = s;
    setSpeed(s);
  }

  function spawnFood(g: SGame) {
    let f: Cell;
    do {
      f = {
        x: Math.floor(Math.random() * GRID),
        y: Math.floor(Math.random() * GRID),
      };
    } while (g.snake.some((s) => s.x === f.x && s.y === f.y));
    g.food = f;
  }

  function burst(g: SGame, x: number, y: number, n: number, col: string) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = Math.random() * 4;
      g.particles.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 1.5,
        life: 1,
        r: 1.5 + Math.random() * 2.5,
        c: col,
      });
    }
  }

  function start(g: SGame) {
    g.snake = [{ x: 15, y: 15 }];
    g.prev = [{ x: 15, y: 15 }];
    g.grew = false;
    g.dir = { x: 0, y: 0 };
    g.queue = [];
    g.score = 0;
    g.stepMs = SPEEDS[speedRef.current];
    g.stepAcc = 0;
    g.foodPhase = 0;
    g.particles = [];
    g.pulses = [];
    g.floats = [];
    spawnFood(g);
    setScore(0);
    setAwaiting(true);
    setPhaseBoth('playing');
  }

  function endGame(g: SGame) {
    if (phaseRef.current !== 'playing') return;
    let stored = 0;
    try {
      stored = Number(localStorage.getItem('aihues_snake_best') || '0') || 0;
    } catch {
      stored = 0;
    }
    if (g.score > stored) {
      try {
        localStorage.setItem('aihues_snake_best', String(g.score));
      } catch {
        /* ignore */
      }
      setBest(g.score);
    } else {
      setBest(stored);
    }
    setPhaseBoth('over');
  }

  function step(g: SGame) {
    if (g.queue.length) {
      const nd = g.queue.shift() as Cell;
      if (!opp(nd, g.dir)) g.dir = nd;
    }
    if (g.dir.x === 0 && g.dir.y === 0) return;
    const head = g.snake[0];
    const nx = head.x + g.dir.x;
    const ny = head.y + g.dir.y;
    const hitsSelf = g.snake.some((s) => s.x === nx && s.y === ny);
    if (nx < 0 || nx >= GRID || ny < 0 || ny >= GRID || hitsSelf) {
      const cc = center(head);
      g.pulses.push({ x: cc.x, y: cc.y, t: 0 });
      burst(g, cc.x, cc.y, 20, 'rgba(255,255,255,0.85)');
      endGame(g);
      return;
    }
    g.prev = g.snake.map((c) => ({ ...c }));
    g.snake.unshift({ x: nx, y: ny });
    if (nx === g.food.x && ny === g.food.y) {
      g.grew = true;
      g.score += 10;
      setScore(g.score);
      const fc = center(g.food);
      g.pulses.push({ x: fc.x, y: fc.y, t: 0 });
      g.floats.push({ x: fc.x, y: fc.y - 8, t: 0, text: '+10' });
      burst(g, fc.x, fc.y, 16, C.fx);
      spawnFood(g);
    } else {
      g.grew = false;
      g.snake.pop();
    }
  }

  function update(g: SGame, dt: number, dtMs: number) {
    g.foodPhase += dt * 0.11;
    for (let i = g.particles.length - 1; i >= 0; i--) {
      const p = g.particles[i];
      p.vy += 0.12 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= 0.022 * dt;
      if (p.life <= 0) g.particles.splice(i, 1);
    }
    for (let i = g.pulses.length - 1; i >= 0; i--) {
      g.pulses[i].t += dt * 0.05;
      if (g.pulses[i].t >= 1) g.pulses.splice(i, 1);
    }
    for (let i = g.floats.length - 1; i >= 0; i--) {
      g.floats[i].t += dt * 0.03;
      if (g.floats[i].t >= 1) g.floats.splice(i, 1);
    }
    if (phaseRef.current !== 'playing') return;
    if (g.dir.x === 0 && g.dir.y === 0 && g.queue.length === 0) {
      g.stepAcc = 0;
      return;
    }
    g.stepAcc += dtMs;
    let guard = 0;
    while (g.stepAcc >= g.stepMs && guard < 4) {
      g.stepAcc -= g.stepMs;
      guard++;
      step(g);
      if (phaseRef.current !== 'playing') break;
    }
  }

  function spinePoints(g: SGame): Cell[] {
    const s = g.snake;
    if (s.length === 0) return [];
    const mt = Math.min(1, g.stepAcc / g.stepMs);
    const pts: Cell[] = [];
    const ph = g.prev[0] ?? s[0];
    const h0 = center(ph);
    const h1 = center(s[0]);
    pts.push({ x: lerp(h0.x, h1.x, mt), y: lerp(h0.y, h1.y, mt) });
    for (let i = 1; i < s.length - 1; i++) pts.push(center(s[i]));
    if (s.length > 1) {
      const last = s.length - 1;
      if (g.grew) {
        pts.push(center(s[last]));
      } else {
        const pl = g.prev[g.prev.length - 1] ?? s[last];
        const t0 = center(pl);
        const t1 = center(s[last]);
        pts.push({ x: lerp(t0.x, t1.x, mt), y: lerp(t0.y, t1.y, mt) });
      }
    }
    return pts;
  }

  function strokeSpine(
    ctx: CanvasRenderingContext2D,
    pts: Cell[],
    width: number,
    style: string | CanvasGradient
  ) {
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = style;
    if (pts.length === 1) {
      ctx.fillStyle = style;
      ctx.beginPath();
      ctx.arc(pts[0].x, pts[0].y, width / 2, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
  }

  function drawSnake(ctx: CanvasRenderingContext2D, g: SGame) {
    const pts = spinePoints(g);
    if (!pts.length) return;
    const head = pts[0];
    const tail = pts[pts.length - 1];

    ctx.save();
    ctx.shadowColor = C.glow;
    ctx.shadowBlur = 16;
    strokeSpine(ctx, pts, CELL * 0.8, C.headB);
    ctx.restore();

    const grad = ctx.createLinearGradient(head.x, head.y, tail.x, tail.y);
    grad.addColorStop(0, C.headA);
    grad.addColorStop(1, C.tail);
    strokeSpine(ctx, pts, CELL * 0.8, grad);
    strokeSpine(ctx, pts, CELL * 0.3, C.gloss);

    // head + eyes
    const r = CELL * 0.46;
    const hg = ctx.createRadialGradient(
      head.x - r * 0.3,
      head.y - r * 0.3,
      1,
      head.x,
      head.y,
      r
    );
    hg.addColorStop(0, C.headA);
    hg.addColorStop(1, C.headB);
    ctx.fillStyle = hg;
    ctx.beginPath();
    ctx.arc(head.x, head.y, r, 0, Math.PI * 2);
    ctx.fill();
    const d = g.dir.x === 0 && g.dir.y === 0 ? { x: 1, y: 0 } : g.dir;
    const perp = { x: -d.y, y: d.x };
    for (const sgn of [1, -1]) {
      const ex = head.x + d.x * r * 0.32 + perp.x * r * 0.42 * sgn;
      const ey = head.y + d.y * r * 0.32 + perp.y * r * 0.42 * sgn;
      ctx.fillStyle = C.eyeWhite;
      ctx.beginPath();
      ctx.arc(ex, ey, r * 0.26, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = C.eye;
      ctx.beginPath();
      ctx.arc(
        ex + d.x * r * 0.09,
        ey + d.y * r * 0.09,
        r * 0.13,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  function drawFood(ctx: CanvasRenderingContext2D, g: SGame) {
    const c = center(g.food);
    const pulse = 1 + Math.sin(g.foodPhase) * 0.12;
    const R = CELL * 0.34 * pulse;
    const ring = Math.sin(g.foodPhase) * 0.5 + 0.5;
    ctx.globalAlpha = 0.22 * ring;
    ctx.strokeStyle = C.foodMid;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(c.x, c.y, R + 6 + ring * 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.save();
    ctx.shadowColor = C.foodGlow;
    ctx.shadowBlur = 18;
    const g2 = ctx.createRadialGradient(
      c.x - R * 0.3,
      c.y - R * 0.3,
      1,
      c.x,
      c.y,
      R
    );
    g2.addColorStop(0, C.foodCore);
    g2.addColorStop(0.6, C.foodMid);
    g2.addColorStop(1, C.foodEdge);
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.arc(c.x, c.y, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath();
    ctx.arc(c.x - R * 0.32, c.y - R * 0.32, R * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  function render(g: SGame, ctx: CanvasRenderingContext2D) {
    const { cw, ch, scale, offX, offY, dpr } = g;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cw, ch);
    ctx.setTransform(scale * dpr, 0, 0, scale * dpr, offX * dpr, offY * dpr);

    // soft light pool — defines the play area without a border
    const cx = FIELD / 2;
    const pool = ctx.createRadialGradient(cx, cx, 0, cx, cx, FIELD * 0.62);
    pool.addColorStop(0, C.pool);
    pool.addColorStop(1, 'rgba(127,216,171,0)');
    ctx.fillStyle = pool;
    ctx.fillRect(0, 0, FIELD, FIELD);

    // edge-fading grid dots
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i <= GRID; i++) {
      for (let j = 0; j <= GRID; j++) {
        const x = i * CELL;
        const y = j * CELL;
        const dx = (x - cx) / (FIELD / 2);
        const dy = (y - cx) / (FIELD / 2);
        const fade = 1 - Math.sqrt(dx * dx + dy * dy) * 0.96;
        if (fade <= 0.04) continue;
        ctx.globalAlpha = 0.05 * fade;
        ctx.beginPath();
        ctx.arc(x, y, 1.25, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    drawFood(ctx, g);
    drawSnake(ctx, g);

    // score feedback — rings, sparks, rising "+10"
    for (const pl of g.pulses) {
      ctx.globalAlpha = (1 - pl.t) * 0.5;
      ctx.strokeStyle = C.fx;
      ctx.lineWidth = 2 + (1 - pl.t) * 2.5;
      ctx.beginPath();
      ctx.arc(pl.x, pl.y, 8 + pl.t * 46, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    for (const p of g.particles) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * Math.max(0.2, p.life), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    for (const f of g.floats) {
      const alpha = f.t < 0.15 ? f.t / 0.15 : 1 - (f.t - 0.15) / 0.85;
      ctx.save();
      ctx.translate(f.x, f.y - f.t * 40);
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(0,0,0,0.4)';
      ctx.font = 'bold 22px ui-sans-serif, system-ui, sans-serif';
      ctx.strokeText(f.text, 0, 0);
      ctx.shadowColor = C.fxGlow;
      ctx.shadowBlur = 12;
      ctx.fillStyle = C.fx;
      ctx.fillText(f.text, 0, 0);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  function frame(ts: number) {
    const g = gRef.current;
    const canvas = canvasRef.current;
    if (!g || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const last = g.last || ts;
    const dtMs = Math.min(ts - last, 50);
    const dt = Math.min(dtMs / 16.67, 3);
    g.last = ts;
    update(g, dt, dtMs);
    render(g, ctx);
    rafRef.current = requestAnimationFrame(frame);
  }

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    function sizeNow() {
      const el = wrapRef.current;
      const cv = canvasRef.current;
      if (!el || !cv) return;
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cw = rect.width;
      const ch = rect.height;
      cv.width = Math.round(cw * dpr);
      cv.height = Math.round(ch * dpr);
      const scale = Math.min(cw / FIELD, ch / FIELD);
      const offX = (cw - FIELD * scale) / 2;
      const offY = (ch - FIELD * scale) / 2;
      if (!gRef.current) {
        gRef.current = {
          dpr,
          cw,
          ch,
          scale,
          offX,
          offY,
          snake: [{ x: 15, y: 15 }],
          prev: [{ x: 15, y: 15 }],
          grew: false,
          dir: { x: 0, y: 0 },
          queue: [],
          food: { x: 22, y: 15 },
          score: 0,
          stepMs: SPEEDS.normal,
          stepAcc: 0,
          foodPhase: 0,
          particles: [],
          pulses: [],
          floats: [],
          last: 0,
        };
      } else {
        Object.assign(gRef.current, { dpr, cw, ch, scale, offX, offY });
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

  function changeDir(x: number, y: number) {
    const g = gRef.current;
    if (!g || phaseRef.current !== 'playing') return;
    const nd = { x, y };
    const ref = g.queue.length ? g.queue[g.queue.length - 1] : g.dir;
    if (opp(nd, ref) || (nd.x === ref.x && nd.y === ref.y)) return;
    if (g.queue.length < 2) {
      g.queue.push(nd);
      setAwaiting(false);
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phaseRef.current !== 'playing') return;
      let handled = true;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          changeDir(0, -1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          changeDir(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          changeDir(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          changeDir(1, 0);
          break;
        default:
          handled = false;
      }
      if (handled) e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function onTouchStart(e: React.TouchEvent) {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  function onTouchEnd(e: React.TouchEvent) {
    const s = touchRef.current;
    if (!s) return;
    const dx = e.changedTouches[0].clientX - s.x;
    const dy = e.changedTouches[0].clientY - s.y;
    if (Math.abs(dx) < 18 && Math.abs(dy) < 18) return;
    if (Math.abs(dx) > Math.abs(dy)) changeDir(dx > 0 ? 1 : -1, 0);
    else changeDir(0, dy > 0 ? 1 : -1);
    touchRef.current = null;
  }

  const speedOpts: Speed[] = ['slow', 'normal', 'fast'];

  return (
    <div
      ref={wrapRef}
      className='relative h-full min-h-[460px] w-full touch-none select-none'
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <canvas ref={canvasRef} className='absolute inset-0 h-full w-full' />

      {(phase === 'playing' || phase === 'over') && (
        <div className='pointer-events-none absolute inset-x-0 top-0 mx-auto flex max-w-[680px] items-start justify-between p-5 text-white'>
          <span
            key={score}
            className='sn-score inline-block text-[26px] font-bold leading-none text-white/90'
          >
            {score}
          </span>
          <span className='rounded-full bg-white/10 px-3 py-1 text-[13px] font-medium text-white/70'>
            {tx.best} {best}
          </span>
        </div>
      )}

      {phase === 'playing' && awaiting && (
        <div className='pointer-events-none absolute bottom-24 left-1/2 -translate-x-1/2'>
          <span className='sn-in rounded-full bg-black/35 px-4 py-2 text-[13px] font-medium text-white/80 ring-1 ring-white/10'>
            {tx.hint}
          </span>
        </div>
      )}

      {phase === 'playing' && (
        <div className='absolute bottom-5 left-1/2 -translate-x-1/2 sm:hidden'>
          <div className='grid grid-cols-3 grid-rows-3 gap-1.5'>
            <button
              type='button'
              aria-label='Up'
              onClick={() => changeDir(0, -1)}
              className='sn-pad col-start-2 row-start-1'
            >
              ↑
            </button>
            <button
              type='button'
              aria-label='Left'
              onClick={() => changeDir(-1, 0)}
              className='sn-pad col-start-1 row-start-2'
            >
              ←
            </button>
            <button
              type='button'
              aria-label='Down'
              onClick={() => changeDir(0, 1)}
              className='sn-pad col-start-2 row-start-2'
            >
              ↓
            </button>
            <button
              type='button'
              aria-label='Right'
              onClick={() => changeDir(1, 0)}
              className='sn-pad col-start-3 row-start-2'
            >
              →
            </button>
          </div>
        </div>
      )}

      {phase === 'idle' && (
        <div className='sn-in absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center'>
          <p className='max-w-[360px] text-[14px] leading-relaxed text-white/70'>
            {tx.sub}
          </p>
          <div className='w-full max-w-[400px] rounded-[14px] bg-white/[0.05] px-5 py-4 text-left ring-1 ring-white/10'>
            <div className='mb-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/40'>
              {tx.rulesTitle}
            </div>
            <ul className='space-y-2'>
              {tx.rules.map((r, i) => (
                <li
                  key={i}
                  className='flex items-start gap-2.5 text-[13px] leading-relaxed text-white/75'
                >
                  <span
                    aria-hidden='true'
                    className='mt-[7px] h-1 w-1 shrink-0 rounded-full bg-white/30'
                  />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-[12px] font-semibold uppercase tracking-[0.14em] text-white/40'>
              {tx.speed}
            </span>
            {speedOpts.map((s) => (
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
          <button
            type='button'
            onClick={() => gRef.current && start(gRef.current)}
            className='sn-btn inline-flex items-center rounded-full bg-white px-9 py-3 text-[15px] font-semibold text-[#121212] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101512]'
          >
            {tx.start}
          </button>
        </div>
      )}

      {phase === 'over' && (
        <div className='sn-in absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/35 px-6 text-center'>
          <div className='text-[14px] font-semibold text-white/70'>
            {tx.over}
          </div>
          <div className='text-[44px] font-bold leading-none text-white/90'>
            {score}
          </div>
          <div className='mb-3 text-[13px] font-medium text-white/50'>
            {tx.best} · {best}
          </div>
          <button
            type='button'
            onClick={() => gRef.current && start(gRef.current)}
            className='sn-btn inline-flex items-center rounded-full bg-white px-9 py-3 text-[15px] font-semibold text-[#121212] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101512]'
          >
            {tx.again}
          </button>
        </div>
      )}

      <style>{`
        @keyframes snIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        .sn-in { animation: snIn 0.18s cubic-bezier(0.23, 1, 0.32, 1) both; }
        @keyframes snScore { 0% { transform: scale(1.7); } 100% { transform: scale(1); } }
        .sn-score { animation: snScore 0.3s cubic-bezier(0.23, 1, 0.32, 1); transform-origin: left center; }
        .sn-btn { transition: transform 0.15s cubic-bezier(0.23, 1, 0.32, 1), background-color 0.2s ease; }
        .sn-btn:hover { transform: scale(1.02); background-color: rgba(255, 255, 255, 0.9); }
        .sn-btn:active { transform: scale(0.97); }
        .sn-pad { width: 52px; height: 52px; border-radius: 13px; font-size: 22px; color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.18); backdrop-filter: blur(6px); }
        .sn-pad:active { background: rgba(255,255,255,0.28); }
        @media (prefers-reduced-motion: reduce) {
          .sn-in, .sn-score { animation: none; }
          .sn-btn { transition: none; }
          .sn-btn:hover, .sn-btn:active { transform: none; }
        }
      `}</style>
    </div>
  );
}

'use client';

import { type ReactNode, useEffect, useRef } from 'react';

import { Frames } from '@/components/demos/DemoKit';

/* Per-game demos, owned by the games domain. Snake and Doodle Jump are real
   auto-played simulations (actual movement/physics) drawn with each game's
   own palette, so the preview matches the real thing rather than faking it. */

function GameStage({ bg, children }: { bg: string; children: ReactNode }) {
  return (
    <div
      className='relative h-[244px] w-full overflow-hidden rounded-[16px] border border-white/10 shadow-sm'
      style={{ background: bg }}
    >
      {children}
    </div>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

function mix(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const r = Math.round(
    ((pa >> 16) & 255) + (((pb >> 16) & 255) - ((pa >> 16) & 255)) * t
  );
  const g = Math.round(
    ((pa >> 8) & 255) + (((pb >> 8) & 255) - ((pa >> 8) & 255)) * t
  );
  const bl = Math.round((pa & 255) + ((pb & 255) - (pa & 255)) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

/* Snake — greedy AI walks the grid toward the food, eats → grows + turns. */
function SnakeDemo({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!active) return;
    const cv = ref.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let cell = 16;
    let cols = 20;
    let rows = 12;
    let W = 0;
    let H = 0;
    const resize = () => {
      const r = cv.getBoundingClientRect();
      W = r.width;
      H = r.height;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = Math.max(13, Math.floor(Math.min(W, H) / 11));
      cols = Math.max(6, Math.floor(W / cell));
      rows = Math.max(5, Math.floor(H / cell));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    type Cell = { x: number; y: number };
    let snake: Cell[] = [];
    let dir: Cell = { x: 1, y: 0 };
    let food: Cell = { x: 0, y: 0 };
    let grow = 0;
    const placeFood = () => {
      let c: Cell;
      do {
        c = {
          x: Math.floor(Math.random() * cols),
          y: Math.floor(Math.random() * rows),
        };
      } while (snake.some((s) => s.x === c.x && s.y === c.y));
      food = c;
    };
    const reset = () => {
      const cy = Math.floor(rows / 2);
      snake = [
        { x: 3, y: cy },
        { x: 2, y: cy },
        { x: 1, y: cy },
      ];
      dir = { x: 1, y: 0 };
      grow = 0;
      placeFood();
    };
    reset();

    const choose = (): Cell | null => {
      const head = snake[0];
      const cand: Cell[] = [];
      if (food.x !== head.x) cand.push({ x: Math.sign(food.x - head.x), y: 0 });
      if (food.y !== head.y) cand.push({ x: 0, y: Math.sign(food.y - head.y) });
      cand.push(
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 }
      );
      for (const d of cand) {
        if (d.x === -dir.x && d.y === -dir.y) continue;
        const nx = head.x + d.x;
        const ny = head.y + d.y;
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
        if (
          snake.some((s, i) => i < snake.length - 1 && s.x === nx && s.y === ny)
        )
          continue;
        return d;
      }
      return null;
    };
    const step = () => {
      const d = choose();
      if (!d) return reset();
      dir = d;
      const head = { x: snake[0].x + d.x, y: snake[0].y + d.y };
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        grow += 2;
        placeFood();
      }
      if (grow > 0) grow--;
      else snake.pop();
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#0f1512';
      ctx.fillRect(0, 0, W, H);
      const ox = (W - cols * cell) / 2;
      const oy = (H - rows * cell) / 2;
      ctx.strokeStyle = 'rgba(120,200,150,0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= cols; x++) {
        ctx.beginPath();
        ctx.moveTo(ox + x * cell, oy);
        ctx.lineTo(ox + x * cell, oy + rows * cell);
        ctx.stroke();
      }
      for (let y = 0; y <= rows; y++) {
        ctx.beginPath();
        ctx.moveTo(ox, oy + y * cell);
        ctx.lineTo(ox + cols * cell, oy + y * cell);
        ctx.stroke();
      }
      const fx = ox + food.x * cell + cell / 2;
      const fy = oy + food.y * cell + cell / 2;
      const fg = ctx.createRadialGradient(fx, fy, 1, fx, fy, cell * 0.6);
      fg.addColorStop(0, '#ffe7b3');
      fg.addColorStop(0.55, '#ffb24a');
      fg.addColorStop(1, '#ff8a1f');
      ctx.fillStyle = fg;
      ctx.beginPath();
      ctx.arc(fx, fy, cell * 0.32, 0, Math.PI * 2);
      ctx.fill();
      for (let i = snake.length - 1; i >= 0; i--) {
        const s = snake[i];
        const t = snake.length > 1 ? i / (snake.length - 1) : 0;
        ctx.fillStyle = i === 0 ? '#46e89a' : mix('#27bd76', '#1b7a4c', t);
        roundRect(
          ctx,
          ox + s.x * cell + 1.5,
          oy + s.y * cell + 1.5,
          cell - 3,
          cell - 3,
          4
        );
        ctx.fill();
      }
      const h = snake[0];
      const hx = ox + h.x * cell + cell / 2;
      const hy = oy + h.y * cell + cell / 2;
      const nx = -dir.y;
      const ny = dir.x;
      ctx.fillStyle = '#0a0f0c';
      ctx.beginPath();
      ctx.arc(
        hx + dir.x * cell * 0.16 + nx * cell * 0.18,
        hy + dir.y * cell * 0.16 + ny * cell * 0.18,
        1.7,
        0,
        Math.PI * 2
      );
      ctx.arc(
        hx + dir.x * cell * 0.16 - nx * cell * 0.18,
        hy + dir.y * cell * 0.16 - ny * cell * 0.18,
        1.7,
        0,
        Math.PI * 2
      );
      ctx.fill();
    };

    let raf = 0;
    let acc = 0;
    let last = 0;
    let visible = true;
    const STEP = 150;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      threshold: 0.1,
    });
    io.observe(cv);
    const loop = (t: number) => {
      if (visible) {
        if (last) acc += t - last;
        while (acc >= STEP) {
          step();
          acc -= STEP;
        }
        draw();
      }
      last = t;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [active]);
  return (
    <GameStage bg='#0f1512'>
      <canvas className='absolute inset-0 h-full w-full' ref={ref} />
    </GameStage>
  );
}

/* Doodle Jump — physics: gravity + auto-steer toward the next platform, bounce
   on landing, camera scrolls as it climbs. */
function DoodleJumpDemo({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!active) return;
    const cv = ref.current;
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = 0;
    let H = 0;
    const resize = () => {
      const r = cv.getBoundingClientRect();
      W = r.width;
      H = r.height;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    const G = 0.38;
    const JUMP = 9.6;
    const SPRING_MULT = 1.4;
    const MAXVX = 3.9;
    const PW = 46;
    const PH = 9;
    const R = 13;
    const GAP = 40;
    // platform type bitflags + colours, mirroring the real game
    const FRAGILE = 1;
    const MOVING = 2;
    const SPRING = 4;
    const SPIKE = 8;
    const platColor = (t: number) => {
      if (t & SPIKE) return t & MOVING ? '#26C6DA' : '#B71C1C';
      if (t & SPRING) {
        if (t & FRAGILE) return '#FFA726';
        if (t & MOVING) return '#66BB6A';
        return '#FF9800';
      }
      if (t & FRAGILE) return t & MOVING ? '#AB47BC' : '#F06292';
      if (t & MOVING) return '#42A5F5';
      return '#8B4513';
    };
    const okToLand = (t: number) => !(t & SPIKE);
    type Plat = { x: number; y: number; t: number; vx: number; dead: boolean };
    const randType = (prevSpring: boolean) => {
      let t = 0;
      if (Math.random() < 0.25) {
        if (Math.random() < 0.3) t |= FRAGILE;
        if (Math.random() < 0.3) t |= MOVING;
        if (Math.random() < 0.2) t |= SPRING;
      } else if (prevSpring) {
        t = SPIKE;
        if (Math.random() < 0.5) t |= MOVING;
      }
      return t;
    };
    const mvx = (t: number) =>
      t & MOVING
        ? (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 0.7)
        : 0;
    let plats: Plat[] = [];
    let ch = { x: 0, y: 0, vy: 0 };
    let stars: { x: number; y: number; r: number }[] = [];
    let topSpring = false;
    // a spike always gets a safe platform beside it so the climb never dead-ends
    const addSafe = (x: number, y: number) => {
      const left = x - PW - 14;
      const sx =
        left > 10 ? Math.random() * left : x + PW + 14 + Math.random() * 16;
      plats.push({
        x: Math.max(8, Math.min(W - PW - 8, sx)),
        y,
        t: 0,
        vx: 0,
        dead: false,
      });
    };
    const spawn = (x: number, y: number, prevSpring: boolean) => {
      const t = randType(prevSpring);
      plats.push({ x, y, t, vx: mvx(t), dead: false });
      if (t & SPIKE) addSafe(x, y);
      return (t & SPRING) !== 0;
    };
    const init = () => {
      const baseY = H - 28;
      plats = [{ x: W / 2 - PW / 2, y: baseY, t: 0, vx: 0, dead: false }];
      let y = baseY;
      let prev = false;
      while (y > -20) {
        y -= GAP + Math.random() * 22;
        prev = spawn(Math.random() * (W - PW), y, prev);
      }
      topSpring = prev;
      ch = { x: W / 2, y: baseY - R, vy: -JUMP };
      stars = Array.from({ length: 16 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.3,
      }));
    };
    init();

    // frames for the falling char to reach a target y (solves the parabola)
    const timeTo = (y1: number) => {
      const a = 0.5 * G;
      const c = ch.y + R - y1;
      const disc = ch.vy * ch.vy - 4 * a * c;
      if (disc < 0) return 24;
      return Math.max(2, (-ch.vy + Math.sqrt(disc)) / (2 * a));
    };
    let target: Plat | null = null;
    // Chosen at take-off: the nearest safe platform above that this jump can
    // actually reach, so the hop has a clear direction from the start.
    const pickTarget = (): Plat | null => {
      const apexY = ch.y - (ch.vy * ch.vy) / (2 * G);
      let best: Plat | null = null;
      for (const p of plats) {
        if (p.dead || !okToLand(p.t)) continue;
        if (p.y > ch.y - 8 || p.y < apexY + 10) continue; // above & reachable
        if (!best || p.y > best.y) best = p; // nearest one up → steady climb
      }
      if (!best) {
        // nothing above in reach — fall onto the nearest platform below
        for (const p of plats) {
          if (p.dead || !okToLand(p.t)) continue;
          if (p.y > ch.y + R && (!best || p.y < best.y)) best = p;
        }
      }
      return best;
    };
    const centerX = (p: Plat) => {
      if (p.t & MOVING) {
        const t = timeTo(p.y);
        return Math.max(PW / 2, Math.min(W - PW / 2, p.x + PW / 2 + p.vx * t));
      }
      return p.x + PW / 2;
    };

    const update = () => {
      for (const p of plats) {
        if (!(p.t & MOVING) || p.dead) continue;
        p.x += p.vx;
        if (p.x < 0) {
          p.x = 0;
          p.vx *= -1;
        } else if (p.x > W - PW) {
          p.x = W - PW;
          p.vx *= -1;
        }
      }
      // Commit to a target at take-off, then size the horizontal velocity to the
      // parabolic flight time (dx / framesToTarget) so the ballistic arc lands on
      // the platform instead of merely drifting toward it.
      if (!target || target.dead) target = pickTarget();
      if (target) {
        const dx = centerX(target) - ch.x;
        ch.x += Math.max(-MAXVX, Math.min(MAXVX, dx / timeTo(target.y)));
      }
      ch.vy += G;
      ch.y += ch.vy;
      if (ch.vy > 0) {
        for (const p of plats) {
          if (p.dead) continue;
          if (
            ch.x + R * 0.5 > p.x &&
            ch.x - R * 0.5 < p.x + PW &&
            ch.y + R >= p.y &&
            ch.y + R <= p.y + PH + ch.vy
          ) {
            if (p.t & SPIKE) return init();
            ch.y = p.y - R;
            ch.vy = p.t & SPRING ? -JUMP * SPRING_MULT : -JUMP;
            if (p.t & FRAGILE) p.dead = true;
            target = null;
            break;
          }
        }
      }
      if (ch.y < H * 0.5) {
        const d = H * 0.5 - ch.y;
        ch.y += d;
        plats.forEach((p) => (p.y += d));
        stars.forEach((s) => {
          s.y += d * 0.4;
          if (s.y > H) s.y -= H;
        });
      }
      plats = plats.filter((p) => !p.dead && p.y < H + 30);
      let top = plats.length ? Math.min(...plats.map((p) => p.y)) : 0;
      while (top > -10) {
        top -= GAP + Math.random() * 22;
        topSpring = spawn(Math.random() * (W - PW), top, topSpring);
      }
      if (ch.y > H + 40) init();
    };

    const drawPlat = (p: Plat) => {
      if (p.t & SPIKE) {
        // teeth flush along the platform's top edge, spanning its full width
        const n = 5;
        const tw = PW / n;
        ctx.fillStyle = '#fecaca';
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
          const x0 = p.x + i * tw;
          ctx.moveTo(x0, p.y + 1);
          ctx.lineTo(x0 + tw / 2, p.y - 6);
          ctx.lineTo(x0 + tw, p.y + 1);
        }
        ctx.closePath();
        ctx.fill();
      }
      ctx.fillStyle = platColor(p.t);
      roundRect(ctx, p.x, p.y, PW, PH, 4);
      ctx.fill();
      if (p.t & SPRING) {
        ctx.fillStyle = '#ffe0b2';
        ctx.fillRect(p.x + PW / 2 - 5, p.y - 5, 10, 5);
      }
      if (p.t & FRAGILE) {
        ctx.strokeStyle = 'rgba(0,0,0,0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x + 14, p.y);
        ctx.lineTo(p.x + 20, p.y + PH);
        ctx.moveTo(p.x + 32, p.y);
        ctx.lineTo(p.x + 27, p.y + PH);
        ctx.stroke();
      }
    };

    const draw = () => {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#121a33');
      g.addColorStop(0.5, '#0b0e18');
      g.addColorStop(1, '#06080e');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      for (const s of stars) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const p of plats) drawPlat(p);
      ctx.save();
      ctx.translate(ch.x, ch.y);
      const gl = ctx.createRadialGradient(0, 0, 2, 0, 0, R + 10);
      gl.addColorStop(0, 'rgba(70,185,255,0.42)');
      gl.addColorStop(1, 'rgba(70,185,255,0)');
      ctx.fillStyle = gl;
      ctx.beginPath();
      ctx.arc(0, 0, R + 10, 0, Math.PI * 2);
      ctx.fill();
      const b = ctx.createRadialGradient(-5, -6, 2, 0, 2, R + 3);
      b.addColorStop(0, '#d6f0ff');
      b.addColorStop(0.45, '#6cc6f6');
      b.addColorStop(1, '#1f9be6');
      ctx.fillStyle = b;
      ctx.beginPath();
      ctx.arc(0, 0, R, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0b1020';
      ctx.beginPath();
      ctx.arc(-5, -2, 2, 0, Math.PI * 2);
      ctx.arc(5, -2, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      threshold: 0.1,
    });
    io.observe(cv);
    const loop = () => {
      if (visible) {
        update();
        draw();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [active]);
  return (
    <GameStage bg='#0b0e18'>
      <canvas className='absolute inset-0 h-full w-full' ref={ref} />
    </GameStage>
  );
}

/* Slot Machine — dark vegas stage, gold trim, the game's six real symbols. */
function Reel({ symbols, dur }: { symbols: string[]; dur: number }) {
  const strip = [...symbols, ...symbols];
  return (
    <div
      className='relative h-full flex-1 overflow-hidden rounded-[8px] border border-[#e0b34a]/30'
      style={{ background: 'rgba(20,10,12,0.6)' }}
    >
      <div
        className='demo-reel flex flex-col items-center'
        style={{ animationDuration: `${dur}s` }}
      >
        {strip.map((s, i) => (
          <div
            key={i}
            className='flex h-[46px] shrink-0 items-center justify-center text-[26px]'
          >
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

function SlotDemo() {
  const s = ['7️⃣', '💎', '🔔', '🍋', '🍒', '⭐'];
  return (
    <GameStage bg='radial-gradient(125% 80% at 50% -10%, #3a1218 0%, #1c0a0e 48%, #0d0507 100%)'>
      <div className='flex h-full flex-col p-3'>
        <div className='mb-2 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-[#e7c873]'>
          Match three to win
        </div>
        <div className='relative flex flex-1 gap-2'>
          <Reel dur={1.0} symbols={s} />
          <Reel dur={1.3} symbols={[...s].reverse()} />
          <Reel dur={1.6} symbols={[s[2], s[4], s[0], s[5], s[1], s[3]]} />
          <div className='pointer-events-none absolute inset-x-0 top-1/2 h-[46px] -translate-y-1/2 rounded-[6px] border-2 border-[#e0b34a]/70' />
        </div>
      </div>
    </GameStage>
  );
}

/* Daily Fortune — dark/gold draw → fortune-card reveal. */
function DailyLuckDemo() {
  return (
    <GameStage bg='radial-gradient(125% 80% at 50% -10%, #2c1c30 0%, #1a1018 48%, #0e0a0d 100%)'>
      <div className='h-full p-3'>
        <Frames
          interval={2400}
          frames={[
            <div
              key='draw'
              className='flex h-full flex-col items-center justify-center gap-3'
            >
              <span className='text-[26px]'>🔮</span>
              <span className='rounded-full bg-gradient-to-b from-[#f0c45a] to-[#d9982e] px-6 py-2 text-[13px] font-extrabold text-[#2a1d05]'>
                Draw fortune
              </span>
            </div>,
            <div
              key='result'
              className='flex h-full items-center justify-center'
            >
              <div
                className='w-full rounded-[14px] border border-[#e0b34a]/30 p-3 text-center'
                style={{ background: 'rgba(18,14,26,0.6)' }}
              >
                <div className='text-[10px] font-bold uppercase tracking-[0.16em] text-[#e7c873]'>
                  ✦ Today&apos;s fortune
                </div>
                <div className='mt-0.5 text-[20px] font-black text-[#e7c873]'>
                  Great Fortune
                </div>
                <div className='mt-2 grid grid-cols-2 gap-2'>
                  <div className='rounded-[10px] bg-white/5 px-2 py-1.5'>
                    <div className='text-[9px] font-bold uppercase tracking-wide text-[#34d399]'>
                      Lucky color
                    </div>
                    <div className='mt-0.5 flex items-center justify-center gap-1 text-[11px] text-white/80'>
                      <span
                        className='h-2.5 w-2.5 rounded-full'
                        style={{ background: '#50C878' }}
                      />
                      Emerald
                    </div>
                  </div>
                  <div className='rounded-[10px] bg-white/5 px-2 py-1.5'>
                    <div className='text-[9px] font-bold uppercase tracking-wide text-[#f87171]'>
                      Lucky number
                    </div>
                    <div className='mt-0.5 text-[13px] font-bold text-white/85'>
                      7
                    </div>
                  </div>
                </div>
              </div>
            </div>,
          ]}
        />
      </div>
    </GameStage>
  );
}

const GAME_DEMOS: Record<string, (p: { active: boolean }) => ReactNode> = {
  snake: SnakeDemo,
  'doodle-jump': DoodleJumpDemo,
  'slot-machine': SlotDemo,
  'daily-luck': DailyLuckDemo,
};

export function GameDemo({
  slug,
  active = false,
}: {
  slug: string;
  active?: boolean;
}) {
  const D = GAME_DEMOS[slug];
  return D ? <D active={active} /> : null;
}

export const GAME_DEMO_SLUGS = Object.keys(GAME_DEMOS);

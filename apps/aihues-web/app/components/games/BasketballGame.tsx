'use client';

import { useEffect, useRef, useState } from 'react';

import type { Locale } from '@/lib/dict';

/* Basketball Shootout — native port of the original game, Kimi-styled.
   Landscape court, an auto-sweeping aim angle (25°–70°) and a click / tap /
   Space timing shot at fixed power; gravity arc, floor / backboard / rim
   bounces, score-through-the-rim detection, streak multipliers, 60s clock.
   The transparent canvas fills the stage; the 860×420 playfield letterboxes
   inside and the floor paints full width. */

const W = 860;
const H = 420;
const GRAVITY = 0.35;
const SHOOT_POWER = 16.5;
const AIM_MIN = 25;
const AIM_MAX = 70;
const AIM_SPEED = 2;
const DURATION = 60;
const GROUND_Y = 360;
const HOOP_X = 680;
const HOOP_Y = 195;
const HOOP_W = 52;
const BALL_R = 14;
const BACKBOARD_H = 70;

// Kimi tokens (dark) — values from kimi-design-skill/references/tokens.json
const C = {
  court: '#242a33', // cool dark court surface
  courtDark: '#171c23',
  courtLine: 'rgba(255,255,255,0.12)', // separator.s1
  ball: '#ff9f0a', // status.orange
  ballLight: '#ffc266',
  ballDark: '#e07a00',
  ballSeam: 'rgba(0,0,0,0.55)',
  ballHi: 'rgba(255,255,255,0.2)',
  rim: '#ff9f0a', // status.orange
  rimBack: 'rgba(255,159,10,0.45)',
  board: 'rgba(255,255,255,0.1)', // fills.f2
  boardLine: 'rgba(255,255,255,0.25)', // fills.f4
  net: 'rgba(255,255,255,0.42)', // labels.tertiary
  pole: '#4d4d4d', // background.quaternary
  fx: '#ffd24a', // celebratory gold
  fxGlow: 'rgba(255,205,80,0.85)',
  aim: 'rgba(255,255,255,0.42)', // labels.tertiary
};

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  scored: boolean;
  rot: number;
  rotSpeed: number;
  trail: { x: number; y: number }[];
  dead: number;
  banked: boolean;
}
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  r: number;
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
  label?: string;
}
interface BGame {
  dpr: number;
  cw: number;
  ch: number;
  scale: number;
  offX: number;
  offY: number;
  ball: Ball | null;
  aimAngle: number;
  aimTime: number;
  score: number;
  streak: number;
  timeLeft: number;
  timeAcc: number;
  particles: Particle[];
  pulses: Pulse[];
  floats: Float[];
  last: number;
}

const T = {
  en: {
    start: 'Start',
    again: 'Play again',
    over: "Time's up",
    best: 'Best',
    time: 'Time',
    streak: 'streak',
    swish: 'SWISH',
    hint: 'Click or press Space to shoot at the right angle',
    sub: 'Time the sweeping arrow and sink the shot. 60 seconds.',
    rulesTitle: 'How to play',
    rules: [
      '60 seconds on the clock — score as many points as you can.',
      'The aim arrow sweeps up and down; click or press Space to shoot at the right angle.',
      'Each basket scores 2 points.',
      'Hit consecutive shots to build a streak: ×1.5 at 2, ×2 at 3, ×3 at 5 in a row.',
      'Missing a shot resets your streak.',
    ],
  },
  zh: {
    start: '开始',
    again: '再来一局',
    over: '时间到',
    best: '最佳',
    time: '时间',
    streak: '连击',
    swish: '空心',
    hint: '在合适角度点击或按空格投篮',
    sub: '把握摆动的箭头,瞄准入筐。限时 60 秒。',
    rulesTitle: '玩法规则',
    rules: [
      '限时 60 秒,尽可能多得分。',
      '瞄准箭头会上下摆动,在合适角度点击或按空格投篮。',
      '每次投进得 2 分。',
      '连续命中触发连击加成:2 连 ×1.5、3 连 ×2、5 连 ×3。',
      '投失则连击清零。',
    ],
  },
} as const;

export default function BasketballGame({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const tx = T[zh ? 'zh' : 'en'];
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gRef = useRef<BGame | null>(null);
  const rafRef = useRef<number>(0);
  const phaseRef = useRef<'idle' | 'playing' | 'over'>('idle');

  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [time, setTime] = useState(DURATION);
  const [best, setBest] = useState(0);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const v = Number(localStorage.getItem('aihues_hoops_best') || '0');
      if (!Number.isNaN(v)) setBest(v);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  function setPhaseBoth(p: 'idle' | 'playing' | 'over') {
    phaseRef.current = p;
    setPhase(p);
  }

  function shoot(g: BGame) {
    if (phaseRef.current !== 'playing' || (g.ball && !g.ball.dead)) return;
    const rad = (g.aimAngle * Math.PI) / 180;
    g.ball = {
      x: 120,
      y: GROUND_Y - 20,
      vx: Math.cos(rad) * SHOOT_POWER,
      vy: -Math.sin(rad) * SHOOT_POWER,
      scored: false,
      rot: 0,
      rotSpeed: (Math.random() - 0.5) * 0.3,
      trail: [],
      dead: 0,
      banked: false,
    };
  }

  function start(g: BGame) {
    g.ball = null;
    g.aimAngle = AIM_MIN;
    g.aimTime = 0;
    g.score = 0;
    g.streak = 0;
    g.timeLeft = DURATION;
    g.timeAcc = 0;
    g.particles = [];
    g.pulses = [];
    g.floats = [];
    g.last = 0;
    setScore(0);
    setStreak(0);
    setTime(DURATION);
    setPhaseBoth('playing');
  }

  function endGame(g: BGame) {
    if (phaseRef.current !== 'playing') return;
    let stored = 0;
    try {
      stored = Number(localStorage.getItem('aihues_hoops_best') || '0') || 0;
    } catch {
      stored = 0;
    }
    if (g.score > stored) {
      try {
        localStorage.setItem('aihues_hoops_best', String(g.score));
      } catch {
        /* ignore */
      }
      setBest(g.score);
    } else {
      setBest(stored);
    }
    setPhaseBoth('over');
  }

  function scoreFx(
    g: BGame,
    x: number,
    y: number,
    pts: number,
    swish: boolean
  ) {
    g.pulses.push({ x, y, t: 0 });
    g.floats.push({
      x,
      y: y - 28,
      t: 0,
      text: `+${pts}`,
      label: swish ? tx.swish : undefined,
    });
    const n = swish ? 26 : 18;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = Math.random() * (swish ? 6 : 5);
      g.particles.push({
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 2.5,
        life: 1,
        r: 2 + Math.random() * 3,
      });
    }
  }

  function update(g: BGame, dt: number, dtMs: number) {
    if (phaseRef.current !== 'playing') {
      for (let i = g.pulses.length - 1; i >= 0; i--) {
        g.pulses[i].t += dt * 0.05;
        if (g.pulses[i].t >= 1) g.pulses.splice(i, 1);
      }
      for (let i = g.floats.length - 1; i >= 0; i--) {
        g.floats[i].t += dt * 0.035;
        if (g.floats[i].t >= 1) g.floats.splice(i, 1);
      }
      return;
    }

    g.timeAcc += dtMs;
    while (g.timeAcc >= 1000) {
      g.timeAcc -= 1000;
      g.timeLeft -= 1;
      setTime(Math.max(0, g.timeLeft));
      if (g.timeLeft <= 0) {
        endGame(g);
        return;
      }
    }

    g.aimTime += dt * 0.016;
    const range = AIM_MAX - AIM_MIN;
    g.aimAngle =
      AIM_MIN +
      range / 2 +
      Math.sin((g.aimTime * Math.PI * 2) / AIM_SPEED) * (range / 2);

    for (let i = g.particles.length - 1; i >= 0; i--) {
      const p = g.particles[i];
      p.vy += 0.18 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= 0.02 * dt;
      if (p.life <= 0) g.particles.splice(i, 1);
    }
    for (let i = g.pulses.length - 1; i >= 0; i--) {
      g.pulses[i].t += dt * 0.05;
      if (g.pulses[i].t >= 1) g.pulses.splice(i, 1);
    }
    for (let i = g.floats.length - 1; i >= 0; i--) {
      g.floats[i].t += dt * 0.035;
      if (g.floats[i].t >= 1) g.floats.splice(i, 1);
    }

    const b = g.ball;
    if (!b) return;
    if (b.dead) {
      b.dead -= dtMs;
      if (b.dead <= 0) g.ball = null;
      return;
    }

    const prevY = b.y;
    b.vy += GRAVITY * dt;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.rot += b.rotSpeed * dt;
    b.trail.push({ x: b.x, y: b.y });
    if (b.trail.length > 12) b.trail.shift();

    if (
      !b.scored &&
      b.vy > 0 &&
      prevY < HOOP_Y &&
      b.y >= HOOP_Y &&
      Math.abs(b.x - HOOP_X) < HOOP_W / 2 - 4
    ) {
      b.scored = true;
      g.streak += 1;
      const mult =
        g.streak >= 5 ? 3 : g.streak >= 3 ? 2 : g.streak >= 2 ? 1.5 : 1;
      const swish = !b.banked;
      const pts = Math.round(2 * mult) + (swish ? 1 : 0);
      g.score += pts;
      setScore(g.score);
      setStreak(g.streak);
      scoreFx(g, HOOP_X, HOOP_Y + 16, pts, swish);
    }

    const bbX = HOOP_X + HOOP_W / 2 + 6;
    if (
      b.x + BALL_R > bbX &&
      b.x - BALL_R < bbX + 8 &&
      b.y > HOOP_Y - BACKBOARD_H &&
      b.y < HOOP_Y + 16
    ) {
      b.vx *= -0.6;
      b.x = bbX - BALL_R;
      b.banked = true;
    }
    for (const rx of [HOOP_X - HOOP_W / 2, HOOP_X + HOOP_W / 2]) {
      const dx = b.x - rx;
      const dy = b.y - HOOP_Y;
      if (Math.sqrt(dx * dx + dy * dy) < BALL_R + 4) {
        b.vx *= -0.5;
        b.vy *= 0.7;
        b.x += dx > 0 ? 3 : -3;
      }
    }

    if (b.y + BALL_R >= GROUND_Y) {
      b.y = GROUND_Y - BALL_R;
      b.vy *= -0.55;
      b.vx *= 0.85;
      if (Math.abs(b.vy) < 1 && Math.abs(b.vx) < 0.5) {
        if (!b.scored) {
          g.streak = 0;
          setStreak(0);
        }
        b.dead = 350;
      }
    }
    if (b.x - BALL_R > W && !b.dead) {
      if (!b.scored) {
        g.streak = 0;
        setStreak(0);
      }
      b.dead = 60;
    }
  }

  function drawHoop(ctx: CanvasRenderingContext2D) {
    const rimL = HOOP_X - HOOP_W / 2;
    const rimR = HOOP_X + HOOP_W / 2;
    const BW = 9;
    const boardX = rimR;
    const boardTop = HOOP_Y - BACKBOARD_H + 20;

    // pole + base (behind the board)
    ctx.fillStyle = C.pole;
    ctx.fillRect(boardX + BW, HOOP_Y - 20, 7, GROUND_Y - HOOP_Y + 20);
    ctx.fillRect(boardX + BW - 6, GROUND_Y - 4, 22, 4);

    // backboard + shooter's box (on the board, facing the court)
    ctx.fillStyle = C.board;
    ctx.fillRect(boardX, boardTop, BW, BACKBOARD_H);
    ctx.strokeStyle = C.boardLine;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(boardX, boardTop, BW, BACKBOARD_H);
    ctx.strokeStyle = C.rim;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(boardX, HOOP_Y - 25, BW, 40);

    // net — tapering diamond mesh
    const netH = 34;
    const botL = rimL + 9;
    const botR = rimR - 9;
    ctx.strokeStyle = C.net;
    ctx.lineWidth = 1;
    const cols = 6;
    ctx.beginPath();
    for (let i = 0; i <= cols; i++) {
      const tt = i / cols;
      ctx.moveTo(rimL + tt * HOOP_W, HOOP_Y);
      ctx.lineTo(botL + tt * (botR - botL), HOOP_Y + netH);
    }
    for (let r = 1; r <= 3; r++) {
      const ry = HOOP_Y + (netH * r) / 3;
      const inset = (HOOP_W - (botR - botL)) * (r / 3) * 0.5;
      ctx.moveTo(rimL + inset, ry);
      ctx.lineTo(rimR - inset, ry);
    }
    ctx.stroke();

    // rim
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = C.rimBack;
    ctx.beginPath();
    ctx.ellipse(HOOP_X, HOOP_Y, HOOP_W / 2, 6, 0, Math.PI, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = C.rim;
    ctx.beginPath();
    ctx.ellipse(HOOP_X, HOOP_Y, HOOP_W / 2, 6, 0, 0, Math.PI);
    ctx.stroke();
  }

  function drawBall(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    rot: number
  ) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    // 3D body — radial shade from a top-left light to a lower-right shadow
    const grad = ctx.createRadialGradient(
      -BALL_R * 0.35,
      -BALL_R * 0.35,
      1,
      0,
      0,
      BALL_R
    );
    grad.addColorStop(0, C.ballLight);
    grad.addColorStop(0.55, C.ball);
    grad.addColorStop(1, C.ballDark);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, BALL_R, 0, Math.PI * 2);
    ctx.fill();
    // seams — horizontal line + three ellipses (classic basketball)
    ctx.strokeStyle = C.ballSeam;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-BALL_R, 0);
    ctx.lineTo(BALL_R, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, 0, BALL_R * 0.42, BALL_R, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, 0, BALL_R * 0.72, BALL_R, 0.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, 0, BALL_R * 0.72, BALL_R, -0.5, 0, Math.PI * 2);
    ctx.stroke();
    // specular highlight
    ctx.fillStyle = C.ballHi;
    ctx.beginPath();
    ctx.arc(-BALL_R * 0.32, -BALL_R * 0.32, BALL_R * 0.34, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function render(g: BGame, ctx: CanvasRenderingContext2D) {
    const { cw, ch, scale, offX, offY, dpr } = g;

    // court floor
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cw, ch);

    const floorY = offY + GROUND_Y * scale;
    const fade = 14 * scale;
    const fg = ctx.createLinearGradient(0, floorY - fade, 0, floorY);
    fg.addColorStop(0, 'rgba(36,42,51,0)');
    fg.addColorStop(1, C.court);
    ctx.fillStyle = fg;
    ctx.fillRect(0, floorY - fade, cw, fade);
    const floorGrad = ctx.createLinearGradient(0, floorY, 0, ch);
    floorGrad.addColorStop(0, C.court);
    floorGrad.addColorStop(1, C.courtDark);
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, floorY, cw, ch - floorY);
    ctx.fillStyle = C.courtLine;
    ctx.fillRect(0, floorY, cw, Math.max(1, 1.5 * scale));

    // playfield
    ctx.setTransform(scale * dpr, 0, 0, scale * dpr, offX * dpr, offY * dpr);

    drawHoop(ctx);

    // aim indicator
    if (phaseRef.current === 'playing' && (!g.ball || g.ball.dead)) {
      const rad = (g.aimAngle * Math.PI) / 180;
      let px = 120;
      let py = GROUND_Y - 20;
      const pvx = Math.cos(rad) * SHOOT_POWER;
      let pvy = -Math.sin(rad) * SHOOT_POWER;
      ctx.fillStyle = C.aim;
      for (let i = 0; i < 16; i++) {
        px += pvx * 2.2;
        py += pvy * 2.2;
        pvy += GRAVITY * 2.2;
        if (py > GROUND_Y) break;
        ctx.globalAlpha = 1 - i / 18;
        ctx.beginPath();
        ctx.arc(px, py, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // score feedback — gold flash, rings, sparks, rising "+N"
    for (const pl of g.pulses) {
      if (pl.t < 0.45) {
        const fa = (1 - pl.t / 0.45) * 0.55;
        const fl = ctx.createRadialGradient(pl.x, pl.y, 0, pl.x, pl.y, 34);
        fl.addColorStop(0, `rgba(255,210,90,${fa})`);
        fl.addColorStop(1, 'rgba(255,210,90,0)');
        ctx.fillStyle = fl;
        ctx.beginPath();
        ctx.arc(pl.x, pl.y, 34, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = (1 - pl.t) * 0.6;
      ctx.strokeStyle = C.fx;
      ctx.lineWidth = 2 + (1 - pl.t) * 3;
      ctx.beginPath();
      ctx.arc(pl.x, pl.y, 10 + pl.t * 70, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = (1 - pl.t) * 0.4;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(pl.x, pl.y, 6 + pl.t * 42, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    for (const p of g.particles) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = C.fx;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * Math.max(0.2, p.life), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    for (const f of g.floats) {
      const alpha = f.t < 0.15 ? f.t / 0.15 : 1 - (f.t - 0.15) / 0.85;
      const pop =
        f.t < 0.22 ? 0.6 + (f.t / 0.22) * 0.55 : 1.15 - (f.t - 0.22) * 0.12;
      ctx.save();
      ctx.translate(f.x, f.y - f.t * 52);
      ctx.scale(pop, pop);
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 5;
      ctx.strokeStyle = 'rgba(0,0,0,0.45)';
      ctx.font =
        'bold 32px ui-sans-serif, system-ui, -apple-system, sans-serif';
      ctx.strokeText(f.text, 0, 0);
      ctx.shadowColor = C.fxGlow;
      ctx.shadowBlur = 14;
      ctx.fillStyle = C.fx;
      ctx.fillText(f.text, 0, 0);
      ctx.shadowBlur = 0;
      if (f.label) {
        ctx.font =
          'bold 12px ui-sans-serif, system-ui, -apple-system, sans-serif';
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(0,0,0,0.45)';
        ctx.strokeText(f.label, 0, 22);
        ctx.fillStyle = 'rgba(255,236,180,0.95)';
        ctx.fillText(f.label, 0, 22);
      }
      ctx.restore();
    }
    ctx.globalAlpha = 1;

    const b = g.ball;
    if (b) {
      for (let i = 0; i < b.trail.length; i++) {
        ctx.globalAlpha = (i / b.trail.length) * 0.18;
        ctx.fillStyle = C.ball;
        ctx.beginPath();
        ctx.arc(b.trail[i].x, b.trail[i].y, BALL_R * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      drawBall(ctx, b.x, b.y, b.rot);
    } else if (phaseRef.current === 'playing') {
      drawBall(ctx, 120, GROUND_Y - 20, 0);
    }
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
      const scale = Math.min(cw / W, ch / H);
      const offX = (cw - W * scale) / 2;
      const offY = ch - H * scale;
      if (!gRef.current) {
        gRef.current = {
          dpr,
          cw,
          ch,
          scale,
          offX,
          offY,
          ball: null,
          aimAngle: AIM_MIN,
          aimTime: 0,
          score: 0,
          streak: 0,
          timeLeft: DURATION,
          timeAcc: 0,
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (gRef.current) shoot(gRef.current);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div
      ref={wrapRef}
      className='relative h-full min-h-[420px] w-full cursor-pointer touch-none select-none'
      onClick={() => gRef.current && shoot(gRef.current)}
    >
      <canvas ref={canvasRef} className='absolute inset-0 h-full w-full' />

      {(phase === 'playing' || phase === 'over') && (
        <div className='pointer-events-none absolute inset-x-0 top-0 mx-auto flex max-w-[1100px] items-start justify-between p-5 text-white'>
          <span
            key={score}
            className='bb-score inline-block text-[26px] font-bold leading-none text-white/90'
          >
            {score}
          </span>
          <span className='flex items-center gap-2'>
            {streak >= 2 && (
              <span className='rounded-full bg-[rgba(255,159,10,0.16)] px-2.5 py-1 text-[12px] font-semibold text-[#ff9f0a]'>
                {streak}× {tx.streak}
              </span>
            )}
            <span className='rounded-full bg-white/10 px-3 py-1 text-[13px] font-medium text-white/70'>
              {tx.time} {time}s
            </span>
          </span>
        </div>
      )}

      {phase === 'idle' && (
        <div className='bb-in absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center'>
          <p className='max-w-[340px] text-[14px] leading-relaxed text-white/70'>
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
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation();
              if (gRef.current) start(gRef.current);
            }}
            className='bb-btn inline-flex items-center rounded-full bg-white px-9 py-3 text-[15px] font-semibold text-[#121212] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161717]'
          >
            {tx.start}
          </button>
        </div>
      )}

      {phase === 'over' && (
        <div className='bb-in absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/35 px-6 text-center'>
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
            onClick={(e) => {
              e.stopPropagation();
              if (gRef.current) start(gRef.current);
            }}
            className='bb-btn inline-flex items-center rounded-full bg-white px-9 py-3 text-[15px] font-semibold text-[#121212] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161717]'
          >
            {tx.again}
          </button>
        </div>
      )}

      <style>{`
        @keyframes bbIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        .bb-in { animation: bbIn 0.18s cubic-bezier(0.23, 1, 0.32, 1) both; }
        @keyframes bbScore { 0% { transform: scale(1.7); } 100% { transform: scale(1); } }
        .bb-score { animation: bbScore 0.32s cubic-bezier(0.23, 1, 0.32, 1); transform-origin: left center; }
        .bb-btn { transition: transform 0.15s cubic-bezier(0.23, 1, 0.32, 1), background-color 0.2s ease; }
        .bb-btn:hover { transform: scale(1.02); background-color: rgba(255, 255, 255, 0.9); }
        .bb-btn:active { transform: scale(0.97); }
        @media (prefers-reduced-motion: reduce) {
          .bb-in { animation: none; }
          .bb-score { animation: none; }
          .bb-btn { transition: none; }
          .bb-btn:hover, .bb-btn:active { transform: none; }
        }
      `}</style>
    </div>
  );
}

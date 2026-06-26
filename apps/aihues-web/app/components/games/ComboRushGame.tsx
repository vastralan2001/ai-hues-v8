'use client';

import { useEffect, useRef, useState } from 'react';

import type { Locale } from '@/lib/dict';

/* Combo Rush — ported from kimi.com/share/d2htkss7fffeniq9c2s0. Core logic kept; visuals upgraded to the aihues aesthetic. */

type Phase = 'idle' | 'playing' | 'over';
type Mode = 'color' | 'arrow';
type DiffKey = 'easy' | 'medium' | 'hard' | 'expert';
type Dir = '↑' | '→' | '↓' | '←';

const DIRS: Dir[] = ['↑', '→', '↓', '←'];
const COLORS: Record<Dir, string> = {
  '↑': '#ff5a5f',
  '→': '#46e8a0',
  '↓': '#4aa3ff',
  '←': '#ffca3a',
};
// Base QTE window per difficulty, in ms — kept faithful to the source.
const DIFF_MS: Record<DiffKey, number> = {
  easy: 2000,
  medium: 1500,
  hard: 1000,
  expert: 500,
};
const DIFF_ORDER: DiffKey[] = ['easy', 'medium', 'hard', 'expert'];
const ROUND_TIME = 30;
const BEST_KEY = 'aihues_combo-rush_best';
const SUCCESS_GAP = 300;
const MISS_GAP = 500;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  r: number;
  c: string;
}
interface CRGame {
  W: number;
  H: number;
  particles: Particle[];
  shake: number;
  t: number;
  // Current prompt state, mirrored from refs for the render loop.
  dir: Dir;
  color: string;
  spawnedAt: number;
  limitMs: number;
  active: boolean;
  flash: 0 | 1 | -1; // 1 = success flash, -1 = miss flash, 0 = none
  flashT: number;
}

const T = {
  en: {
    best: 'Best',
    choose: 'Difficulty',
    mode: 'Mode',
    modeColor: 'Color',
    modeArrow: 'Arrow',
    start: 'Start',
    again: 'Play again',
    combo: 'Combo',
    sub: 'Hit the prompt before it runs out. Chain hits to build your combo.',
    hintColor: 'Press the direction whose colour matches the orb.',
    hintArrow: 'Press the arrow shown in the orb.',
    keys: 'Arrow keys or the buttons below',
    perfect: 'Perfect!',
    good: 'Good!',
    miss: 'Miss!',
    over: "Time's up",
    maxCombo: 'Max combo',
    diffs: { easy: 'Easy', medium: 'Medium', hard: 'Hard', expert: 'Expert' },
  },
  zh: {
    best: '最高',
    choose: '难度',
    mode: '模式',
    modeColor: '色彩',
    modeArrow: '箭头',
    start: '开始',
    again: '再来一局',
    combo: '连击',
    sub: '在提示消失前命中,连续命中即可累积连击。',
    hintColor: '按下与光球颜色相同的方向键。',
    hintArrow: '按下光球中显示的箭头。',
    keys: '方向键或下方按钮',
    perfect: '完美!',
    good: '不错!',
    miss: '失误!',
    over: '时间到',
    maxCombo: '最高连击',
    diffs: { easy: '简单', medium: '中等', hard: '困难', expert: '专家' },
  },
} as const;

export default function ComboRushGame({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const tx = T[zh ? 'zh' : 'en'];

  const fieldRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gRef = useRef<CRGame | null>(null);
  const rafRef = useRef(0);
  const phaseRef = useRef<Phase>('idle');
  const modeRef = useRef<Mode>('color');
  const diffRef = useRef<DiffKey>('easy');
  const bestRef = useRef(0);
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const maxComboRef = useRef(0);
  const dirRef = useRef<Dir>('↑');
  const colorRef = useRef<string>(COLORS['↑']);
  const activeRef = useRef(false);
  const timeoutRef = useRef<number>(0);
  const gapRef = useRef<number>(0);
  const roundTimerRef = useRef<number>(0);
  const startRef = useRef<() => void>(() => {});
  const inputRef = useRef<(d: Dir) => void>(() => {});

  const [phase, setPhase] = useState<Phase>('idle');
  const [mode, setModeState] = useState<Mode>('color');
  const [diff, setDiff] = useState<DiffKey>('easy');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [best, setBest] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [feedback, setFeedback] = useState<{
    text: string;
    kind: 'perfect' | 'good' | 'miss';
    key: number;
  } | null>(null);
  const [pressed, setPressed] = useState<Dir | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const b = Number(localStorage.getItem(BEST_KEY) || '0') || 0;
      if (!Number.isNaN(b)) {
        bestRef.current = b;
        setBest(b);
      }
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

    gRef.current = {
      W: field.clientWidth,
      H: field.clientHeight,
      particles: [],
      shake: 0,
      t: 0,
      dir: '↑',
      color: COLORS['↑'],
      spawnedAt: 0,
      limitMs: DIFF_MS.easy,
      active: false,
      flash: 0,
      flashT: 0,
    };
    size();

    const clearTimers = () => {
      window.clearTimeout(timeoutRef.current);
      window.clearTimeout(gapRef.current);
      window.clearInterval(roundTimerRef.current);
    };

    const burst = (color: string, big: boolean) => {
      const g = gRef.current;
      if (!g) return;
      const x = g.W / 2;
      const y = g.H * 0.46;
      const n = big ? 34 : 18;
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n + Math.random() * 0.4;
        const sp = (big ? 4.5 : 3) * (0.5 + Math.random());
        g.particles.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 1,
          r: Math.random() * 3 + 1.5,
          c: color,
        });
      }
    };

    // calcTimeLimit — faithful to source: max(base, base - 0.001*score + jitter).
    const calcLimit = () => {
      const base = DIFF_MS[diffRef.current];
      const jitter = Math.random() * base;
      return Math.max(base, base - 0.001 * scoreRef.current + jitter);
    };

    const spawn = () => {
      if (phaseRef.current !== 'playing') return;
      const g = gRef.current;
      if (!g) return;
      window.clearTimeout(timeoutRef.current);
      const dir = DIRS[Math.floor(Math.random() * 4)];
      const colorKey = DIRS[Math.floor(Math.random() * 4)];
      const color = COLORS[colorKey];
      dirRef.current = dir;
      colorRef.current = color;
      activeRef.current = true;
      const limit = calcLimit();
      g.dir = dir;
      g.color = color;
      g.limitMs = limit;
      g.spawnedAt = performance.now();
      g.active = true;
      timeoutRef.current = window.setTimeout(() => {
        if (activeRef.current && phaseRef.current === 'playing') resolveMiss();
      }, limit);
    };

    const showFeedback = (kind: 'perfect' | 'good' | 'miss') => {
      const text =
        kind === 'perfect' ? tx.perfect : kind === 'good' ? tx.good : tx.miss;
      setFeedback({ text, kind, key: performance.now() });
    };

    const resolveMiss = () => {
      const g = gRef.current;
      if (!g || !activeRef.current) return;
      activeRef.current = false;
      g.active = false;
      g.flash = -1;
      g.flashT = 0;
      window.clearTimeout(timeoutRef.current);
      comboRef.current = 0;
      setCombo(0);
      showFeedback('miss');
      gapRef.current = window.setTimeout(spawn, MISS_GAP);
    };

    const resolveHit = () => {
      const g = gRef.current;
      if (!g) return;
      activeRef.current = false;
      g.active = false;
      window.clearTimeout(timeoutRef.current);
      comboRef.current += 1;
      const c = comboRef.current;
      const pts = Math.floor(100 * (1 + c * 0.1));
      scoreRef.current += pts;
      if (c > maxComboRef.current) {
        maxComboRef.current = c;
        setMaxCombo(c);
      }
      setScore(scoreRef.current);
      setCombo(c);
      const milestone = c % 10 === 0;
      g.flash = 1;
      g.flashT = 0;
      g.shake = Math.min(14, 4 + c * 0.6);
      burst(g.color, milestone);
      showFeedback(milestone ? 'perfect' : 'good');
      gapRef.current = window.setTimeout(spawn, SUCCESS_GAP);
    };

    const handleInput = (d: Dir) => {
      if (phaseRef.current !== 'playing' || !activeRef.current) return;
      const ok =
        modeRef.current === 'color'
          ? COLORS[d] === colorRef.current
          : d === dirRef.current;
      if (ok) resolveHit();
      else resolveMiss();
    };
    inputRef.current = handleInput;

    const endGame = () => {
      clearTimers();
      activeRef.current = false;
      const g = gRef.current;
      if (g) g.active = false;
      if (scoreRef.current > bestRef.current) {
        bestRef.current = scoreRef.current;
        setBest(scoreRef.current);
        try {
          localStorage.setItem(BEST_KEY, String(scoreRef.current));
        } catch {
          /* ignore */
        }
      }
      setPhaseBoth('over');
    };

    const start = () => {
      clearTimers();
      scoreRef.current = 0;
      comboRef.current = 0;
      maxComboRef.current = 0;
      activeRef.current = false;
      setScore(0);
      setCombo(0);
      setMaxCombo(0);
      setTimeLeft(ROUND_TIME);
      setFeedback(null);
      const g = gRef.current;
      if (g) {
        g.particles = [];
        g.shake = 0;
        g.flash = 0;
        g.active = false;
      }
      setPhaseBoth('playing');
      spawn();
      let left = ROUND_TIME;
      roundTimerRef.current = window.setInterval(() => {
        left -= 1;
        setTimeLeft(Math.max(0, left));
        if (left <= 0) endGame();
      }, 1000);
    };
    startRef.current = start;

    const render = () => {
      const g = gRef.current;
      if (!g) return;
      const { W, H } = g;
      ctx.save();
      if (g.shake > 0.2) {
        const dx = (Math.random() - 0.5) * g.shake;
        const dy = (Math.random() - 0.5) * g.shake;
        ctx.translate(dx, dy);
      }

      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#161427');
      bg.addColorStop(1, '#0e0c1a');
      ctx.fillStyle = bg;
      ctx.fillRect(-20, -20, W + 40, H + 40);

      const cx = W / 2;
      const cy = H * 0.46;
      const ringR = Math.min(W, H) * 0.3;

      // Hit-line ring — the prompt's window shrinks toward it.
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255,255,255,0.16)';
      ctx.beginPath();
      ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
      ctx.stroke();

      const playing = phaseRef.current === 'playing';
      if (g.active && playing) {
        const elapsed = performance.now() - g.spawnedAt;
        const prog = Math.min(1, elapsed / g.limitMs); // 0 -> 1 as time runs out
        const closeR = ringR + Math.min(W, H) * 0.5 * (1 - prog);

        // Approaching guide ring collapsing onto the hit-line.
        ctx.lineWidth = 3;
        ctx.strokeStyle = g.color;
        ctx.globalAlpha = 0.35 + 0.4 * (1 - prog);
        ctx.beginPath();
        ctx.arc(cx, cy, closeR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;

        // The prompt orb itself, escalating with the combo.
        const comboScale = 1 + Math.min(0.5, comboRef.current * 0.02);
        const orbR = ringR * 0.72 * comboScale;
        const pulse = 1 + 0.05 * Math.sin(g.t * 0.25);
        ctx.save();
        ctx.shadowColor = g.color;
        ctx.shadowBlur = 26 + Math.min(28, comboRef.current * 1.5);
        const grad = ctx.createRadialGradient(
          cx - orbR * 0.3,
          cy - orbR * 0.3,
          orbR * 0.1,
          cx,
          cy,
          orbR
        );
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.35, g.color);
        grad.addColorStop(1, g.color);
        ctx.globalAlpha = 0.92;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, orbR * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Direction glyph.
        ctx.fillStyle = '#0e0c1a';
        ctx.font = `bold ${Math.round(orbR * 1.1)}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(g.dir, cx, cy + orbR * 0.06);
      }

      // Hit / miss flash on the hit-line.
      if (g.flash !== 0) {
        const fa = Math.max(0, 1 - g.flashT);
        ctx.globalAlpha = fa * 0.85;
        ctx.lineWidth = 6 + 18 * (1 - fa);
        ctx.strokeStyle = g.flash === 1 ? '#46e8a0' : '#ff5a5f';
        ctx.beginPath();
        ctx.arc(cx, cy, ringR + 22 * (1 - fa), 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      for (const p of g.particles) {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    };

    let lastTs = 0;
    const frame = (ts: number) => {
      rafRef.current = requestAnimationFrame(frame);
      const g = gRef.current;
      if (!g) return;
      const dt = lastTs ? Math.min(2.4, (ts - lastTs) / 16.667) : 1;
      lastTs = ts;
      g.t += dt;
      if (g.shake > 0) g.shake = Math.max(0, g.shake - 0.6 * dt);
      if (g.flash !== 0) {
        g.flashT += 0.06 * dt;
        if (g.flashT >= 1) g.flash = 0;
      }
      for (let i = g.particles.length - 1; i >= 0; i--) {
        const p = g.particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 0.05 * dt;
        p.life -= 0.025 * dt;
        if (p.life <= 0) g.particles.splice(i, 1);
      }
      render();
    };
    rafRef.current = requestAnimationFrame(frame);

    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: '↑',
        ArrowRight: '→',
        ArrowDown: '↓',
        ArrowLeft: '←',
      };
      const d = map[e.key];
      if (d) {
        e.preventDefault();
        inputRef.current(d);
        setPressed(d);
        window.setTimeout(
          () => setPressed((cur) => (cur === d ? null : cur)),
          110
        );
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      clearTimers();
      window.removeEventListener('keydown', onKey);
    };
  }, [tx.good, tx.miss, tx.perfect]);

  const setMode = (m: Mode) => {
    modeRef.current = m;
    setModeState(m);
  };
  const onButton = (d: Dir) => {
    inputRef.current(d);
    setPressed(d);
    window.setTimeout(() => setPressed((cur) => (cur === d ? null : cur)), 110);
  };

  const ratio = timeLeft / ROUND_TIME;
  const lowTime = timeLeft <= 5;
  const comboHot = combo >= 10;
  const modeOpts: Mode[] = ['color', 'arrow'];

  return (
    <div className='relative flex min-h-[480px] w-full flex-col touch-none select-none'>
      <div className='mx-auto flex h-[52px] w-full max-w-[480px] shrink-0 items-center justify-between px-1 text-white'>
        {phase === 'playing' ? (
          <>
            <span
              className={`text-[22px] font-bold leading-none tabular-nums ${
                lowTime ? 'text-[#ff6b70]' : 'text-white/90'
              }`}
            >
              {timeLeft}s
            </span>
            <span className='flex items-center gap-3'>
              <span
                key={combo}
                className={`cr-pop text-[20px] font-bold leading-none ${
                  comboHot ? 'text-[#ffca3a]' : 'text-white/90'
                }`}
              >
                {tx.combo} {combo}
              </span>
              <span className='text-[20px] font-bold leading-none text-white/90 tabular-nums'>
                {score}
              </span>
            </span>
          </>
        ) : (
          <span className='text-[13px] font-medium text-white/55'>
            {tx.best} {best}
          </span>
        )}
      </div>

      {phase === 'playing' ? (
        <div className='mx-auto mb-2 h-1.5 w-full max-w-[480px] overflow-hidden rounded-full bg-white/10'>
          <div
            className='h-full rounded-full transition-[width] duration-300 ease-linear'
            style={{
              width: `${ratio * 100}%`,
              background: lowTime ? '#ff5a5f' : 'rgba(255,255,255,0.72)',
            }}
          />
        </div>
      ) : null}

      <div
        ref={fieldRef}
        className={`relative min-h-0 flex-1 overflow-hidden rounded-[18px] ${
          comboHot ? 'cr-shake-host' : ''
        }`}
      >
        <canvas ref={canvasRef} className='absolute inset-0 h-full w-full' />

        {feedback ? (
          <div
            key={feedback.key}
            className='cr-fx pointer-events-none absolute inset-x-0 top-[14%] flex justify-center'
          >
            <span
              className='text-[40px] font-extrabold'
              style={{
                color:
                  feedback.kind === 'perfect'
                    ? '#ffca3a'
                    : feedback.kind === 'good'
                      ? '#46e8a0'
                      : '#ff5a5f',
                textShadow: '0 2px 16px rgba(0,0,0,0.55)',
              }}
            >
              {feedback.text}
            </span>
          </div>
        ) : null}

        {phase === 'playing' ? (
          <p className='pointer-events-none absolute inset-x-0 top-2 text-center text-[12px] font-medium text-white/45'>
            {mode === 'color' ? tx.hintColor : tx.hintArrow}
          </p>
        ) : null}

        {phase === 'idle' && (
          <div className='cr-in absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/35 px-6 text-center'>
            <p className='max-w-[460px] text-[14px] leading-relaxed text-white/70'>
              {tx.sub}
            </p>
            <div className='flex flex-col items-center gap-2'>
              <span className='text-[11px] font-bold uppercase tracking-[0.16em] text-white/40'>
                {tx.mode}
              </span>
              <div className='flex gap-1.5 rounded-full bg-white/[0.06] p-1 ring-1 ring-white/10'>
                {modeOpts.map((m) => (
                  <button
                    key={m}
                    type='button'
                    onClick={() => setMode(m)}
                    className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                      mode === m
                        ? 'bg-white text-[#121212]'
                        : 'text-white/65 hover:text-white'
                    }`}
                  >
                    {m === 'color' ? tx.modeColor : tx.modeArrow}
                  </button>
                ))}
              </div>
            </div>
            <div className='flex flex-col items-center gap-2'>
              <span className='text-[11px] font-bold uppercase tracking-[0.16em] text-white/40'>
                {tx.choose}
              </span>
              <div className='flex flex-wrap justify-center gap-2'>
                {DIFF_ORDER.map((d) => (
                  <button
                    key={d}
                    type='button'
                    onClick={() => {
                      diffRef.current = d;
                      setDiff(d);
                    }}
                    className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                      diff === d
                        ? 'bg-white text-[#121212]'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    {tx.diffs[d]}
                  </button>
                ))}
              </div>
            </div>
            <button
              type='button'
              onClick={() => startRef.current()}
              className='cr-cta mt-1 rounded-full bg-white px-9 py-3 text-[15px] font-bold text-[#121212] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101319]'
            >
              {tx.start}
            </button>
            <p className='text-[12px] text-white/45'>{tx.keys}</p>
          </div>
        )}

        {phase === 'over' && (
          <div className='cr-in absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/45 px-6 text-center'>
            <div className='text-[14px] font-semibold text-white/70'>
              {tx.over}
            </div>
            <div className='text-[56px] font-extrabold leading-none text-white'>
              {score}
            </div>
            <div className='text-[13px] font-medium text-white/55'>
              {tx.maxCombo} · {maxCombo}
            </div>
            <div className='mb-3 text-[13px] font-medium text-white/50'>
              {tx.best} · {best}
            </div>
            <button
              type='button'
              onClick={() => startRef.current()}
              className='cr-cta rounded-full bg-white px-9 py-3 text-[15px] font-bold text-[#121212] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101319]'
            >
              {tx.again}
            </button>
          </div>
        )}
      </div>

      <div className='mx-auto mt-3 grid w-full max-w-[300px] grid-cols-3 gap-2'>
        <span aria-hidden='true' />
        <DirButton
          dir='↑'
          pressed={pressed === '↑'}
          disabled={phase !== 'playing'}
          onPress={onButton}
        />
        <span aria-hidden='true' />
        <DirButton
          dir='←'
          pressed={pressed === '←'}
          disabled={phase !== 'playing'}
          onPress={onButton}
        />
        <DirButton
          dir='↓'
          pressed={pressed === '↓'}
          disabled={phase !== 'playing'}
          onPress={onButton}
        />
        <DirButton
          dir='→'
          pressed={pressed === '→'}
          disabled={phase !== 'playing'}
          onPress={onButton}
        />
      </div>

      <style>{`
        .cr-cta { transition: transform .15s cubic-bezier(0.23,1,0.32,1), background-color .2s ease; }
        .cr-cta:hover { transform: translateY(-2px); background-color: rgba(255,255,255,0.92); }
        .cr-cta:active { transform: scale(.97); }
        @keyframes crIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .cr-in { animation: crIn .26s cubic-bezier(0.23,1,0.32,1); }
        @keyframes crFx { 0% { opacity: 0; transform: translateY(8px) scale(0.8); } 22% { opacity: 1; transform: translateY(0) scale(1.06); } 100% { opacity: 0; transform: translateY(-16px) scale(1); } }
        .cr-fx span { animation: crFx .55s cubic-bezier(0.23,1,0.32,1) forwards; display: inline-block; }
        @keyframes crPop { 0% { transform: scale(1.4); } 100% { transform: scale(1); } }
        .cr-pop { animation: crPop .3s cubic-bezier(0.23,1,0.32,1); display: inline-block; transform-origin: right center; }
        @keyframes crShake { 0%,100% { transform: translate(0,0); } 25% { transform: translate(-2px,1px); } 50% { transform: translate(2px,-1px); } 75% { transform: translate(-1px,-1px); } }
        .cr-shake-host { animation: crShake .35s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .cr-cta, .cr-in, .cr-fx span, .cr-pop, .cr-shake-host { animation: none !important; transition: none !important; }
          .cr-cta:hover, .cr-cta:active { transform: none; }
        }
      `}</style>
    </div>
  );
}

function DirButton({
  dir,
  pressed,
  disabled,
  onPress,
}: {
  dir: Dir;
  pressed: boolean;
  disabled: boolean;
  onPress: (d: Dir) => void;
}) {
  return (
    <button
      type='button'
      aria-label={dir}
      disabled={disabled}
      onPointerDown={(e) => {
        e.preventDefault();
        onPress(dir);
      }}
      className='cr-dir flex h-[58px] items-center justify-center rounded-[14px] text-[26px] font-bold transition-transform disabled:opacity-45'
      style={{
        backgroundColor: pressed ? `${COLORS[dir]}26` : `${COLORS[dir]}14`,
        boxShadow: pressed
          ? `inset 0 0 0 2px ${COLORS[dir]}, 0 0 18px ${COLORS[dir]}`
          : `inset 0 0 0 1.5px ${COLORS[dir]}80`,
        color: COLORS[dir],
        transform: pressed ? 'scale(0.94)' : 'none',
      }}
    >
      {dir}
    </button>
  );
}

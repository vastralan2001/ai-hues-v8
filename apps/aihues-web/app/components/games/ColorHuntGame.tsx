'use client';

import { useEffect, useRef, useState } from 'react';

import type { Locale } from '@/lib/dict';

/* Color Hunt — native port of the shade-spotting challenge, Kimi styled and
   borderless, in two modes: Stages (60 scored rounds, 5s each, ΔE 1.8–6) and
   Sprint (one 60-second dash, count boards cleared, free wrong taps, ΔE 2–5).
   Both keep the source logic; the tiles, feedback and reveal are the upgraded
   layer. */

const TOTAL_STAGE = 60;
const TIME_PER = 5;
const SPRINT_TIME = 60;
const MAX_N = 8;
const DE_STAGES = { min: 1.8, max: 6 };
const DE_SPRINT = { min: 2.0, max: 5.0 };

type Mode = 'stages' | 'sprint';
type RGB = [number, number, number];

function rgb2lab(rgb: RGB): [number, number, number] {
  let r = rgb[0] / 255;
  let g = rgb[1] / 255;
  let b = rgb[2] / 255;
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  let x = (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) / 0.95047;
  let y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
  let z = (r * 0.0193339 + g * 0.119192 + b * 0.9503041) / 1.08883;
  x = x > 0.008856 ? Math.cbrt(x) : 7.787 * x + 16 / 116;
  y = y > 0.008856 ? Math.cbrt(y) : 7.787 * y + 16 / 116;
  z = z > 0.008856 ? Math.cbrt(z) : 7.787 * z + 16 / 116;
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}

function deltaE2000(c1: RGB, c2: RGB): number {
  const deg = Math.PI / 180;
  const lab1 = rgb2lab(c1);
  const lab2 = rgb2lab(c2);
  const L1 = lab1[0];
  let a1 = lab1[1];
  const b1 = lab1[2];
  const L2 = lab2[0];
  let a2 = lab2[1];
  const b2 = lab2[2];
  const avgL = (L1 + L2) / 2;
  const avgC =
    (Math.sqrt(a1 * a1 + b1 * b1) + Math.sqrt(a2 * a2 + b2 * b2)) / 2;
  const G =
    0.5 *
    (1 - Math.sqrt(Math.pow(avgC, 7) / (Math.pow(avgC, 7) + Math.pow(25, 7))));
  a1 = a1 * (1 + G);
  a2 = a2 * (1 + G);
  const C1 = Math.sqrt(a1 * a1 + b1 * b1);
  const C2 = Math.sqrt(a2 * a2 + b2 * b2);
  const avgC2 = (C1 + C2) / 2;
  const h1 = ((Math.atan2(b1, a1) * 180) / Math.PI + 360) % 360;
  const h2 = ((Math.atan2(b2, a2) * 180) / Math.PI + 360) % 360;
  const dh =
    Math.abs(h2 - h1) > 180
      ? h2 <= h1
        ? h2 - h1 + 360
        : h2 - h1 - 360
      : h2 - h1;
  const avgH = Math.abs(h1 - h2) > 180 ? (h1 + h2 + 360) / 2 : (h1 + h2) / 2;
  const T =
    1 -
    0.17 * Math.cos((avgH - 30) * deg) +
    0.24 * Math.cos(2 * avgH * deg) +
    0.32 * Math.cos((3 * avgH + 6) * deg) -
    0.2 * Math.cos((4 * avgH - 63) * deg);
  const deltaL = L2 - L1;
  const deltaC = C2 - C1;
  const deltaH = 2 * Math.sqrt(C1 * C2) * Math.sin((dh * deg) / 2);
  const SL =
    1 +
    (0.015 * Math.pow(avgL - 50, 2)) / Math.sqrt(20 + Math.pow(avgL - 50, 2));
  const SC = 1 + 0.045 * avgC2;
  const SH = 1 + 0.015 * avgC2 * T;
  const deltaTheta = 30 * Math.exp(-Math.pow((avgH - 275) / 25, 2));
  const RC =
    2 * Math.sqrt(Math.pow(avgC2, 7) / (Math.pow(avgC2, 7) + Math.pow(25, 7)));
  const RT = -RC * Math.sin(2 * deltaTheta * deg);
  const LCH =
    Math.pow(deltaL / SL, 2) +
    Math.pow(deltaC / SC, 2) +
    Math.pow(deltaH / SH, 2) +
    RT * (deltaC / SC) * (deltaH / SH);
  return Math.sqrt(LCH);
}

function randColor(): RGB {
  return [
    Math.floor(Math.random() * 200 + 25),
    Math.floor(Math.random() * 200 + 25),
    Math.floor(Math.random() * 200 + 25),
  ];
}

function randInt(max: number) {
  return Math.floor(Math.random() * max);
}

function rgbStr(c: RGB) {
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

function generatePair(
  base: RGB,
  minDE: number,
  maxDE: number
): { color: RGB; de: number } {
  let diff: RGB = [base[0], base[1], base[2]];
  let de = 0;
  while (de < minDE || de > maxDE) {
    diff = [base[0], base[1], base[2]];
    for (let i = 0; i < 3; i++) {
      diff[i] += Math.floor((Math.random() - 0.5) * 20);
      diff[i] = Math.max(0, Math.min(255, diff[i]));
    }
    de = deltaE2000(base, diff);
  }
  return { color: diff, de };
}

interface StageData {
  stage: number;
  n: number;
  base: RGB;
  diff: RGB;
  diffIdx: number;
  de: number;
}
interface Fx {
  kind: 'correct' | 'wrong' | 'timeout';
  pts: number;
  key: number;
}

const T = {
  en: {
    start: 'Start',
    again: 'Play again',
    best: 'Best',
    stage: 'Stage',
    cleared: 'Cleared',
    miss: 'Miss',
    timeUp: 'Time',
    modeStages: 'Stages',
    modeSprint: 'Sprint',
    overStages: 'Challenge complete',
    overSprint: "Time's up",
    subStages:
      'Spot the odd shade and beat the 5-second timer — 60 scored rounds.',
    subSprint: 'Clear as many boards as you can in one 60-second dash.',
    rulesTitle: 'How to play',
    rulesStages: [
      'Every tile shares one colour — except a single odd one out.',
      'Tap the odd tile before the 5-second timer ends.',
      'Subtler shades and bigger grids score more; answer fast for a bonus.',
      '60 rounds, and the grid keeps growing. How sharp is your eye?',
    ],
    rulesSprint: [
      'Every tile shares one colour — except a single odd one out.',
      'Tap the odd tile to clear the board. Wrong taps cost nothing.',
      'No per-board timer — just race the single 60-second clock.',
      'The grid keeps growing; clear as many boards as you can.',
    ],
  },
  zh: {
    start: '开始',
    again: '再来一次',
    best: '最佳',
    stage: '关卡',
    cleared: '通过',
    miss: '失误',
    timeUp: '超时',
    modeStages: '闯关',
    modeSprint: '冲刺',
    overStages: '挑战完成',
    overSprint: '时间到',
    subStages: '在 5 秒内找出不同色块——共 60 关计分。',
    subSprint: '在 60 秒内尽可能多地通关。',
    rulesTitle: '玩法规则',
    rulesStages: [
      '每一关所有方块同色,只有一个略有差异。',
      '在 5 秒内点出那个不一样的方块。',
      '色差越小、格子越大得分越高,越快越有加成。',
      '共 60 关,格子会越来越多,考验你的眼力。',
    ],
    rulesSprint: [
      '每一块所有方块同色,只有一个略有差异。',
      '点出不同的方块即可通关,点错没有惩罚。',
      '没有单关计时——只跟一个 60 秒总时钟赛跑。',
      '格子会越来越多,看你能通过多少关。',
    ],
  },
} as const;

export default function ColorHuntGame({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const tx = T[zh ? 'zh' : 'en'];

  const areaRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number>(0);
  const timeLeftRef = useRef(0);
  const dataRef = useRef<StageData | null>(null);
  const lockedRef = useRef(false);
  const phaseRef = useRef<'idle' | 'playing' | 'over'>('idle');
  const modeRef = useRef<Mode>('stages');
  const scoreRef = useRef(0);
  const clearedRef = useRef(0);
  const passRef = useRef(0);

  const [mode, setModeState] = useState<Mode>('stages');
  const [phase, setPhase] = useState<'idle' | 'playing' | 'over'>('idle');
  const [data, setData] = useState<StageData | null>(null);
  const [score, setScore] = useState(0);
  const [cleared, setCleared] = useState(0);
  const [bestStages, setBestStages] = useState(0);
  const [bestSprint, setBestSprint] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [reveal, setReveal] = useState(-1);
  const [locked, setLocked] = useState(false);
  const [fx, setFx] = useState<Fx | null>(null);
  const [gridPx, setGridPx] = useState(0);

  const best = mode === 'sprint' ? bestSprint : bestStages;

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const a = Number(localStorage.getItem('aihues_colorhunt_best') || '0');
      const s = Number(
        localStorage.getItem('aihues_colorhunt_sprint_best') || '0'
      );
      if (!Number.isNaN(a)) setBestStages(a);
      if (!Number.isNaN(s)) setBestSprint(s);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    function measure() {
      const r = areaRef.current?.getBoundingClientRect();
      if (!r || r.width < 2 || r.height < 2) return;
      const px = Math.max(
        140,
        Math.floor(Math.min(r.width - 8, r.height - 30))
      );
      setGridPx((prev) => (Math.abs(prev - px) > 0.5 ? px : prev));
    }
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  function setPh(p: 'idle' | 'playing' | 'over') {
    phaseRef.current = p;
    setPhase(p);
  }
  function setDt(d: StageData) {
    dataRef.current = d;
    setData(d);
  }
  function setLk(v: boolean) {
    lockedRef.current = v;
    setLocked(v);
  }
  function setMode(m: Mode) {
    modeRef.current = m;
    setModeState(m);
  }

  function startTimer(duration: number, onEnd: () => void) {
    clearInterval(timerRef.current);
    timeLeftRef.current = duration;
    setTimeLeft(duration);
    timerRef.current = window.setInterval(() => {
      if (lockedRef.current) return;
      timeLeftRef.current = Math.max(0, timeLeftRef.current - 0.06);
      setTimeLeft(timeLeftRef.current);
      if (timeLeftRef.current <= 0) onEnd();
    }, 60);
  }

  function buildBoard(round: number, n: number) {
    const range = modeRef.current === 'sprint' ? DE_SPRINT : DE_STAGES;
    const base = randColor();
    const { color: diff, de } = generatePair(base, range.min, range.max);
    const diffIdx = randInt(n * n);
    setDt({ stage: round, n, base, diff, diffIdx, de });
    setReveal(-1);
  }

  function start(m: Mode) {
    setMode(m);
    passRef.current = 0;
    scoreRef.current = 0;
    clearedRef.current = 0;
    setScore(0);
    setCleared(0);
    setFx(null);
    setReveal(-1);
    setLk(false);
    setPh('playing');
    if (m === 'sprint') {
      startTimer(SPRINT_TIME, endGame);
      buildBoard(1, 2);
    } else {
      buildBoard(1, 2);
      startTimer(TIME_PER, () => resolve(-1));
    }
  }

  function endGame() {
    clearInterval(timerRef.current);
    setLk(false);
    const sprint = modeRef.current === 'sprint';
    const result = sprint ? clearedRef.current : scoreRef.current;
    const key = sprint
      ? 'aihues_colorhunt_sprint_best'
      : 'aihues_colorhunt_best';
    let stored = 0;
    try {
      stored = Number(localStorage.getItem(key) || '0') || 0;
    } catch {
      stored = 0;
    }
    if (result > stored) {
      try {
        localStorage.setItem(key, String(result));
      } catch {
        /* ignore */
      }
      if (sprint) setBestSprint(result);
      else setBestStages(result);
    }
    setPh('over');
  }

  function resolve(clickedIdx: number) {
    if (lockedRef.current || phaseRef.current !== 'playing') return;
    const d = dataRef.current;
    if (!d) return;
    setLk(true);
    clearInterval(timerRef.current);
    const correct = clickedIdx === d.diffIdx;
    let delay = 650;
    if (correct) {
      const left = timeLeftRef.current;
      const speedFactor = 1 + left / 10;
      const pts = Math.round(d.n * (100 / d.de) * speedFactor);
      scoreRef.current += pts;
      setScore(scoreRef.current);
      setFx({ kind: 'correct', pts, key: d.stage });
      setReveal(-1);
      delay = 280;
    } else {
      setFx({
        kind: clickedIdx === -1 ? 'timeout' : 'wrong',
        pts: 0,
        key: d.stage,
      });
      setReveal(d.diffIdx);
    }
    window.setTimeout(() => {
      if (phaseRef.current !== 'playing') return;
      const nextStage = d.stage + 1;
      let nextN = d.n;
      passRef.current += 1;
      if (passRef.current === d.n - 1 && d.n < MAX_N) {
        nextN = d.n + 1;
        passRef.current = 0;
      }
      setLk(false);
      if (nextStage > TOTAL_STAGE) {
        endGame();
        return;
      }
      buildBoard(nextStage, nextN);
      startTimer(TIME_PER, () => resolve(-1));
    }, delay);
  }

  function sprintClick(clickedIdx: number) {
    if (phaseRef.current !== 'playing') return;
    const d = dataRef.current;
    if (!d || clickedIdx !== d.diffIdx) return;
    clearedRef.current += 1;
    setCleared(clearedRef.current);
    let nextN = d.n;
    passRef.current += 1;
    if (passRef.current === d.n - 1 && d.n < MAX_N) {
      nextN = d.n + 1;
      passRef.current = 0;
    }
    buildBoard(d.stage + 1, nextN);
  }

  function onCell(idx: number) {
    if (modeRef.current === 'sprint') sprintClick(idx);
    else resolve(idx);
  }

  const sprint = mode === 'sprint';
  const duration = sprint ? SPRINT_TIME : TIME_PER;
  const ratio = timeLeft / duration;
  const low = sprint ? timeLeft <= 10 : timeLeft <= 1.5;
  const modeOpts: Mode[] = ['stages', 'sprint'];

  return (
    <div className='relative flex min-h-[460px] w-full flex-col touch-none select-none'>
      <div
        className='mx-auto flex h-[52px] w-full shrink-0 items-center justify-between px-1 text-white'
        style={{ maxWidth: gridPx || undefined }}
      >
        {data ? (
          <>
            {sprint ? (
              <span
                className={`text-[22px] font-bold leading-none tabular-nums ${
                  low ? 'text-[#ff6b70]' : 'text-white/90'
                }`}
              >
                {Math.ceil(timeLeft)}s
              </span>
            ) : (
              <span className='text-[13px] font-semibold uppercase tracking-[0.14em] text-white/55'>
                {tx.stage} {data.stage}
                <span className='text-white/30'>/{TOTAL_STAGE}</span>
              </span>
            )}
            <span className='flex items-center gap-3'>
              <span
                key={sprint ? cleared : score}
                className='ch-pop text-[24px] font-bold leading-none text-white/90'
              >
                {sprint ? cleared : score}
              </span>
              <span className='rounded-full bg-white/10 px-2.5 py-1 text-[12px] font-medium text-white/60'>
                {tx.best} {best}
              </span>
            </span>
          </>
        ) : null}
      </div>

      <div
        ref={areaRef}
        className='relative flex min-h-0 flex-1 flex-col items-center justify-center gap-3'
      >
        {data ? (
          <>
            <div
              className='h-1.5 overflow-hidden rounded-full bg-white/10'
              style={{ width: gridPx || '60%' }}
            >
              <div
                className='h-full rounded-full transition-[width] duration-75 ease-linear'
                style={{
                  width: `${ratio * 100}%`,
                  background: low ? '#ff5a5f' : 'rgba(255,255,255,0.7)',
                }}
              />
            </div>

            <div
              key={data.stage}
              className='ch-grid grid'
              style={{
                width: gridPx || 280,
                height: gridPx || 280,
                gridTemplateColumns: `repeat(${data.n}, minmax(0, 1fr))`,
                gap: Math.max(3, Math.round((gridPx || 280) / data.n / 18)),
              }}
            >
              {Array.from({ length: data.n * data.n }).map((_, i) => {
                const isDiff = i === data.diffIdx;
                return (
                  <button
                    key={i}
                    type='button'
                    aria-label='tile'
                    disabled={locked}
                    onClick={() => onCell(i)}
                    className={`ch-cell ${reveal === i ? 'ch-reveal' : ''}`}
                    style={{
                      backgroundColor: rgbStr(isDiff ? data.diff : data.base),
                    }}
                  />
                );
              })}
            </div>
          </>
        ) : null}

        {fx ? (
          <div
            key={fx.key + ':' + fx.kind}
            className='ch-fx pointer-events-none absolute inset-x-0 top-2 flex justify-center'
          >
            <span
              className='text-[34px] font-extrabold'
              style={{
                color:
                  fx.kind === 'correct'
                    ? '#42d77d'
                    : fx.kind === 'wrong'
                      ? '#ff5a5f'
                      : 'rgba(255,255,255,0.6)',
                textShadow: '0 2px 14px rgba(0,0,0,0.45)',
              }}
            >
              {fx.kind === 'correct'
                ? `+${fx.pts}`
                : fx.kind === 'wrong'
                  ? tx.miss
                  : tx.timeUp}
            </span>
          </div>
        ) : null}
      </div>

      {phase === 'idle' && (
        <div className='ch-in absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center'>
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
                {m === 'sprint' ? tx.modeSprint : tx.modeStages}
              </button>
            ))}
          </div>
          <p className='max-w-[380px] text-[14px] leading-relaxed text-white/70'>
            {sprint ? tx.subSprint : tx.subStages}
          </p>
          <div className='w-full max-w-[420px] rounded-[14px] bg-white/[0.05] px-5 py-4 text-left ring-1 ring-white/10'>
            <div className='mb-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/40'>
              {tx.rulesTitle}
            </div>
            <ul className='space-y-2'>
              {(sprint ? tx.rulesSprint : tx.rulesStages).map((r, i) => (
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
            onClick={() => start(mode)}
            className='ch-btn inline-flex items-center rounded-full bg-white px-9 py-3 text-[15px] font-semibold text-[#121212] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101319]'
          >
            {tx.start}
          </button>
        </div>
      )}

      {phase === 'over' && (
        <div className='ch-in absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 px-6 text-center'>
          <div className='text-[14px] font-semibold text-white/70'>
            {sprint ? tx.overSprint : tx.overStages}
          </div>
          <div className='text-[44px] font-bold leading-none text-white/90'>
            {sprint ? cleared : score}
          </div>
          <div className='mb-3 text-[13px] font-medium text-white/50'>
            {tx.best} · {best}
          </div>
          <button
            type='button'
            onClick={() => start(mode)}
            className='ch-btn inline-flex items-center rounded-full bg-white px-9 py-3 text-[15px] font-semibold text-[#121212] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[#101319]'
          >
            {tx.again}
          </button>
        </div>
      )}

      <style>{`
        .ch-grid { touch-action: manipulation; }
        .ch-cell {
          border-radius: 10px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -3px 7px rgba(0,0,0,0.22);
          transition: transform 0.12s cubic-bezier(0.23,1,0.32,1), box-shadow 0.18s ease;
          cursor: pointer;
        }
        .ch-cell:hover:not(:disabled) { transform: scale(1.04); box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 16px rgba(0,0,0,0.35); }
        .ch-cell:active:not(:disabled) { transform: scale(0.96); }
        .ch-reveal { animation: chReveal 0.6s ease; box-shadow: 0 0 0 3px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.55); }
        @keyframes chReveal { 0%,100% { box-shadow: 0 0 0 3px rgba(255,255,255,0.9), 0 0 18px rgba(255,255,255,0.5); } 50% { box-shadow: 0 0 0 5px rgba(255,255,255,1), 0 0 26px rgba(255,255,255,0.8); } }
        @keyframes chGridIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
        .ch-grid { animation: chGridIn 0.22s cubic-bezier(0.23,1,0.32,1) both; }
        @keyframes chFx { 0% { opacity: 0; transform: translateY(6px) scale(0.8); } 20% { opacity: 1; transform: translateY(0) scale(1.05); } 100% { opacity: 0; transform: translateY(-14px) scale(1); } }
        .ch-fx span { animation: chFx 0.7s cubic-bezier(0.23,1,0.32,1) forwards; display: inline-block; }
        @keyframes chPop { 0% { transform: scale(1.5); } 100% { transform: scale(1); } }
        .ch-pop { animation: chPop 0.3s cubic-bezier(0.23,1,0.32,1); transform-origin: right center; display: inline-block; }
        @keyframes chIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        .ch-in { animation: chIn 0.18s cubic-bezier(0.23,1,0.32,1) both; }
        .ch-btn { transition: transform 0.15s cubic-bezier(0.23,1,0.32,1), background-color 0.2s ease; }
        .ch-btn:hover { transform: scale(1.02); background-color: rgba(255,255,255,0.9); }
        .ch-btn:active { transform: scale(0.97); }
        @media (prefers-reduced-motion: reduce) {
          .ch-cell, .ch-grid, .ch-fx span, .ch-pop, .ch-in, .ch-btn, .ch-reveal { animation: none !important; transition: none !important; }
          .ch-cell:hover:not(:disabled), .ch-cell:active:not(:disabled), .ch-btn:hover, .ch-btn:active { transform: none; }
        }
      `}</style>
    </div>
  );
}

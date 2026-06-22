'use client';

import { useEffect, useRef, useState } from 'react';

import type { Locale } from '@/lib/dict';

/* Radish Smash — ported from kimi.com/share/d30fhgqj4egk5k4362q0. Core logic kept; visuals upgraded to the aihues aesthetic. */

type Phase = 'idle' | 'playing' | 'over';
type DiffKey = 'chill' | 'normal' | 'rush';
type Kind = 'carrot' | 'cabbage' | 'bunny' | 'doom';

const BEST_KEY = 'aihues_radish-smash_best';
const ROUND_TIME = 60;
const MAX_ACTIVE = 3;
const GRID = 4;
const CELLS = GRID * GRID;

/* speed level → spawn interval (ms), faithful to source: 1200 / sqrt(level) */
const DIFFS: Record<DiffKey, { level: number }> = {
  chill: { level: 3 },
  normal: { level: 5 },
  rush: { level: 8 },
};
const DIFF_ORDER: DiffKey[] = ['chill', 'normal', 'rush'];
const spawnInterval = (level: number) => Math.round(1200 / Math.sqrt(level));

/* creature table: emoji, base points, cumulative probability — kept from source
   (carrot 0.4, cabbage 0.3, bunny 0.2, doom 0.1). doom ends the round at once. */
const CREATURES: { kind: Kind; emoji: string; score: number; prob: number }[] =
  [
    { kind: 'carrot', emoji: '🥕', score: 5, prob: 0.4 },
    { kind: 'cabbage', emoji: '🥬', score: 3, prob: 0.3 },
    { kind: 'bunny', emoji: '🐰', score: -5, prob: 0.2 },
    { kind: 'doom', emoji: '🐇', score: -50, prob: 0.1 },
  ];

function pickCreature() {
  const r = Math.random();
  let acc = 0;
  for (const c of CREATURES) {
    acc += c.prob;
    if (r < acc) return c;
  }
  return CREATURES[0];
}

interface Target {
  id: number;
  cell: number;
  kind: Kind;
  emoji: string;
  score: number;
}
interface Hit {
  id: number;
  cell: number;
  kind: Kind;
  points: number;
  combo: number;
}

const T = {
  en: {
    score: 'Score',
    best: 'Best',
    combo: 'Combo',
    ready: 'Smash the veg, spare the bunnies',
    start: 'Start',
    again: 'Play again',
    hint: 'Tap a hole to whack what pops up',
    choose: 'Choose your pace',
    diffs: { chill: 'Chill', normal: 'Normal', rush: 'Rush' },
    legend: 'Whack the veg, dodge the bunnies — the rare hare ends the run.',
    overTitle: "Time's up",
    doomTitle: 'The hare got you',
  },
  zh: {
    score: '得分',
    best: '最高',
    combo: '连击',
    ready: '只打蔬菜,放过兔子',
    start: '开始',
    again: '再来一局',
    hint: '点击地洞,敲打冒头的东西',
    choose: '选择节奏',
    diffs: { chill: '悠闲', normal: '普通', rush: '狂暴' },
    legend: '打蔬菜、躲家兔——稀有的那兔会直接结束游戏。',
    overTitle: '时间到',
    doomTitle: '被那兔抓到了',
  },
} as const;

export default function RadishSmashGame({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const tx = T[zh ? 'zh' : 'en'];

  const spawnTimerRef = useRef<number>(0);
  const roundTimerRef = useRef<number>(0);
  const despawnRef = useRef<Map<number, number>>(new Map());
  const hitTimersRef = useRef<Set<number>>(new Set());
  const targetsRef = useRef<Target[]>([]);
  const phaseRef = useRef<Phase>('idle');
  const diffRef = useRef<DiffKey>('normal');
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const bestRef = useRef(0);
  const idRef = useRef(0);
  const startRef = useRef<() => void>(() => {});

  const [phase, setPhase] = useState<Phase>('idle');
  const [diff, setDiff] = useState<DiffKey>('normal');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [best, setBest] = useState(0);
  const [time, setTime] = useState(ROUND_TIME);
  const [targets, setTargets] = useState<Target[]>([]);
  const [hits, setHits] = useState<Hit[]>([]);
  const [doom, setDoom] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const b = Number(localStorage.getItem(BEST_KEY) || 0) || 0;
      bestRef.current = b;
      setBest(b);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const hitTimers = hitTimersRef.current;

    const setPhaseBoth = (p: Phase) => {
      phaseRef.current = p;
      setPhase(p);
    };

    const clearSpawn = () => {
      window.clearInterval(spawnTimerRef.current);
      spawnTimerRef.current = 0;
    };
    const clearRound = () => {
      window.clearInterval(roundTimerRef.current);
      roundTimerRef.current = 0;
    };
    const clearDespawns = () => {
      despawnRef.current.forEach((t) => window.clearTimeout(t));
      despawnRef.current.clear();
    };

    const syncTargets = () => setTargets([...targetsRef.current]);

    const removeTarget = (id: number) => {
      const idx = targetsRef.current.findIndex((t) => t.id === id);
      if (idx === -1) return false;
      targetsRef.current.splice(idx, 1);
      const dt = despawnRef.current.get(id);
      if (dt !== undefined) {
        window.clearTimeout(dt);
        despawnRef.current.delete(id);
      }
      return true;
    };

    const spawn = () => {
      if (phaseRef.current !== 'playing') return;
      if (targetsRef.current.length >= MAX_ACTIVE) return;
      const used = new Set(targetsRef.current.map((t) => t.cell));
      const free: number[] = [];
      for (let i = 0; i < CELLS; i++) if (!used.has(i)) free.push(i);
      if (free.length === 0) return;
      const cell = free[Math.floor(Math.random() * free.length)];
      const c = pickCreature();
      const id = ++idRef.current;
      targetsRef.current.push({
        id,
        cell,
        kind: c.kind,
        emoji: c.emoji,
        score: c.score,
      });
      syncTargets();
      const stay = Math.round(
        spawnInterval(DIFFS[diffRef.current].level) * 1.5
      );
      const dt = window.setTimeout(() => {
        despawnRef.current.delete(id);
        if (removeTarget(id)) syncTargets();
      }, stay);
      despawnRef.current.set(id, dt);
    };

    const endGame = (byDoom: boolean) => {
      clearSpawn();
      clearRound();
      clearDespawns();
      targetsRef.current = [];
      syncTargets();
      setDoom(byDoom);
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

    const whack = (cell: number) => {
      if (phaseRef.current !== 'playing') return;
      const target = targetsRef.current.find((t) => t.cell === cell);
      if (!target) return;

      const bad = target.score < 0;
      let points = target.score;
      let nextCombo = comboRef.current;
      if (bad) {
        nextCombo = 0;
      } else {
        nextCombo = comboRef.current + 1;
        const mult = 1 + Math.min(5, Math.floor((nextCombo - 1) / 3)) * 0.2;
        points = Math.round(target.score * mult);
      }
      comboRef.current = nextCombo;
      setCombo(nextCombo);

      scoreRef.current += points;
      setScore(scoreRef.current);

      const hitId = ++idRef.current;
      setHits((prev) => [
        ...prev,
        { id: hitId, cell, kind: target.kind, points, combo: nextCombo },
      ]);
      const ht = window.setTimeout(() => {
        hitTimers.delete(ht);
        setHits((prev) => prev.filter((h) => h.id !== hitId));
      }, 700);
      hitTimers.add(ht);

      removeTarget(target.id);
      syncTargets();

      if (target.kind === 'doom') {
        window.setTimeout(() => {
          if (phaseRef.current === 'playing') endGame(true);
        }, 480);
      }
    };

    const startRound = () => {
      clearSpawn();
      clearRound();
      clearDespawns();
      hitTimers.forEach((t) => window.clearTimeout(t));
      hitTimers.clear();
      targetsRef.current = [];
      setHits([]);
      setDoom(false);
      scoreRef.current = 0;
      comboRef.current = 0;
      setScore(0);
      setCombo(0);
      setTime(ROUND_TIME);
      syncTargets();
      setPhaseBoth('playing');

      const interval = spawnInterval(DIFFS[diffRef.current].level);
      spawnTimerRef.current = window.setInterval(spawn, interval);
      roundTimerRef.current = window.setInterval(() => {
        setTime((prev) => {
          const next = prev - 1;
          if (next <= 0) {
            endGame(false);
            return 0;
          }
          return next;
        });
      }, 1000);
    };

    startRef.current = startRound;

    const board = document.getElementById('rs-board');
    const onPointer = (e: Event) => {
      const ev = e as PointerEvent;
      const el = (ev.target as HTMLElement | null)?.closest('[data-cell]');
      if (!el) return;
      ev.preventDefault();
      const cell = Number((el as HTMLElement).dataset.cell);
      if (!Number.isNaN(cell)) whack(cell);
    };
    board?.addEventListener('pointerdown', onPointer);

    return () => {
      clearSpawn();
      clearRound();
      clearDespawns();
      hitTimers.forEach((t) => window.clearTimeout(t));
      hitTimers.clear();
      board?.removeEventListener('pointerdown', onPointer);
    };
  }, []);

  const ratio = time / ROUND_TIME;
  const low = time <= 10;
  const comboMult =
    1 + Math.min(5, Math.floor((Math.max(1, combo) - 1) / 3)) * 0.2;

  return (
    <div className='relative flex min-h-[480px] w-full flex-col touch-none select-none'>
      <div className='mx-auto flex h-[52px] w-full max-w-[420px] shrink-0 items-center justify-between px-1 text-white'>
        {phase === 'playing' ? (
          <>
            <span className='flex items-baseline gap-1.5'>
              <span
                key={score}
                className='rs-pop text-[26px] font-bold leading-none text-white/90 tabular-nums'
              >
                {score}
              </span>
              <span className='text-[12px] font-medium uppercase tracking-wide text-white/45'>
                {tx.score}
              </span>
            </span>
            <span className='flex items-center gap-2'>
              {combo >= 2 ? (
                <span
                  key={combo}
                  className='rs-combo rounded-full bg-[#ff9d2e]/20 px-2.5 py-1 text-[13px] font-bold text-[#ffb454] tabular-nums'
                >
                  {tx.combo} ×{combo}
                  {comboMult > 1 ? (
                    <span className='ml-1 text-[#ffd28a]'>
                      {comboMult.toFixed(1)}×
                    </span>
                  ) : null}
                </span>
              ) : null}
              <span
                className={`tabular-nums rounded-full px-3 py-1 text-[13px] font-medium ${
                  low
                    ? 'bg-[#ff6b70]/20 text-[#ff8e92]'
                    : 'bg-white/10 text-white/70'
                }`}
              >
                {time}s
              </span>
            </span>
          </>
        ) : null}
      </div>

      {phase === 'playing' ? (
        <div className='mx-auto mb-2 w-full max-w-[420px] shrink-0 px-1'>
          <div className='h-1.5 overflow-hidden rounded-full bg-white/10'>
            <div
              className='h-full rounded-full transition-[width] duration-1000 ease-linear'
              style={{
                width: `${ratio * 100}%`,
                background: low ? '#ff5a5f' : 'rgba(255,255,255,0.7)',
              }}
            />
          </div>
        </div>
      ) : null}

      <div className='relative flex min-h-0 flex-1 items-center justify-center'>
        <div
          id='rs-board'
          className='rs-grid grid w-full max-w-[420px]'
          style={{
            aspectRatio: '1 / 1',
            gridTemplateColumns: `repeat(${GRID}, minmax(0, 1fr))`,
            gap: 'clamp(6px, 2.4%, 14px)',
          }}
        >
          {Array.from({ length: CELLS }).map((_, i) => {
            const target = targets.find((t) => t.cell === i);
            const hit = hits.find((h) => h.cell === i);
            const bad = target ? target.score < 0 : false;
            const doomTarget = target?.kind === 'doom';
            return (
              <div
                key={i}
                data-cell={i}
                role='button'
                tabIndex={-1}
                aria-label='hole'
                className='rs-hole relative cursor-pointer'
              >
                <span className='rs-hole-rim absolute inset-0 rounded-full' />
                <span className='rs-hole-pit absolute rounded-full' />
                {target ? (
                  <span
                    key={target.id}
                    className={`rs-mole absolute left-1/2 top-1/2 flex items-center justify-center rounded-full ${
                      doomTarget ? 'rs-doom' : bad ? 'rs-bad' : 'rs-good'
                    }`}
                  >
                    <span className='rs-emoji'>{target.emoji}</span>
                  </span>
                ) : null}
                {hit ? (
                  <span
                    key={`hit-${hit.id}`}
                    className='rs-hit pointer-events-none absolute left-1/2 top-1/2 z-10 whitespace-nowrap text-center text-[clamp(14px,4vw,22px)] font-extrabold'
                    style={{
                      color: hit.points >= 0 ? '#46e8a0' : '#ff6b70',
                      textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                    }}
                  >
                    {hit.points >= 0 ? `+${hit.points}` : hit.points}
                    {hit.points >= 0 && hit.combo >= 2 ? (
                      <span className='block text-[clamp(9px,2.4vw,12px)] text-[#ffb454]'>
                        ×{hit.combo}
                      </span>
                    ) : null}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>

        {phase === 'idle' && (
          <div className='rs-in absolute inset-0 flex flex-col items-center justify-center gap-5 bg-black/35 px-6 text-center'>
            <p className='text-[12px] font-bold uppercase tracking-[0.18em] text-white/55'>
              {tx.ready}
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
              className='rs-cta rounded-full bg-white px-9 py-3 text-[15px] font-bold text-[#121212]'
            >
              {tx.start}
            </button>
            <p className='max-w-[340px] text-[13px] leading-relaxed text-white/55'>
              {tx.legend}
            </p>
          </div>
        )}

        {phase === 'over' && (
          <div className='rs-in absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/55 px-6 text-center'>
            <span className='text-[13px] font-semibold uppercase tracking-[0.14em] text-white/55'>
              {doom ? tx.doomTitle : tx.overTitle}
            </span>
            <span className='text-[64px] font-extrabold leading-none text-white'>
              {score}
            </span>
            <span className='rounded-full bg-white/10 px-4 py-1 text-[13px] font-medium text-white/70'>
              {tx.best} {best}
            </span>
            <button
              type='button'
              onClick={() => startRef.current()}
              className='rs-cta mt-1 rounded-full bg-white px-9 py-3 text-[15px] font-bold text-[#121212]'
            >
              {tx.again}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .rs-grid { touch-action: manipulation; }
        .rs-hole { aspect-ratio: 1 / 1; }
        .rs-hole-rim {
          background: radial-gradient(circle at 50% 30%, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 60%, transparent 72%);
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.08), inset 0 -6px 14px rgba(0,0,0,0.45);
        }
        .rs-hole-pit {
          inset: 14%;
          background: radial-gradient(circle at 50% 35%, #2a1d12, #160d07 70%);
          box-shadow: inset 0 6px 14px rgba(0,0,0,0.7), inset 0 -2px 4px rgba(120,70,30,0.25);
        }
        .rs-hole:active .rs-hole-pit { box-shadow: inset 0 8px 18px rgba(0,0,0,0.8); }
        .rs-mole {
          width: 66%; height: 66%;
          transform: translate(-50%, -50%) scale(0);
          transform-origin: center bottom;
          animation: rsPop 0.22s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        .rs-good { background: radial-gradient(circle at 50% 35%, #ffe9b0, #f5a623); box-shadow: 0 4px 14px rgba(245,166,35,0.45), inset 0 -4px 8px rgba(0,0,0,0.18); }
        .rs-bad { background: radial-gradient(circle at 50% 35%, #d8dee8, #9aa6b8); box-shadow: 0 4px 14px rgba(120,130,150,0.4), inset 0 -4px 8px rgba(0,0,0,0.2); }
        .rs-doom { background: radial-gradient(circle at 50% 35%, #ffb0c2, #e0426a); box-shadow: 0 0 18px rgba(224,66,106,0.75), inset 0 -4px 8px rgba(0,0,0,0.25); animation: rsPop 0.22s cubic-bezier(0.34,1.56,0.64,1) forwards, rsDoomPulse 0.7s ease-in-out 0.22s infinite; }
        .rs-emoji { font-size: clamp(20px, 8vw, 40px); line-height: 1; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.35)); }
        .rs-hole:active .rs-mole { animation: rsSquash 0.18s ease forwards; }
        @keyframes rsPop {
          0% { transform: translate(-50%, -50%) scale(0); }
          70% { transform: translate(-50%, -52%) scale(1.08); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes rsSquash {
          0% { transform: translate(-50%, -50%) scale(1); }
          100% { transform: translate(-50%, -42%) scale(1.18, 0.7); opacity: 0.4; }
        }
        @keyframes rsDoomPulse {
          0%, 100% { box-shadow: 0 0 14px rgba(224,66,106,0.6), inset 0 -4px 8px rgba(0,0,0,0.25); }
          50% { box-shadow: 0 0 26px rgba(224,66,106,0.95), inset 0 -4px 8px rgba(0,0,0,0.25); }
        }
        .rs-hit { animation: rsHit 0.7s cubic-bezier(0.23,1,0.32,1) forwards; }
        @keyframes rsHit {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.6); }
          20% { opacity: 1; transform: translate(-50%, -90%) scale(1.1); }
          100% { opacity: 0; transform: translate(-50%, -160%) scale(1); }
        }
        @keyframes rsPopNum { 0% { transform: scale(1.5); } 100% { transform: scale(1); } }
        .rs-pop { animation: rsPopNum 0.3s cubic-bezier(0.23,1,0.32,1); transform-origin: left center; display: inline-block; }
        @keyframes rsComboIn { 0% { transform: scale(0.7); opacity: 0; } 60% { transform: scale(1.12); } 100% { transform: scale(1); opacity: 1; } }
        .rs-combo { animation: rsComboIn 0.28s cubic-bezier(0.34,1.56,0.64,1); display: inline-block; }
        @keyframes rsIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .rs-in { animation: rsIn .28s cubic-bezier(0.23,1,0.32,1); }
        .rs-cta { transition: transform .15s cubic-bezier(0.23,1,0.32,1); }
        .rs-cta:hover { transform: translateY(-2px); }
        .rs-cta:active { transform: scale(.97); }
        @media (prefers-reduced-motion: reduce) {
          .rs-mole, .rs-doom, .rs-hit, .rs-pop, .rs-combo, .rs-in { animation: none !important; }
          .rs-mole { transform: translate(-50%, -50%) scale(1); }
          .rs-cta { transition: none; }
          .rs-hole:active .rs-mole { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

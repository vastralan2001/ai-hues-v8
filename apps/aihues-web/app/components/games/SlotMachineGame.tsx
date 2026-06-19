'use client';

import { useEffect, useRef, useState } from 'react';

import type { Locale } from '@/lib/dict';

/* Lucky Slots — native port of the original slot-machine game.
   Faithful: 6 symbols, a 3×3 grid, 8 paylines (rows / cols / diagonals),
   staggered reel stops, jackpot on Lucky 7, 3 free spins per day,
   credits and a spin history. */

const SYMBOLS = [
  { e: '7️⃣', name: 'Lucky 7', reward: 100 },
  { e: '💎', name: 'Diamond', reward: 50 },
  { e: '🔔', name: 'Bell', reward: 30 },
  { e: '🍋', name: 'Lemon', reward: 15 },
  { e: '🍒', name: 'Cherry', reward: 10 },
  { e: '⭐', name: 'Star', reward: 5 },
];

// each line: three [col, row] cells
const PAYLINES: [number, number][][] = [
  [
    [0, 0],
    [1, 0],
    [2, 0],
  ],
  [
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  [
    [0, 2],
    [1, 2],
    [2, 2],
  ],
  [
    [0, 0],
    [0, 1],
    [0, 2],
  ],
  [
    [1, 0],
    [1, 1],
    [1, 2],
  ],
  [
    [2, 0],
    [2, 1],
    [2, 2],
  ],
  [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  [
    [0, 2],
    [1, 1],
    [2, 0],
  ],
];

const MAX_SPINS = 3;
const SPINS_KEY = 'aihues_slots_spins';
const CREDITS_KEY = 'aihues_slots_credits';
const HISTORY_KEY = 'aihues_slots_history';

interface HistItem {
  reward: number;
  jackpot: boolean;
  date: string;
}

const T = {
  en: {
    spin: 'Spin',
    spinning: 'Spinning…',
    none: 'No win — try again!',
    win: 'You won',
    jackpot: 'JACKPOT!',
    credits: 'Credits',
    spinsLeft: 'Free spins today',
    noSpins: 'Out of spins — come back tomorrow',
    history: 'History',
    empty: 'No spins yet',
  },
  zh: {
    spin: '旋转',
    spinning: '旋转中…',
    none: '未中奖,再试一次!',
    win: '赢得',
    jackpot: '大奖!',
    credits: '积分',
    spinsLeft: '今日免费次数',
    noSpins: '次数已用完,明天再来',
    history: '历史',
    empty: '还没有记录',
  },
} as const;

function todayStr() {
  return new Date().toDateString();
}
function randGrid(): number[][] {
  return [0, 1, 2].map(() =>
    [0, 1, 2].map(() => Math.floor(Math.random() * SYMBOLS.length))
  );
}

export default function SlotMachineGame({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const tx = T[zh ? 'zh' : 'en'];
  // deterministic initial grid (avoids SSR/client hydration mismatch);
  // randomised on mount below
  const [grid, setGrid] = useState<number[][]>(() => [
    [1, 2, 3],
    [4, 5, 0],
    [2, 3, 1],
  ]);
  const [spinning, setSpinning] = useState(false);
  const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
  const [credits, setCredits] = useState(0);
  const [msg, setMsg] = useState<{ text: string; color: string } | null>(null);
  const [winCells, setWinCells] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<HistItem[]>([]);
  const intervals = useRef<Array<ReturnType<typeof setInterval>>>([]);
  const timeouts = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    const ivRef = intervals;
    const toRef = timeouts;
    const raf = requestAnimationFrame(() => {
      setGrid(randGrid());
      try {
        const sp = JSON.parse(localStorage.getItem(SPINS_KEY) || 'null') as {
          date: string;
          left: number;
        } | null;
        setSpinsLeft(sp && sp.date === todayStr() ? sp.left : MAX_SPINS);
        setCredits(Number(localStorage.getItem(CREDITS_KEY) || '0') || 0);
        setHistory(JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'));
      } catch {
        /* ignore */
      }
    });
    return () => {
      cancelAnimationFrame(raf);
      ivRef.current.forEach(clearInterval);
      toRef.current.forEach(clearTimeout);
    };
  }, []);

  function evaluate(final: number[][]) {
    const cells = new Set<string>();
    let reward = 0;
    let jackpot = false;
    for (const line of PAYLINES) {
      const [a, b, c] = line.map(([col, row]) => final[row][col]);
      if (a === b && b === c) {
        reward += SYMBOLS[a].reward;
        if (a === 0) jackpot = true;
        for (const [col, row] of line) cells.add(`${row},${col}`);
      }
    }
    setWinCells(cells);
    if (reward > 0) {
      const next = credits + reward;
      setCredits(next);
      setMsg({
        text: jackpot ? `${tx.jackpot} +${reward}` : `${tx.win} +${reward}`,
        color: jackpot ? '#e0b34a' : '#34d399',
      });
      const hist = [
        {
          reward,
          jackpot,
          date: new Date().toLocaleDateString('en', {
            month: 'short',
            day: 'numeric',
          }),
        },
        ...history,
      ].slice(0, 20);
      setHistory(hist);
      try {
        localStorage.setItem(CREDITS_KEY, String(next));
        localStorage.setItem(HISTORY_KEY, JSON.stringify(hist));
      } catch {
        /* ignore */
      }
    } else {
      setMsg({ text: tx.none, color: '#94a3b8' });
    }
  }

  function spin() {
    if (spinning || spinsLeft <= 0) return;
    const left = spinsLeft - 1;
    setSpinsLeft(left);
    try {
      localStorage.setItem(
        SPINS_KEY,
        JSON.stringify({ date: todayStr(), left })
      );
    } catch {
      /* ignore */
    }
    setSpinning(true);
    setMsg(null);
    setWinCells(new Set());
    intervals.current.forEach(clearInterval);
    intervals.current = [];
    const final = randGrid();

    [0, 1, 2].forEach((col) => {
      const iv = setInterval(() => {
        setGrid((prev) => {
          const next = prev.map((r) => [...r]);
          for (let row = 0; row < 3; row++)
            next[row][col] = Math.floor(Math.random() * SYMBOLS.length);
          return next;
        });
      }, 70);
      intervals.current.push(iv);
      const stop = setTimeout(
        () => {
          clearInterval(iv);
          setGrid((prev) => {
            const next = prev.map((r) => [...r]);
            for (let row = 0; row < 3; row++) next[row][col] = final[row][col];
            return next;
          });
          if (col === 2) {
            setSpinning(false);
            evaluate(final);
          }
        },
        650 + col * 380
      );
      timeouts.current.push(stop);
    });
  }

  return (
    <div className='mx-auto w-full max-w-[460px]'>
      <div className='mb-5 flex items-center justify-center gap-2 text-[13px] font-semibold text-[#e7c873]'>
        <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#e0b34a]/15 text-[12px]'>
          ¢
        </span>
        {credits} {tx.credits}
      </div>

      {/* cabinet */}
      <div className='rounded-[22px] border border-[#e0b34a]/30 bg-[rgba(20,10,12,0.6)] p-4 shadow-[0_0_50px_-12px_rgba(224,179,74,0.35)] backdrop-blur-md'>
        <div className='grid grid-cols-3 gap-2 rounded-[14px] bg-black/45 p-2'>
          {grid.map((rowArr, r) =>
            rowArr.map((sym, c) => {
              const isWin = winCells.has(`${r},${c}`);
              return (
                <div
                  key={`${r}-${c}`}
                  className={`flex h-[84px] items-center justify-center rounded-[12px] text-[46px] transition-all ${
                    isWin
                      ? 'bg-[#e0b34a]/25 ring-2 ring-[#e0b34a] [animation:cellPop_0.4s_ease]'
                      : 'bg-gradient-to-b from-white/95 to-white/80'
                  }`}
                >
                  {SYMBOLS[sym].e}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* message */}
      <div className='mt-5 h-7 text-center'>
        {msg ? (
          <span
            className='text-[16px] font-extrabold'
            style={{ color: msg.color }}
          >
            {msg.text}
          </span>
        ) : null}
      </div>

      {/* spins + button */}
      <div className='mt-3 flex flex-col items-center gap-3'>
        <button
          type='button'
          onClick={spin}
          disabled={spinning || spinsLeft <= 0}
          className='inline-flex items-center rounded-full bg-gradient-to-b from-[#f0c45a] to-[#d9982e] px-12 py-3 text-[16px] font-extrabold text-[#2a1d05] shadow-[0_12px_30px_-10px_rgba(224,179,74,0.8)] transition-transform hover:-translate-y-0.5 disabled:opacity-50'
        >
          {spinning ? tx.spinning : tx.spin}
        </button>
        <div className='flex items-center gap-2 text-[12px] text-white/55'>
          <span>{spinsLeft > 0 ? tx.spinsLeft : tx.noSpins}</span>
          {spinsLeft > 0 ? (
            <span className='flex gap-1'>
              {Array.from({ length: MAX_SPINS }).map((_, i) => (
                <span
                  key={i}
                  className={`h-2 w-2 rounded-full ${i < spinsLeft ? 'bg-[#e0b34a]' : 'bg-white/15'}`}
                />
              ))}
            </span>
          ) : null}
        </div>
      </div>

      {/* history */}
      <div className='mt-8'>
        <div className='mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/40'>
          {tx.history}
        </div>
        {history.length === 0 ? (
          <div className='rounded-[12px] border border-white/10 px-4 py-4 text-center text-[13px] text-white/35'>
            {tx.empty}
          </div>
        ) : (
          <ul className='space-y-1.5'>
            {history.slice(0, 6).map((h, i) => (
              <li
                key={i}
                className='flex items-center justify-between rounded-[10px] border-l-[3px] bg-white/5 px-3 py-2 text-[13px]'
                style={{ borderLeftColor: h.jackpot ? '#e0b34a' : '#34d399' }}
              >
                <span className='text-white/50'>{h.date}</span>
                <span className='font-semibold text-white/80'>
                  {h.jackpot ? tx.jackpot : tx.win}
                </span>
                <span className='font-semibold text-[#e7c873]'>
                  +{h.reward}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <style>{`
        @keyframes cellPop { 0%{transform:scale(0.9)} 60%{transform:scale(1.12)} 100%{transform:scale(1)} }
      `}</style>
    </div>
  );
}

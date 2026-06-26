'use client';

import { useEffect, useState } from 'react';

import type { Locale } from '@/lib/dict';
import {
  randGrid,
  useSlotReels,
  SlotBoard,
  type SpinResult,
} from './slot-machine-core';

/* Lucky Slots — native port of the original slot-machine game. The board, the
   staggered column spin and the payline scoring all live in slot-machine-core,
   shared with the home demo. This file owns the meta: credits, free spins and
   the spin history. */

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

// History dates may be stored as ISO (current) or a pre-formatted "Jun 26"
// (legacy) — normalise both to one short format for display.
function fmtDate(d: string): string {
  const t = new Date(d);
  return Number.isNaN(t.getTime())
    ? d
    : t.toLocaleDateString('en', { month: 'short', day: 'numeric' });
}

export default function SlotMachineGame({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const tx = T[zh ? 'zh' : 'en'];
  // deterministic initial grid (avoids SSR/client hydration mismatch);
  // randomised on mount below
  const reels = useSlotReels([
    [1, 2, 3],
    [4, 5, 0],
    [2, 3, 1],
  ]);
  const [spinsLeft, setSpinsLeft] = useState(MAX_SPINS);
  const [credits, setCredits] = useState(0);
  const [msg, setMsg] = useState<{ text: string; color: string } | null>(null);
  const [history, setHistory] = useState<HistItem[]>([]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      reels.setGrid(randGrid());
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
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleResult(res: SpinResult) {
    if (res.reward > 0) {
      const next = credits + res.reward;
      setCredits(next);
      setMsg({
        text: res.jackpot
          ? `${tx.jackpot} +${res.reward}`
          : `${tx.win} +${res.reward}`,
        color: res.jackpot ? '#e0b34a' : '#34d399',
      });
      const hist = [
        {
          reward: res.reward,
          jackpot: res.jackpot,
          date: new Date().toISOString(),
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
    if (reels.spinning || spinsLeft <= 0) return;
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
    setMsg(null);
    reels.spin(randGrid(), handleResult);
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
        <div className='rounded-[14px] bg-black/45 p-2'>
          <SlotBoard
            grid={reels.grid}
            winCells={reels.winCells}
            spinKey={reels.spinKey}
            cell={84}
            gap={8}
            radius={12}
          />
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
          disabled={reels.spinning || spinsLeft <= 0}
          className='inline-flex items-center rounded-full bg-gradient-to-b from-[#f0c45a] to-[#d9982e] px-12 py-3 text-[16px] font-extrabold text-[#2a1d05] shadow-[0_12px_30px_-10px_rgba(224,179,74,0.8)] transition-transform hover:-translate-y-0.5 disabled:opacity-50'
        >
          {reels.spinning ? tx.spinning : tx.spin}
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
                className='grid grid-cols-[3.5rem_1fr_auto] items-center gap-3 rounded-[10px] border-l-[3px] bg-white/5 px-3 py-2 text-[13px]'
                style={{ borderLeftColor: h.jackpot ? '#e0b34a' : '#34d399' }}
              >
                <span className='text-white/50'>{fmtDate(h.date)}</span>
                <span className='font-semibold text-white/80'>
                  {h.jackpot ? tx.jackpot : tx.win}
                </span>
                <span className='justify-self-end font-semibold text-[#e7c873]'>
                  +{h.reward}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

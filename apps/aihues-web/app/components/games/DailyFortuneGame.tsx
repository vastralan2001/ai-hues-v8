'use client';

import { useEffect, useRef, useState } from 'react';

import type { Locale } from '@/lib/dict';

/* Daily Fortune — native port of the original daily-luck game.
   Faithful to the original: weighted fortune tiers, a daily-once draw,
   wisdom quote, lucky colour, do / don't, credits and a history log. */

interface Tier {
  level: string;
  levelZh: string;
  prob: number;
  credits: number;
  desc: string;
  descZh: string;
  color: string;
}

const TIERS: Tier[] = [
  {
    level: 'Great Fortune',
    levelZh: '大吉',
    prob: 0.1,
    credits: 50,
    desc: 'Everything goes smoothly',
    descZh: '万事顺遂',
    color: '#e0b34a',
  },
  {
    level: 'Fortune',
    levelZh: '吉',
    prob: 0.2,
    credits: 30,
    desc: 'Good luck keeps coming',
    descZh: '好运连连',
    color: '#34d399',
  },
  {
    level: 'Moderate Fortune',
    levelZh: '中吉',
    prob: 0.3,
    credits: 20,
    desc: 'Steady progress ahead',
    descZh: '稳步向前',
    color: '#60a5fa',
  },
  {
    level: 'Small Fortune',
    levelZh: '小吉',
    prob: 0.25,
    credits: 15,
    desc: 'Adjust and wait for good news',
    descZh: '调整待时',
    color: '#a78bfa',
  },
  {
    level: 'Neutral',
    levelZh: '平',
    prob: 0.15,
    credits: 5,
    desc: 'Contentment brings happiness',
    descZh: '知足常乐',
    color: '#94a3b8',
  },
];

const WISDOM = [
  'A journey of a thousand miles begins with a single step.',
  'Stay curious, keep learning.',
  'Code is poetry, elegance first.',
  'Today is perfect for refactoring old code.',
  'A bug is just a feature waiting for its fix.',
  'Good naming is half the battle.',
  'Every great product starts with a rough demo.',
  'An interesting challenge awaits you today.',
  'Done is better than perfect.',
  'Today is a good day to write tests.',
  'Documentation is a letter to your future self.',
  'Automation is the ultimate laziness of programmers.',
  'A helpful person will appear today.',
  'Health is the 1; everything else is the 0s.',
  'Write down three small goals for today.',
  'Trust your gut, but verify.',
];
const DOS = [
  'Write code',
  'Learn something new',
  'Submit a PR',
  'Refactor',
  'Write docs',
  'Code review',
  'Write unit tests',
  'Exercise early',
  'Read source code',
  'Share knowledge',
];
const DONTS = [
  'Work too late',
  'Skip tests',
  'Hard-code magic numbers',
  'Ignore docs',
  'Delay tasks',
  'Chase hype blindly',
];
const LUCKY_COLORS = [
  { name: 'Azure Blue', hex: '#007FFF' },
  { name: 'Crimson Red', hex: '#DC143C' },
  { name: 'Emerald Green', hex: '#50C878' },
  { name: 'Royal Purple', hex: '#7851A9' },
  { name: 'Golden Amber', hex: '#FFBF00' },
  { name: 'Ocean Teal', hex: '#008080' },
  { name: 'Rose Pink', hex: '#FF66CC' },
  { name: 'Sunset Orange', hex: '#FF4500' },
];

interface Result {
  level: string;
  levelZh: string;
  desc: string;
  descZh: string;
  color: string;
  credits: number;
  wisdom: string;
  doIt: string;
  dont: string;
  luckyColor: { name: string; hex: string };
  date: string;
}

const KEY = 'aihues_daily_v2';

function weighted(items: Tier[]): Tier {
  const total = items.reduce((s, i) => s + i.prob, 0);
  let r = Math.random() * total;
  for (const it of items) {
    r -= it.prob;
    if (r <= 0) return it;
  }
  return items[items.length - 1];
}
const pick = <T,>(a: T[]): T => a[Math.floor(Math.random() * a.length)];

const T = {
  en: {
    draw: 'Draw fortune',
    drawing: 'Drawing your fortune…',
    tomorrow: "You've drawn today — come back tomorrow",
    reward: "Today's reward",
    credits: 'Credits',
    lucky: 'Lucky colour',
    doLabel: 'Do',
    dontLabel: "Don't",
    history: 'History',
    empty: 'No draws yet',
  },
  zh: {
    draw: '求签',
    drawing: '正在为你抽签…',
    tomorrow: '今日已抽签,明天再来吧',
    reward: '今日奖励',
    credits: '积分',
    lucky: '幸运色',
    doLabel: '宜',
    dontLabel: '忌',
    history: '历史',
    empty: '还没有抽过签',
  },
} as const;

function todayStr() {
  return new Date().toDateString();
}

export default function DailyFortuneGame({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const tx = T[zh ? 'zh' : 'en'];
  const [phase, setPhase] = useState<'idle' | 'drawing' | 'result'>('idle');
  const [result, setResult] = useState<Result | null>(null);
  const [history, setHistory] = useState<Result[]>([]);
  const [credits, setCredits] = useState(0);
  const [drawnToday, setDrawnToday] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) {
          const data = JSON.parse(raw) as {
            history: Result[];
            credits: number;
            lastDraw: string;
          };
          setHistory(data.history ?? []);
          setCredits(data.credits ?? 0);
          if (data.lastDraw === todayStr() && data.history?.length) {
            setResult(data.history[0]);
            setPhase('result');
            setDrawnToday(true);
          }
        }
      } catch {
        /* ignore */
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  function draw() {
    if (phase === 'drawing' || drawnToday) return;
    setPhase('drawing');
    timer.current = setTimeout(() => {
      const tier = weighted(TIERS);
      const res: Result = {
        level: tier.level,
        levelZh: tier.levelZh,
        desc: tier.desc,
        descZh: tier.descZh,
        color: tier.color,
        credits: tier.credits,
        wisdom: pick(WISDOM),
        doIt: pick(DOS),
        dont: pick(DONTS),
        luckyColor: pick(LUCKY_COLORS),
        date: new Date().toLocaleDateString('en', {
          month: 'short',
          day: 'numeric',
        }),
      };
      const nextHistory = [res, ...history].slice(0, 20);
      const nextCredits = credits + res.credits;
      setResult(res);
      setHistory(nextHistory);
      setCredits(nextCredits);
      setPhase('result');
      setDrawnToday(true);
      try {
        localStorage.setItem(
          KEY,
          JSON.stringify({
            history: nextHistory,
            credits: nextCredits,
            lastDraw: todayStr(),
          })
        );
      } catch {
        /* ignore */
      }
    }, 1100);
  }

  return (
    <div className='mx-auto w-full max-w-[460px]'>
      {/* credits */}
      <div className='mb-5 flex items-center justify-center gap-2 text-[13px] font-semibold text-[#e7c873]'>
        <span className='inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#e0b34a]/15 text-[12px]'>
          ¢
        </span>
        {credits} {tx.credits}
      </div>

      {/* stage */}
      <div className='relative flex min-h-[300px] flex-col items-center justify-center'>
        {phase === 'idle' && (
          <button
            type='button'
            onClick={draw}
            className='group flex flex-col items-center gap-6'
          >
            <span className='text-[120px] leading-none drop-shadow-[0_8px_30px_rgba(224,179,74,0.4)] transition-transform group-hover:-translate-y-1'>
              🏮
            </span>
            <span className='inline-flex items-center rounded-full bg-gradient-to-b from-[#f0c45a] to-[#d9982e] px-9 py-3 text-[15px] font-extrabold text-[#2a1d05] shadow-[0_12px_30px_-10px_rgba(224,179,74,0.8)] transition-transform group-hover:-translate-y-0.5'>
              {tx.draw}
            </span>
          </button>
        )}

        {phase === 'drawing' && (
          <div className='flex flex-col items-center gap-5'>
            <span className='text-[110px] leading-none [animation:lanternShake_0.18s_infinite]'>
              🏮
            </span>
            <span className='text-[14px] text-white/60'>{tx.drawing}</span>
          </div>
        )}

        {phase === 'result' && result && (
          <div className='w-full [animation:fortuneIn_0.5s_cubic-bezier(0.23,1,0.32,1)]'>
            <div
              className='rounded-[22px] border bg-[rgba(18,14,26,0.55)] p-6 text-center backdrop-blur-md'
              style={{ borderColor: `${result.color}66` }}
            >
              <div
                className='text-[58px] font-black leading-none'
                style={{ color: result.color }}
              >
                {zh ? result.levelZh : result.level}
              </div>
              {!zh && (
                <div className='mt-1 text-[12px] font-bold uppercase tracking-[0.18em] text-white/45'>
                  {result.levelZh}
                </div>
              )}
              <div className='mt-3 text-[15px] text-white/85'>
                {zh ? result.descZh : result.desc}
              </div>

              <div className='my-5 flex items-center justify-center gap-2 rounded-full bg-[#e0b34a]/12 py-2 text-[14px] font-bold text-[#e7c873]'>
                {tx.reward}: +{result.credits} {tx.credits}
              </div>

              <p className='mb-5 text-[13px] italic leading-relaxed text-white/60'>
                “{result.wisdom}”
              </p>

              <div className='grid grid-cols-2 gap-3 text-left'>
                <div className='rounded-[12px] bg-white/5 px-3 py-2.5'>
                  <div className='text-[11px] font-bold uppercase tracking-wider text-[#34d399]'>
                    {tx.doLabel}
                  </div>
                  <div className='mt-0.5 text-[13px] text-white/85'>
                    {result.doIt}
                  </div>
                </div>
                <div className='rounded-[12px] bg-white/5 px-3 py-2.5'>
                  <div className='text-[11px] font-bold uppercase tracking-wider text-[#f87171]'>
                    {tx.dontLabel}
                  </div>
                  <div className='mt-0.5 text-[13px] text-white/85'>
                    {result.dont}
                  </div>
                </div>
                <div className='col-span-2 flex items-center gap-2 rounded-[12px] bg-white/5 px-3 py-2.5'>
                  <span
                    className='h-5 w-5 rounded-full ring-2 ring-white/20'
                    style={{ background: result.luckyColor.hex }}
                  />
                  <span className='text-[11px] font-bold uppercase tracking-wider text-white/45'>
                    {tx.lucky}
                  </span>
                  <span className='text-[13px] text-white/85'>
                    {result.luckyColor.name}
                  </span>
                </div>
              </div>
            </div>
            {drawnToday && (
              <p className='mt-4 text-center text-[12px] text-white/45'>
                {tx.tomorrow}
              </p>
            )}
          </div>
        )}
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
                style={{ borderLeftColor: h.color }}
              >
                <span className='text-white/50'>{h.date}</span>
                <span className='font-semibold' style={{ color: h.color }}>
                  {zh ? h.levelZh : h.level}
                </span>
                <span className='font-semibold text-[#e7c873]'>
                  +{h.credits}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <style>{`
        @keyframes lanternShake {
          0%,100% { transform: rotate(-7deg); }
          50% { transform: rotate(7deg); }
        }
        @keyframes fortuneIn {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

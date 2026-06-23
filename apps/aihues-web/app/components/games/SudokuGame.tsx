'use client';

import { useEffect, useRef, useState } from 'react';

import type { Locale } from '@/lib/dict';

/* Sudoku — ported from kimi.com/share/d1p6ptc5rbs8otg3d1i0. Core logic kept; visuals upgraded to the aihues aesthetic. */

type Phase = 'idle' | 'playing' | 'over';
type DiffKey = 'easy' | 'medium' | 'hard';
type Board = number[][];

const DIFF_ORDER: DiffKey[] = ['easy', 'medium', 'hard'];
const HOLES: Record<DiffKey, number> = { easy: 40, medium: 50, hard: 60 };
const BEST_KEY = 'aihues_sudoku_best';

const T = {
  en: {
    choose: 'Choose your difficulty',
    start: 'Start',
    again: 'Play again',
    hint: 'How to play',
    rule: 'Tap a cell, then a number. Fill the grid so every row, column and 3×3 box holds 1–9.',
    best: 'Best',
    mistakes: 'Mistakes',
    time: 'Time',
    erase: 'Erase',
    solved: 'Solved!',
    yourTime: 'Your time',
    newBest: 'New best',
    diffs: { easy: 'Easy', medium: 'Medium', hard: 'Hard' },
  },
  zh: {
    choose: '选择难度',
    start: '开始',
    again: '再来一局',
    hint: '玩法',
    rule: '点选格子后点数字。让每一行、每一列以及每个 3×3 宫格都包含 1–9。',
    best: '最佳',
    mistakes: '错误',
    time: '用时',
    erase: '擦除',
    solved: '完成！',
    yourTime: '用时',
    newBest: '新纪录',
    diffs: { easy: '简单', medium: '中等', hard: '困难' },
  },
} as const;

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function isValid(b: Board, r: number, c: number, n: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (b[r][i] === n || b[i][c] === n) return false;
  }
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (b[br + i][bc + j] === n) return false;
    }
  }
  return true;
}

function generateFullBoard(): Board {
  const b: Board = Array.from({ length: 9 }, () => Array<number>(9).fill(0));
  function fill(r: number, c: number): boolean {
    if (r === 9) return true;
    if (c === 9) return fill(r + 1, 0);
    const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (const n of nums) {
      if (isValid(b, r, c, n)) {
        b[r][c] = n;
        if (fill(r, c + 1)) return true;
        b[r][c] = 0;
      }
    }
    return false;
  }
  fill(0, 0);
  return b;
}

function countSolutions(b: Board): number {
  let count = 0;
  const temp: Board = b.map((row) => row.slice());
  function dfs(r: number, c: number): void {
    if (count > 1) return;
    if (r === 9) {
      count++;
      return;
    }
    if (c === 9) {
      dfs(r + 1, 0);
      return;
    }
    if (temp[r][c] !== 0) {
      dfs(r, c + 1);
      return;
    }
    for (let n = 1; n <= 9; n++) {
      if (isValid(temp, r, c, n)) {
        temp[r][c] = n;
        dfs(r, c + 1);
        temp[r][c] = 0;
      }
    }
  }
  dfs(0, 0);
  return count;
}

function generatePuzzle(diff: DiffKey): { puzzle: Board; solution: Board } {
  const sol = generateFullBoard();
  const puzzle: Board = sol.map((row) => row.slice());
  const holes = HOLES[diff];
  const cells = shuffle([...Array(81).keys()]);
  for (let i = 0; i < holes; i++) {
    const idx = cells[i];
    const r = Math.floor(idx / 9);
    const c = idx % 9;
    const backup = puzzle[r][c];
    puzzle[r][c] = 0;
    if (countSolutions(puzzle) !== 1) {
      puzzle[r][c] = backup;
    }
  }
  return { puzzle, solution: sol };
}

function formatTime(sec: number): string {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function isConflict(board: Board, r: number, c: number): boolean {
  const n = board[r][c];
  if (n === 0) return false;
  for (let i = 0; i < 9; i++) {
    if (i !== c && board[r][i] === n) return true;
    if (i !== r && board[i][c] === n) return true;
  }
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const rr = br + i;
      const cc = bc + j;
      if ((rr !== r || cc !== c) && board[rr][cc] === n) return true;
    }
  }
  return false;
}

type BestMap = Partial<Record<DiffKey, number>>;

function readBest(): BestMap {
  try {
    const raw = localStorage.getItem(BEST_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      const out: BestMap = {};
      for (const k of DIFF_ORDER) {
        const v = (parsed as Record<string, unknown>)[k];
        if (typeof v === 'number' && Number.isFinite(v)) out[k] = v;
      }
      return out;
    }
  } catch {
    /* ignore */
  }
  return {};
}

export default function SudokuGame({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const tx = T[zh ? 'zh' : 'en'];

  const fieldRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number>(0);
  const startedRef = useRef(false);

  const [phase, setPhase] = useState<Phase>('idle');
  const [diff, setDiff] = useState<DiffKey>('easy');
  const [puzzle, setPuzzle] = useState<Board>(() =>
    Array.from({ length: 9 }, () => Array<number>(9).fill(0))
  );
  const [solution, setSolution] = useState<Board>(() =>
    Array.from({ length: 9 }, () => Array<number>(9).fill(0))
  );
  const [given, setGiven] = useState<boolean[][]>(() =>
    Array.from({ length: 9 }, () => Array<boolean>(9).fill(false))
  );
  const [selected, setSelected] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [best, setBest] = useState<BestMap>({});
  const [gridPx, setGridPx] = useState(0);
  const [newRecord, setNewRecord] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setBest(readBest()));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const el = fieldRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      const px = Math.max(180, Math.floor(Math.min(r.width - 4, r.height - 4)));
      setGridPx((prev) => (Math.abs(prev - px) > 0.5 ? px : prev));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startGame = (d: DiffKey) => {
    const { puzzle: p, solution: s } = generatePuzzle(d);
    const g = p.map((row) => row.map((v) => v !== 0));
    setPuzzle(p);
    setSolution(s);
    setGiven(g);
    setSelected(null);
    setMistakes(0);
    setSeconds(0);
    setNewRecord(false);
    setPhase('playing');
    startedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const finish = (finalSeconds: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = 0;
    let isNew = false;
    setBest((prev) => {
      const prior = prev[diff];
      if (prior === undefined || finalSeconds < prior) {
        isNew = true;
        const next: BestMap = { ...prev, [diff]: finalSeconds };
        try {
          localStorage.setItem(BEST_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      }
      return prev;
    });
    setNewRecord(isNew);
    setPhase('over');
  };

  const checkWin = (board: Board) => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] !== solution[r][c]) return;
      }
    }
    finish(seconds);
  };

  const place = (num: number) => {
    if (phase !== 'playing' || selected === null) return;
    const r = Math.floor(selected / 9);
    const c = selected % 9;
    if (given[r][c]) return;
    const cur = puzzle[r][c];
    if (cur === num) return;
    const next = puzzle.map((row) => row.slice());
    next[r][c] = num;
    setPuzzle(next);
    if (num !== 0 && num !== solution[r][c]) {
      setMistakes((m) => m + 1);
    }
    checkWin(next);
  };

  const erase = () => {
    if (phase !== 'playing' || selected === null) return;
    const r = Math.floor(selected / 9);
    const c = selected % 9;
    if (given[r][c]) return;
    if (puzzle[r][c] === 0) return;
    const next = puzzle.map((row) => row.slice());
    next[r][c] = 0;
    setPuzzle(next);
  };

  const selectCell = (idx: number) => {
    if (phase !== 'playing') return;
    setSelected((prev) => (prev === idx ? null : idx));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase !== 'playing') return;
      const key = e.key;
      if (key >= '1' && key <= '9') {
        e.preventDefault();
        place(Number(key));
        return;
      }
      if (key === '0' || key === 'Backspace' || key === 'Delete') {
        e.preventDefault();
        erase();
        return;
      }
      if (selected === null) {
        if (
          key === 'ArrowUp' ||
          key === 'ArrowDown' ||
          key === 'ArrowLeft' ||
          key === 'ArrowRight'
        ) {
          e.preventDefault();
          setSelected(40);
        }
        return;
      }
      let r = Math.floor(selected / 9);
      let c = selected % 9;
      if (key === 'ArrowUp') r = (r + 8) % 9;
      else if (key === 'ArrowDown') r = (r + 1) % 9;
      else if (key === 'ArrowLeft') c = (c + 8) % 9;
      else if (key === 'ArrowRight') c = (c + 1) % 9;
      else return;
      e.preventDefault();
      setSelected(r * 9 + c);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, selected, puzzle, given, solution, seconds]);

  const selR = selected === null ? -1 : Math.floor(selected / 9);
  const selC = selected === null ? -1 : selected % 9;
  const selVal = selected === null ? 0 : puzzle[selR][selC];

  const counts = (() => {
    const out = Array<number>(10).fill(0);
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const v = puzzle[r][c];
        if (v >= 1 && v <= 9) out[v]++;
      }
    }
    return out;
  })();

  const px = gridPx || 320;
  const cellFont = Math.round(px / 9 / 2.1);

  return (
    <div className='relative flex min-h-[480px] w-full flex-col touch-none select-none'>
      <div
        className='mx-auto flex h-[52px] w-full shrink-0 items-center justify-between gap-3 px-1 text-white'
        style={{ maxWidth: px || undefined }}
      >
        {phase === 'playing' ? (
          <>
            <span className='flex items-center gap-1.5'>
              <span className='text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45'>
                {tx.mistakes}
              </span>
              <span
                className={`text-[18px] font-bold leading-none tabular-nums ${
                  mistakes > 0 ? 'text-[#ff6b70]' : 'text-white/90'
                }`}
              >
                {mistakes}
              </span>
            </span>
            <span className='text-[22px] font-bold leading-none text-white/90 tabular-nums'>
              {formatTime(seconds)}
            </span>
            <span className='rounded-full bg-white/10 px-3 py-1 text-[12px] font-medium text-white/70 tabular-nums'>
              {tx.best}{' '}
              {best[diff] !== undefined
                ? formatTime(best[diff] as number)
                : '—'}
            </span>
          </>
        ) : null}
      </div>

      <div
        ref={fieldRef}
        className='relative flex min-h-0 flex-1 flex-col items-center justify-center gap-4'
      >
        {phase !== 'idle' ? (
          <>
            <div
              className='sd-grid grid overflow-hidden rounded-[14px] bg-white/[0.04] ring-1 ring-white/10'
              style={{
                width: px,
                height: px,
                gridTemplateColumns: 'repeat(9, minmax(0, 1fr))',
                gridTemplateRows: 'repeat(9, minmax(0, 1fr))',
              }}
            >
              {Array.from({ length: 81 }).map((_, i) => {
                const r = Math.floor(i / 9);
                const c = i % 9;
                const v = puzzle[r][c];
                const isGiven = given[r][c];
                const conflict = isConflict(puzzle, r, c);
                const isSel = selected === i;
                const sameLine = !isSel && (r === selR || c === selC);
                const sameBox =
                  !isSel &&
                  !sameLine &&
                  selected !== null &&
                  Math.floor(r / 3) === Math.floor(selR / 3) &&
                  Math.floor(c / 3) === Math.floor(selC / 3);
                const sameVal =
                  !isSel && v !== 0 && selVal !== 0 && v === selVal;
                let bg = 'transparent';
                if (isSel) bg = 'rgba(255,255,255,0.18)';
                else if (sameVal) bg = 'rgba(255,255,255,0.12)';
                else if (sameLine || sameBox) bg = 'rgba(255,255,255,0.05)';
                let color = 'rgba(255,255,255,0.92)';
                if (conflict) color = '#ff7a7e';
                else if (isGiven) color = '#ffffff';
                else color = '#8fd0ff';
                return (
                  <button
                    key={i}
                    type='button'
                    aria-label={`cell ${r + 1},${c + 1}`}
                    onClick={() => selectCell(i)}
                    className='sd-cell flex items-center justify-center'
                    style={{
                      backgroundColor: bg,
                      color,
                      fontSize: cellFont,
                      fontWeight: isGiven ? 800 : 600,
                      borderRight:
                        c === 2 || c === 5
                          ? '2px solid rgba(255,255,255,0.32)'
                          : c === 8
                            ? 'none'
                            : '1px solid rgba(255,255,255,0.08)',
                      borderBottom:
                        r === 2 || r === 5
                          ? '2px solid rgba(255,255,255,0.32)'
                          : r === 8
                            ? 'none'
                            : '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    {v !== 0 ? v : ''}
                  </button>
                );
              })}
            </div>

            <div
              className='grid w-full grid-cols-5 gap-1.5'
              style={{ maxWidth: px }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
                const done = counts[n] >= 9;
                return (
                  <button
                    key={n}
                    type='button'
                    onClick={() => place(n)}
                    disabled={done}
                    className={`sd-pad flex items-center justify-center rounded-[10px] py-3 text-[18px] font-bold tabular-nums ${
                      done
                        ? 'bg-white/[0.03] text-white/25'
                        : 'bg-white/10 text-white hover:bg-white/[0.18]'
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
              <button
                type='button'
                onClick={erase}
                aria-label={tx.erase}
                className='sd-pad col-span-1 flex items-center justify-center rounded-[10px] bg-white/10 py-3 text-[15px] font-semibold text-white/80 hover:bg-white/[0.18]'
              >
                ⌫
              </button>
            </div>
          </>
        ) : null}
      </div>

      {phase === 'idle' && (
        <div className='sd-in absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center'>
          <p className='text-[12px] font-bold uppercase tracking-[0.18em] text-white/55'>
            {tx.choose}
          </p>
          <div className='flex flex-wrap justify-center gap-2'>
            {DIFF_ORDER.map((d) => (
              <button
                key={d}
                type='button'
                onClick={() => setDiff(d)}
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
            onClick={() => startGame(diff)}
            className='sd-cta rounded-full bg-white px-9 py-3 text-[15px] font-bold text-[#121212]'
          >
            {tx.start}
          </button>
          <p className='max-w-[420px] text-[13px] leading-relaxed text-white/55'>
            {tx.rule}
          </p>
        </div>
      )}

      {phase === 'over' && (
        <div className='sd-in absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/45 px-6 text-center'>
          <span className='text-[15px] font-semibold text-white/70'>
            {tx.solved}
          </span>
          <span className='text-[56px] font-extrabold leading-none text-white tabular-nums'>
            {formatTime(seconds)}
          </span>
          <span className='text-[13px] font-medium text-white/60'>
            {tx.diffs[diff]} · {tx.mistakes} {mistakes}
          </span>
          {newRecord && (
            <span className='rounded-full bg-white/15 px-3 py-1 text-[12px] font-semibold text-white'>
              {tx.newBest}
            </span>
          )}
          <button
            type='button'
            onClick={() => startGame(diff)}
            className='sd-cta mt-1 rounded-full bg-white px-9 py-3 text-[15px] font-bold text-[#121212]'
          >
            {tx.again}
          </button>
        </div>
      )}

      <style>{`
        .sd-grid { touch-action: manipulation; }
        .sd-cell { transition: background-color .12s ease; cursor: pointer; }
        .sd-cell:active { background-color: rgba(255,255,255,0.22) !important; }
        .sd-pad { transition: transform .12s cubic-bezier(0.23,1,0.32,1), background-color .18s ease; }
        .sd-pad:not(:disabled):active { transform: scale(.94); }
        @keyframes sdIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .sd-in { animation: sdIn .28s cubic-bezier(0.23,1,0.32,1); }
        .sd-cta { transition: transform .15s cubic-bezier(0.23,1,0.32,1); }
        .sd-cta:hover { transform: translateY(-2px); }
        .sd-cta:active { transform: scale(.97); }
        @media (prefers-reduced-motion: reduce) {
          .sd-cell, .sd-pad, .sd-in, .sd-cta { animation: none !important; transition: none !important; }
          .sd-pad:not(:disabled):active, .sd-cta:hover, .sd-cta:active { transform: none; }
        }
      `}</style>
    </div>
  );
}

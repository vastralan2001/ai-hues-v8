'use client';

import { useEffect, useRef, useState } from 'react';

import type { Locale } from '@/lib/dict';

/* Minesweeper — ported from kimi.com/share/d1pvrh6ruqkge6ukk4s0. Core logic kept; visuals upgraded to the aihues aesthetic. */

type Phase = 'idle' | 'playing' | 'over';
type DiffKey = 'easy' | 'normal' | 'hard';

const DIFFS: Record<DiffKey, { rows: number; cols: number; mines: number }> = {
  easy: { rows: 9, cols: 9, mines: 10 },
  normal: { rows: 13, cols: 13, mines: 28 },
  hard: { rows: 16, cols: 16, mines: 50 },
};
const DIFF_ORDER: DiffKey[] = ['easy', 'normal', 'hard'];
const BEST_KEY = 'aihues_minesweeper_best';
const LONG_PRESS_MS = 380;

interface Cell {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  count: number;
}

type Best = Partial<Record<DiffKey, number>>;

const NUM_COLOR: Record<number, string> = {
  1: '#7db4ff',
  2: '#5fd38a',
  3: '#ff7a85',
  4: '#c39bff',
  5: '#ffb15c',
  6: '#5cd6d6',
  7: '#d6dae3',
  8: '#9aa3b2',
};

const T = {
  en: {
    choose: 'Choose your difficulty',
    start: 'Start',
    again: 'Play again',
    best: 'Best',
    none: '—',
    mines: 'Mines',
    win: 'Cleared',
    lose: 'Boom',
    newBest: 'New best time!',
    time: 'Time',
    dig: 'Dig',
    flag: 'Flag',
    hint: 'Tap to dig · long-press or Flag mode to mark',
    cells: 'cells',
    diffs: { easy: 'Easy', normal: 'Normal', hard: 'Hard' },
  },
  zh: {
    choose: '选择难度',
    start: '开始',
    again: '再来一局',
    best: '最佳',
    none: '—',
    mines: '地雷',
    win: '通关',
    lose: '踩雷',
    newBest: '最佳纪录!',
    time: '用时',
    dig: '挖开',
    flag: '插旗',
    hint: '点击挖开 · 长按或插旗模式标记',
    cells: '格',
    diffs: { easy: '简单', normal: '普通', hard: '困难' },
  },
} as const;

function makeBoard(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      mine: false,
      revealed: false,
      flagged: false,
      count: 0,
    }))
  );
}

function neighbors(r: number, c: number, rows: number, cols: number) {
  const out: [number, number][] = [];
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++)
      if (dr || dc) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) out.push([nr, nc]);
      }
  return out;
}

function placeMines(
  board: Cell[][],
  rows: number,
  cols: number,
  mines: number,
  exR: number,
  exC: number
) {
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      board[r][c].mine = false;
      board[r][c].count = 0;
    }
  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    const excluded = Math.abs(r - exR) <= 1 && Math.abs(c - exC) <= 1;
    if (!board[r][c].mine && !excluded) {
      board[r][c].mine = true;
      placed++;
    }
  }
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (!board[r][c].mine)
        board[r][c].count = neighbors(r, c, rows, cols).filter(
          ([nr, nc]) => board[nr][nc].mine
        ).length;
}

function cloneBoard(board: Cell[][]): Cell[][] {
  return board.map((row) => row.map((cell) => ({ ...cell })));
}

export default function MinesweeperGame({ locale }: { locale: Locale }) {
  const zh = locale === 'zh';
  const tx = T[zh ? 'zh' : 'en'];

  const fieldRef = useRef<HTMLDivElement | null>(null);
  const boardRef = useRef<Cell[][]>([]);
  const phaseRef = useRef<Phase>('idle');
  const diffRef = useRef<DiffKey>('easy');
  const firstClickRef = useRef(true);
  const revealedRef = useRef(0);
  const timeRef = useRef(0);
  const timerRef = useRef<number>(0);
  const longPressRef = useRef<number>(0);
  const longFiredRef = useRef(false);
  const bestRef = useRef<Best>({});

  const [phase, setPhase] = useState<Phase>('idle');
  const [diff, setDiff] = useState<DiffKey>('easy');
  const [board, setBoard] = useState<Cell[][]>([]);
  const [flagMode, setFlagMode] = useState(false);
  const [minesLeft, setMinesLeft] = useState(DIFFS.easy.mines);
  const [time, setTime] = useState(0);
  const [won, setWon] = useState(false);
  const [best, setBest] = useState<Best>({});
  const [isNewBest, setIsNewBest] = useState(false);
  const [side, setSide] = useState(0);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      let parsed: Best = {};
      try {
        const raw = localStorage.getItem(BEST_KEY);
        if (raw) {
          const obj = JSON.parse(raw) as Record<string, unknown>;
          for (const k of DIFF_ORDER) {
            const v = obj[k];
            if (typeof v === 'number' && Number.isFinite(v)) parsed[k] = v;
          }
        }
      } catch {
        parsed = {};
      }
      bestRef.current = parsed;
      setBest(parsed);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const el = fieldRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      const px = Math.max(120, Math.floor(Math.min(r.width, r.height)));
      setSide((prev) => (Math.abs(prev - px) > 0.5 ? px : prev));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(longPressRef.current);
    };
  }, []);

  const stopTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = 0;
  };

  const startTimer = () => {
    stopTimer();
    timerRef.current = window.setInterval(() => {
      timeRef.current = Math.min(999, timeRef.current + 1);
      setTime(timeRef.current);
    }, 1000);
  };

  const syncMinesLeft = (b: Cell[][], mines: number) => {
    let flags = 0;
    for (const row of b) for (const cell of row) if (cell.flagged) flags++;
    setMinesLeft(mines - flags);
  };

  const reset = (d: DiffKey) => {
    stopTimer();
    clearTimeout(longPressRef.current);
    const cfg = DIFFS[d];
    const b = makeBoard(cfg.rows, cfg.cols);
    boardRef.current = b;
    firstClickRef.current = true;
    revealedRef.current = 0;
    timeRef.current = 0;
    setBoard(cloneBoard(b));
    setMinesLeft(cfg.mines);
    setTime(0);
    setWon(false);
    setIsNewBest(false);
    setFlagMode(false);
  };

  const start = (d: DiffKey) => {
    diffRef.current = d;
    setDiff(d);
    reset(d);
    phaseRef.current = 'playing';
    setPhase('playing');
  };

  const finish = (didWin: boolean, elapsed: number) => {
    stopTimer();
    phaseRef.current = 'over';
    setWon(didWin);
    if (didWin) {
      const d = diffRef.current;
      const prev = bestRef.current[d];
      if (prev === undefined || elapsed < prev) {
        const next: Best = { ...bestRef.current, [d]: elapsed };
        bestRef.current = next;
        setBest(next);
        setIsNewBest(true);
        try {
          localStorage.setItem(BEST_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
      }
    }
    setPhase('over');
  };

  const reveal = (r: number, c: number) => {
    if (phaseRef.current !== 'playing') return;
    const b = boardRef.current;
    if (b[r][c].revealed || b[r][c].flagged) return;
    const cfg = DIFFS[diffRef.current];

    if (firstClickRef.current) {
      placeMines(b, cfg.rows, cfg.cols, cfg.mines, r, c);
      firstClickRef.current = false;
      startTimer();
    }

    if (b[r][c].mine) {
      b[r][c].revealed = true;
      for (const row of b)
        for (const cell of row) if (cell.mine) cell.revealed = true;
      setBoard(cloneBoard(b));
      finish(false, timeRef.current);
      return;
    }

    const stack: [number, number][] = [[r, c]];
    const visited = new Set<string>();
    while (stack.length) {
      const next = stack.pop();
      if (!next) break;
      const [cr, cc] = next;
      if (b[cr][cc].revealed || b[cr][cc].flagged) continue;
      b[cr][cc].revealed = true;
      revealedRef.current++;
      if (b[cr][cc].count === 0)
        for (const [nr, nc] of neighbors(cr, cc, cfg.rows, cfg.cols)) {
          const key = `${nr}-${nc}`;
          if (!visited.has(key)) {
            visited.add(key);
            stack.push([nr, nc]);
          }
        }
    }

    const winNow = revealedRef.current === cfg.rows * cfg.cols - cfg.mines;
    if (winNow)
      for (const row of b)
        for (const cell of row) if (cell.mine) cell.flagged = true;

    setBoard(cloneBoard(b));
    syncMinesLeft(b, cfg.mines);

    if (winNow) finish(true, timeRef.current);
  };

  const toggleFlag = (r: number, c: number) => {
    if (phaseRef.current !== 'playing') return;
    const b = boardRef.current;
    if (b[r][c].revealed) return;
    b[r][c].flagged = !b[r][c].flagged;
    setBoard(cloneBoard(b));
    syncMinesLeft(b, DIFFS[diffRef.current].mines);
  };

  const onCellPointerDown = (r: number, c: number) => {
    longFiredRef.current = false;
    clearTimeout(longPressRef.current);
    longPressRef.current = window.setTimeout(() => {
      longFiredRef.current = true;
      toggleFlag(r, c);
    }, LONG_PRESS_MS);
  };

  const cancelLongPress = () => {
    clearTimeout(longPressRef.current);
  };

  const onCellClick = (r: number, c: number) => {
    clearTimeout(longPressRef.current);
    if (longFiredRef.current) {
      longFiredRef.current = false;
      return;
    }
    if (flagMode) toggleFlag(r, c);
    else reveal(r, c);
  };

  const onCellContext = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    clearTimeout(longPressRef.current);
    longFiredRef.current = true;
    toggleFlag(r, c);
  };

  const cfg = DIFFS[diff];
  const gap = side ? Math.max(1, Math.round(side / cfg.cols / 16)) : 2;
  const fmt = (n: number) =>
    String(Math.max(0, Math.min(999, n))).padStart(3, '0');
  const bestStr = (d: DiffKey) =>
    best[d] !== undefined ? `${best[d]}s` : tx.none;

  return (
    <div className='relative flex min-h-[480px] w-full flex-col touch-none select-none'>
      <div
        className='mx-auto flex h-[52px] w-full shrink-0 items-center justify-between gap-2 px-1 text-white'
        style={{ maxWidth: side || undefined }}
      >
        {phase === 'playing' ? (
          <>
            <span className='ms-chip inline-flex items-center gap-1.5'>
              <span aria-hidden='true' className='text-[15px] leading-none'>
                💣
              </span>
              <span className='text-[18px] font-bold leading-none tabular-nums'>
                {fmt(minesLeft)}
              </span>
            </span>

            <button
              type='button'
              onClick={() => setFlagMode((m) => !m)}
              aria-pressed={flagMode}
              className={`ms-toggle inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                flagMode
                  ? 'bg-white text-[#121212]'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <span aria-hidden='true'>{flagMode ? '🚩' : '⛏️'}</span>
              {flagMode ? tx.flag : tx.dig}
            </button>

            <span className='ms-chip inline-flex items-center gap-1.5'>
              <span
                aria-hidden='true'
                className='text-[13px] leading-none text-white/60'
              >
                ⏱
              </span>
              <span className='text-[18px] font-bold leading-none tabular-nums'>
                {fmt(time)}
              </span>
            </span>
          </>
        ) : null}
      </div>

      <div
        ref={fieldRef}
        className='relative flex min-h-0 flex-1 items-center justify-center overflow-hidden'
      >
        {phase !== 'idle' && board.length > 0 ? (
          <div
            className='ms-grid grid rounded-[14px] bg-white/[0.04] p-[6px] ring-1 ring-white/10'
            style={{
              width: side || '100%',
              height: side || '100%',
              gridTemplateColumns: `repeat(${cfg.cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${cfg.rows}, minmax(0, 1fr))`,
              gap,
            }}
          >
            {board.map((row, r) =>
              row.map((cell, c) => {
                const exploded = cell.revealed && cell.mine && won === false;
                const showNum = cell.revealed && !cell.mine && cell.count > 0;
                return (
                  <button
                    key={`${r}-${c}`}
                    type='button'
                    aria-label='cell'
                    disabled={phase === 'over'}
                    onClick={() => onCellClick(r, c)}
                    onContextMenu={(e) => onCellContext(e, r, c)}
                    onPointerDown={() => onCellPointerDown(r, c)}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    className={`ms-cell flex items-center justify-center font-bold leading-none ${
                      cell.revealed ? 'ms-revealed' : 'ms-hidden'
                    } ${exploded ? 'ms-boom' : ''}`}
                    style={{
                      fontSize: side
                        ? Math.max(9, Math.round((side / cfg.cols) * 0.5))
                        : 12,
                      color: showNum ? NUM_COLOR[cell.count] : undefined,
                    }}
                  >
                    {cell.revealed
                      ? cell.mine
                        ? '💣'
                        : cell.count > 0
                          ? cell.count
                          : ''
                      : cell.flagged
                        ? '🚩'
                        : ''}
                  </button>
                );
              })
            )}
          </div>
        ) : null}

        {phase === 'idle' && (
          <div className='ms-in absolute inset-0 flex flex-col items-center justify-center gap-5 px-6 text-center'>
            <p className='text-[12px] font-bold uppercase tracking-[0.18em] text-white/55'>
              {tx.choose}
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
                  className={`flex flex-col items-center gap-0.5 rounded-[14px] px-5 py-3 text-[14px] font-semibold transition-colors ${
                    diff === d
                      ? 'bg-white text-[#121212]'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  <span>{tx.diffs[d]}</span>
                  <span
                    className={`text-[11px] font-medium ${
                      diff === d ? 'text-[#121212]/60' : 'text-white/45'
                    }`}
                  >
                    {DIFFS[d].rows}×{DIFFS[d].cols} · {DIFFS[d].mines}{' '}
                    <span aria-hidden='true'>💣</span>
                  </span>
                </button>
              ))}
            </div>
            <button
              type='button'
              onClick={() => start(diff)}
              className='ms-cta rounded-full bg-white px-9 py-3 text-[15px] font-bold text-[#121212]'
            >
              {tx.start}
            </button>
            <p className='text-[13px] text-white/55'>
              {tx.best}: {bestStr(diff)}
            </p>
            <p className='text-[12px] text-white/40'>{tx.hint}</p>
          </div>
        )}

        {phase === 'over' && (
          <div className='ms-in absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/55 px-6 text-center'>
            <span className='text-[52px] leading-none' aria-hidden='true'>
              {won ? '🎉' : '💥'}
            </span>
            <span className='text-[24px] font-extrabold leading-none text-white'>
              {won ? tx.win : tx.lose}
            </span>
            <span className='rounded-full bg-white/10 px-4 py-1 text-[13px] font-medium text-white/75'>
              {tx.time} {fmt(time)}
            </span>
            {won && isNewBest ? (
              <span className='text-[13px] font-semibold text-[#5fd38a]'>
                {tx.newBest}
              </span>
            ) : (
              <span className='text-[12px] text-white/45'>
                {tx.best} {tx.diffs[diff]}: {bestStr(diff)}
              </span>
            )}
            <button
              type='button'
              onClick={() => start(diffRef.current)}
              className='ms-cta mt-1 rounded-full bg-white px-9 py-3 text-[15px] font-bold text-[#121212]'
            >
              {tx.again}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .ms-grid { touch-action: manipulation; }
        .ms-cell {
          border-radius: 5px;
          border: none;
          padding: 0;
          cursor: pointer;
          aspect-ratio: 1 / 1;
          -webkit-tap-highlight-color: transparent;
          transition: transform .1s cubic-bezier(0.23,1,0.32,1), background-color .15s ease;
        }
        .ms-hidden {
          background: linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.07));
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -2px 5px rgba(0,0,0,0.28);
        }
        .ms-hidden:hover:not(:disabled) { background: linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.1)); }
        .ms-hidden:active:not(:disabled) { transform: scale(0.93); }
        .ms-revealed {
          background: rgba(0,0,0,0.28);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.05);
          animation: msReveal .18s cubic-bezier(0.23,1,0.32,1);
          cursor: default;
        }
        .ms-boom {
          background: #ff5a5f !important;
          box-shadow: 0 0 14px rgba(255,90,95,0.7);
        }
        @keyframes msReveal { from { transform: scale(0.78); opacity: 0.45; } to { transform: scale(1); opacity: 1; } }
        .ms-chip {
          border-radius: 9999px;
          background: rgba(255,255,255,0.08);
          padding: 5px 12px;
          color: rgba(255,255,255,0.92);
        }
        @keyframes msIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .ms-in { animation: msIn .26s cubic-bezier(0.23,1,0.32,1); }
        .ms-cta { transition: transform .15s cubic-bezier(0.23,1,0.32,1); }
        .ms-cta:hover { transform: translateY(-2px); }
        .ms-cta:active { transform: scale(.97); }
        @media (prefers-reduced-motion: reduce) {
          .ms-cell, .ms-revealed, .ms-in, .ms-cta { animation: none !important; transition: none !important; }
          .ms-hidden:active:not(:disabled), .ms-cta:hover, .ms-cta:active { transform: none; }
        }
      `}</style>
    </div>
  );
}

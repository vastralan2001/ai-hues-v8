'use client';

import { useEffect, useRef, useState } from 'react';

/* Shared Lucky Slots core — one source of truth for the board, the smooth
   scrolling reels and the payline scoring, used by BOTH the full game and the
   home demo so the two are genuinely equivalent (the demo just auto-spins to a
   jackpot). The reels scroll a strip of symbols and decelerate onto the result
   — no flicker. */

export const SYMBOLS = [
  { e: '7️⃣', name: 'Lucky 7', reward: 100 },
  { e: '💎', name: 'Diamond', reward: 50 },
  { e: '🔔', name: 'Bell', reward: 30 },
  { e: '🍋', name: 'Lemon', reward: 15 },
  { e: '🍒', name: 'Cherry', reward: 10 },
  { e: '⭐', name: 'Star', reward: 5 },
];

// each line: three [col, row] cells — rows, cols, diagonals
export const PAYLINES: [number, number][][] = [
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

const REEL_DUR = 1150; // ms per reel scroll
const REEL_STAGGER = 300; // ms between reels braking
const BUFFER = 12; // off-screen symbols scrolled before the result
export const SPIN_TOTAL = REEL_DUR + 2 * REEL_STAGGER + 60;

export type Grid = number[][];
export interface SpinResult {
  reward: number;
  jackpot: boolean;
  cells: Set<string>;
}

export function randGrid(): Grid {
  return [0, 1, 2].map(() =>
    [0, 1, 2].map(() => Math.floor(Math.random() * SYMBOLS.length))
  );
}

export function evaluateGrid(final: Grid): SpinResult {
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
  return { reward, jackpot, cells };
}

function prefersReduced() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/* Reel engine. `grid` is the resting result; `spinKey` bumps to (re)play the
   scroll animation. The hook reports the evaluated result once the reels land. */
export function useSlotReels(initial: Grid) {
  const [grid, setGrid] = useState<Grid>(initial);
  const [spinKey, setSpinKey] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winCells, setWinCells] = useState<Set<string>>(new Set());
  const timeouts = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const clear = () => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  };
  useEffect(() => clear, []);

  function spin(final: Grid, onDone?: (res: SpinResult) => void) {
    clear();
    setGrid(final);
    if (prefersReduced()) {
      const res = evaluateGrid(final);
      setWinCells(res.cells);
      onDone?.(res);
      return;
    }
    setWinCells(new Set());
    setSpinning(true);
    setSpinKey((k) => k + 1);
    timeouts.current.push(
      setTimeout(() => {
        setSpinning(false);
        const res = evaluateGrid(final);
        setWinCells(res.cells);
        onDone?.(res);
      }, SPIN_TOTAL)
    );
  }

  return { grid, setGrid, spinKey, spinning, winCells, spin, clear };
}

function Cell({
  sym,
  cellH,
  fontSize,
  isWin,
}: {
  sym: number;
  cellH: string;
  fontSize: string;
  isWin: boolean;
}) {
  // symbols sit straight on the dark reel (no white tile); a winner gets a soft
  // gold wash + glow + pop.
  return (
    <div
      className={`flex shrink-0 items-center justify-center transition-colors ${
        isWin
          ? 'rounded-[6px] bg-[#e0b34a]/18 [animation:cellPop_0.4s_ease]'
          : ''
      }`}
      style={{ height: cellH, fontSize }}
    >
      <span
        style={
          isWin
            ? { filter: 'drop-shadow(0 0 7px rgba(231,200,115,0.85))' }
            : undefined
        }
      >
        {SYMBOLS[sym].e}
      </span>
    </div>
  );
}

/* A single column reel — a strip of `BUFFER` random symbols above the 3 result
   symbols, scrolled (and decelerated) into view by the reel-spin keyframe. */
function Reel({
  col,
  win,
  spinKey,
  delay,
  cell,
  gap,
  radius,
  fill,
}: {
  col: number[];
  win: boolean[];
  spinKey: number;
  delay: number;
  cell: number;
  gap: number;
  radius: number;
  fill: boolean;
}) {
  // deterministic scroll buffer (varied per reel via its own result) — the
  // symbols that whir past before the result lands; pure, so render stays clean
  const buffer = Array.from(
    { length: BUFFER },
    (_, i) => (i * 7 + col[0] * 3 + col[2] + 1) % SYMBOLS.length
  );
  const strip = [...buffer, col[0], col[1], col[2]];
  const animate = spinKey > 0;

  // fill mode sizes everything off the reel's own height (container queries) so
  // the board stretches to fill a 16:9 frame; otherwise it's fixed px cells.
  const third = (100 / 3).toFixed(4);
  const cellH = fill ? `${third}cqh` : `${cell}px`;
  const fontSize = fill ? '19cqh' : `${Math.round(cell * 0.6)}px`;
  const innerGap = fill ? 0 : gap;
  const end = fill
    ? `${(BUFFER * (100 / 3)).toFixed(4)}cqh`
    : `${BUFFER * (cell + gap)}px`;

  return (
    <div
      className={`overflow-hidden border border-[#e0b34a]/30 ${fill ? 'h-full flex-1' : ''}`}
      style={{
        height: fill ? undefined : cell * 3 + gap * 2,
        borderRadius: radius,
        background: 'rgba(20,10,12,0.55)',
        containerType: fill ? 'size' : undefined,
      }}
    >
      <div
        key={spinKey}
        className='flex flex-col'
        style={{
          gap: innerGap,
          ['--reel-end' as string]: end,
          transform: animate
            ? undefined
            : 'translateY(calc(-1 * var(--reel-end)))',
          animation: animate
            ? `reel-spin ${REEL_DUR}ms cubic-bezier(0.1,0.72,0.2,1) ${delay}ms both`
            : undefined,
        }}
      >
        {strip.map((s, i) => {
          const finalRow = i - BUFFER;
          return (
            <Cell
              key={i}
              sym={s}
              cellH={cellH}
              fontSize={fontSize}
              isWin={finalRow >= 0 && win[finalRow]}
            />
          );
        })}
      </div>
    </div>
  );
}

/* The reel board — the 3×3 cabinet face. `fill` stretches it to its container
   (16:9 demo); otherwise `cell` sizes fixed px reels (the full game). */
export function SlotBoard({
  grid,
  winCells,
  spinKey = 0,
  cell = 84,
  gap = 8,
  radius = 12,
  fill = false,
}: {
  grid: Grid;
  winCells: Set<string>;
  spinKey?: number;
  cell?: number;
  gap?: number;
  radius?: number;
  fill?: boolean;
}) {
  const reels = [0, 1, 2].map((c) => (
    <Reel
      key={c}
      col={[grid[0][c], grid[1][c], grid[2][c]]}
      win={[
        winCells.has(`0,${c}`),
        winCells.has(`1,${c}`),
        winCells.has(`2,${c}`),
      ]}
      spinKey={spinKey}
      delay={c * REEL_STAGGER}
      cell={cell}
      gap={gap}
      radius={radius}
      fill={fill}
    />
  ));
  return fill ? (
    <div className='flex h-full w-full' style={{ gap }}>
      {reels}
    </div>
  ) : (
    <div className='grid grid-cols-3' style={{ gap }}>
      {reels}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';

import { GameStage } from '@/components/demos/DemoKit';

/* Minesweeper — a self-solving demo. Real flood-reveal + flag deduction AI on a
   freshly generated board; cell look, number colours and 💣/🚩 mirror the real
   MinesweeperGame. */
const MS_NUM_COLOR: Record<number, string> = {
  1: '#7db4ff',
  2: '#5fd38a',
  3: '#ff7a85',
  4: '#c39bff',
  5: '#ffb15c',
  6: '#5cd6d6',
  7: '#d6dae3',
  8: '#9aa3b2',
};
type MsCell = { mine: boolean; revealed: boolean; flagged: boolean; n: number };

export function MinesweeperDemo({ active }: { active: boolean }) {
  const ROWS = 8;
  const COLS = 8;
  const MINES = 10;
  const [board, setBoard] = useState<MsCell[][]>([]);

  useEffect(() => {
    if (!active) return;
    const nbrs = (r: number, c: number) => {
      const out: [number, number][] = [];
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          if (!dr && !dc) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) out.push([nr, nc]);
        }
      return out;
    };
    const build = (): MsCell[][] => {
      const b: MsCell[][] = Array.from({ length: ROWS }, () =>
        Array.from({ length: COLS }, () => ({
          mine: false,
          revealed: false,
          flagged: false,
          n: 0,
        }))
      );
      let placed = 0;
      while (placed < MINES) {
        const r = Math.floor(Math.random() * ROWS);
        const c = Math.floor(Math.random() * COLS);
        if (!b[r][c].mine) {
          b[r][c].mine = true;
          placed++;
        }
      }
      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++)
          if (!b[r][c].mine)
            b[r][c].n = nbrs(r, c).filter(([nr, nc]) => b[nr][nc].mine).length;
      return b;
    };

    let b = build();
    const flood = (r: number, c: number) => {
      const stack: [number, number][] = [[r, c]];
      while (stack.length) {
        const [cr, cc] = stack.pop()!;
        const cell = b[cr][cc];
        if (cell.revealed || cell.flagged || cell.mine) continue;
        cell.revealed = true;
        if (cell.n === 0) for (const nb of nbrs(cr, cc)) stack.push(nb);
      }
    };
    // open a guaranteed-empty starting cell
    const zeros: [number, number][] = [];
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        if (!b[r][c].mine && b[r][c].n === 0) zeros.push([r, c]);
    if (zeros.length) flood(...zeros[Math.floor(Math.random() * zeros.length)]);

    const raf = requestAnimationFrame(() =>
      setBoard(b.map((row) => row.map((x) => ({ ...x }))))
    );

    let resetting = false;
    const solveStep = () => {
      let progressed = false;
      // flag certain mines + reveal certain safes around satisfied numbers
      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++) {
          const cell = b[r][c];
          if (!cell.revealed || cell.n === 0) continue;
          const nb = nbrs(r, c);
          const hidden = nb.filter(
            ([nr, nc]) => !b[nr][nc].revealed && !b[nr][nc].flagged
          );
          const flagged = nb.filter(([nr, nc]) => b[nr][nc].flagged).length;
          if (hidden.length && hidden.length === cell.n - flagged) {
            for (const [nr, nc] of hidden) {
              if (!b[nr][nc].flagged) {
                b[nr][nc].flagged = true;
                progressed = true;
              }
            }
          } else if (flagged === cell.n) {
            for (const [nr, nc] of hidden) {
              flood(nr, nc);
              progressed = true;
            }
          }
        }
      if (!progressed) {
        // guess a safe hidden cell (demo never loses)
        const safe: [number, number][] = [];
        for (let r = 0; r < ROWS; r++)
          for (let c = 0; c < COLS; c++)
            if (!b[r][c].revealed && !b[r][c].flagged && !b[r][c].mine)
              safe.push([r, c]);
        if (safe.length) {
          flood(...safe[Math.floor(Math.random() * safe.length)]);
          progressed = true;
        }
      }
      // win check
      let hiddenSafe = 0;
      for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++)
          if (!b[r][c].mine && !b[r][c].revealed) hiddenSafe++;
      setBoard(b.map((row) => row.map((x) => ({ ...x }))));
      if (hiddenSafe === 0 || !progressed) {
        for (let r = 0; r < ROWS; r++)
          for (let c = 0; c < COLS; c++)
            if (b[r][c].mine) b[r][c].flagged = true;
        setBoard(b.map((row) => row.map((x) => ({ ...x }))));
        if (!resetting) {
          resetting = true;
          window.setTimeout(() => {
            b = build();
            const z: [number, number][] = [];
            for (let r = 0; r < ROWS; r++)
              for (let c = 0; c < COLS; c++)
                if (!b[r][c].mine && b[r][c].n === 0) z.push([r, c]);
            if (z.length) flood(...z[Math.floor(Math.random() * z.length)]);
            setBoard(b.map((row) => row.map((x) => ({ ...x }))));
            resetting = false;
          }, 1400);
        }
      }
    };

    const iv = window.setInterval(solveStep, 750);
    return () => {
      clearInterval(iv);
      cancelAnimationFrame(raf);
    };
  }, [active]);

  return (
    <GameStage bg='radial-gradient(125% 95% at 50% 42%, #18211c 0%, #121815 46%, #0a0e0c 100%)'>
      <div className='flex h-full w-full items-center justify-center p-3'>
        <div
          className='grid aspect-square h-full max-h-full gap-[3px] rounded-[12px] bg-white/[0.04] p-[6px] ring-1 ring-white/10'
          style={{
            gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
          }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => {
              const showNum = cell.revealed && !cell.mine && cell.n > 0;
              return (
                <div
                  key={`${r}-${c}`}
                  className='flex items-center justify-center rounded-[5px] text-[14px] font-bold leading-none'
                  style={{
                    background: cell.revealed
                      ? cell.mine
                        ? '#ff5a5f'
                        : 'rgba(0,0,0,0.28)'
                      : 'linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.07))',
                    boxShadow: cell.revealed
                      ? 'inset 0 0 0 1px rgba(255,255,255,0.05)'
                      : 'inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -2px 5px rgba(0,0,0,0.28)',
                    color: showNum ? MS_NUM_COLOR[cell.n] : undefined,
                  }}
                >
                  {cell.revealed
                    ? cell.mine
                      ? '💣'
                      : cell.n > 0
                        ? cell.n
                        : ''
                    : cell.flagged
                      ? '🚩'
                      : ''}
                </div>
              );
            })
          )}
        </div>
      </div>
    </GameStage>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';

import { GameStage } from '@/components/demos/DemoKit';
import { SlotBoard, useSlotReels, type Grid } from './slot-machine-core';

/* Slot Machine demo — the SAME reel engine + board as the real game
   (slot-machine-core), just auto-spun to a top-row jackpot on a loop. */

// top row all 7️⃣ (index 0) → the top payline jackpots when the reels land.
const JACKPOT: Grid = [
  [0, 0, 0],
  [3, 1, 4],
  [2, 5, 1],
];

export function SlotDemo({ active = true }: { active?: boolean }) {
  const reels = useSlotReels([
    [1, 2, 3],
    [4, 5, 0],
    [2, 3, 1],
  ]);
  const spin = reels.spin;
  const [won, setWon] = useState(false);
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const loop = () => {
      if (!aliveRef.current) return;
      setWon(false);
      spin(JACKPOT, () => {
        if (!aliveRef.current) return;
        setWon(true);
        window.setTimeout(loop, 2200);
      });
    };
    // defer the first state change out of the effect body
    const start = window.setTimeout(
      () => {
        if (!aliveRef.current) return;
        if (!active || reduce) {
          reels.setGrid(JACKPOT);
          setWon(true);
        } else {
          loop();
        }
      },
      active && !reduce ? 400 : 0
    );
    return () => {
      aliveRef.current = false;
      window.clearTimeout(start);
      reels.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <GameStage bg='radial-gradient(125% 80% at 50% -10%, #3a1218 0%, #1c0a0e 48%, #0d0507 100%)'>
      <div className='flex h-full w-full flex-col gap-1.5 p-3'>
        <div className='text-center text-[11px] font-bold uppercase tracking-[0.16em] text-[#e7c873]'>
          Match three to win
        </div>
        {/* fills the remaining 16:9 height — the reels stretch widescreen */}
        <div className='min-h-0 flex-1'>
          <SlotBoard
            grid={reels.grid}
            winCells={reels.winCells}
            spinKey={reels.spinKey}
            gap={6}
            radius={8}
            fill
          />
        </div>
        <div
          className='h-[15px] text-center text-[12px] font-extrabold text-[#e7c873]'
          style={{ opacity: won ? 1 : 0, transition: 'opacity 300ms ease' }}
        >
          🎉 JACKPOT +300
        </div>
      </div>
    </GameStage>
  );
}

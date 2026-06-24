'use client';

import { Frames, GameStage } from '@/components/demos/DemoKit';

/* Slot Machine — spins, then stops and shows a winning result. */
export function SlotDemo() {
  const SYMS = ['7️⃣', '💎', '🔔', '🍋', '🍒', '⭐'];
  const RESULT = ['7️⃣', '7️⃣', '7️⃣'];
  return (
    <GameStage bg='radial-gradient(125% 80% at 50% -10%, #3a1218 0%, #1c0a0e 48%, #0d0507 100%)'>
      <div className='flex h-full flex-col p-3'>
        <div className='mb-2 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-[#e7c873]'>
          Match three to win
        </div>
        <Frames
          interval={2800}
          frames={[
            <div key='spin' className='relative flex flex-1 gap-2'>
              {[1.0, 1.3, 1.6].map((dur, i) => (
                <div
                  key={i}
                  className='relative flex-1 overflow-hidden rounded-[8px] border border-[#e0b34a]/30'
                  style={{ background: 'rgba(20,10,12,0.6)' }}
                >
                  <div
                    className='demo-reel flex flex-col items-center'
                    style={{ animationDuration: `${dur}s` }}
                  >
                    {[...SYMS, ...SYMS].map((s, j) => (
                      <div
                        key={j}
                        className='flex h-[46px] shrink-0 items-center justify-center text-[26px]'
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className='pointer-events-none absolute inset-x-0 top-1/2 h-[46px] -translate-y-1/2 rounded-[6px] border-2 border-[#e0b34a]/70' />
            </div>,
            <div
              key='win'
              className='flex flex-1 flex-col items-center justify-center gap-2'
            >
              <div className='flex gap-3'>
                {RESULT.map((s, i) => (
                  <div
                    key={i}
                    className='flex h-14 w-14 items-center justify-center rounded-[10px] border-2 border-[#e0b34a] text-[32px]'
                    style={{ background: 'rgba(20,10,12,0.8)' }}
                  >
                    {s}
                  </div>
                ))}
              </div>
              <div className='mt-1 text-[13px] font-extrabold text-[#e7c873]'>
                🎉 JACKPOT +300
              </div>
            </div>,
          ]}
        />
      </div>
    </GameStage>
  );
}

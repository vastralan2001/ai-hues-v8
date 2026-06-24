'use client';

import { Frames, GameStage } from '@/components/demos/DemoKit';

/* Daily Fortune — dark/gold draw → fortune-card reveal. */
export function DailyLuckDemo() {
  return (
    <GameStage bg='radial-gradient(125% 80% at 50% -10%, #2c1c30 0%, #1a1018 48%, #0e0a0d 100%)'>
      <div className='h-full p-3'>
        <Frames
          interval={2400}
          frames={[
            <div
              key='draw'
              className='flex h-full flex-col items-center justify-center gap-3'
            >
              <span className='text-[26px]'>🔮</span>
              <span className='rounded-full bg-gradient-to-b from-[#f0c45a] to-[#d9982e] px-6 py-2 text-[13px] font-extrabold text-[#2a1d05]'>
                Draw fortune
              </span>
            </div>,
            <div
              key='result'
              className='flex h-full items-center justify-center'
            >
              <div
                className='w-full rounded-[14px] border border-[#e0b34a]/30 p-3 text-center'
                style={{ background: 'rgba(18,14,26,0.6)' }}
              >
                <div className='text-[10px] font-bold uppercase tracking-[0.16em] text-[#e7c873]'>
                  ✦ Today&apos;s fortune
                </div>
                <div className='mt-0.5 text-[20px] font-black text-[#e7c873]'>
                  Great Fortune
                </div>
                <div className='mt-2 grid grid-cols-2 gap-2'>
                  <div className='rounded-[10px] bg-white/5 px-2 py-1.5'>
                    <div className='text-[9px] font-bold uppercase tracking-wide text-[#34d399]'>
                      Lucky color
                    </div>
                    <div className='mt-0.5 flex items-center justify-center gap-1 text-[11px] text-white/80'>
                      <span
                        className='h-2.5 w-2.5 rounded-full'
                        style={{ background: '#50C878' }}
                      />
                      Emerald
                    </div>
                  </div>
                  <div className='rounded-[10px] bg-white/5 px-2 py-1.5'>
                    <div className='text-[9px] font-bold uppercase tracking-wide text-[#f87171]'>
                      Lucky number
                    </div>
                    <div className='mt-0.5 text-[13px] font-bold text-white/85'>
                      7
                    </div>
                  </div>
                </div>
              </div>
            </div>,
          ]}
        />
      </div>
    </GameStage>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';

import { t, type Locale } from '@/lib/dict';

interface PomodoroToolProps {
  locale: Locale;
}

const DURATION_OPTIONS = [15, 25, 45, 60];

export default function PomodoroTool({ locale }: PomodoroToolProps) {
  const [duration, setDuration] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsDone(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, secondsLeft]);

  const handleStart = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(duration * 60);
      setIsDone(false);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsDone(false);
    setSecondsLeft(duration * 60);
  };

  const handleDurationChange = (min: number) => {
    setDuration(min);
    setSecondsLeft(min * 60);
    setIsRunning(false);
    setIsDone(false);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progress = 1 - secondsLeft / (duration * 60);
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * progress;

  return (
    <div className='mx-auto max-w-[600px] px-6 py-12 text-center'>
      <h1 className='mb-2 text-[32px] font-extrabold tracking-tight text-foreground'>
        {t(locale, 'tool.pomodoro.title')}
      </h1>
      <p className='mb-8 text-[15px] text-secondary'>
        {t(locale, 'tool.pomodoro.desc')}
      </p>

      {/* Duration selector */}
      <div className='mb-8 flex justify-center gap-2'>
        {DURATION_OPTIONS.map((min) => (
          <button
            className={`rounded-[10px] px-4 py-2 text-sm font-semibold transition-colors ${
              duration === min
                ? 'bg-accent text-white'
                : 'border border-border bg-surface text-foreground hover:border-accent'
            }`}
            key={min}
            onClick={() => handleDurationChange(min)}
            type='button'
          >
            {min} {t(locale, 'tool.pomodoro.minutes')}
          </button>
        ))}
      </div>

      {/* Timer circle */}
      <div className='relative mx-auto mb-8 h-[280px] w-[280px]'>
        <svg className='h-full w-full -rotate-90' viewBox='0 0 260 260'>
          <circle
            cx='130'
            cy='130'
            fill='none'
            r='120'
            stroke='var(--color-border)'
            strokeWidth='8'
          />
          <circle
            cx='130'
            cy='130'
            fill='none'
            r='120'
            stroke='var(--color-accent)'
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap='round'
            strokeWidth='8'
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className='absolute inset-0 flex flex-col items-center justify-center'>
          <span className='text-[56px] font-extrabold tabular-nums text-foreground'>
            {String(minutes).padStart(2, '0')}:
            {String(seconds).padStart(2, '0')}
          </span>
          {isDone && (
            <span className='mt-2 text-lg font-semibold text-accent'>
              {t(locale, 'tool.pomodoro.done')}
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className='flex justify-center gap-3'>
        {!isRunning ? (
          <button
            className='rounded-[10px] bg-accent px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-accent-light'
            onClick={handleStart}
            type='button'
          >
            {t(locale, 'tool.pomodoro.start')}
          </button>
        ) : (
          <button
            className='rounded-[10px] border border-border bg-surface px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
            onClick={handlePause}
            type='button'
          >
            {t(locale, 'tool.pomodoro.pause')}
          </button>
        )}
        <button
          className='rounded-[10px] border border-border bg-surface px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent'
          onClick={handleReset}
          type='button'
        >
          {t(locale, 'tool.pomodoro.reset')}
        </button>
      </div>
    </div>
  );
}

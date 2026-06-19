'use client';

import { useEffect, useRef, useState } from 'react';

export default function Typewriter({
  phrases,
  className = '',
  typeMs = 75,
  deleteMs = 38,
  holdMs = 1600,
}: {
  phrases: string[];
  className?: string;
  typeMs?: number;
  deleteMs?: number;
  holdMs?: number;
}) {
  const [text, setText] = useState(phrases[0] ?? '');
  const [reduced, setReduced] = useState(false);
  const idx = useRef(0);
  const phase = useRef<'typing' | 'holding' | 'deleting'>('holding');

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      const raf = requestAnimationFrame(() => setReduced(true));
      return () => cancelAnimationFrame(raf);
    }
    if (phrases.length <= 1) return;

    let timer: ReturnType<typeof setTimeout>;
    let cur = phrases[0] ?? '';
    phase.current = 'holding';

    const step = () => {
      if (phase.current === 'holding') {
        phase.current = 'deleting';
        timer = setTimeout(step, holdMs);
        return;
      }
      if (phase.current === 'deleting') {
        cur = cur.slice(0, -1);
        setText(cur);
        if (cur.length === 0) {
          idx.current = (idx.current + 1) % phrases.length;
          phase.current = 'typing';
        }
        timer = setTimeout(step, deleteMs);
        return;
      }
      // typing
      const next = phrases[idx.current];
      cur = next.slice(0, cur.length + 1);
      setText(cur);
      if (cur === next) {
        phase.current = 'holding';
        timer = setTimeout(step, 0);
        return;
      }
      timer = setTimeout(step, typeMs);
    };

    timer = setTimeout(step, holdMs);
    return () => clearTimeout(timer);
  }, [phrases, typeMs, deleteMs, holdMs]);

  return (
    <span className={className}>
      {text}
      {!reduced && (
        <span
          aria-hidden='true'
          className='typewriter-caret'
          style={{
            display: 'inline-block',
            width: '0.06em',
            marginLeft: '0.04em',
            alignSelf: 'stretch',
            background: 'currentColor',
            transform: 'translateY(0.08em)',
          }}
        >
          &nbsp;
        </span>
      )}
    </span>
  );
}

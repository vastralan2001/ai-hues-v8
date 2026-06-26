'use client';

import { useEffect, useRef, useState } from 'react';

/* A controlled typewriter: types out `word`, and when `word` changes it erases
   the mismatched tail then types the new word. `onCleared` fires at the instant
   the old word is fully deleted (just before the new word types) — the hero
   uses it to commit ALL synced changes (slogan, background hue, colour) exactly
   then, so nothing flips mid-deletion. */
export default function SyncedTypewriter({
  word,
  color,
  className = '',
  onCleared,
}: {
  word: string;
  color?: string;
  className?: string;
  onCleared?: () => void;
}) {
  const [text, setText] = useState(word);
  const [shownColor, setShownColor] = useState(color);
  const [reduced, setReduced] = useState(false);
  const cur = useRef(word);
  const onClearedRef = useRef(onCleared);
  useEffect(() => {
    onClearedRef.current = onCleared;
  });

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      const raf = requestAnimationFrame(() => setReduced(true));
      return () => cancelAnimationFrame(raf);
    }
  }, []);

  useEffect(() => {
    if (reduced) {
      cur.current = word;
      const raf = requestAnimationFrame(() => {
        setText(word);
        setShownColor(color);
        onClearedRef.current?.();
      });
      return () => cancelAnimationFrame(raf);
    }
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const c = cur.current;
      if (!word.startsWith(c)) {
        // erase the mismatched tail of the previous word (keep its colour)
        cur.current = c.slice(0, -1);
        setText(cur.current);
        timer = setTimeout(tick, 34);
      } else {
        if (c.length === 0) {
          // fully erased → commit the new colour + notify the hero, then type
          setShownColor(color);
          onClearedRef.current?.();
        }
        if (c.length < word.length) {
          cur.current = word.slice(0, c.length + 1);
          setText(cur.current);
          timer = setTimeout(tick, 72);
        }
      }
    };
    timer = setTimeout(tick, 0);
    return () => clearTimeout(timer);
  }, [word, color, reduced]);

  return (
    <span className={className} style={{ color: shownColor }}>
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

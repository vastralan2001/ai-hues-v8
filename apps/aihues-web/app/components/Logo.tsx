/* AIHues logotype — the wordmark IS the mark. "AI" stays solid; each letter
   of "Hues" is dyed a distinct vivid hue, so the name itself shows its hues.
   Sizing/weight come from the parent link. */
// Colors come straight from the design tokens (warm → cool), not hand-picked.
const HUES: { ch: string; color: string }[] = [
  { ch: 'H', color: 'var(--color-accent)' },
  { ch: 'U', color: 'var(--color-accent-light)' },
  { ch: 'E', color: 'var(--color-green)' },
  { ch: 'S', color: 'var(--color-blue)' },
];

export function Wordmark() {
  return (
    <span className='uppercase tracking-[0.12em]'>
      <span className='text-foreground'>AI</span>
      {HUES.map((h) => (
        <span key={h.ch} style={{ color: h.color }}>
          {h.ch}
        </span>
      ))}
    </span>
  );
}

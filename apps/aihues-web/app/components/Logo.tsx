/* AIHues logotype — the wordmark IS the mark. "AI" stays solid; each letter
   of "Hues" is dyed a distinct design-token hue. Those same four hues tag the
   four content families: Helpers, Unwinds, Evaluations, Stories. */

// Colors come straight from the design tokens (warm → cool), not hand-picked.
export const HUE_COLOR: Record<string, string> = {
  H: 'var(--color-accent)',
  U: 'var(--color-violet)',
  E: 'var(--color-green)',
  S: 'var(--color-blue)',
};

export function Wordmark() {
  return (
    <span className='logo-mark font-display uppercase tracking-[0.12em]'>
      <span className='logo-letter text-foreground'>AI</span>
      {['H', 'U', 'E', 'S'].map((ch, i) => (
        <span
          key={ch}
          className='logo-letter logo-hue'
          style={{ color: HUE_COLOR[ch], transitionDelay: `${i * 55}ms` }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

/* Render a word whose leading H/U/E/S is emphasised in that letter's hue. */
export function BrandWord({ children }: { children: string }) {
  const first = children.charAt(0);
  const color = HUE_COLOR[first.toUpperCase()];
  return (
    <>
      <span style={color ? { color } : undefined}>{first}</span>
      {children.slice(1)}
    </>
  );
}

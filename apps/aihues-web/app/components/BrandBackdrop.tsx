/* The category-brand gradient wash used at the top of every themed surface
   (listing mastheads + Tools/Tests/Stories detail pages). Reads --color-accent
   from the nearest themed ancestor (PageShell variant / categoryThemeStyle), so
   it picks up the current family hue. Place it as the first child of a
   `relative isolate` full-width wrapper. */
export default function BrandBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden='true'
      className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-[300px] ${className ?? ''}`}
      style={{
        background:
          'radial-gradient(58% 100% at 50% 0%, color-mix(in srgb, var(--color-accent) 11%, transparent), transparent 72%)',
      }}
    />
  );
}

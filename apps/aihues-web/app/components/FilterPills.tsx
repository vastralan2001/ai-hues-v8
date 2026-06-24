import Link from 'next/link';

/* Shared filter pill bar for the listing pages (Tools categories, Games genres,
   Stories tags). One look everywhere; the active pill picks up the page's
   category hue via --color-accent. Items can navigate (href) or toggle state
   (onSelect). */

export type FilterItem = {
  key: string;
  label: string;
  count?: number;
  href?: string;
};

export function FilterPills({
  items,
  activeKey,
  onSelect,
  ariaLabel,
  className = '',
}: {
  items: FilterItem[];
  activeKey: string;
  onSelect?: (key: string) => void;
  ariaLabel?: string;
  className?: string;
}) {
  const cls = (active: boolean) =>
    `inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-[13px] font-semibold no-underline transition-colors ${
      active
        ? 'border-accent bg-accent text-white'
        : 'border-border bg-white/70 text-secondary backdrop-blur-sm hover:border-accent hover:text-accent'
    }`;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`} aria-label={ariaLabel}>
      {items.map((it) => {
        const active = it.key === activeKey;
        const inner = (
          <>
            {it.label}
            {it.count != null ? (
              <span className={active ? 'text-white/70' : 'text-muted'}>
                {it.count}
              </span>
            ) : null}
          </>
        );
        return it.href ? (
          <Link
            key={it.key}
            href={it.href}
            aria-current={active ? 'page' : undefined}
            className={cls(active)}
          >
            {inner}
          </Link>
        ) : (
          <button
            key={it.key}
            type='button'
            aria-pressed={active}
            onClick={() => onSelect?.(it.key)}
            className={cls(active)}
          >
            {inner}
          </button>
        );
      })}
    </div>
  );
}

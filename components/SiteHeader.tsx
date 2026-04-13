import Link from 'next/link';

const navItems = [
  { href: '/', label: '首页' },
  { href: '/about', label: '方案' },
];

const shellClass = 'mx-auto w-[min(1120px,calc(100vw-32px))]';

export function SiteHeader() {
  return (
    <header
      className={`${shellClass} relative z-10 flex flex-col items-start gap-5 py-6 md:flex-row md:items-center md:justify-between md:gap-6 md:pb-4`}
    >
      <Link
        className="inline-flex items-center gap-3 text-sm font-bold tracking-[0.08em] text-ink"
        href="/"
      >
        <span className="grid size-[38px] place-items-center rounded-[2px] border border-line bg-accent text-[15px] font-bold text-white shadow-[0_10px_24px_rgba(255,96,70,0.25)]">
          A
        </span>
        <span className="font-serif text-[1.02rem] font-semibold uppercase tracking-[3px]">
          Aiushtha
        </span>
      </Link>

      <nav
        className="inline-flex flex-wrap gap-[18px] text-sm text-muted"
        aria-label="主导航"
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            className="transition-colors hover:text-ink-warm focus-visible:text-ink-warm"
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

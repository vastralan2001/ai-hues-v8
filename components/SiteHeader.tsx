import Link from 'next/link';

const navItems = [
  { href: '/', label: '首页' },
  { href: '/about', label: '方案' },
];

const shellClass = 'mx-auto w-[min(1120px,calc(100vw-32px))]';

export function SiteHeader() {
  return (
    <header
      className={`${shellClass} flex flex-col items-start gap-5 py-6 md:flex-row md:items-center md:justify-between md:gap-6 md:pb-3`}
    >
      <Link
        className="inline-flex items-center gap-3 text-sm font-bold tracking-[0.03em]"
        href="/"
      >
        <span className="grid size-[38px] place-items-center rounded-[14px] bg-[linear-gradient(135deg,var(--color-ink),var(--color-accent))] text-[15px] text-[#f8f1e8]">
          A
        </span>
        <span>Aiushtha</span>
      </Link>

      <nav
        className="inline-flex flex-wrap gap-[18px] text-sm text-muted"
        aria-label="主导航"
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            className="transition-colors hover:text-ink focus-visible:text-ink"
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

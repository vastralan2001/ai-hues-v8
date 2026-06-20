import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowUpRight, Mail, Rss } from 'lucide-react';

import HeaderBar from '@/components/HeaderBar';
import { t, type Locale } from '@/lib/dict';
import {
  blogHref,
  discoverHref,
  gameDetailHref,
  gamesHref,
  homeHref,
  pricingHref,
  showcaseHref,
  testsHref,
  toolDetailHref,
  toolsHref,
  wishlistHref,
} from '@/lib/routes';
import { Logo } from './Logo';
import { BookmarkButton } from './BookmarkButton';

type ChromeVariant =
  | 'home'
  | 'tools'
  | 'games'
  | 'tests'
  | 'wishlist'
  | 'ranking'
  | 'default';

const mainLinks: Array<{ href: string; labelKey: string }> = [
  { href: homeHref, labelKey: 'nav.home' },
  { href: toolsHref, labelKey: 'nav.tools' },
  { href: gamesHref, labelKey: 'nav.games' },
  { href: testsHref, labelKey: 'nav.tests' },
  { href: blogHref, labelKey: 'nav.blog' },
  { href: wishlistHref, labelKey: 'nav.wishlist' },
];

const headerLinks: Record<
  ChromeVariant,
  Array<{ href: string; labelKey: string }>
> = {
  home: mainLinks,
  tools: mainLinks,
  games: mainLinks,
  tests: mainLinks,
  wishlist: mainLinks,
  ranking: mainLinks,
  default: mainLinks,
};

export function SiteHeader({
  variant = 'default',
  locale = 'en',
}: {
  variant?: ChromeVariant;
  locale?: Locale;
}) {
  const links = headerLinks[variant];

  return (
    <HeaderBar>
      <div className='mx-auto flex h-[76px] max-w-[1300px] items-center justify-between px-4 md:px-8'>
        {/* Logo */}
        <Link
          aria-label='AIHues home'
          className='flex shrink-0 items-center gap-2 text-lg font-extrabold text-foreground md:gap-2.5 md:text-xl'
          href={homeHref}
        >
          <Logo size={28} />
          <span className='hidden uppercase tracking-[0.12em] md:inline'>
            AIHues
          </span>
        </Link>

        {/* Nav links — scrollable on mobile */}
        <nav
          aria-label='Primary navigation'
          className='mx-3 flex flex-1 items-center justify-start gap-5 overflow-x-auto whitespace-nowrap py-2 md:mx-6 md:justify-center md:gap-9'
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {links.map(({ href, labelKey }) => (
            <Link
              key={labelKey}
              className='text-[13px] font-bold uppercase tracking-[0.14em] text-secondary transition-colors duration-150 hover:text-accent md:text-[15px]'
              href={href}
            >
              {t(locale, labelKey)}
            </Link>
          ))}
        </nav>

        {/* Right side: bookmark button */}
        <div className='shrink-0'>
          <BookmarkButton />
        </div>
      </div>
    </HeaderBar>
  );
}

export function SiteFooter({
  locale = 'en',
}: {
  variant?: ChromeVariant;
  locale?: Locale;
}) {
  const product: Array<[string, string]> = [
    [t(locale, 'nav.tools'), toolsHref],
    [t(locale, 'categories.title'), toolsHref],
    [t(locale, 'nav.tests'), testsHref],
    [t(locale, 'nav.wishlist'), wishlistHref],
    [t(locale, 'nav.discover'), discoverHref],
  ];
  const games: Array<[string, string]> = [
    [t(locale, 'footer.chess'), gameDetailHref('chess')],
    [t(locale, 'footer.snake'), gameDetailHref('snake')],
    [t(locale, 'footer.colorHunt'), gameDetailHref('color-hunt')],
    [t(locale, 'footer.luckySlots'), gameDetailHref('slot-machine')],
    [t(locale, 'footer.allGames'), gamesHref],
  ];
  const resources: Array<[string, string]> = [
    [t(locale, 'footer.cheatSheet'), toolDetailHref('kimi-code')],
    [t(locale, 'nav.blog'), blogHref],
    [t(locale, 'footer.comparisons'), '/comparisons'],
    [t(locale, 'nav.showcase'), showcaseHref],
  ];
  const company: Array<[string, string]> = [
    [t(locale, 'footer.about'), '/about'],
    [t(locale, 'footer.pricing'), pricingHref],
    [t(locale, 'footer.terms'), '/terms'],
    [t(locale, 'footer.privacy'), '/privacy'],
    [t(locale, 'footer.contact'), 'mailto:hello@aihues.com'],
  ];

  return (
    <footer className='border-t border-border bg-surface'>
      <div className='mx-auto grid max-w-[1300px] gap-10 px-6 py-14 sm:grid-cols-2 md:px-8 lg:grid-cols-12'>
        <div className='lg:col-span-4'>
          <Link
            href={homeHref}
            className='inline-flex items-center gap-2.5 text-xl font-extrabold text-foreground'
          >
            <Logo size={30} />
            <span className='uppercase tracking-[0.12em]'>AIHues</span>
          </Link>
          <p className='mt-3 max-w-[280px] text-[14px] leading-relaxed text-muted'>
            {t(locale, 'footer.tagline')}
          </p>
          <div className='mt-5 flex items-center gap-2'>
            <FooterIcon
              href='mailto:hello@aihues.com'
              label={t(locale, 'footer.contact')}
            >
              <Mail size={16} />
            </FooterIcon>
            <FooterIcon href='/blog/rss.xml' label='RSS'>
              <Rss size={16} />
            </FooterIcon>
            <FooterIcon href='https://kimi.com' label='Kimi' external>
              <ArrowUpRight size={16} />
            </FooterIcon>
          </div>
        </div>

        <FooterColumn
          className='lg:col-span-2'
          heading={t(locale, 'footer.product')}
          links={product}
        />
        <FooterColumn
          className='lg:col-span-2'
          heading={t(locale, 'footer.games')}
          links={games}
        />
        <FooterColumn
          className='lg:col-span-2'
          heading={t(locale, 'footer.resources')}
          links={resources}
        />
        <FooterColumn
          className='lg:col-span-2'
          heading={t(locale, 'footer.company')}
          links={company}
        />
      </div>

      <div className='border-t border-border'>
        <div className='mx-auto flex max-w-[1300px] flex-col items-center justify-between gap-3 px-6 py-5 text-[13px] text-muted sm:flex-row md:px-8'>
          <span>{t(locale, 'footer.copyright')}</span>
          <div className='flex items-center gap-5'>
            <FooterLink href='/terms'>{t(locale, 'footer.terms')}</FooterLink>
            <FooterLink href='/privacy'>
              {t(locale, 'footer.privacy')}
            </FooterLink>
            <FooterLink href='mailto:hello@aihues.com'>
              {t(locale, 'footer.contact')}
            </FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

const footerLinkClass =
  'text-[14px] text-secondary transition-colors duration-200 hover:text-foreground focus-visible:text-foreground focus-visible:underline focus-visible:outline-none';

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  const external =
    href.startsWith('http') ||
    href.startsWith('mailto:') ||
    href.endsWith('.xml');
  if (external) {
    return (
      <a className={footerLinkClass} href={href}>
        {children}
      </a>
    );
  }
  return (
    <Link className={footerLinkClass} href={href}>
      {children}
    </Link>
  );
}

function FooterColumn({
  heading,
  links,
  className,
}: {
  heading: string;
  links: Array<[string, string]>;
  className?: string;
}) {
  return (
    <div className={className}>
      <h4 className='mb-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-muted'>
        {heading}
      </h4>
      <ul className='space-y-2.5'>
        {links.map(([label, href]) => (
          <li key={label}>
            <FooterLink href={href}>{label}</FooterLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterIcon({
  href,
  label,
  external,
  children,
}: {
  href: string;
  label: string;
  external?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      aria-label={label}
      className='flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-colors duration-200 hover:border-accent/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40'
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
    >
      {children}
    </a>
  );
}

export function PageShell({
  children,
  variant = 'default',
  locale = 'en',
}: {
  children: ReactNode;
  variant?: ChromeVariant;
  locale?: Locale;
}) {
  return (
    <>
      <SiteHeader variant={variant} locale={locale} />
      <main>{children}</main>
      <SiteFooter variant={variant} locale={locale} />
    </>
  );
}

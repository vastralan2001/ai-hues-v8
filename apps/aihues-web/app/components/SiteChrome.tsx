import Link from 'next/link';
import type { ReactNode } from 'react';
import { Rss } from 'lucide-react';

import HeaderBar from '@/components/HeaderBar';
import { t, type Locale } from '@/lib/dict';
import {
  storiesHref,
  searchHref,
  gameDetailHref,
  gamesHref,
  homeHref,
  testDetailHref,
  testsHref,
  toolsHref,
  wishlistHref,
} from '@/lib/routes';
import { Wordmark } from './Logo';
import { BookmarkButton } from './BookmarkButton';
import { type BrandCategory, categoryThemeStyle } from '@/lib/category-brand';

type ChromeVariant =
  | 'home'
  | 'tools'
  | 'games'
  | 'tests'
  | 'stories'
  | 'wishlist'
  | 'ranking'
  | 'default';

const mainLinks: Array<{ href: string; labelKey: string }> = [
  { href: toolsHref, labelKey: 'nav.tools' },
  { href: gamesHref, labelKey: 'nav.games' },
  { href: testsHref, labelKey: 'nav.tests' },
  { href: storiesHref, labelKey: 'nav.resources' },
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
  stories: mainLinks,
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
      <div className='w-full px-[clamp(1.5rem,5vw,7rem)]'>
        <div className='mx-auto flex h-[76px] max-w-[1760px] items-center justify-between'>
          {/* Logo */}
          <Link
            aria-label='AIHues home'
            className='shrink-0 text-lg font-extrabold md:text-xl'
            href={homeHref}
          >
            <Wordmark />
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
                className='font-display text-[13px] font-bold uppercase tracking-[0.14em] text-secondary transition-colors duration-150 hover:text-accent md:text-[15px]'
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
    [t(locale, 'nav.search'), searchHref],
    [t(locale, 'nav.wishlist'), wishlistHref],
    [t(locale, 'nav.resources'), storiesHref],
  ];
  const games: Array<[string, string]> = [
    [t(locale, 'footer.chess'), gameDetailHref('chess')],
    [t(locale, 'footer.snake'), gameDetailHref('snake')],
    [t(locale, 'footer.colorHunt'), gameDetailHref('color-hunt')],
    [t(locale, 'footer.luckySlots'), gameDetailHref('slot-machine')],
    [t(locale, 'footer.allGames'), gamesHref],
  ];
  const tests: Array<[string, string]> = [
    ['MBTI', testDetailHref('mbti')],
    ['SBTI', testDetailHref('sbti')],
    ['Mensa', testDetailHref('mensa')],
    ['Stanford–Binet', testDetailHref('sbinet')],
    [t(locale, 'footer.allTests'), testsHref],
  ];
  const company: Array<[string, string]> = [
    [t(locale, 'footer.about'), '/about'],
    [t(locale, 'footer.terms'), '/terms'],
    [t(locale, 'footer.privacy'), '/privacy'],
  ];

  return (
    <footer className='border-t border-border bg-surface'>
      <div className='w-full px-[clamp(1.5rem,5vw,7rem)]'>
        <div className='mx-auto grid max-w-[1760px] gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12'>
          <div className='lg:col-span-4'>
            <Link
              href={homeHref}
              className='inline-block text-xl font-extrabold'
            >
              <Wordmark />
            </Link>
            <p className='mt-3 max-w-[360px] text-[14px] leading-relaxed text-muted'>
              {t(locale, 'footer.tagline')}
            </p>
            <div className='mt-5 flex items-center gap-2'>
              <FooterIcon href='/stories/rss.xml' label='RSS'>
                <Rss size={16} />
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
            heading={t(locale, 'nav.tests')}
            links={tests}
          />
          <FooterColumn
            className='lg:col-span-2'
            heading={t(locale, 'footer.company')}
            links={company}
          />
        </div>
      </div>

      <div className='border-t border-border'>
        <div className='w-full px-[clamp(1.5rem,5vw,7rem)]'>
          <div className='mx-auto flex max-w-[1760px] flex-col items-center justify-between gap-3 py-5 text-[13px] text-muted sm:flex-row'>
            <span>{t(locale, 'footer.copyright')}</span>
            <div className='flex items-center gap-5'>
              <FooterLink href='/terms'>{t(locale, 'footer.terms')}</FooterLink>
              <FooterLink href='/privacy'>
                {t(locale, 'footer.privacy')}
              </FooterLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

const footerLinkClass =
  'text-[14px] text-secondary transition-colors duration-200 hover:text-accent focus-visible:text-accent focus-visible:underline focus-visible:outline-none';

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
  const themed: Partial<Record<ChromeVariant, BrandCategory>> = {
    tools: 'tools',
    games: 'games',
    tests: 'tests',
    stories: 'stories',
  };
  const cat = themed[variant];
  return (
    <div className='flex min-h-dvh flex-col'>
      <SiteHeader variant={variant} locale={locale} />
      <main
        className='flex-1'
        style={cat ? categoryThemeStyle(cat) : undefined}
      >
        {children}
      </main>
      <SiteFooter variant={variant} locale={locale} />
    </div>
  );
}

import Link from 'next/link';
import type { ReactNode } from 'react';

import { t, type Locale } from '@/lib/dict';
import {
  gameDetailHref,
  gamesHref,
  homeHref,
  rankingHref,
  showcaseHref,
  toolsHref,
  wishlistHref,
  blogHref,
} from '@/lib/routes';
import { Logo } from './Logo';
import { BookmarkButton } from './BookmarkButton';

type ChromeVariant =
  | 'home'
  | 'tools'
  | 'games'
  | 'wishlist'
  | 'ranking'
  | 'default';

const headerLinks: Record<
  ChromeVariant,
  Array<{ href: string; labelKey: string }>
> = {
  home: [
    { href: homeHref, labelKey: 'nav.home' },
    { href: toolsHref, labelKey: 'nav.tools' },
    { href: gamesHref, labelKey: 'nav.games' },
    { href: blogHref, labelKey: 'nav.blog' },
    { href: wishlistHref, labelKey: 'nav.wishlist' },
  ],
  tools: [
    { href: homeHref, labelKey: 'nav.home' },
    { href: toolsHref, labelKey: 'nav.tools' },
    { href: gamesHref, labelKey: 'nav.games' },
    { href: blogHref, labelKey: 'nav.blog' },
    { href: wishlistHref, labelKey: 'nav.wishlist' },
  ],
  games: [
    { href: homeHref, labelKey: 'nav.home' },
    { href: toolsHref, labelKey: 'nav.tools' },
    { href: gamesHref, labelKey: 'nav.games' },
    { href: blogHref, labelKey: 'nav.blog' },
    { href: wishlistHref, labelKey: 'nav.wishlist' },
  ],
  wishlist: [
    { href: homeHref, labelKey: 'nav.home' },
    { href: toolsHref, labelKey: 'nav.tools' },
    { href: gamesHref, labelKey: 'nav.games' },
    { href: blogHref, labelKey: 'nav.blog' },
    { href: wishlistHref, labelKey: 'nav.wishlist' },
  ],
  ranking: [
    { href: homeHref, labelKey: 'nav.home' },
    { href: toolsHref, labelKey: 'nav.tools' },
    { href: gamesHref, labelKey: 'nav.games' },
    { href: blogHref, labelKey: 'nav.blog' },
    { href: wishlistHref, labelKey: 'nav.wishlist' },
  ],
  default: [
    { href: homeHref, labelKey: 'nav.home' },
    { href: toolsHref, labelKey: 'nav.tools' },
    { href: gamesHref, labelKey: 'nav.games' },
    { href: blogHref, labelKey: 'nav.blog' },
    { href: wishlistHref, labelKey: 'nav.wishlist' },
  ],
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
    <header
      style={{ backdropFilter: 'blur(16px)' }}
      className='sticky top-0 z-[100] border-b border-border bg-[rgba(255,255,255,0.92)]'
    >
      <div className='mx-auto grid h-[68px] max-w-[1300px] grid-cols-[1fr_auto_1fr] items-center px-8'>
        {/* Logo */}
        <Link
          aria-label='AIHues home'
          className='flex items-center gap-2.5 justify-self-start text-xl font-extrabold text-foreground'
          href={homeHref}
        >
          <Logo size={32} />
          <span>AIHues</span>
        </Link>

        {/* Nav links */}
        <nav
          aria-label='Primary navigation'
          className='flex items-center gap-7 justify-self-center'
        >
          {links.map(({ href, labelKey }) => (
            <Link
              key={labelKey}
              className='text-[14px] font-medium text-secondary transition-colors duration-150 hover:text-foreground'
              href={href}
            >
              {t(locale, labelKey)}
            </Link>
          ))}
        </nav>

        {/* Right side: bookmark button */}
        <div className='justify-self-end'>
          <BookmarkButton />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter({
  variant = 'default',
  locale = 'en',
}: {
  variant?: ChromeVariant;
  locale?: Locale;
}) {
  if (variant === 'tools') {
    return (
      <footer className='border-t border-border px-8 py-8 text-center text-[13px] text-muted'>
        {t(locale, 'footer.copyright')} · 57 {t(locale, 'section.tools')}
      </footer>
    );
  }

  if (variant === 'games') {
    return (
      <footer className='border-t border-border px-8 py-8 text-center text-[13px] text-muted'>
        <div className='mb-3 flex items-center justify-center gap-2.5 text-xl font-extrabold text-foreground'>
          <Logo size={32} />
          <span>AIHues</span>
        </div>
        <div className='mb-3 flex justify-center gap-6'>
          <Link href={homeHref}>{t(locale, 'nav.home')}</Link>
          <Link href={toolsHref}>{t(locale, 'nav.tools')}</Link>
          <Link href={rankingHref}>{t(locale, 'nav.ranking')}</Link>
        </div>
        {t(locale, 'footer.copyright')}
      </footer>
    );
  }

  if (variant === 'ranking') {
    return (
      <footer className='border-t border-border px-8 py-12'>
        <div className='mx-auto max-w-[1300px]'>
          <div className='mb-8 flex flex-wrap items-start justify-between gap-6'>
            <div>
              <div className='mb-2 flex items-center gap-2.5 text-xl font-extrabold'>
                <Logo size={32} />
                <span>AIHues</span>
              </div>
              <p className='max-w-[300px] text-[14px] text-muted'>
                {t(locale, 'footer.tagline')}
              </p>
            </div>
            <div className='flex flex-wrap gap-10'>
              <FooterColumn
                heading={t(locale, 'footer.product')}
                links={[
                  [t(locale, 'nav.tools'), toolsHref],
                  [t(locale, 'categories.title'), `${homeHref}#categories`],
                  [t(locale, 'nav.discover'), showcaseHref],
                  [t(locale, 'nav.wishlist'), wishlistHref],
                ]}
              />
              <FooterColumn
                heading={t(locale, 'footer.games')}
                links={[
                  [t(locale, 'game.daily'), gameDetailHref('daily-luck')],
                  [t(locale, 'game.popular'), gameDetailHref('slot-machine')],
                  [t(locale, 'game.hoops'), gameDetailHref('basketball')],
                ]}
              />
              <FooterColumn
                heading={t(locale, 'footer.company')}
                links={[
                  [t(locale, 'footer.about'), '/about'],
                  [t(locale, 'nav.blog'), '/blog'],
                  [t(locale, 'footer.terms'), '/terms'],
                ]}
              />
            </div>
          </div>
          <div className='border-t border-border pt-6 text-center text-[13px] text-muted'>
            {t(locale, 'footer.copyright')}
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className='border-t border-border px-8 py-12'>
      <div className='mx-auto max-w-[1300px]'>
        {/* Top row: brand + links */}
        <div className='mb-8 flex flex-wrap items-start justify-between gap-6'>
          {/* Brand */}
          <div>
            <div className='mb-2 flex items-center gap-2.5 text-xl font-extrabold'>
              <Logo size={32} />
              <span>AIHues</span>
            </div>
            <p className='max-w-[260px] text-[14px] text-muted'>
              {t(locale, 'footer.tagline')}
            </p>
          </div>

          {/* Link columns */}
          <div className='flex flex-wrap gap-10'>
            {/* Product */}
            <div>
              <h4 className='mb-3 text-[14px] font-semibold text-foreground'>
                {t(locale, 'footer.product')}
              </h4>
              <div className='grid gap-2'>
                {[
                  { href: toolsHref, labelKey: 'nav.tools' },
                  { href: '#categories', labelKey: 'categories.title' },
                  { href: wishlistHref, labelKey: 'nav.wishlist' },
                  { href: showcaseHref, labelKey: 'nav.showcase' },
                ].map(({ href, labelKey }) => (
                  <Link
                    key={labelKey}
                    className='text-[14px] text-muted transition-colors hover:text-foreground'
                    href={href}
                  >
                    {t(locale, labelKey)}
                  </Link>
                ))}
              </div>
            </div>

            {/* Games */}
            <div>
              <h4 className='mb-3 text-[14px] font-semibold text-foreground'>
                {t(locale, 'footer.games')}
              </h4>
              <div className='grid gap-2'>
                {[
                  {
                    href: gameDetailHref('daily-luck'),
                    labelKey: 'game.daily',
                  },
                  {
                    href: gameDetailHref('slot-machine'),
                    labelKey: 'game.popular',
                  },
                  {
                    href: gameDetailHref('basketball'),
                    labelKey: 'game.hoops',
                  },
                ].map(({ href, labelKey }) => (
                  <Link
                    key={labelKey}
                    className='text-[14px] text-muted transition-colors hover:text-foreground'
                    href={href}
                  >
                    {t(locale, labelKey)}
                  </Link>
                ))}
              </div>
            </div>

            {/* Company */}
            <div>
              <h4 className='mb-3 text-[14px] font-semibold text-foreground'>
                {t(locale, 'footer.company')}
              </h4>
              <div className='grid gap-2'>
                {[
                  { href: '/about', labelKey: 'footer.about' },
                  { href: '/blog', labelKey: 'nav.blog' },
                  { href: '/terms', labelKey: 'footer.terms' },
                ].map(({ href, labelKey }) => (
                  <Link
                    key={labelKey}
                    className='text-[14px] text-muted transition-colors hover:text-foreground'
                    href={href}
                  >
                    {t(locale, labelKey)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className='border-t border-border pt-6 text-center text-[13px] text-muted'>
          {t(locale, 'footer.copyright')}
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  heading,
  links,
}: {
  heading: string;
  links: Array<[string, string]>;
}) {
  return (
    <div>
      <h4 className='mb-3 text-[14px] font-semibold text-foreground'>
        {heading}
      </h4>
      <div className='grid gap-2'>
        {links.map(([label, href]) => (
          <Link
            key={label}
            className='text-[14px] text-muted transition-colors hover:text-foreground'
            href={href}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
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

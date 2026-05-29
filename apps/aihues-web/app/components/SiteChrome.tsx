import Link from 'next/link';
import type { ReactNode } from 'react';

import {
  gameDetailHref,
  gamesHref,
  homeHref,
  discoverHref,
  pricingHref,
  rankingHref,
  showcaseHref,
  toolsHref,
  wishlistHref,
  blogHref,
} from '@/lib/routes';

type ChromeVariant =
  | 'home'
  | 'tools'
  | 'games'
  | 'wishlist'
  | 'ranking'
  | 'default';

const headerLinks: Record<
  ChromeVariant,
  Array<{ href: string; label: string }>
> = {
  home: [
    { href: homeHref, label: 'Home' },
    { href: toolsHref, label: 'Tools' },
    { href: gamesHref, label: 'Games' },
    { href: blogHref, label: 'Blog' },
    { href: wishlistHref, label: 'Wishlist' },
    { href: rankingHref, label: 'Ranking' },
  ],
  tools: [
    { href: homeHref, label: 'Home' },
    { href: toolsHref, label: 'Tools' },
    { href: gamesHref, label: 'Games' },
    { href: blogHref, label: 'Blog' },
    { href: wishlistHref, label: 'Wishlist' },
    { href: rankingHref, label: 'Ranking' },
  ],
  games: [
    { href: homeHref, label: 'Home' },
    { href: toolsHref, label: 'Tools' },
    { href: gamesHref, label: 'Games' },
    { href: blogHref, label: 'Blog' },
    { href: wishlistHref, label: 'Wishlist' },
    { href: rankingHref, label: 'Ranking' },
  ],
  wishlist: [
    { href: homeHref, label: 'Home' },
    { href: toolsHref, label: 'Tools' },
    { href: gamesHref, label: 'Games' },
    { href: blogHref, label: 'Blog' },
    { href: wishlistHref, label: 'Wishlist' },
    { href: rankingHref, label: 'Ranking' },
  ],
  ranking: [
    { href: homeHref, label: 'Home' },
    { href: toolsHref, label: 'Tools' },
    { href: gamesHref, label: 'Games' },
    { href: blogHref, label: 'Blog' },
    { href: wishlistHref, label: 'Wishlist' },
    { href: rankingHref, label: 'Ranking' },
  ],
  default: [
    { href: homeHref, label: 'Home' },
    { href: toolsHref, label: 'Tools' },
    { href: gamesHref, label: 'Games' },
    { href: blogHref, label: 'Blog' },
    { href: wishlistHref, label: 'Wishlist' },
    { href: rankingHref, label: 'Ranking' },
  ],
};

export function SiteHeader({
  variant = 'default',
}: {
  variant?: ChromeVariant;
}) {
  const links = headerLinks[variant];

  return (
    <header
      style={{ backdropFilter: 'blur(20px) saturate(180%)' }}
      className='sticky top-0 z-[100] border-b border-border bg-white/[0.92]'
    >
      <div className='mx-auto grid h-[68px] max-w-[1300px] grid-cols-[1fr_auto_1fr] items-center px-8'>
        {/* Logo */}
        <Link
          aria-label='AIHues home'
          className='flex items-center gap-2.5 justify-self-start text-xl font-extrabold text-foreground'
          href={homeHref}
        >
          <span
            className='flex h-[34px] w-[34px] items-center justify-center rounded-[10px] text-sm font-bold text-white'
            style={{ background: 'linear-gradient(135deg, #b45309, #d97706)' }}
          >
            H
          </span>
          <span>AIHues</span>
        </Link>

        {/* Nav links */}
        <nav
          aria-label='Primary navigation'
          className='flex items-center gap-7 justify-self-center'
        >
          {links.map(({ href, label }) => (
            <Link
              key={label}
              className='text-[14px] font-medium text-secondary transition-colors duration-150 hover:text-foreground'
              href={href}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter({
  variant = 'default',
}: {
  variant?: ChromeVariant;
}) {
  if (variant === 'tools') {
    return (
      <footer className='border-t border-border px-8 py-8 text-center text-[13px] text-muted'>
        © 2026 AIHues · <span>Find your AI vibe</span> · 57 Tools
      </footer>
    );
  }

  if (variant === 'games') {
    return (
      <footer className='border-t border-border px-8 py-8 text-center text-[13px] text-muted'>
        <div className='mb-3 flex items-center justify-center gap-2.5 text-xl font-extrabold text-foreground'>
          <span
            className='flex h-8 w-8 items-center justify-center rounded-[8px] text-sm font-bold text-white'
            style={{ background: 'linear-gradient(135deg, #b45309, #d97706)' }}
          >
            H
          </span>
          AIHues
        </div>
        <div className='mb-3 flex justify-center gap-6'>
          <Link href={homeHref}>Home</Link>
          <Link href={toolsHref}>Tools</Link>
          <Link href={rankingHref}>Ranking</Link>
        </div>
        © 2026 AIHues · Find your AI vibe · Built on Kimi
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
                <span
                  className='flex h-8 w-8 items-center justify-center rounded-[8px] text-sm font-bold text-white'
                  style={{
                    background: 'linear-gradient(135deg, #b45309, #d97706)',
                  }}
                >
                  H
                </span>
                AIHues
              </div>
              <p className='max-w-[300px] text-[14px] text-muted'>
                Find your AI vibe. 57 tools and 3 games with a natural feel.
              </p>
            </div>
            <div className='flex flex-wrap gap-10'>
              <FooterColumn
                heading='Product'
                links={[
                  ['All Tools', toolsHref],
                  ['Categories', `${homeHref}#categories`],
                  ['Showcase', showcaseHref],
                  ['Pricing', pricingHref],
                ]}
              />
              <FooterColumn
                heading='Games'
                links={[
                  ['Daily Fortune', gameDetailHref('daily-luck')],
                  ['Slot Machine', gameDetailHref('slot-machine')],
                  ['Hoops Challenge', gameDetailHref('basketball')],
                ]}
              />
              <FooterColumn
                heading='Company'
                links={[
                  ['About', '#'],
                  ['Blog', '#'],
                  ['Terms', '#'],
                ]}
              />
            </div>
          </div>
          <div className='border-t border-border pt-6 text-center text-[13px] text-muted'>
            Find your AI vibe · Built on Kimi
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
              <span
                className='flex h-8 w-8 items-center justify-center rounded-[8px] text-sm font-bold text-white'
                style={{
                  background: 'linear-gradient(135deg, #b45309, #d97706)',
                }}
              >
                H
              </span>
              AIHues
            </div>
            <p className='max-w-[260px] text-[14px] text-muted'>
              Find your AI vibe. 57 tools&nbsp;+&nbsp;3&nbsp;games that feel
              human.
            </p>
          </div>

          {/* Link columns */}
          <div className='flex flex-wrap gap-10'>
            {/* Product */}
            <div>
              <h4 className='mb-3 text-[14px] font-semibold text-foreground'>
                Product
              </h4>
              <div className='grid gap-2'>
                {[
                  { href: toolsHref, label: 'Tools' },
                  { href: '#categories', label: 'Categories' },
                  { href: wishlistHref, label: 'Wishlist' },
                  { href: pricingHref, label: 'Pricing' },
                ].map(({ href, label }) => (
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

            {/* Games */}
            <div>
              <h4 className='mb-3 text-[14px] font-semibold text-foreground'>
                Games
              </h4>
              <div className='grid gap-2'>
                {[
                  {
                    href: gameDetailHref('daily-luck'),
                    label: 'Daily Fortune',
                  },
                  {
                    href: gameDetailHref('slot-machine'),
                    label: 'Lucky Slots',
                  },
                  {
                    href: gameDetailHref('basketball'),
                    label: 'Hoops Challenge',
                  },
                ].map(({ href, label }) => (
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

            {/* Company */}
            <div>
              <h4 className='mb-3 text-[14px] font-semibold text-foreground'>
                Company
              </h4>
              <div className='grid gap-2'>
                {[
                  { href: '#', label: 'About' },
                  { href: '#', label: 'Blog' },
                  { href: '#', label: 'Terms' },
                ].map(({ href, label }) => (
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
          </div>
        </div>

        {/* Bottom bar */}
        <div className='border-t border-border pt-6 text-center text-[13px] text-muted'>
          © 2026 AIHues · Find your AI vibe · Built on Kimi
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
}: {
  children: ReactNode;
  variant?: ChromeVariant;
}) {
  return (
    <>
      <SiteHeader variant={variant} />
      <main>{children}</main>
      <SiteFooter variant={variant} />
    </>
  );
}

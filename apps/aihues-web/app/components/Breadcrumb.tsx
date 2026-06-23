import { Fragment } from 'react';
import Link from 'next/link';

export interface Crumb {
  label: string;
  href?: string;
}

/* Breadcrumb trail for detail pages. `light` (default) sits on the warm-white
   surface; `dark` is for the themed game hero. The last item is the current
   page (not a link). */
export default function Breadcrumb({
  items,
  variant = 'light',
  className = '',
}: {
  items: Crumb[];
  variant?: 'light' | 'dark';
  className?: string;
}) {
  const tone =
    variant === 'dark'
      ? {
          base: 'text-white/45',
          link: 'hover:text-white',
          current: 'text-white/80',
          sep: 'text-white/25',
        }
      : {
          base: 'text-muted',
          link: 'hover:text-accent',
          current: 'text-secondary',
          sep: '',
        };

  return (
    <nav
      aria-label='Breadcrumb'
      className={`flex min-w-0 items-center gap-1.5 text-[13px] ${tone.base} ${className}`}
    >
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <Fragment key={`${item.label}-${i}`}>
            {item.href && !last ? (
              <Link
                href={item.href}
                className={`shrink-0 font-medium transition-colors ${tone.link}`}
              >
                {item.label}
              </Link>
            ) : (
              <span className={`truncate font-medium ${tone.current}`}>
                {item.label}
              </span>
            )}
            {!last && (
              <span aria-hidden='true' className={tone.sep}>
                /
              </span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}

import Link from 'next/link';

import { ToolIcon } from '@/components/ToolIcon';
import { CATEGORY_ACCENT_HEX, type BrandCategory } from '@/lib/category-brand';

export type MarqueeItem = {
  slug: string;
  name: string;
  href: string;
  cat: BrandCategory;
};

export default function ToolMarquee({ rows }: { rows: MarqueeItem[][] }) {
  const durations = [48, 58, 52];

  return (
    <div className='marquee-mask flex flex-col gap-3'>
      {rows.map((items, rowIdx) => {
        if (items.length === 0) return null;
        const loop = [...items, ...items];
        return (
          <div key={rowIdx} className='marquee-row'>
            <div
              className='marquee-track'
              style={{
                animationDuration: `${durations[rowIdx % durations.length]}s`,
              }}
            >
              {loop.map((item, i) => (
                <Link
                  key={`${rowIdx}-${item.slug}-${i}`}
                  href={item.href}
                  className='marquee-chip'
                  style={
                    {
                      '--chip-accent': CATEGORY_ACCENT_HEX[item.cat],
                    } as React.CSSProperties
                  }
                  aria-hidden={i >= items.length ? 'true' : undefined}
                  tabIndex={i >= items.length ? -1 : undefined}
                >
                  <ToolIcon slug={item.slug} size={18} />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

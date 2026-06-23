'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { ToolIcon } from '@/components/ToolIcon';
import type { Locale } from '@/lib/dict';

interface Item {
  slug: string;
  title: string;
  desc: string;
  subtitle: string;
  href: string;
  type: 'tool' | 'game' | 'test';
}

/* Shared "related items" rail — tools, games or tests — backed by the
   server-side embedding index (/api/related). One card style, with a light
   variant for surfaces and a dark variant for the themed game hero. */
export default function RelatedItems({
  type,
  slug,
  query,
  locale,
  variant = 'light',
  heading,
  k = 6,
  className = '',
}: {
  type: 'tool' | 'game' | 'test';
  slug?: string;
  query?: string;
  locale: Locale;
  variant?: 'light' | 'dark';
  heading?: string;
  k?: number;
  className?: string;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!slug && !query) return;
    let active = true;
    const params = new URLSearchParams({ type, k: String(k) });
    if (slug) params.set('slug', slug);
    else if (query) params.set('q', query);
    fetch(`/api/related?${params.toString()}`)
      .then((r) => r.json())
      .then((d: { items?: Item[] }) => {
        if (active) {
          setItems(Array.isArray(d.items) ? d.items : []);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, [type, slug, query, k]);

  if (!loaded || items.length === 0) return null;

  const defaultHeading =
    type === 'game'
      ? locale === 'zh'
        ? '相关游戏'
        : 'Related Games'
      : type === 'test'
        ? locale === 'zh'
          ? '相关测评'
          : 'Related Tests'
        : locale === 'zh'
          ? '相关工具'
          : 'Related Tools';

  const dark = variant === 'dark';
  const card = dark
    ? 'border-white/10 bg-white/[0.04] hover:border-white/30'
    : 'border-border bg-surface hover:border-accent';
  const iconWrap = dark ? 'bg-white/10 text-white' : 'bg-accent-bg text-accent';
  const titleCls = dark ? 'text-white' : 'text-foreground';
  const descCls = dark ? 'text-white/55' : 'text-secondary';

  return (
    <section className={className}>
      <h3
        className={`mb-4 text-[16px] font-bold ${dark ? 'text-white' : 'text-foreground'}`}
      >
        {heading ?? defaultHeading}
      </h3>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
        {items.map((it) => (
          <Link
            key={`${it.type}-${it.slug}`}
            href={it.href}
            className={`card-lift group flex items-start gap-3 rounded-[14px] border px-4 py-3.5 text-inherit no-underline transition-colors ${card}`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${iconWrap}`}
            >
              <ToolIcon slug={it.slug} size={18} />
            </span>
            <span className='min-w-0 flex-1'>
              <span
                className={`block truncate text-[14px] font-semibold ${titleCls}`}
              >
                {it.title}
              </span>
              <span
                className={`mt-0.5 line-clamp-2 text-[12px] leading-snug ${descCls}`}
              >
                {it.desc}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

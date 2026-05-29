'use client';

import Link from 'next/link';
import { useState } from 'react';

import { useI18n } from '@/lib/i18n';
import { gamesHref, toolsCategoryHref, toolsHref } from '@/lib/routes';

interface SidebarGroup {
  icon: string;
  labelKey: string;
  href: string;
  count?: number;
  children?: Array<{ labelKey: string; href: string; count?: number }>;
}

function useGroups(): SidebarGroup[] {
  const { t } = useI18n();
  return [
    {
      icon: '📁',
      labelKey: t('sidebar.allTools'),
      href: toolsHref,
      count: 57,
    },
    {
      icon: '🚀',
      labelKey: t('sidebar.growth'),
      href: toolsHref,
      count: 70,
    },
    {
      icon: '💻',
      labelKey: t('sidebar.devTools'),
      href: toolsCategoryHref('developer'),
      count: 30,
    },
    {
      icon: '🛠️',
      labelKey: t('sidebar.utilities'),
      href: toolsCategoryHref('utility'),
      count: 8,
    },
    {
      icon: '🤖',
      labelKey: t('sidebar.aiProducts'),
      href: toolsCategoryHref('ai-writing'),
      count: 19,
    },
    {
      icon: '⭐',
      labelKey: t('sidebar.openSource'),
      href: toolsHref,
      count: 30,
    },
    {
      icon: '🎨',
      labelKey: t('sidebar.design'),
      href: toolsHref,
      count: 12,
    },
    {
      icon: '🎮',
      labelKey: t('sidebar.miniGames'),
      href: gamesHref,
      count: 3,
    },
  ];
}

export function Sidebar() {
  const { t } = useI18n();
  const groups = useGroups();
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <aside
      className='fixed left-0 top-[68px] z-[90] hidden h-[calc(100vh-68px)] w-[240px] overflow-y-auto border-r border-border bg-surface lg:block'
      style={{ padding: '12px 0' }}
    >
      <nav aria-label='Sidebar categories'>
        {groups.map((group) => {
          const hasChildren = !!group.children?.length;
          const isOpen = openGroups.has(group.labelKey);

          return (
            <div key={group.labelKey} className='px-2 py-0.5'>
              {hasChildren ? (
                <button
                  className='flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[14px] font-bold text-foreground transition-all hover:bg-accent/5'
                  onClick={() => toggleGroup(group.labelKey)}
                  type='button'
                >
                  <span className='w-[22px] text-center text-[16px]'>
                    {group.icon}
                  </span>
                  <span className='flex-1 text-left'>{group.labelKey}</span>
                  {group.count != null && (
                    <span className='rounded-full bg-black/[0.06] px-1.5 py-px text-[11px] font-semibold text-muted dark:bg-white/10'>
                      {group.count}
                    </span>
                  )}
                  <span
                    className={`text-[11px] text-muted transition-transform ${isOpen ? 'rotate-90' : ''}`}
                  >
                    ▶
                  </span>
                </button>
              ) : (
                <Link
                  className='flex items-center gap-2 rounded-lg px-2.5 py-2 text-[14px] font-bold text-foreground transition-all hover:bg-accent/5'
                  href={group.href}
                >
                  <span className='w-[22px] text-center text-[16px]'>
                    {group.icon}
                  </span>
                  <span className='flex-1'>{group.labelKey}</span>
                  {group.count != null && (
                    <span className='rounded-full bg-black/[0.06] px-1.5 py-px text-[11px] font-semibold text-muted dark:bg-white/10'>
                      {group.count}
                    </span>
                  )}
                </Link>
              )}

              {hasChildren && isOpen && (
                <div className='pl-4'>
                  {group.children?.map((child) => (
                    <Link
                      key={child.labelKey}
                      className='flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px] text-secondary transition-all hover:bg-accent/5 hover:text-foreground'
                      href={child.href}
                    >
                      <span className='flex-1'>{t(child.labelKey)}</span>
                      {child.count != null && (
                        <span className='rounded-full bg-black/[0.06] px-1.5 py-px text-[11px] font-semibold text-muted dark:bg-white/10'>
                          {child.count}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

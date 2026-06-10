'use client';

import { useMemo } from 'react';

import { useI18n } from '@/lib/i18n';
import { getToolUsages, getTotalRuns } from '@/lib/tool-usage';
import { LOCAL_TOOLS } from '@/lib/tool-data';
import type { CatalogGame } from '@/lib/catalog-api';

/** Get game play count from localStorage leaderboard fallback */
function getGamePlayCount(slug: string): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem('aihues_lb_' + slug);
    const board = raw ? JSON.parse(raw) : [];
    return Array.isArray(board) ? board.length : 0;
  } catch {
    return 0;
  }
}

interface RankingClientProps {
  games: CatalogGame[];
}

export function RankingClient({ games }: RankingClientProps) {
  const { locale } = useI18n();

  const myStats = useMemo(() => {
    const usages = getToolUsages();
    const totalRuns = getTotalRuns();
    const creditsRaw = localStorage.getItem('aihues-credits');
    const credits = creditsRaw ? parseInt(creditsRaw, 10) : 100;
    return { usages, totalRuns, credits };
  }, []);

  const toolRanks = useMemo(() => {
    return [...LOCAL_TOOLS]
      .map((t) => {
        const myUsage = myStats.usages.find((u) => u.slug === t.slug);
        const count = myUsage?.count ?? 0;
        return {
          slug: t.slug,
          name: locale === 'zh' && t.nameZh ? t.nameZh : t.name,
          category: t.category,
          usage: count,
          myCount: count,
        };
      })
      .filter((t) => t.usage > 0) // Only show tools you've actually used
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 15);
  }, [locale, myStats.usages]);

  const gameRanks = useMemo(() => {
    return games
      .map((g) => {
        const count = getGamePlayCount(g.slug);
        return {
          slug: g.slug,
          name: g.name,
          usage: count,
          category: 'Games',
        };
      })
      .filter((g) => g.usage > 0)
      .sort((a, b) => b.usage - a.usage);
  }, [games]);

  const allRanks = useMemo(() => {
    return [...toolRanks, ...gameRanks].sort((a, b) => b.usage - a.usage);
  }, [toolRanks, gameRanks]);

  const top10 = allRanks.slice(0, 10);

  const hasAnyUsage = myStats.totalRuns > 0 || allRanks.length > 0;

  return (
    <>
      <section className='page-hero ranking-hero'>
        <h1>Ranking</h1>
        <p>
          {locale === 'zh'
            ? '查看你的工具使用排行。'
            : 'See your most-used tools and games.'}
        </p>
        <div className='ranking-metrics'>
          <article>
            <span>{locale === 'zh' ? '使用工具数' : 'Tools Used'}</span>
            <strong>{myStats.usages.length}</strong>
          </article>
          <article>
            <span>{locale === 'zh' ? '使用次数' : 'Usage'}</span>
            <strong>{myStats.totalRuns}</strong>
            <small>{locale === 'zh' ? '总运行次数' : 'Total runs'}</small>
          </article>
          <article>
            <span>CREDIT</span>
            <strong>{myStats.credits}</strong>
            <small>{locale === 'zh' ? '余额' : 'Balance'}</small>
          </article>
        </div>
      </section>

      <section className='section section--compact'>
        {!hasAnyUsage ? (
          <p className='text-center text-secondary py-12'>
            {locale === 'zh'
              ? '还没有使用过任何工具或游戏。去工具页面试试吧！'
              : 'No tools or games used yet. Try some out!'}
          </p>
        ) : (
          <div className='rank-table' role='table' aria-label='Tool ranking'>
            <div className='rank-row rank-row--head' role='row'>
              <span>{locale === 'zh' ? '排名' : 'Rank'}</span>
              <span>{locale === 'zh' ? '工具/游戏' : 'Tool / Game'}</span>
              <span>{locale === 'zh' ? '使用次数' : 'Uses'}</span>
              <span>{locale === 'zh' ? '分类' : 'Category'}</span>
            </div>
            {top10.map((item, idx) => (
              <div className='rank-row' key={item.slug ?? item.name} role='row'>
                <strong>#{idx + 1}</strong>
                <span>{item.name}</span>
                <span>{item.usage}</span>
                <span>{item.category}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

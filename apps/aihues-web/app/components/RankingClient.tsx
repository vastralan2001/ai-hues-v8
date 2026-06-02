'use client';

import { useMemo } from 'react';

import { useI18n } from '@/lib/i18n';
import { getToolUsages, getTotalRuns } from '@/lib/tool-usage';
import { LOCAL_TOOLS } from '@/lib/tool-data';
import type { CatalogGame } from '@/lib/catalog-api';

// Deterministic "fake" popularity based on slug hash so it looks consistent
function slugHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function fakeUsage(slug: string): string {
  const hash = slugHash(slug);
  const k = ((hash % 150) + 5) / 10;
  return `${k.toFixed(1)}k`;
}

function fakeRating(slug: string): string {
  const hash = slugHash(slug + 'rating');
  return ((hash % 15) / 10 + 3.5).toFixed(1);
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
      .map((t) => ({
        slug: t.slug,
        name: locale === 'zh' && t.nameZh ? t.nameZh : t.name,
        category: t.category,
        usage: fakeUsage(t.slug),
        rating: fakeRating(t.slug),
        myCount: myStats.usages.find((u) => u.slug === t.slug)?.count ?? 0,
      }))
      .sort((a, b) => {
        // Sort by my usage first, then by fake usage
        if (b.myCount !== a.myCount) return b.myCount - a.myCount;
        return parseFloat(b.usage) - parseFloat(a.usage);
      })
      .slice(0, 15);
  }, [locale, myStats.usages]);

  const gameRanks = useMemo(() => {
    return games.map((g, idx) => ({
      slug: g.slug,
      rank: idx + 1,
      name: g.name,
      usage: `${((slugHash(g.slug) % 50) + 1) / 10}k`,
      rating: ((slugHash(g.slug + 'rating') % 15) / 10 + 3.5).toFixed(1),
      category: 'Games',
    }));
  }, [games]);

  const allRanks = [...toolRanks, ...gameRanks].sort(
    (a, b) => parseFloat(b.usage) - parseFloat(a.usage)
  );

  const top10 = allRanks.slice(0, 10);

  return (
    <>
      <section className='page-hero ranking-hero'>
        <h1>Ranking</h1>
        <p>
          {locale === 'zh'
            ? '查看最热门工具和你的使用排名。'
            : 'See the most-used tools and where you stand.'}
        </p>
        <div className='ranking-metrics'>
          <article>
            <span>{locale === 'zh' ? '我的排名' : 'My Rank'}</span>
            <strong>
              #
              {myStats.usages.length > 0
                ? Math.min(myStats.usages.length, 99)
                : '—'}
            </strong>
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
        <div className='rank-table' role='table' aria-label='Tool ranking'>
          <div className='rank-row rank-row--head' role='row'>
            <span>{locale === 'zh' ? '排名' : 'Rank'}</span>
            <span>{locale === 'zh' ? '工具' : 'Tool'}</span>
            <span>{locale === 'zh' ? '使用' : 'Usage'}</span>
            <span>{locale === 'zh' ? '评分' : 'Rating'}</span>
            <span>{locale === 'zh' ? '分类' : 'Category'}</span>
          </div>
          {top10.map((item, idx) => (
            <div className='rank-row' key={item.slug ?? item.name} role='row'>
              <strong>#{idx + 1}</strong>
              <span>{item.name}</span>
              <span>{item.usage}</span>
              <span>{item.rating}</span>
              <span>{item.category}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

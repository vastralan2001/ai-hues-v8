import type { Metadata } from 'next';

import { PageShell } from '@/components/SiteChrome';
import { RankingClient } from '@/components/RankingClient';
import { safeListGames } from '@/lib/catalog-api';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Ranking',
};

export default async function RankingPage() {
  const {
    data: { games },
  } = await safeListGames({ pageSize: 20 });

  return (
    <PageShell variant='ranking'>
      <RankingClient games={games} />
    </PageShell>
  );
}

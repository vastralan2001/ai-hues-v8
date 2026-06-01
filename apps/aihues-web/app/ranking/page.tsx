import type { Metadata } from 'next';

import { PageShell } from '@/components/SiteChrome';

export const metadata: Metadata = {
  title: 'Ranking',
};

// TODO(上线前): 以下为假数据，需替换为后端 API 返回的真实排行榜
// 需要后端接口：GET /api/v1/analytics/tool-rankings
// const TOOL_RANKINGS = [...];

export default function RankingPage() {
  return (
    <PageShell variant='ranking'>
      <section className='page-hero ranking-hero'>
        <h1>Ranking</h1>
        <p>See the most-used tools and where you stand.</p>
      </section>

      <section
        className='section section--compact'
        style={{ textAlign: 'center', padding: '80px 20px' }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏗️</div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
          Coming Soon
        </h2>
        <p
          style={{
            fontSize: '14px',
            color: '#78716c',
            maxWidth: '400px',
            margin: '0 auto',
          }}
        >
          Rankings and achievements are under construction. Check back after the
          analytics backend is ready.
        </p>
      </section>
    </PageShell>
  );
}

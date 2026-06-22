import type { Metadata } from 'next';

import { PageShell } from '@/components/SiteChrome';
import { getAllPosts } from '@/lib/resources-data';
import ResourcesContent from './ResourcesContent';

export const metadata: Metadata = {
  title: 'Resources | AIHues',
  description:
    'Growth strategies, AI tool reviews, and indie dev battle-tested tips.',
  openGraph: {
    title: 'AIHues Resources',
    description:
      'Growth strategies, AI tool reviews, and indie dev battle-tested tips.',
    type: 'website',
  },
};

export default function ResourcesPage() {
  const posts = getAllPosts();
  return (
    <PageShell>
      <ResourcesContent initialPosts={posts} />
    </PageShell>
  );
}

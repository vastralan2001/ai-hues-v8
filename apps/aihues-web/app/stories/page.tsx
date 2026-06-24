import type { Metadata } from 'next';

import { PageShell } from '@/components/SiteChrome';
import { getAllPosts } from '@/lib/resources-data';
import StoriesContent from './StoriesContent';

export const metadata: Metadata = {
  title: 'Stories | AIHues',
  description:
    'Growth strategies, AI tool reviews, and indie dev battle-tested tips.',
  openGraph: {
    title: 'AIHues Stories',
    description:
      'Growth strategies, AI tool reviews, and indie dev battle-tested tips.',
    type: 'website',
  },
};

export default async function StoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const posts = getAllPosts();
  const { tag } = await searchParams;
  return (
    <PageShell variant='stories'>
      <StoriesContent initialPosts={posts} initialTag={tag} />
    </PageShell>
  );
}

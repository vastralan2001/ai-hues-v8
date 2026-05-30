import type { Metadata } from 'next';

import { PageShell } from '@/components/SiteChrome';
import BlogContent from './BlogContent';

export const metadata: Metadata = {
  title: 'Blog | AIHues',
  description: 'Growth strategies, AI tool reviews, and indie dev battle-tested tips.',
  openGraph: {
    title: 'AIHues Blog',
    description: 'Growth strategies, AI tool reviews, and indie dev battle-tested tips.',
    type: 'website',
  },
};

export default function BlogPage() {
  return (
    <PageShell>
      <BlogContent />
    </PageShell>
  );
}

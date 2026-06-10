import type { Metadata } from 'next';

import { PageShell } from '@/components/SiteChrome';
import { WishlistBoard } from '@/components/WishlistBoard';

export const metadata: Metadata = {
  title: 'Wishlist',
};

export default function WishlistPage() {
  return (
    <PageShell variant='wishlist'>
      <section className='page-hero'>
        <h1>Tool Wishlist</h1>
        <p>
          What tool do you want? Submit your ideas — top voted gets built first!
        </p>
        <WishlistBoard />
      </section>
    </PageShell>
  );
}

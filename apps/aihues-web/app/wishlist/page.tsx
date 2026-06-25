import type { Metadata } from 'next';

import Breadcrumb from '@/components/Breadcrumb';
import { PageShell } from '@/components/SiteChrome';
import { WishlistBoard } from '@/components/WishlistBoard';

export const metadata: Metadata = {
  title: 'Wishlist',
};

export default function WishlistPage() {
  return (
    <PageShell variant='wishlist'>
      <div className='mx-auto mt-8 w-full max-w-[1320px] px-6'>
        <Breadcrumb
          items={[{ label: 'Home', href: '/' }, { label: 'Wishlist' }]}
        />
      </div>
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

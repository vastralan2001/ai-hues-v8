import type { Metadata } from 'next';

import { PageMasthead } from '@/components/PageMasthead';
import { PageShell } from '@/components/SiteChrome';
import { WishlistBoard } from '@/components/WishlistBoard';

export const metadata: Metadata = {
  title: 'Wishlist',
  description:
    'Vote for the next tool, game, or test you want us to build on AIHues.',
};

export default function WishlistPage() {
  return (
    <PageShell variant='wishlist'>
      <PageMasthead
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Wishlist' }]}
        title='Wishlist'
        subtitle='Vote for the next tool, game, or test you want us to build.'
        features={['Community voted', 'Public roadmap', 'Built in public']}
      />

      <section className='mx-auto w-full max-w-[1760px] px-[clamp(1.5rem,5vw,7rem)] pb-20'>
        <WishlistBoard />
      </section>
    </PageShell>
  );
}

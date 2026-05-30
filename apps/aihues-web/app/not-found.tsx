import Link from 'next/link';
import { PageShell } from '@/components/SiteChrome';

export const metadata = {
  title: '404 — Page Not Found | AIHues',
};

export default function NotFound() {
  return (
    <PageShell>
      <div className='flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center'>
        <h1 className='text-[120px] font-extrabold leading-none tracking-[-4px] text-[#e8e2d9]'>
          404
        </h1>
        <h2 className='mt-4 text-2xl font-bold text-[#1c1917]'>
          Page not found
        </h2>
        <p className='mt-2 max-w-[400px] text-[15px] text-[#78716c]'>
          The page you are looking for does not exist or has been moved.
        </p>
        <div className='mt-8 flex flex-wrap justify-center gap-3'>
          <Link
            href='/'
            className='rounded-[10px] bg-[#b45309] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#d97706]'
          >
            Go Home
          </Link>
          <Link
            href='/tools'
            className='rounded-[10px] border border-[#e8e2d9] bg-white px-6 py-3 text-sm font-semibold text-[#1c1917] transition-colors hover:border-[#d97706] hover:text-[#b45309]'
          >
            Browse Tools
          </Link>
        </div>
      </div>
    </PageShell>
  );
}

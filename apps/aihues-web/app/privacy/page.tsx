import type { Metadata } from 'next';

import { PageShell } from '@/components/SiteChrome';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for AIHues.',
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <main className='mx-auto max-w-[720px] px-6 py-20 md:px-7'>
        <h1 className='mb-6 text-[36px] font-extrabold tracking-[-1px] text-[#1c1917]'>
          Privacy Policy
        </h1>

        <div className='space-y-6 text-[16px] leading-relaxed text-[#57534e]'>
          <p>
            AIHues is committed to protecting your privacy. This policy explains
            what information we collect, how we use it, and your rights.
          </p>

          <h2 className='mt-8 text-[20px] font-bold text-[#1c1917]'>
            Information We Collect
          </h2>
          <ul className='list-disc space-y-2 pl-5'>
            <li>
              <strong>Usage data:</strong> We use Google Analytics to understand
              how visitors interact with AIHues, such as pages visited and time
              spent.
            </li>
            <li>
              <strong>Tool inputs:</strong> Inputs you enter into AI writing
              tools are sent to our AI provider via a proxy to generate
              responses. We do not store these inputs on our servers.
            </li>
            <li>
              <strong>Local data:</strong> Features like bookmarks, wishlist,
              theme, and language preferences are stored in your browser&apos;s
              localStorage.
            </li>
          </ul>

          <h2 className='mt-8 text-[20px] font-bold text-[#1c1917]'>
            How We Use Information
          </h2>
          <p>
            We use collected data to improve the site, fix issues, and
            prioritize new features. We do not sell personal information to
            third parties.
          </p>

          <h2 className='mt-8 text-[20px] font-bold text-[#1c1917]'>
            Cookies and Analytics
          </h2>
          <p>
            Google Analytics may set cookies to measure site usage. You can
            accept or decline analytics cookies via the cookie banner. Declining
            cookies will disable analytics tracking.
          </p>

          <h2 className='mt-8 text-[20px] font-bold text-[#1c1917]'>
            Third-Party Services
          </h2>
          <p>
            External tools and blog links may redirect to third-party websites.
            Please review their privacy policies separately.
          </p>

          <h2 className='mt-8 text-[20px] font-bold text-[#1c1917]'>Changes</h2>
          <p>
            We may update this Privacy Policy from time to time. Continued use
            of AIHues constitutes acceptance of the latest version.
          </p>

          <p className='pt-6 text-sm text-[#a8a29e]'>Last updated: June 2026</p>
        </div>
      </main>
    </PageShell>
  );
}

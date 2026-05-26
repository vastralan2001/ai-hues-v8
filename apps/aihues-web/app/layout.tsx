import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'AIHues — Find your AI vibe',
    template: '%s - AIHues',
  },
  description:
    'AI tools and lightweight games powered by the AIHues catalog API.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}

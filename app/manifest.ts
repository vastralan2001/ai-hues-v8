import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Aiushtha',
    short_name: 'Aiushtha',
    description: '面向产品型站点的 Next.js App Router 基线。',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5efe4',
    theme_color: '#11312b',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}

export const siteName = 'Aiushtha';
export const siteDescription =
  '面向产品型站点的 Next.js App Router 基线，兼顾 SEO、动态数据、React 组件化和 Node 部署能力。';

function resolveSiteUrl() {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '');

  if (configuredSiteUrl) {
    return configuredSiteUrl;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'NEXT_PUBLIC_SITE_URL is required for production builds to generate correct metadata.',
    );
  }

  const localPort = process.env.PORT || '3000';
  return `http://localhost:${localPort}`;
}

export const siteUrl = resolveSiteUrl();

export function absoluteUrl(path = '/') {
  const baseUrl = siteUrl.replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

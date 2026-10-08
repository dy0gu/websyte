import type { MetadataRoute } from 'next';
import { getServerSideURL } from '~/utilities/get-server-url';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getServerSideURL().replace(/\/$/, '');

  return {
    rules: {
      disallow: '/admin/*',
      userAgent: '*',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

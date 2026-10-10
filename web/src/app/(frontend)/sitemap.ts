import config from '@payload-config';
import type { MetadataRoute } from 'next';
import { unstable_cache } from 'next/cache.js';
import { getPayload } from 'payload';
import { getDocumentPath } from '~/utilities/get-document-path';
import { getServerSideURL } from '~/utilities/get-server-url';

const getSitemap = unstable_cache(
  async (): Promise<MetadataRoute.Sitemap> => {
    const payload = await getPayload({ config: config });
    const siteUrl = getServerSideURL().replace(/\/$/, '');
    const entries: MetadataRoute.Sitemap = [];
    const append = (path: string, lastModified?: string) => {
      entries.push({
        url: `${siteUrl}${path}`,
        ...(lastModified ? { lastModified: lastModified } : {}),
      });
    };
    for (const path of ['/', '/posts', '/projects']) append(path);

    const { totalDocs: totalPosts } = await payload.count({
      collection: 'posts',
      locale: 'en',
      overrideAccess: false,
    });
    const totalPostPages = Math.ceil(totalPosts / 12);
    for (let page = 2; page <= totalPostPages; page++) append(`/posts/page/${page}`);

    for (const collection of ['pages', 'posts'] as const) {
      const result = await payload.find({
        collection: collection,
        depth: 0,
        draft: false,
        limit: 0,
        locale: 'en',
        overrideAccess: false,
        pagination: false,
        select: { slug: true, updatedAt: true },
      });
      for (const doc of result.docs) {
        if (!doc.slug || (collection === 'pages' && doc.slug === 'home')) continue;
        append(getDocumentPath({ collection: collection, slug: doc.slug }), doc.updatedAt);
      }
    }
    return entries;
  },
  ['sitemap'],
  { tags: ['pages-sitemap', 'posts-sitemap', 'projects-sitemap'] },
);

export default function sitemap() {
  return getSitemap();
}

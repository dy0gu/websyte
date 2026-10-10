import configPromise from '@payload-config';
import { getLocale } from 'next-intl/server';
import { getPayload } from 'payload';
import type { HomePost } from '~/components/home/types';

const postsPerPage = 12;

export async function getPostArchive(page?: number) {
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: postsPerPage,
    locale: await getLocale(),
    overrideAccess: false,
    ...(page ? { page: page } : {}),
    select: {
      meta: true,
      publishedAt: true,
      slug: true,
      title: true,
    },
    sort: '-publishedAt',
  });

  const posts: HomePost[] = result.docs.map((post) => ({
    description: post.meta?.description,
    id: post.id,
    publishedAt: post.publishedAt,
    slug: post.slug,
    title: post.title,
  }));

  return { pagination: result, posts: posts };
}

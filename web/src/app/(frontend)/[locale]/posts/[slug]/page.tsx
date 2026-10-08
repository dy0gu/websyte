import configPromise from '@payload-config';
import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { getLocale } from 'next-intl/server';
import { getPayload } from 'payload';
import { cache } from 'react';
import styles from '~/app/(frontend)/pages.module.css';
import { RelatedPosts } from '~/blocks/related-posts/component';
import { LivePreviewListener } from '~/components/live-preview-listener';
import { PayloadRedirects } from '~/components/payload-redirects';
import { RichText } from '~/components/rich-text';
import { PostHero } from '~/heros/post-hero';
import shared from '~/styles/shared.module.css';
import { generateMeta } from '~/utilities/generate-meta';

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise });
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    locale: 'en',
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  });

  const params = posts.docs.map(({ slug }) => {
    return { slug: slug };
  });

  return params;
}

type Args = {
  params: Promise<{
    slug?: string;
  }>;
};

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode();
  const { slug = '' } = await paramsPromise;
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug);
  const url = `/posts/${decodedSlug}`;
  const post = await queryPostBySlug({ slug: decodedSlug });

  if (!post) return <PayloadRedirects url={url} />;

  return (
    <article className={styles.postArticle}>
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <PostHero post={post} />

      <div className={styles.postContentArea}>
        <div className={shared.container}>
          <RichText className={styles.postContent} data={post.content} enableGutter={false} />
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className={styles.relatedPosts}
              docs={post.relatedPosts.filter((post) => typeof post === 'object')}
            />
          )}
        </div>
      </div>
    </article>
  );
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise;
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug);
  const post = await queryPostBySlug({ slug: decodedSlug });

  return generateMeta({ doc: post, path: `/posts/${decodedSlug}` });
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode();

  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: 'posts',
    draft: draft,
    limit: 1,
    locale: await getLocale(),
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  return result.docs?.[0] || null;
});

import configPromise from '@payload-config';
import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { getLocale } from 'next-intl/server';
import { getPayload } from 'payload';
import { cache } from 'react';
import styles from '~/app/(frontend)/pages.module.css';

import { RenderBlocks } from '~/blocks/render-blocks';
import { LivePreviewListener } from '~/components/live-preview-listener';
import { PayloadRedirects } from '~/components/payload-redirects';
import { RenderHero } from '~/heros/render-hero';
import { generateMeta } from '~/utilities/generate-meta';

type Args = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode();
  const { slug } = await paramsPromise;
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug);
  const url = `/${decodedSlug}`;
  const page = await queryPageBySlug({
    slug: decodedSlug,
  });

  if (!page) {
    return <PayloadRedirects url={url} />;
  }

  const { hero, layout } = page;

  return (
    <article
      className={styles.article}
      data-header-contrast={hero.type === 'highImpact' ? 'light' : undefined}
    >
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  );
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise;
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug);
  const page = await queryPageBySlug({
    slug: decodedSlug,
  });

  return generateMeta({ doc: page, path: `/${decodedSlug}` });
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode();

  const payload = await getPayload({ config: configPromise });

  const result = await payload.find({
    collection: 'pages',
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

import { notFound } from 'next/navigation';
import type { Metadata } from 'next/types';
import { getLocale, getTranslations } from 'next-intl/server';

import styles from '~/app/(frontend)/pages.module.css';
import { ArchiveHero } from '~/components/archive-hero/archive-hero';

import { WritingSection } from '~/components/home/writing-section';
import { Pagination } from '~/components/pagination';
import { localizedPageMetadata } from '~/i18n/metadata';
import { getPostArchive } from '~/utilities/get-post-archive';

export const revalidate = 600;

type Args = {
  params: Promise<{
    'page-number': string;
  }>;
};

export default async function Page({ params: paramsPromise }: Args) {
  const { 'page-number': pageNumber } = await paramsPromise;
  const t = await getTranslations('UI');
  const sanitizedPageNumber = Number(pageNumber);

  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 1) notFound();

  const { posts: archivePosts, pagination } = await getPostArchive(sanitizedPageNumber);

  return (
    <main className={styles.page}>
      <ArchiveHero description={t('postsDescription')} title={t('postsTitle')} />
      <WritingSection
        kicker={t('postsPage', { page: sanitizedPageNumber })}
        posts={archivePosts}
        showAllLink={false}
      />
      <div className={styles.pagination}>
        {pagination.page && pagination.totalPages > 1 && (
          <Pagination page={pagination.page} totalPages={pagination.totalPages} />
        )}
      </div>
    </main>
  );
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { 'page-number': pageNumber } = await paramsPromise;
  const t = await getTranslations('UI');
  return localizedPageMetadata({
    locale: await getLocale(),
    path: `/posts/page/${pageNumber}`,
    title: t('postsPage', { page: pageNumber }),
  });
}

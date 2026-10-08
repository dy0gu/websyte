import type { Metadata } from 'next/types';
import { getLocale, getTranslations } from 'next-intl/server';
import styles from '~/app/(frontend)/pages.module.css';
import { ArchiveHero } from '~/components/archive-hero/archive-hero';

import { WritingSection } from '~/components/home/writing-section';
import { Pagination } from '~/components/pagination';
import { localizedPageMetadata } from '~/i18n/metadata';
import { getPostArchive } from '~/utilities/get-post-archive';

export const revalidate = 600;

export default async function Page() {
  const t = await getTranslations('UI');
  const { posts: archivePosts, pagination } = await getPostArchive();

  return (
    <main className={styles.page}>
      <ArchiveHero description={t('postsDescription')} title={t('postsTitle')} />
      <WritingSection kicker={t('allPosts')} posts={archivePosts} showAllLink={false} />
      <div className={styles.pagination}>
        {pagination.totalPages > 1 && pagination.page && (
          <Pagination page={pagination.page} totalPages={pagination.totalPages} />
        )}
      </div>
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('UI');
  return localizedPageMetadata({
    locale: await getLocale(),
    path: '/posts',
    title: t('postsTitle'),
  });
}

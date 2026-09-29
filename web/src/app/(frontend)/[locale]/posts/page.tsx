import configPromise from '@payload-config'
import type { Metadata } from 'next/types'
import { getLocale, getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import styles from '@/app/(frontend)/pages.module.css'
import { ArchiveHero } from '@/components/archive-hero/archive-hero'
import type { HomePost } from '@/components/home/types'
import { WritingSection } from '@/components/home/writing-section'
import { Pagination } from '@/components/pagination'
import { localizedMetadata } from '@/i18n/metadata'

export const revalidate = 600

export default async function Page() {
  const t = await getTranslations('UI')
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    locale: await getLocale(),
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    sort: '-publishedAt',
    select: {
      title: true,
      slug: true,
      meta: true,
      publishedAt: true,
    },
  })

  const archivePosts: HomePost[] = posts.docs.map((post) => ({
    description: post.meta?.description,
    id: post.id,
    publishedAt: post.publishedAt,
    slug: post.slug,
    title: post.title,
  }))

  return (
    <main className={styles.page}>
      <ArchiveHero
        description={t('postsDescription')}
        eyebrow={t('postsEyebrow')}
        title={t('postsTitle')}
      />
      <WritingSection kicker={t('allPosts')} posts={archivePosts} showAllLink={false} />
      <div className={styles.pagination}>
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('UI')
  return { ...localizedMetadata('/posts', await getLocale()), title: `${t('postsTitle')} | Diogo` }
}

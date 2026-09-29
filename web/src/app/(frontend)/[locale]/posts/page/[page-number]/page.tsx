import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
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

type Args = {
  params: Promise<{
    'page-number': string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { 'page-number': pageNumber } = await paramsPromise
  const t = await getTranslations('UI')
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 1) notFound()

  const posts = await payload.find({
    locale: await getLocale(),
    collection: 'posts',
    depth: 1,
    limit: 12,
    page: sanitizedPageNumber,
    overrideAccess: false,
    sort: '-publishedAt',
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
      <WritingSection
        kicker={t('postsPage', { page: sanitizedPageNumber })}
        posts={archivePosts}
        showAllLink={false}
      />
      <div className={styles.pagination}>
        {posts?.page && posts?.totalPages > 1 && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </main>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { 'page-number': pageNumber } = await paramsPromise
  const t = await getTranslations('UI')
  return {
    ...localizedMetadata(`/posts/page/${pageNumber}`, await getLocale()),
    title: `${t('postsPage', { page: pageNumber })} | Diogo`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'posts',
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / 12)

  const pages: { 'page-number': string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ 'page-number': String(i) })
  }

  return pages
}

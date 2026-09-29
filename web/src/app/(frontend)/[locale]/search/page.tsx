import configPromise from '@payload-config'
import type { Metadata } from 'next/types'
import { getLocale, getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import styles from '@/app/(frontend)/pages.module.css'
import { ArchiveHero } from '@/components/archive-hero/archive-hero'
import type { CardPostData } from '@/components/card'
import { CollectionArchive } from '@/components/collection-archive'
import { localizedMetadata } from '@/i18n/metadata'
import { Search } from '@/search/component'
import shared from '@/styles/shared.module.css'

type Args = {
  searchParams: Promise<{
    q: string
  }>
}
export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const t = await getTranslations('UI')
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    locale: await getLocale(),
    collection: 'search',
    overrideAccess: false,
    depth: 1,
    limit: 12,
    select: {
      doc: true,
      title: true,
      slug: true,
      meta: true,
    },
    // pagination: false reduces overhead if you don't need totalDocs
    pagination: false,
    ...(query
      ? {
          where: {
            or: [
              {
                title: {
                  like: query,
                },
              },
              {
                'meta.description': {
                  like: query,
                },
              },
              {
                'meta.title': {
                  like: query,
                },
              },
              {
                slug: {
                  like: query,
                },
              },
            ],
          },
        }
      : {}),
  })

  return (
    <main className={styles.page}>
      <ArchiveHero
        description={t('searchDescription')}
        eyebrow={t('searchEyebrow')}
        title={t('searchTitle')}
      />
      <section className={styles.searchSection}>
        <div className={styles.searchForm}>
          <Search />
        </div>

        {posts.totalDocs > 0 ? (
          <CollectionArchive posts={posts.docs as CardPostData[]} />
        ) : (
          <div className={shared.container}>{t('noResults')}</div>
        )}
      </section>
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('UI')
  return {
    robots: { index: false, follow: true },
    ...localizedMetadata('/search', await getLocale()),
    title: `${t('searchTitle')} | Diogo`,
  }
}

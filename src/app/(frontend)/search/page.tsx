import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/collection-archive'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Search } from '@/search/component'
import PageClient from './page.client'
import { CardPostData } from '@/components/card'
import { cn } from '@/utilities/ui'
import shared from '@/styles/shared.module.css'
import styles from '@/app/(frontend)/pages.module.css'

type Args = {
  searchParams: Promise<{
    q: string
  }>
}
export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,
    select: {
      title: true,
      slug: true,
      categories: true,
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
    <div className={styles.page}>
      <PageClient />
      <div className={cn(shared.container, styles.intro)}>
        <div className={cn(shared.prose, styles.centered)}>
          <h1 className={styles.searchTitle}>Search</h1>

          <div className={styles.searchForm}>
            <Search />
          </div>
        </div>
      </div>

      {posts.totalDocs > 0 ? (
        <CollectionArchive posts={posts.docs as CardPostData[]} />
      ) : (
        <div className={shared.container}>No results found.</div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Search`,
  }
}

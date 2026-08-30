import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/collection-archive'
import { PageRange } from '@/components/page-range'
import { Pagination } from '@/components/pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import PageClient from './page.client'
import { cn } from '@/utilities/ui'
import shared from '@/styles/shared.module.css'
import styles from '@/app/(frontend)/pages.module.css'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  return (
    <div className={styles.page}>
      <PageClient />
      <div className={cn(shared.container, styles.intro)}>
        <div className={shared.prose}>
          <h1>Posts</h1>
        </div>
      </div>

      <div className={cn(shared.container, styles.range)}>
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} />

      <div className={shared.container}>
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Posts`,
  }
}

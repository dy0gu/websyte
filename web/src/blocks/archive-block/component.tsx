import configPromise from '@payload-config'
import { getLocale } from 'next-intl/server'
import { getPayload } from 'payload'
import type React from 'react'
import { CollectionArchive } from '@/components/collection-archive'
import RichText from '@/components/rich-text'
import type { ArchiveBlock as ArchiveBlockProps, Post } from '@/payload-types'
import shared from '@/styles/shared.module.css'
import { cn } from '@/utilities/ui'
import styles from './component.module.css'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const { id, introContent, limit: limitFromProps, populateBy, selectedDocs } = props

  const limit = limitFromProps || 3

  let posts: Post[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const fetchedPosts = await payload.find({
      locale: await getLocale(),
      collection: 'posts',
      overrideAccess: false,
      depth: 1,
      limit,
    })

    posts = fetchedPosts.docs
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedPosts = selectedDocs.flatMap((post) =>
        typeof post.value === 'object' && post.value ? [post.value] : [],
      )

      posts = filteredSelectedPosts
    }
  }

  return (
    <div className={styles.root} id={`block-${id}`}>
      {introContent && (
        <div className={cn(shared.container, styles.intro)}>
          <RichText className={styles.introContent} data={introContent} enableGutter={false} />
        </div>
      )}
      <CollectionArchive posts={posts} />
    </div>
  )
}

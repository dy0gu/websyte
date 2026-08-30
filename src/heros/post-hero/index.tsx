import { formatDateTime } from '@/utilities/format-date-time'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/media'
import { formatAuthors } from '@/utilities/format-authors'
import { cn } from '@/utilities/ui'
import shared from '@/styles/shared.module.css'
import styles from './index.module.css'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const { categories, heroImage, populatedAuthors, publishedAt, title } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  return (
    <div className={styles.root}>
      <div className={cn(shared.container, styles.contentContainer)}>
        <div className={styles.content}>
          <div className={styles.categories}>
            {categories?.map((category, index) => {
              if (typeof category === 'object' && category !== null) {
                const { title: categoryTitle } = category

                const titleToUse = categoryTitle || 'Untitled category'

                const isLast = index === categories.length - 1

                return (
                  <React.Fragment key={index}>
                    {titleToUse}
                    {!isLast && <React.Fragment>, &nbsp;</React.Fragment>}
                  </React.Fragment>
                )
              }
              return null
            })}
          </div>

          <h1 className={styles.title}>{title}</h1>

          <div className={styles.meta}>
            {hasAuthors && (
              <div className={styles.author}>
                <div className={styles.metaItem}>
                  <p className={styles.metaLabel}>Author</p>

                  <p>{formatAuthors(populatedAuthors)}</p>
                </div>
              </div>
            )}
            {publishedAt && (
              <div className={styles.metaItem}>
                <p className={styles.metaLabel}>Date Published</p>

                <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.media}>
        {heroImage && typeof heroImage !== 'string' && (
          <Media fill priority imgClassName={styles.image} resource={heroImage} />
        )}
        <div className={styles.overlay} />
      </div>
    </div>
  )
}

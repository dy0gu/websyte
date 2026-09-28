import { useLocale, useTranslations } from 'next-intl'
import type React from 'react'
import { Media } from '@/components/media'

import type { Post } from '@/payload-types'
import shared from '@/styles/shared.module.css'
import { formatAuthors } from '@/utilities/format-authors'
import { formatDateTime } from '@/utilities/format-date-time'
import { cn } from '@/utilities/ui'
import styles from './index.module.css'

export const PostHero: React.FC<{
  post: Post
}> = ({ post }) => {
  const t = useTranslations('UI')
  const locale = useLocale()
  const { heroImage, populatedAuthors, publishedAt, title } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  return (
    <div className={styles.root}>
      <div className={styles.grid} aria-hidden="true" />
      <div className={cn(shared.container, styles.contentContainer)}>
        <div className={styles.content}>
          <p className={styles.eyebrow}>{t('articleEyebrow')}</p>
          <h1 className={styles.title}>{title}</h1>

          <div className={styles.meta}>
            {hasAuthors && (
              <div className={styles.author}>
                <div className={styles.metaItem}>
                  <p className={styles.metaLabel}>{t('author')}</p>

                  <p>{formatAuthors(populatedAuthors)}</p>
                </div>
              </div>
            )}
            {publishedAt && (
              <div className={styles.metaItem}>
                <p className={styles.metaLabel}>{t('published')}</p>

                <time dateTime={publishedAt}>{formatDateTime(publishedAt, locale)}</time>
              </div>
            )}
          </div>
        </div>
      </div>
      {heroImage && typeof heroImage !== 'string' && (
        <div className={styles.media}>
          <Media fill priority imgClassName={styles.image} resource={heroImage} />
        </div>
      )}
    </div>
  )
}

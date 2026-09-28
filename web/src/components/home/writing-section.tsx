import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

import styles from './home.module.css'
import type { HomePost } from './types'

const formatYearRange = (posts: HomePost[]) => {
  const years = posts
    .map(({ publishedAt }) => (publishedAt ? new Date(publishedAt).getFullYear() : undefined))
    .filter((year): year is number => year !== undefined && !Number.isNaN(year))
    .sort()

  if (years.length === 0) return null

  const oldestYear = years[0]
  const newestYear = years[years.length - 1]

  return oldestYear === newestYear ? String(oldestYear) : `${oldestYear} - ${newestYear}`
}

export function WritingSection({
  kicker,
  posts,
  showAllLink = true,
}: {
  kicker?: string
  posts: HomePost[]
  showAllLink?: boolean
}) {
  const t = useTranslations('UI')
  const locale = useLocale()
  const formatDate = (date?: string | null) =>
    date
      ? new Intl.DateTimeFormat(locale === 'pt' ? 'pt-PT' : 'en', {
          month: 'short',
          year: 'numeric',
          timeZone: 'Europe/Lisbon',
        }).format(new Date(date))
      : t('unscheduled')
  const yearRange = formatYearRange(posts)

  return (
    <section className={styles.writing} id="writing">
      <div className={styles.sectionIntro} data-reveal>
        <div className={styles.sectionMeta}>
          <p className={styles.kicker}>{kicker ?? t('latestPosts')}</p>
          {yearRange && <p className={styles.yearRange}>{yearRange}</p>}
        </div>
        {showAllLink && (
          <Link className={styles.allPostsLink} href="/posts">
            {t('allPosts')}
          </Link>
        )}
      </div>
      <div className={styles.postList}>
        {posts.map((post, index) => (
          <Link className={styles.post} data-reveal href={`/posts/${post.slug}`} key={post.id}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3>{post.title}</h3>
              {post.description && <p>{post.description}</p>}
            </div>
            <time dateTime={post.publishedAt || undefined}>{formatDate(post.publishedAt)}</time>
            <i>↗</i>
          </Link>
        ))}
      </div>
    </section>
  )
}

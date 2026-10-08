// fallow-ignore-file code-duplication -- these distinct home sections intentionally share a presentation pattern.
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import styles from '~/components/home/home.module.css';
import type { HomePost } from '~/components/home/types';
import { Link } from '~/i18n/navigation';
import { getDocumentPath } from '~/utilities/get-document-path';
import { getMediaUrl } from '~/utilities/get-media-url';

const formatYearRange = (posts: HomePost[]) => {
  const years = posts
    .map(({ publishedAt }) => (publishedAt ? new Date(publishedAt).getFullYear() : undefined))
    .filter((year): year is number => year !== undefined && !Number.isNaN(year))
    .sort();

  if (years.length === 0) return null;

  const oldestYear = years[0];
  const newestYear = years[years.length - 1];

  return oldestYear === newestYear ? String(oldestYear) : `${oldestYear} - ${newestYear}`;
};

export function WritingSection({
  kicker,
  posts,
  showAllLink = true,
}: {
  kicker?: string;
  posts: HomePost[];
  showAllLink?: boolean;
}) {
  const t = useTranslations('UI');
  const locale = useLocale();
  const formatPublishedAt = (date: string) =>
    new Intl.DateTimeFormat(locale === 'pt' ? 'pt-PT' : 'en', {
      month: 'short',
      timeZone: 'Europe/Lisbon',
      year: 'numeric',
    }).format(new Date(date));
  const yearRange = formatYearRange(posts);

  return (
    <section className={styles.writing} id="writing">
      <div className={styles.sectionIntro}>
        <div className={styles.sectionMeta}>
          <h2 className={styles.sectionTitle}>{kicker ?? t('latestPosts')}</h2>
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
          <Link
            className={styles.post}
            href={getDocumentPath({ collection: 'posts', slug: post.slug })}
            key={post.id}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            {post.cover && (
              <div className={styles.postVisual}>
                <Image
                  alt={post.cover.alt}
                  className={styles.postCover}
                  fill
                  sizes="(max-width: 768px) 80px, 112px"
                  src={getMediaUrl(post.cover.url)}
                />
              </div>
            )}
            <div className={styles.postCopy}>
              <h3>{post.title}</h3>
              {post.description && <p>{post.description}</p>}
            </div>
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>{formatPublishedAt(post.publishedAt)}</time>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}

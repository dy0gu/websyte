'use client';
import { useTranslations } from 'next-intl';
import type React from 'react';
import styles from '~/components/card/index.module.css';
import { Media } from '~/components/media';
import { Link } from '~/i18n/navigation';
import type { Post } from '~/payload-types';
import shared from '~/styles/shared.module.css';
import { cn } from '~/utilities/ui';
import { useClickableCard } from '~/utilities/use-clickable-card';

export type CardPostData = Pick<Post, 'id' | 'slug' | 'meta' | 'title'> & {
  doc?: { relationTo?: string };
};

export const Card: React.FC<{
  alignItems?: 'center';
  className?: string;
  doc?: CardPostData;
  relationTo?: 'posts';
  title?: string;
}> = (props) => {
  const t = useTranslations('UI');
  const { card, link } = useClickableCard({});
  const { className, doc, relationTo, title: titleFromProps } = props;

  const { slug, meta, title } = doc || {};
  const { description, image: metaImage } = meta || {};

  const titleToUse = titleFromProps || title;
  const sanitizedDescription = description?.replace(/\s/g, ' '); // replace non-breaking space with white space
  const href =
    doc?.doc?.relationTo === 'projects' ? '/projects' : `/${relationTo || 'posts'}/${slug}`;

  return (
    <article className={cn(styles.card, className)} ref={card.ref}>
      <div className={styles.media}>
        {!metaImage && <div>{t('noImage')}</div>}
        {metaImage && typeof metaImage !== 'string' && (
          <Media fill resource={metaImage} size="33vw" />
        )}
      </div>
      <div className={styles.content}>
        {titleToUse && (
          <div className={cn(shared.prose, styles.title)}>
            <h3>
              <Link className={styles.titleLink} href={href} ref={link.ref}>
                {titleToUse}
              </Link>
            </h3>
          </div>
        )}
        {description && (
          <div className={styles.description}>{description && <p>{sanitizedDescription}</p>}</div>
        )}
      </div>
    </article>
  );
};

import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical';
import clsx from 'clsx';
import type React from 'react';
import styles from '~/blocks/related-posts/component.module.css';
import { Card } from '~/components/card';
import { RichText } from '~/components/rich-text';
import type { Post } from '~/payload-types';

export type RelatedPostsProps = {
  className?: string;
  docs?: Post[];
  introContent?: DefaultTypedEditorState;
};

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { className, docs, introContent } = props;

  return (
    <div className={clsx(styles.root, className)}>
      {introContent && <RichText data={introContent} enableGutter={false} />}

      <div className={styles.grid}>
        {docs?.map((doc) => {
          if (typeof doc === 'string') return null;

          return <Card doc={doc} key={doc.id} relationTo="posts" />;
        })}
      </div>
    </div>
  );
};

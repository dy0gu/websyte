import type React from 'react';
import styles from '~/blocks/content/component.module.css';
import { CMSLink } from '~/components/cms-link';
import { RichText } from '~/components/rich-text';
import type { ContentBlock as ContentBlockProps } from '~/payload-types';
import shared from '~/styles/shared.module.css';
import { cn } from '~/utilities/ui';

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns } = props;

  return (
    <div className={cn(shared.container, styles.root)}>
      <div className={styles.grid}>
        {columns &&
          columns.length > 0 &&
          columns.map((col) => {
            const { enableLink, link, richText, size } = col;

            return (
              <div
                className={cn(styles.column, size && styles[size], {
                  [styles.partial]: size !== 'full',
                })}
                key={col.id ?? col.link?.label ?? col.size}
              >
                {richText && <RichText data={richText} enableGutter={false} />}

                {enableLink && <CMSLink {...link} />}
              </div>
            );
          })}
      </div>
    </div>
  );
};

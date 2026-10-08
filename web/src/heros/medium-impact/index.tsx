// fallow-ignore-file code-duplication -- hero variants intentionally render their local link layouts.
import type React from 'react';
import { CMSLink } from '~/components/cms-link';
import { Media } from '~/components/media';
import { RichText } from '~/components/rich-text';
import styles from '~/heros/medium-impact/index.module.css';
import type { Page } from '~/payload-types';
import shared from '~/styles/shared.module.css';
import { cn } from '~/utilities/ui';

export const MediumImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  return (
    <div>
      <div className={cn(shared.container, styles.intro)}>
        {richText && <RichText className={styles.richText} data={richText} enableGutter={false} />}

        {Array.isArray(links) && links.length > 0 && (
          <ul className={styles.links}>
            {links.map(({ id, link }) => {
              return (
                <li key={id ?? link.label}>
                  <CMSLink {...link} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className={shared.container}>
        {media && typeof media === 'object' && (
          <div>
            <Media className={styles.media} priority resource={media} />
            {media?.caption && (
              <div className={styles.caption}>
                <RichText data={media.caption} enableGutter={false} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

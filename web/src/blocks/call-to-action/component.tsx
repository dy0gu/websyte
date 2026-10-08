import type React from 'react';
import styles from '~/blocks/call-to-action/component.module.css';
import { CMSLink } from '~/components/cms-link';
import { RichText } from '~/components/rich-text';
import type { CallToActionBlock as CtaBlockProps } from '~/payload-types';
import shared from '~/styles/shared.module.css';

export const CallToActionBlock: React.FC<CtaBlockProps> = ({ links, richText }) => {
  return (
    <div className={shared.container}>
      <div className={styles.panel}>
        <div className={styles.content}>
          {richText && (
            <RichText className={styles.richText} data={richText} enableGutter={false} />
          )}
        </div>
        <div className={styles.links}>
          {(links || []).map(({ id, link }) => {
            return <CMSLink key={id ?? link.label} size="lg" {...link} />;
          })}
        </div>
      </div>
    </div>
  );
};

import type React from 'react'
import { CMSLink } from '@/components/cms-link'
import { Media } from '@/components/media'
import RichText from '@/components/rich-text'
import type { Page } from '@/payload-types'
import shared from '@/styles/shared.module.css'
import themeStyles from '@/styles/theme.module.css'
import { cn } from '@/utilities/ui'
import styles from './index.module.css'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  return (
    <div className={cn(styles.root, themeStyles.dark)} data-theme="dark">
      <div className={cn(shared.container, styles.contentContainer)}>
        <div className={styles.content}>
          {richText && (
            <RichText className={styles.richText} data={richText} enableGutter={false} />
          )}
          {Array.isArray(links) && links.length > 0 && (
            <ul className={styles.links}>
              {links.map(({ id, link }) => {
                return (
                  <li key={id || link.label}>
                    <CMSLink {...link} />
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
      <div className={styles.media}>
        {media && typeof media === 'object' && (
          <Media fill imgClassName={styles.image} priority resource={media} />
        )}
      </div>
    </div>
  )
}

'use client'
import { useHeaderTheme } from '@/providers/header-theme'
import React, { useEffect } from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/link'
import { Media } from '@/components/media'
import RichText from '@/components/rich-text'
import { cn } from '@/utilities/ui'
import shared from '@/styles/shared.module.css'
import styles from './index.module.css'
import themeStyles from '@/styles/theme.module.css'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  })

  return (
    <div className={cn(styles.root, themeStyles.dark)} data-theme="dark">
      <div className={cn(shared.container, styles.contentContainer)}>
        <div className={styles.content}>
          {richText && <RichText className={styles.richText} data={richText} enableGutter={false} />}
          {Array.isArray(links) && links.length > 0 && (
            <ul className={styles.links}>
              {links.map(({ link }, i) => {
                return (
                  <li key={i}>
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

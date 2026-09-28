import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/rich-text'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { CMSLink } from '../../components/cms-link'
import shared from '@/styles/shared.module.css'
import styles from './component.module.css'

export const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  const { columns } = props

  return (
    <div className={cn(shared.container, styles.root)}>
      <div className={styles.grid}>
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, link, richText, size } = col

            return (
              <div
                className={cn(styles.column, size && styles[size], {
                  [styles.partial]: size !== 'full',
                })}
                key={index}
              >
                {richText && <RichText data={richText} enableGutter={false} />}

                {enableLink && <CMSLink {...link} />}
              </div>
            )
          })}
      </div>
    </div>
  )
}

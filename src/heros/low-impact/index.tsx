import React from 'react'

import type { Page } from '@/payload-types'

import RichText from '@/components/rich-text'
import { cn } from '@/utilities/ui'
import shared from '@/styles/shared.module.css'
import styles from './index.module.css'

type LowImpactHeroType =
  | {
      children?: React.ReactNode
      richText?: never
    }
  | (Omit<Page['hero'], 'richText'> & {
      children?: never
      richText?: Page['hero']['richText']
    })

export const LowImpactHero: React.FC<LowImpactHeroType> = ({ children, richText }) => {
  return (
    <div className={cn(shared.container, styles.root)}>
      <div className={styles.content}>
        {children || (richText && <RichText data={richText} enableGutter={false} />)}
      </div>
    </div>
  )
}

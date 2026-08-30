import type { BannerBlock as BannerBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/rich-text'
import styles from './component.module.css'

type Props = {
  className?: string
} & BannerBlockProps

export const BannerBlock: React.FC<Props> = ({ className, content, style }) => {
  return (
    <div className={cn(styles.root, className)}>
      <div
        className={cn(styles.banner, {
          [styles.info]: style === 'info',
          [styles.error]: style === 'error',
          [styles.success]: style === 'success',
          [styles.warning]: style === 'warning',
        })}
      >
        <RichText data={content} enableGutter={false} enableProse={false} />
      </div>
    </div>
  )
}

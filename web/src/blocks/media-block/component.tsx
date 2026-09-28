import type { StaticImageData } from 'next/image'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/rich-text'

import type { MediaBlock as MediaBlockProps } from '@/payload-types'

import { Media } from '../../components/media'
import shared from '@/styles/shared.module.css'
import styles from './component.module.css'

type Props = MediaBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
}

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    media,
    staticImage,
    disableInnerContainer,
  } = props

  let caption
  if (media && typeof media === 'object') caption = media.caption

  return (
    <div
      className={cn(enableGutter && shared.container, className)}
    >
      {(media || staticImage) && (
        <Media
          imgClassName={cn(styles.image, imgClassName)}
          resource={media}
          src={staticImage}
        />
      )}
      {caption && (
        <div
          className={cn(styles.caption, !disableInnerContainer && shared.container, captionClassName)}
        >
          <RichText data={caption} enableGutter={false} />
        </div>
      )}
    </div>
  )
}

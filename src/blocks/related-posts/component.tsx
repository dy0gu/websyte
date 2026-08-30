import clsx from 'clsx'
import React from 'react'
import RichText from '@/components/rich-text'

import type { Post } from '@/payload-types'

import { Card } from '../../components/card'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import styles from './component.module.css'

export type RelatedPostsProps = {
  className?: string
  docs?: Post[]
  introContent?: DefaultTypedEditorState
}

export const RelatedPosts: React.FC<RelatedPostsProps> = (props) => {
  const { className, docs, introContent } = props

  return (
    <div className={clsx(styles.root, className)}>
      {introContent && <RichText data={introContent} enableGutter={false} />}

      <div className={styles.grid}>
        {docs?.map((doc, index) => {
          if (typeof doc === 'string') return null

          return <Card key={index} doc={doc} relationTo="posts" showCategories />
        })}
      </div>
    </div>
  )
}

import type React from 'react'

import { Card, type CardPostData } from '@/components/card'
import shared from '@/styles/shared.module.css'
import styles from './index.module.css'

export type Props = {
  posts: CardPostData[]
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts } = props

  return (
    <div className={shared.container}>
      <div>
        <div className={styles.grid}>
          {posts?.map((result) => {
            if (typeof result === 'object' && result !== null) {
              return (
                <div className={styles.item} key={result.id}>
                  <Card className={styles.card} doc={result} relationTo="posts" />
                </div>
              )
            }

            return null
          })}
        </div>
      </div>
    </div>
  )
}

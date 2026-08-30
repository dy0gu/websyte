import RichText from '@/components/rich-text'
import React from 'react'

import { Width } from '../width'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import styles from '../form.module.css'

export const Message: React.FC<{ message: DefaultTypedEditorState }> = ({ message }) => {
  return (
    <Width className={styles.message} width="100">
      {message && <RichText data={message} />}
    </Width>
  )
}

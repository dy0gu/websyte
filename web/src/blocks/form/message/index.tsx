import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type React from 'react'
import RichText from '@/components/rich-text'
import styles from '../form.module.css'
import { Width } from '../width'

export const Message: React.FC<{ message: DefaultTypedEditorState }> = ({ message }) => {
  return (
    <Width className={styles.message} width="100">
      {message && <RichText data={message} />}
    </Width>
  )
}

import type * as React from 'react'
import { cn } from '@/utilities/ui'
import styles from './textarea.module.css'

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  className,
  ...props
}) => {
  return <textarea data-slot="textarea" className={cn(styles.root, className)} {...props} />
}

export { Textarea }

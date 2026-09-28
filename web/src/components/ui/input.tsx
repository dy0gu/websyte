import type * as React from 'react'
import { cn } from '@/utilities/ui'
import styles from './input.module.css'

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className,
  type,
  ...props
}) => {
  return <input data-slot="input" className={cn(styles.root, className)} type={type} {...props} />
}

export { Input }

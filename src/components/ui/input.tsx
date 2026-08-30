import { cn } from '@/utilities/ui'
import * as React from 'react'
import styles from './controls.module.css'

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className,
  type,
  ...props
}) => {
  return (
    <input
      data-slot="input"
      className={cn(styles.control, styles.input, className)}
      type={type}
      {...props}
    />
  )
}

export { Input }

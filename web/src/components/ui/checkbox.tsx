'use client'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import type * as React from 'react'
import { cn } from '@/utilities/ui'
import styles from './checkbox.module.css'

const Checkbox: React.FC<React.ComponentProps<typeof CheckboxPrimitive.Root>> = ({
  className,
  ...props
}) => (
  <CheckboxPrimitive.Root data-slot="checkbox" className={cn(styles.root, className)} {...props}>
    <CheckboxPrimitive.Indicator data-slot="checkbox-indicator" className={styles.indicator}>
      <Check className={styles.icon} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
)

export { Checkbox }

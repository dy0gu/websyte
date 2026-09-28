'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import type * as React from 'react'
import { cn } from '@/utilities/ui'
import styles from './select.module.css'

const Select: React.FC<React.ComponentProps<typeof SelectPrimitive.Root>> = (props) => {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

const SelectGroup: React.FC<React.ComponentProps<typeof SelectPrimitive.Group>> = (props) => {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

const SelectValue: React.FC<React.ComponentProps<typeof SelectPrimitive.Value>> = (props) => {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

const SelectTrigger: React.FC<React.ComponentProps<typeof SelectPrimitive.Trigger>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(styles.trigger, className)}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className={styles.mutedIcon} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

const SelectContent: React.FC<React.ComponentProps<typeof SelectPrimitive.Content>> = ({
  children,
  className,
  position = 'popper',
  ...props
}) => {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(styles.content, position === 'popper' && styles.popper, className)}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(styles.viewport, position === 'popper' && styles.popperViewport)}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

const SelectLabel: React.FC<React.ComponentProps<typeof SelectPrimitive.Label>> = ({
  className,
  ...props
}) => {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(styles.selectLabel, className)}
      {...props}
    />
  )
}

const SelectItem: React.FC<React.ComponentProps<typeof SelectPrimitive.Item>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <SelectPrimitive.Item data-slot="select-item" className={cn(styles.item, className)} {...props}>
      <span className={styles.itemIndicator}>
        <SelectPrimitive.ItemIndicator>
          <Check />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

const SelectSeparator: React.FC<React.ComponentProps<typeof SelectPrimitive.Separator>> = ({
  className,
  ...props
}) => {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(styles.separator, className)}
      {...props}
    />
  )
}

const SelectScrollUpButton: React.FC<
  React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>
> = ({ className, ...props }) => {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(styles.scrollButton, className)}
      {...props}
    >
      <ChevronUp />
    </SelectPrimitive.ScrollUpButton>
  )
}

const SelectScrollDownButton: React.FC<
  React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>
> = ({ className, ...props }) => {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(styles.scrollButton, className)}
      {...props}
    >
      <ChevronDown />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}

'use client';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import styles from '~/components/ui/button.module.css';
import { cn } from '~/utilities/ui';

const buttonVariants = cva(styles.base, {
  defaultVariants: {
    size: 'default',
    variant: 'default',
  },
  variants: {
    size: {
      clear: null,
      default: styles.sizeDefault,
      icon: styles.icon,
      lg: styles.large,
      sm: styles.small,
    },
    variant: {
      default: styles.default,
      destructive: styles.destructive,
      ghost: styles.ghost,
      link: styles.link,
      outline: styles.outline,
      secondary: styles.secondary,
    },
  },
});

export interface ButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button: React.FC<ButtonProps> = ({ asChild = false, className, size, variant, ...props }) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={cn(buttonVariants({ className: className, size: size, variant: variant }))}
      data-slot="button"
      {...props}
    />
  );
};

export { Button, buttonVariants };

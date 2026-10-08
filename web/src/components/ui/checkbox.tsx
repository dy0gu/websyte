'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import type * as React from 'react';
import styles from '~/components/ui/checkbox.module.css';
import { cn } from '~/utilities/ui';

const Checkbox: React.FC<React.ComponentProps<typeof CheckboxPrimitive.Root>> = ({
  className,
  ...props
}) => (
  <CheckboxPrimitive.Root className={cn(styles.root, className)} data-slot="checkbox" {...props}>
    <CheckboxPrimitive.Indicator className={styles.indicator} data-slot="checkbox-indicator">
      <Check className={styles.icon} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
);

export { Checkbox };

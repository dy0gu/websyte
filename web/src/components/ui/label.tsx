'use client';

import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import styles from '~/components/ui/label.module.css';
import { cn } from '~/utilities/ui';

const labelVariants = cva(styles.root);

const Label: React.FC<
  { ref?: React.Ref<HTMLLabelElement> } & React.ComponentProps<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
> = ({ className, ref, ...props }) => (
  <LabelPrimitive.Root className={cn(labelVariants(), className)} ref={ref} {...props} />
);

export { Label };

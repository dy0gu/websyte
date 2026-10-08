import type * as React from 'react';
import styles from '~/components/ui/input.module.css';
import { cn } from '~/utilities/ui';

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className,
  type,
  ...props
}) => {
  return <input className={cn(styles.root, className)} data-slot="input" type={type} {...props} />;
};

export { Input };

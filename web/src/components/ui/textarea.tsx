import type * as React from 'react';
import styles from '~/components/ui/textarea.module.css';
import { cn } from '~/utilities/ui';

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  className,
  ...props
}) => {
  return <textarea className={cn(styles.root, className)} data-slot="textarea" {...props} />;
};

export { Textarea };

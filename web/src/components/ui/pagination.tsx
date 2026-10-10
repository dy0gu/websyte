import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type * as React from 'react';
import type { ButtonProps } from '~/components/ui/button';
import { buttonVariants } from '~/components/ui/button';
import styles from '~/components/ui/pagination.module.css';
import shared from '~/styles/shared.module.css';
import { cn } from '~/utilities/ui';

const PaginationRoot = ({ className, ...props }: React.ComponentProps<'nav'>) => {
  const t = useTranslations('UI');
  return <nav aria-label={t('pagination')} className={cn(styles.root, className)} {...props} />;
};

const PaginationContent: React.FC<
  { ref?: React.Ref<HTMLUListElement> } & React.HTMLAttributes<HTMLUListElement>
> = ({ className, ref, ...props }) => (
  <ul className={cn(styles.content, className)} ref={ref} {...props} />
);

const PaginationItem: React.FC<
  { ref?: React.Ref<HTMLLIElement> } & React.HTMLAttributes<HTMLLIElement>
> = ({ className, ref, ...props }) => <li className={className} ref={ref} {...props} />;

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'button'>;

const PaginationLink = ({ className, isActive, size = 'icon', ...props }: PaginationLinkProps) => (
  <button
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        size: size,
        variant: isActive ? 'outline' : 'ghost',
      }),
      className,
    )}
    {...props}
  />
);

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => {
  const t = useTranslations('UI');
  return (
    <PaginationLink
      aria-label={t('previousPage')}
      className={cn(styles.previous, className)}
      size="default"
      {...props}
    >
      <ChevronLeft className={styles.icon} />
      <span>{t('previous')}</span>
    </PaginationLink>
  );
};

const PaginationNext = ({ className, ...props }: React.ComponentProps<typeof PaginationLink>) => {
  const t = useTranslations('UI');
  return (
    <PaginationLink
      aria-label={t('nextPage')}
      className={cn(styles.next, className)}
      size="default"
      {...props}
    >
      <span>{t('next')}</span>
      <ChevronRight className={styles.icon} />
    </PaginationLink>
  );
};

const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<'span'>) => {
  const t = useTranslations('UI');
  return (
    <span aria-hidden className={cn(styles.ellipsis, className)} {...props}>
      <MoreHorizontal className={styles.icon} />
      <span className={shared.srOnly}>{t('morePages')}</span>
    </span>
  );
};

export {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationRoot,
};

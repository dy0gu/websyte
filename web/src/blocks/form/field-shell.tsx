import { useTranslations } from 'next-intl';
import type * as React from 'react';
import type { FieldErrorsImpl } from 'react-hook-form';
import { FieldError } from '~/blocks/form/error';
import { Width } from '~/blocks/form/width';
import { Label } from '~/components/ui/label';
import shared from '~/styles/shared.module.css';

type Props = {
  children: React.ReactNode;
  errors: Partial<FieldErrorsImpl>;
  label?: string;
  name?: string;
  required?: boolean;
  width?: number | string;
};

export function FieldShell({ children, errors, label, name, required, width }: Props) {
  const t = useTranslations('UI');
  const fieldName = name ?? '';

  return (
    <Width width={width}>
      <Label htmlFor={fieldName}>
        {label}
        {required && (
          <span className={shared.required}>
            * <span className={shared.srOnly}>{t('required')}</span>
          </span>
        )}
      </Label>
      {children}
      {errors[fieldName] && <FieldError name={fieldName} />}
    </Width>
  );
}

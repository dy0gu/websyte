import type { TextField } from '@payloadcms/plugin-form-builder/types';
import { useTranslations } from 'next-intl';
import type React from 'react';
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form';
import { FieldError } from '~/blocks/form/error';
import { Width } from '~/blocks/form/width';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import shared from '~/styles/shared.module.css';
export const NumberField: React.FC<
  TextField & {
    errors: Partial<FieldErrorsImpl>;
    register: UseFormRegister<FieldValues>;
  }
> = ({ name, defaultValue, errors, label, register, required, width }) => {
  const t = useTranslations('UI');
  return (
    <Width width={width}>
      <Label htmlFor={name}>
        {label}

        {required && (
          <span className={shared.required}>
            * <span className={shared.srOnly}>{t('required')}</span>
          </span>
        )}
      </Label>
      <Input
        defaultValue={defaultValue}
        id={name}
        type="number"
        {...register(name, { required: required })}
      />
      {errors[name] && <FieldError name={name} />}
    </Width>
  );
};

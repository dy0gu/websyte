import type { EmailField } from '@payloadcms/plugin-form-builder/types';
import { useTranslations } from 'next-intl';
import type React from 'react';
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form';
import { FieldShell } from '~/blocks/form/field-shell';
import { Input } from '~/components/ui/input';

export const Email: React.FC<
  EmailField & {
    errors: Partial<FieldErrorsImpl>;
    register: UseFormRegister<FieldValues>;
  }
> = ({ name, defaultValue, errors, label, register, required, width }) => {
  const t = useTranslations('UI');

  return (
    <FieldShell errors={errors} label={label} name={name} required={required} width={width}>
      <Input
        defaultValue={defaultValue}
        id={name}
        type="email"
        {...register(name, {
          pattern: { message: t('emailError'), value: /^\S[^\s@]*@\S+$/ },
          required: required,
        })}
      />
    </FieldShell>
  );
};

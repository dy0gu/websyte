import type { SelectField } from '@payloadcms/plugin-form-builder/types';
import { useTranslations } from 'next-intl';
import type React from 'react';
import type { Control, FieldErrorsImpl } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { FieldError } from '~/blocks/form/error';
import { Width } from '~/blocks/form/width';
import { Label } from '~/components/ui/label';
import {
  Select as SelectComponent,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import shared from '~/styles/shared.module.css';

export const Select: React.FC<
  SelectField & {
    control: Control;
    errors: Partial<FieldErrorsImpl>;
  }
> = ({ name, control, errors, label, options, required, width, defaultValue }) => {
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
      <Controller
        control={control}
        defaultValue={defaultValue}
        name={name}
        render={({ field: { onChange, value } }) => {
          const controlledValue = options.find((t) => t.value === value);

          return (
            <SelectComponent onValueChange={(val) => onChange(val)} value={controlledValue?.value}>
              <SelectTrigger id={name}>
                <SelectValue placeholder={label} />
              </SelectTrigger>
              <SelectContent>
                {options.map(({ label, value }) => {
                  return (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </SelectComponent>
          );
        }}
        rules={{ required: required }}
      />
      {errors[name] && <FieldError name={name} />}
    </Width>
  );
};

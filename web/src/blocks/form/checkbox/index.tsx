import type { CheckboxField } from '@payloadcms/plugin-form-builder/types';
import { useTranslations } from 'next-intl';
import type React from 'react';
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import { FieldError } from '~/blocks/form/error';
import styles from '~/blocks/form/form.module.css';
import { Width } from '~/blocks/form/width';
import { Checkbox as CheckboxUi } from '~/components/ui/checkbox';
import { Label } from '~/components/ui/label';
import shared from '~/styles/shared.module.css';

export const FormCheckbox: React.FC<
  CheckboxField & {
    errors: Partial<FieldErrorsImpl>;
    register: UseFormRegister<FieldValues>;
  }
> = ({ name, defaultValue, errors, label, register, required, width }) => {
  const props = register(name, { required: required });
  const { setValue } = useFormContext();

  const t = useTranslations('UI');
  return (
    <Width width={width}>
      <div className={styles.checkboxRow}>
        <CheckboxUi
          defaultChecked={defaultValue}
          id={name}
          {...props}
          onCheckedChange={(checked) => {
            setValue(props.name, checked);
          }}
        />
        <Label htmlFor={name}>
          {required && (
            <span className={shared.required}>
              * <span className={shared.srOnly}>{t('required')}</span>
            </span>
          )}
          {label}
        </Label>
      </div>
      {errors[name] && <FieldError name={name} />}
    </Width>
  );
};

import type { SelectField } from '@payloadcms/plugin-form-builder/types';
import type React from 'react';
import type { Control, FieldErrorsImpl } from 'react-hook-form';
import { ControlledSelectField } from '~/blocks/form/select-field';

export const FormSelect: React.FC<
  SelectField & {
    control: Control;
    errors: Partial<FieldErrorsImpl>;
  }
> = ({ name, control, errors, label, options, required, width, defaultValue }) => (
  <ControlledSelectField
    control={control}
    defaultValue={defaultValue}
    errors={errors}
    label={label}
    name={name}
    options={options}
    required={required}
    width={width}
  />
);

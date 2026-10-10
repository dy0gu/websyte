// fallow-ignore-file code-duplication -- separate form controls retain concise local input declarations.
import type { TextField } from '@payloadcms/plugin-form-builder/types';
import type React from 'react';
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form';
import { FieldShell } from '~/blocks/form/field-shell';
import { Input } from '~/components/ui/input';

export const NumberField: React.FC<
  TextField & {
    errors: Partial<FieldErrorsImpl>;
    register: UseFormRegister<FieldValues>;
  }
> = ({ name, defaultValue, errors, label, register, required, width }) => (
  <FieldShell errors={errors} label={label} name={name} required={required} width={width}>
    <Input
      defaultValue={defaultValue}
      id={name}
      type="number"
      {...register(name, { required: required })}
    />
  </FieldShell>
);

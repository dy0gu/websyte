import type { TextField } from '@payloadcms/plugin-form-builder/types';
import type React from 'react';
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form';
import { FieldShell } from '~/blocks/form/field-shell';
import { Textarea as TextAreaComponent } from '~/components/ui/textarea';

export const FormTextarea: React.FC<
  TextField & {
    errors: Partial<FieldErrorsImpl>;
    register: UseFormRegister<FieldValues>;
    rows?: number;
  }
> = ({ name, defaultValue, errors, label, register, required, rows = 3, width }) => (
  <FieldShell errors={errors} label={label} name={name} required={required} width={width}>
    <TextAreaComponent
      defaultValue={defaultValue}
      id={name}
      rows={rows}
      {...register(name, { required: required })}
    />
  </FieldShell>
);

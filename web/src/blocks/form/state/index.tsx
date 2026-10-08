import type { StateField } from '@payloadcms/plugin-form-builder/types';
import type React from 'react';
import type { Control, FieldErrorsImpl } from 'react-hook-form';
import { ControlledSelectField } from '~/blocks/form/select-field';
import { stateOptions } from '~/blocks/form/state/options';

export const State: React.FC<
  StateField & {
    control: Control;
    errors: Partial<FieldErrorsImpl>;
  }
> = ({ name, control, errors, label, required, width }) => (
  <ControlledSelectField
    control={control}
    errors={errors}
    label={label}
    name={name}
    options={stateOptions}
    required={required}
    width={width}
  />
);

import type { CountryField } from '@payloadcms/plugin-form-builder/types';
import type React from 'react';
import type { Control, FieldErrorsImpl } from 'react-hook-form';
import { countryOptions } from '~/blocks/form/country/options';
import { ControlledSelectField } from '~/blocks/form/select-field';

export const Country: React.FC<
  CountryField & {
    control: Control;
    errors: Partial<FieldErrorsImpl>;
  }
> = ({ name, control, errors, label, required, width }) => (
  <ControlledSelectField
    control={control}
    errors={errors}
    label={label}
    name={name}
    options={countryOptions}
    required={required}
    width={width}
  />
);

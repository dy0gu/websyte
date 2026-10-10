import type { Control, FieldErrorsImpl } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { FieldShell } from '~/blocks/form/field-shell';
import {
  Select as SelectComponent,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

type Option = { label: string; value: string };

type Props = {
  control: Control;
  defaultValue?: string;
  errors: Partial<FieldErrorsImpl>;
  label?: string;
  name?: string;
  options: Option[];
  required?: boolean;
  width?: number | string;
};

export function ControlledSelectField({
  control,
  defaultValue = '',
  errors,
  label,
  name,
  options,
  required,
  width,
}: Props) {
  const fieldName = name ?? '';
  const fieldLabel = label ?? '';

  return (
    <FieldShell
      errors={errors}
      label={fieldLabel}
      name={fieldName}
      required={required}
      width={width}
    >
      <Controller
        control={control}
        defaultValue={defaultValue}
        name={fieldName}
        render={({ field: { onChange, value } }) => (
          <SelectComponent
            onValueChange={onChange}
            value={options.find((option) => option.value === value)?.value}
          >
            <SelectTrigger id={fieldName}>
              <SelectValue placeholder={fieldLabel} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectComponent>
        )}
        rules={{ required: required }}
      />
    </FieldShell>
  );
}

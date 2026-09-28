import type { TextField } from '@payloadcms/plugin-form-builder/types'
import { useTranslations } from 'next-intl'
import type React from 'react'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Textarea as TextAreaComponent } from '@/components/ui/textarea'
import shared from '@/styles/shared.module.css'
import { FieldError } from '../error'
import { Width } from '../width'

export const Textarea: React.FC<
  TextField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
    rows?: number
  }
> = ({ name, defaultValue, errors, label, register, required, rows = 3, width }) => {
  const t = useTranslations('UI')
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

      <TextAreaComponent
        defaultValue={defaultValue}
        id={name}
        rows={rows}
        {...register(name, { required: required })}
      />

      {errors[name] && <FieldError name={name} />}
    </Width>
  )
}

import type { EmailField } from '@payloadcms/plugin-form-builder/types'
import { useTranslations } from 'next-intl'
import type React from 'react'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import shared from '@/styles/shared.module.css'
import { FieldError } from '../error'
import { Width } from '../width'

export const Email: React.FC<
  EmailField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
  }
> = ({ name, defaultValue, errors, label, register, required, width }) => {
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
      <Input
        defaultValue={defaultValue}
        id={name}
        type="email"
        {...register(name, {
          pattern: { value: /^\S[^\s@]*@\S+$/, message: t('emailError') },
          required,
        })}
      />

      {errors[name] && <FieldError name={name} />}
    </Width>
  )
}

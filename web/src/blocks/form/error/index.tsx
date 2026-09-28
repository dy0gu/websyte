'use client'
import { useTranslations } from 'next-intl'

import { useFormContext } from 'react-hook-form'
import styles from '../form.module.css'

export const FieldError = ({ name }: { name: string }) => {
  const t = useTranslations('UI')
  const {
    formState: { errors },
  } = useFormContext()
  return (
    <div className={styles.error}>{(errors[name]?.message as string) || t('requiredError')}</div>
  )
}

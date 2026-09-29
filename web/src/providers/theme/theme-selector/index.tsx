'use client'
import { useTranslations } from 'next-intl'
import type React from 'react'
import { useTheme } from '..'
import { themeIsValid } from '../types'

export const ThemeSelector: React.FC = () => {
  const t = useTranslations('UI')
  const { setTheme, preference, isPending, saveFailed } = useTheme()

  const onThemeChange = (value: string) => {
    if (value === 'auto' || themeIsValid(value)) setTheme(value)
  }

  return (
    <>
      <select
        aria-label={t('selectTheme')}
        disabled={isPending}
        aria-busy={isPending}
        value={preference}
        onChange={(event) => onThemeChange(event.target.value)}
      >
        <option value="auto">{t('auto')}</option>
        <option value="light">{t('light')}</option>
        <option value="dark">{t('dark')}</option>
      </select>
      {saveFailed && <span role="alert">{t('themeSaveError')}</span>}
    </>
  )
}

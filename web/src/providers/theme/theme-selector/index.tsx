'use client'
import { useTranslations } from 'next-intl'
import type React from 'react'
import { useTheme } from '..'
import { themeIsValid } from '../types'

export const ThemeSelector: React.FC = () => {
  const t = useTranslations('UI')
  const { setTheme, preference } = useTheme()
  const value = preference === undefined ? '' : (preference ?? 'auto')

  const onThemeChange = (value: string) => {
    if (value === 'auto') setTheme(null)
    else if (themeIsValid(value)) setTheme(value)
  }

  return (
    <select
      aria-label={t('selectTheme')}
      value={value}
      onChange={(event) => onThemeChange(event.target.value)}
    >
      <option value="" disabled hidden>
        {t('theme')}
      </option>
      <option value="auto">{t('auto')}</option>
      <option value="light">{t('light')}</option>
      <option value="dark">{t('dark')}</option>
    </select>
  )
}

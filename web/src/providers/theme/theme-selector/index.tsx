'use client'
import { useTranslations } from 'next-intl'
import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTheme } from '..'
import styles from './index.module.css'
import type { Theme } from './types'
import { themeLocalStorageKey } from './types'

export const ThemeSelector: React.FC = () => {
  const t = useTranslations('UI')
  const { setTheme } = useTheme()
  const [value, setValue] = useState('')

  const onThemeChange = (themeToSet: Theme & 'auto') => {
    if (themeToSet === 'auto') {
      setTheme(null)
      setValue('auto')
    } else {
      setTheme(themeToSet)
      setValue(themeToSet)
    }
  }

  React.useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    setValue(preference ?? 'auto')
  }, [])

  return (
    <Select onValueChange={onThemeChange} value={value}>
      <SelectTrigger aria-label={t('selectTheme')} className={styles.trigger}>
        <SelectValue placeholder={t('theme')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="auto">{t('auto')}</SelectItem>
        <SelectItem value="light">{t('light')}</SelectItem>
        <SelectItem value="dark">{t('dark')}</SelectItem>
      </SelectContent>
    </Select>
  )
}

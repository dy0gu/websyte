'use client'
import { useLocale, useTranslations } from 'next-intl'
import { type Locale, localeLabels, locales } from '@/i18n/config'
import { usePathname, useRouter } from '@/i18n/navigation'

export function LanguageSwitcher() {
  const locale = useLocale()
  const t = useTranslations('UI')
  const pathname = usePathname()
  const router = useRouter()
  return (
    <select
      aria-label={t('language')}
      value={locale}
      onChange={(event) => {
        router.replace(`${pathname}${window.location.search}${window.location.hash}`, {
          locale: event.target.value as Locale,
        })
      }}
    >
      {locales.map((value) => (
        <option key={value} value={value} lang={value}>
          {localeLabels[value]}
        </option>
      ))}
    </select>
  )
}

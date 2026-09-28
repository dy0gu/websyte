import type { Metadata } from 'next'
import { type Locale, locales, localizedPath } from './config'

export function languageAlternates(path: string, available: readonly string[] = locales) {
  return Object.fromEntries(
    locales
      .filter((locale) => available.includes(locale))
      .map((locale) => [locale, localizedPath(path, locale)]),
  )
}

export function localizedMetadata(
  path: string,
  locale: Locale,
  available: readonly string[] = locales,
): Metadata {
  return {
    alternates: {
      canonical: localizedPath(path, locale),
      languages: languageAlternates(path, available),
    },
    ...(!available.includes(locale) ? { robots: { index: false, follow: true } } : {}),
  }
}

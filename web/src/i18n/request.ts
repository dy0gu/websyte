import { notFound } from 'next/navigation'
import { locale as rootLocale } from 'next/root-params'
import { getRequestConfig } from 'next-intl/server'
import { isLocale } from './config'

export default getRequestConfig(async ({ locale: explicitLocale }) => {
  const value = explicitLocale ?? (await rootLocale())
  if (!value || !isLocale(value)) notFound()
  return {
    locale: value,
    timeZone: 'Europe/Lisbon',
    messages: (await import(`./messages/${value}.json`)).default,
  }
})

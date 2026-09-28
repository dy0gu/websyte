import type { Field } from 'payload'
import { localeLabels, locales } from '@/i18n/config'

/** Editorial readiness is separate from Payload's shared document publication status. */
export const translatedLocalesField: Field = {
  name: 'translatedLocales',
  type: 'select',
  hasMany: true,
  defaultValue: ['en'],
  options: locales.map((value) => ({ value, label: localeLabels[value] })),
  admin: {
    position: 'sidebar',
    description:
      'Languages with a complete, reviewed translation. Only these appear in search-engine language alternatives and the sitemap. Other languages may display English fallback content.',
  },
}

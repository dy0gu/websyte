import type { Field } from 'payload';
import { localeLabels, locales } from '~/i18n/config';

/** Editorial readiness is separate from Payload's shared document publication status. */
export const translatedLocalesField: Field = {
  admin: {
    description:
      'Languages with a complete, reviewed translation. Only these appear in search-engine language alternatives and the sitemap. Other languages may display English fallback content.',
    position: 'sidebar',
  },
  defaultValue: ['en'],
  hasMany: true,
  name: 'translatedLocales',
  options: locales.map((value) => ({ label: localeLabels[value], value: value })),
  type: 'select',
};

import { defineRouting } from 'next-intl/routing';
import { defaultLocale, locales } from '~/i18n/config';
export const routing = defineRouting({
  defaultLocale: defaultLocale,
  localeDetection: true,
  localePrefix: 'always',
  locales: locales,
});

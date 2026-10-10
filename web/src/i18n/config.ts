export const locales = ['en', 'pt'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
export const localeCookieName = 'site-locale';
export const localeCookieMaxAge = 60 * 60 * 24 * 365;
export const localeLabels = { en: 'English', pt: 'Português' } as const;

export const isLocale = (value: string): value is Locale =>
  locales.some((locale) => locale === value);

export const parseLocale = (value: unknown): Locale =>
  typeof value === 'string' && isLocale(value) ? value : defaultLocale;

/** Public routes are locale-independent; the locale is selected by cookie. */
export const localizedPath = (path: string, _locale: Locale): string => path;

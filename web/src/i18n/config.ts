export const locales = ['en', 'pt'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
export const localeLabels = { en: 'English', pt: 'Português' } as const;
export const isLocale = (value: string): value is Locale =>
  locales.some((locale) => locale === value);

/** Prefix public URLs only. Preserve assets, admin/API routes, and external URLs. */
export function localizedPath(path: string, locale: Locale): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  if (/^\/(?:admin|api|_next|next)(?:\/|$|[?#])/.test(path)) return path;
  if (/^\/(?:en|pt)(?:\/|$|[?#])/.test(path) || /\.[^/]+$/.test(path.split(/[?#]/)[0])) return path;
  return `/${locale}${path === '/' ? '' : path}`;
}

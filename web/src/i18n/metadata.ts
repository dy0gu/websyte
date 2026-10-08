import type { Metadata } from 'next';
import { type Locale, locales, localizedPath } from '~/i18n/config';
import { withSiteTitle } from '~/utilities/site';

export function languageAlternates(path: string, available: readonly string[] = locales) {
  return Object.fromEntries(
    locales
      .filter((locale) => available.includes(locale))
      .map((locale) => [locale, localizedPath(path, locale)]),
  );
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
    ...(!available.includes(locale) ? { robots: { follow: true, index: false } } : {}),
  };
}

type LocalizedPageMetadataArgs = {
  path: string;
  locale: Locale;
  title?: string | null;
  description?: string;
  robots?: Metadata['robots'];
};

export function localizedPageMetadata({
  path,
  locale,
  title,
  description,
  robots,
}: LocalizedPageMetadataArgs): Metadata {
  return {
    ...localizedMetadata(path, locale),
    ...(description ? { description: description } : {}),
    ...(robots ? { robots: robots } : {}),
    title: withSiteTitle(title),
  };
}

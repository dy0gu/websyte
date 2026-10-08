import type { Metadata } from 'next';
import type { Locale } from '~/i18n/config';
import { withSiteTitle } from '~/utilities/site';

export function localizedMetadata(
  path: string,
  locale: Locale,
  available: readonly string[],
): Metadata {
  return {
    alternates: { canonical: path },
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
    ...localizedMetadata(path, locale, [locale]),
    ...(description ? { description: description } : {}),
    ...(robots ? { robots: robots } : {}),
    title: withSiteTitle(title),
  };
}

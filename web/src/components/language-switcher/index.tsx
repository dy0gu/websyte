'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { isLocale, localeLabels, locales } from '~/i18n/config';
import { usePathname, useRouter } from '~/i18n/navigation';

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations('UI');
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const changeLocale = (nextLocale: string) => {
    if (!isLocale(nextLocale) || nextLocale === locale) return;

    startTransition(() => {
      router.replace(
        {
          pathname: pathname,
          query: Object.fromEntries(new URLSearchParams(window.location.search).entries()),
        },
        { locale: nextLocale, scroll: false },
      );
    });
  };

  return (
    <select
      aria-busy={isPending}
      aria-label={t('language')}
      disabled={isPending}
      onChange={(event) => changeLocale(event.target.value)}
      value={locale}
    >
      {locales.map((value) => (
        <option key={value} lang={value} value={value}>
          {localeLabels[value]}
        </option>
      ))}
    </select>
  );
}

'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { saveLocale } from '~/i18n/client';
import { isLocale, localeLabels, locales } from '~/i18n/config';
import { useRouter } from '~/i18n/navigation';
import { useTheme } from '~/providers/theme';

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations('UI');
  const router = useRouter();
  const { isPending: isThemePending, waitForThemeSave } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState(locale);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setSelectedLocale(locale);
  }, [locale]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const changeLocale = async (nextLocale: string) => {
    if (!isLocale(nextLocale) || nextLocale === locale) return;

    setIsSaving(true);
    setSelectedLocale(nextLocale);
    try {
      await waitForThemeSave();
      await saveLocale(nextLocale);
      router.refresh();
    } catch {
      setSelectedLocale(locale);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <select
      aria-busy={!isHydrated || isSaving || isThemePending}
      aria-label={t('language')}
      disabled={!isHydrated || isSaving || isThemePending}
      onChange={(event) => changeLocale(event.target.value)}
      value={selectedLocale}
    >
      {locales.map((value) => (
        <option key={value} lang={value} value={value}>
          {localeLabels[value]}
        </option>
      ))}
    </select>
  );
}

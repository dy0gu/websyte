'use client';

import { useTranslations } from 'next-intl';
import type React from 'react';
import { useEffect, useState, useSyncExternalStore } from 'react';
import type { Theme } from '~/providers/theme/types';
import { useTheme } from '..';

const getSystemTheme = (): Theme =>
  window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const subscribeToSystemTheme = (onStoreChange: () => void) => {
  const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
  if (!mediaQuery) return () => {};

  mediaQuery.addEventListener('change', onStoreChange);
  return () => mediaQuery.removeEventListener('change', onStoreChange);
};

const getServerTheme = (): Theme => 'light';

export const ThemeSelector: React.FC = () => {
  const t = useTranslations('UI');
  const { setTheme, preference, isPending, saveFailed } = useTheme();
  const [isHydrated, setIsHydrated] = useState(false);
  const systemTheme = useSyncExternalStore(subscribeToSystemTheme, getSystemTheme, getServerTheme);

  useEffect(() => {
    setIsHydrated(true);
  }, []);
  const selectedTheme = preference === 'auto' ? systemTheme : preference;

  return (
    <>
      <select
        aria-busy={isPending}
        aria-label={t('selectTheme')}
        disabled={!isHydrated || isPending}
        onChange={(event) => setTheme(event.target.value as Theme)}
        value={selectedTheme}
      >
        <option value="light">{t('light')}</option>
        <option value="dark">{t('dark')}</option>
      </select>
      {saveFailed && <span role="alert">{t('themeSaveError')}</span>}
    </>
  );
};

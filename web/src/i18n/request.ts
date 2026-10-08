import { notFound } from 'next/navigation';
import { locale as rootLocale } from 'next/root-params';
import { getRequestConfig } from 'next-intl/server';
import { isLocale } from '~/i18n/config';

export default getRequestConfig(async ({ locale: explicitLocale }) => {
  const value = explicitLocale ?? (await rootLocale());
  if (!value || !isLocale(value)) notFound();
  return {
    locale: value,
    messages: (await import(`./messages/${value}.json`)).default,
    timeZone: 'Europe/Lisbon',
  };
});

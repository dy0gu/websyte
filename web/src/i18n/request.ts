import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';
import { localeCookieName, parseLocale } from '~/i18n/config';

export default getRequestConfig(async () => {
  const locale = parseLocale((await cookies()).get(localeCookieName)?.value);
  return {
    locale: locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: 'Europe/Lisbon',
  };
});

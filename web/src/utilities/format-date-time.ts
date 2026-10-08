export const formatDateTime = (timestamp: string, locale = 'en'): string =>
  new Intl.DateTimeFormat(locale === 'pt' ? 'pt-PT' : locale, {
    day: 'numeric',
    month: 'long',
    timeZone: 'Europe/Lisbon',
    year: 'numeric',
  }).format(new Date(timestamp));

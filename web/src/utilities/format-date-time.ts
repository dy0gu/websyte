export const formatDateTime = (timestamp: string, locale = 'en'): string =>
  new Intl.DateTimeFormat(locale === 'pt' ? 'pt-PT' : locale, {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Lisbon',
  }).format(new Date(timestamp))

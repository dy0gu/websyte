import type { Locale } from '~/i18n/config';

export async function saveLocale(locale: Locale): Promise<void> {
  const response = await fetch('/api/locale', {
    body: JSON.stringify({ locale: locale }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  });
  if (!response.ok) throw new Error('Could not save locale');
}

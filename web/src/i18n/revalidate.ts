import { revalidatePath } from 'next/cache.js';
import { locales, localizedPath } from '~/i18n/config';
export function revalidateLocalizedPath(path: string, type?: 'page' | 'layout') {
  for (const locale of locales) revalidatePath(localizedPath(path, locale), type);
}

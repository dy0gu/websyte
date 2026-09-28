import { revalidatePath } from 'next/cache'
import { locales, localizedPath } from './config'
export function revalidateLocalizedPath(path: string, type?: 'page' | 'layout') {
  for (const locale of locales) revalidatePath(localizedPath(path, locale), type)
}

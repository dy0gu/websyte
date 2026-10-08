import { revalidatePath } from 'next/cache.js';

export function revalidateLocalizedPath(path: string, type?: 'page' | 'layout') {
  revalidatePath(path, type);
}

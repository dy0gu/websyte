import { revalidatePath, revalidateTag } from 'next/cache.js';
import { env } from '$/env';

const isMissingStaticGenerationStore = (error: unknown): boolean =>
  error instanceof Error && error.message.includes('static generation store missing');

const revalidate = (callback: () => void): void => {
  try {
    callback();
  } catch (error) {
    if (env.NODE_ENV === 'test' && isMissingStaticGenerationStore(error)) return;
    throw error;
  }
};

export function revalidateLocalizedPath(path: string, type?: 'page' | 'layout') {
  revalidate(() => revalidatePath(path, type));
}

export function revalidateTagWhenAvailable(tag: string): void {
  revalidate(() => revalidateTag(tag, 'max'));
}

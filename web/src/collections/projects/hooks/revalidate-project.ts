import { revalidateTag } from 'next/cache.js';
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload';
import { revalidateLocalizedPath } from '~/i18n/revalidate';

export const revalidateProject: CollectionAfterChangeHook = ({ doc, previousDoc, req }) => {
  if (req.context.disableRevalidate) return doc;

  if (doc._status === 'published' || previousDoc?._status === 'published') {
    req.payload.logger.info('Revalidating portfolio project on the homepage');
    revalidateLocalizedPath('/');
    revalidateLocalizedPath('/projects');
    revalidateTag('projects-sitemap', 'max');
  }

  return doc;
};

export const revalidateProjectDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  if (!req.context.disableRevalidate) {
    revalidateLocalizedPath('/');
    revalidateLocalizedPath('/projects');
    revalidateTag('projects-sitemap', 'max');
  }
  return doc;
};

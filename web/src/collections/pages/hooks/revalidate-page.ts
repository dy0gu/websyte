import { revalidateTag } from 'next/cache.js';
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload';
import { revalidateLocalizedPath } from '~/i18n/revalidate';
import type { Page } from '~/payload-types';
import { getDocumentPath } from '~/utilities/get-document-path';

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = getDocumentPath({ collection: 'pages', slug: doc.slug });

      payload.logger.info(`Revalidating page at path: ${path}`);

      revalidateLocalizedPath(path);
      revalidateTag('pages-sitemap', 'max');
    }

    // If the page was previously published, we need to revalidate the old path
    if (
      previousDoc?._status === 'published' &&
      (doc._status !== 'published' || previousDoc.slug !== doc.slug)
    ) {
      const oldPath = getDocumentPath({ collection: 'pages', slug: previousDoc.slug });

      payload.logger.info(`Revalidating old page at path: ${oldPath}`);

      revalidateLocalizedPath(oldPath);
      revalidateTag('pages-sitemap', 'max');
    }
  }
  return doc;
};

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = getDocumentPath({ collection: 'pages', slug: doc.slug });
    revalidateLocalizedPath(path);
    revalidateTag('pages-sitemap', 'max');
  }

  return doc;
};

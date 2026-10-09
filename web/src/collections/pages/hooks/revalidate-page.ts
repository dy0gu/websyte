import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload';
import { revalidateLocalizedPath, revalidateTagWhenAvailable } from '~/i18n/revalidate';
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
      revalidateTagWhenAvailable('pages-sitemap');
    }

    // If the page was previously published, then the old path should be revalidated
    if (
      previousDoc?._status === 'published' &&
      (doc._status !== 'published' || previousDoc.slug !== doc.slug)
    ) {
      const oldPath = getDocumentPath({ collection: 'pages', slug: previousDoc.slug });

      payload.logger.info(`Revalidating old page at path: ${oldPath}`);

      revalidateLocalizedPath(oldPath);
      revalidateTagWhenAvailable('pages-sitemap');
    }
  }
  return doc;
};

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = getDocumentPath({ collection: 'pages', slug: doc.slug });
    revalidateLocalizedPath(path);
    revalidateTagWhenAvailable('pages-sitemap');
  }

  return doc;
};

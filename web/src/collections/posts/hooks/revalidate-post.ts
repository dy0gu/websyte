import { revalidateTag } from 'next/cache.js';
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload';
import { revalidateLocalizedPath } from '~/i18n/revalidate';
import type { Post } from '~/payload-types';
import { getDocumentPath } from '~/utilities/get-document-path';

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = getDocumentPath({ collection: 'posts', slug: doc.slug });

      payload.logger.info(`Revalidating post at path: ${path}`);

      revalidateLocalizedPath(path);
      revalidateLocalizedPath('/');
      revalidateLocalizedPath('/posts');
      revalidateLocalizedPath('/posts/page/[page-number]', 'page');
      revalidateTag('posts-sitemap', 'max');
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = getDocumentPath({ collection: 'posts', slug: previousDoc.slug });

      payload.logger.info(`Revalidating old post at path: ${oldPath}`);

      revalidateLocalizedPath(oldPath);
      revalidateLocalizedPath('/');
      revalidateLocalizedPath('/posts');
      revalidateLocalizedPath('/posts/page/[page-number]', 'page');
      revalidateTag('posts-sitemap', 'max');
    }
  }
  return doc;
};

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const path = getDocumentPath({ collection: 'posts', slug: doc.slug });

    revalidateLocalizedPath(path);
    revalidateLocalizedPath('/');
    revalidateLocalizedPath('/posts');
    revalidateLocalizedPath('/posts/page/[page-number]', 'page');
    revalidateTag('posts-sitemap', 'max');
  }

  return doc;
};

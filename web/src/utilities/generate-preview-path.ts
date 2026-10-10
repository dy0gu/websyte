import type { CollectionSlug, PayloadRequest } from 'payload';
import { env } from '$/env';
import type { PreviewSearchParams } from '~/app/(frontend)/next/preview/route';
import { defaultLocale, isLocale, localizedPath } from '~/i18n/config';
import { getDocumentPath } from '~/utilities/get-document-path';

type Props = {
  collection: Extract<CollectionSlug, 'pages' | 'posts'>;
  slug?: string | null;
  req: PayloadRequest;
};

export const generatePreviewPath = ({ collection, slug, req }: Props) => {
  if (slug === undefined || slug === null) {
    return null;
  }

  // Encode to support slugs with special characters
  const encodedSlug = encodeURIComponent(slug);

  const locale = req.locale && isLocale(req.locale) ? req.locale : defaultLocale;
  const publicPath = getDocumentPath({ collection: collection, slug: encodedSlug });
  const encodedParams = new URLSearchParams({
    path: localizedPath(publicPath, locale),
    previewSecret: env.PREVIEW_SECRET,
  } satisfies PreviewSearchParams);

  const url = `/next/preview?${encodedParams.toString()}`;

  return url;
};

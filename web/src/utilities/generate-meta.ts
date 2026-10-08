import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { localizedPath } from '~/i18n/config';
import { localizedMetadata } from '~/i18n/metadata';

import type { Config, Media, Page, Post } from '~/payload-types';
import { getServerSideURL } from '~/utilities/get-server-url';
import { mergeOpenGraph } from '~/utilities/merge-open-graph';
import { withSiteTitle } from '~/utilities/site';

const getImageUrl = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL();

  let url = `${serverUrl}/open-graph.webp`;

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url;

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url;
  }

  return url;
};

export const generateMeta = async (args: {
  path: string;
  doc: Partial<Page> | Partial<Post> | null;
}): Promise<Metadata> => {
  const { doc, path } = args;
  const locale = await getLocale();

  const ogImage = getImageUrl(doc?.meta?.image);

  const title = withSiteTitle(doc?.meta?.title);

  return {
    ...localizedMetadata(path, locale, doc?.translatedLocales ?? ['en']),
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title: title,
      url: localizedPath(path, locale),
    }),
    title: title,
  };
};

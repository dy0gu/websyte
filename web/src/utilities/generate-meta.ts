import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { localizedPath } from '@/i18n/config'
import { localizedMetadata } from '@/i18n/metadata'

import type { Config, Media, Page, Post } from '../payload-types'
import { getServerSideURL } from './get-url'
import { mergeOpenGraph } from './merge-open-graph'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/open-graph.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  path: string
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc, path } = args
  const locale = await getLocale()

  const ogImage = getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title ? doc?.meta?.title + ' | Diogo Simões' : 'Diogo Simões'

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
      title,
      url: localizedPath(path, locale),
    }),
    title,
  }
}

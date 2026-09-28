import type { CollectionSlug, PayloadRequest } from 'payload'
import type { PreviewSearchParams } from '@/app/(frontend)/next/preview/route'
import { defaultLocale, isLocale, localizedPath } from '@/i18n/config'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: '/posts',
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug, req }: Props) => {
  if (slug === undefined || slug === null) {
    return null
  }

  // Encode to support slugs with special characters
  const encodedSlug = encodeURIComponent(slug)

  const locale = req.locale && isLocale(req.locale) ? req.locale : defaultLocale
  const publicPath =
    collection === 'pages' && slug === 'home'
      ? '/'
      : `${collectionPrefixMap[collection]}/${encodedSlug}`
  const encodedParams = new URLSearchParams({
    path: localizedPath(publicPath, locale),
    previewSecret: process.env.PREVIEW_SECRET || '',
  } satisfies PreviewSearchParams)

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}

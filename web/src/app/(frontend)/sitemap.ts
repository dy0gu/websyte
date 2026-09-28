import config from '@payload-config'
import type { MetadataRoute } from 'next'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import { locales, localizedPath } from '@/i18n/config'
import { languageAlternates } from '@/i18n/metadata'
import { getServerSideURL } from '@/utilities/get-url'

const getSitemap = unstable_cache(
  async (): Promise<MetadataRoute.Sitemap> => {
    const payload = await getPayload({ config })
    const siteURL = getServerSideURL().replace(/\/$/, '')
    const entries: MetadataRoute.Sitemap = []
    const append = (path: string, available: readonly string[], lastModified?: string) => {
      const languages = Object.fromEntries(
        Object.entries(languageAlternates(path, available)).map(([key, value]) => [
          key,
          `${siteURL}${value}`,
        ]),
      )
      for (const locale of locales.filter((value) => available.includes(value))) {
        entries.push({
          url: `${siteURL}${localizedPath(path, locale)}`,
          alternates: { languages },
          ...(lastModified ? { lastModified } : {}),
        })
      }
    }
    for (const path of ['/', '/posts', '/projects']) append(path, locales)
    for (const collection of ['pages', 'posts'] as const) {
      const result = await payload.find({
        collection,
        locale: 'en',
        overrideAccess: false,
        draft: false,
        depth: 0,
        pagination: false,
        limit: 0,
        select: { slug: true, updatedAt: true, translatedLocales: true },
      })
      for (const doc of result.docs) {
        if (!doc.slug || (collection === 'pages' && doc.slug === 'home')) continue
        append(
          `${collection === 'posts' ? '/posts' : ''}/${doc.slug}`,
          doc.translatedLocales ?? ['en'],
          doc.updatedAt,
        )
      }
    }
    return entries
  },
  ['sitemap-i18n'],
  { tags: ['pages-sitemap', 'posts-sitemap', 'projects-sitemap'] },
)

export default function sitemap() {
  return getSitemap()
}

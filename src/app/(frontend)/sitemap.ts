import config from '@payload-config'
import type { MetadataRoute } from 'next'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import { getServerSideURL } from '@/utilities/get-url'

const getSitemap = unstable_cache(
  async (): Promise<MetadataRoute.Sitemap> => {
    const payload = await getPayload({ config })
    const siteURL = getServerSideURL().replace(/\/$/, '')

    const [pages, posts] = await Promise.all([
      payload.find({
        collection: 'pages',
        overrideAccess: false,
        draft: false,
        depth: 0,
        limit: 1000,
        pagination: false,
        where: {
          _status: {
            equals: 'published',
          },
        },
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
      payload.find({
        collection: 'posts',
        overrideAccess: false,
        draft: false,
        depth: 0,
        limit: 1000,
        pagination: false,
        where: {
          _status: {
            equals: 'published',
          },
        },
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
    ])

    const lastModified = new Date().toISOString()

    return [
      {
        url: `${siteURL}/search`,
        lastModified,
      },
      {
        url: `${siteURL}/posts`,
        lastModified,
      },
      ...pages.docs
        .filter((page) => Boolean(page.slug))
        .map((page) => ({
          url: page.slug === 'home' ? `${siteURL}/` : `${siteURL}/${page.slug}`,
          lastModified: page.updatedAt || lastModified,
        })),
      ...posts.docs
        .filter((post) => Boolean(post.slug))
        .map((post) => ({
          url: `${siteURL}/posts/${post.slug}`,
          lastModified: post.updatedAt || lastModified,
        })),
    ]
  },
  ['sitemap'],
  {
    tags: ['pages-sitemap', 'posts-sitemap'],
  },
)

export default function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getSitemap()
}

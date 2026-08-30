import type { MetadataRoute } from 'next'
import { getServerSideURL } from '@/utilities/get-url'

export default function robots(): MetadataRoute.Robots {
  const siteURL = getServerSideURL().replace(/\/$/, '')

  return {
    rules: {
      userAgent: '*',
      disallow: '/admin/*',
    },
    sitemap: `${siteURL}/sitemap.xml`,
  }
}

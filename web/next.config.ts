import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

import { redirects } from './redirects'

const PUBLIC_SERVER_URL = process.env.PUBLIC_SERVER_URL || 'http://localhost:3000'

const nextConfig: NextConfig = {
  devIndicators: false,
  // Temporarily required on Windows until Next.js fixes Turbopack Sass resolution.
  // See: https://github.com/vercel/next.js/issues/86431
  sassOptions: {
    loadPaths: ['./node_modules/@payloadcms/ui/dist/scss/'],
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
    qualities: [100],
    // Allowed image domains for Next.js Image Optimization
    // Initially only set to the server itself, add more URLs to
    // the array as needed for external image sources
    remotePatterns: [
      ...[
        PUBLIC_SERVER_URL,
        /* 'https://example.com' */
      ].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', '') as 'http' | 'https',
        }
      }),
    ],
  },
  reactStrictMode: true,
  redirects,
  turbopack: {
    root: path.resolve(dirname),
  },
  output: 'standalone',
}

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')
export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })

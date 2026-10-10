import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);

import { env } from '$/env';
import { redirects } from '$/redirects';

const PUBLIC_SERVER_URL = env.PUBLIC_SERVER_URL;

const nextConfig: NextConfig = {
  devIndicators: false,
  distDir: env.NODE_ENV === 'test' ? '.next-test' : '.next',
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
        const url = new URL(item);

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', '') as 'http' | 'https',
        };
      }),
    ],
  },
  output: 'standalone',
  reactStrictMode: true,
  redirects: redirects,
  turbopack: {
    root: path.resolve(dirname),
  },
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false });

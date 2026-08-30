import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all versions of Internet Explorer
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all except the incompatibility page
  }

  return [internetExplorerRedirect]
}

import type { NextConfig } from 'next';

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        key: 'user-agent',
        type: 'header' as const,
        value: '(.*Trident.*)', // all versions of Internet Explorer
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all except the incompatibility page
  };

  return [internetExplorerRedirect];
};

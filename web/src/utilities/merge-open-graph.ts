import type { Metadata } from 'next';
import { getServerSideURL } from '~/utilities/get-server-url';
import { siteName } from '~/utilities/site';

const defaultOpenGraph: Metadata['openGraph'] = {
  description: 'An open-source website built with Payload and Next.js.',
  images: [
    {
      url: `${getServerSideURL()}/open-graph.webp`,
    },
  ],
  siteName: siteName,
  title: siteName,
  type: 'website',
};

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  };
};

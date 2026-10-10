const documentCollections = ['pages', 'posts', 'projects'] as const;

export type DocumentCollection = (typeof documentCollections)[number];

export function isDocumentCollection(collection: string): collection is DocumentCollection {
  return documentCollections.includes(collection as DocumentCollection);
}

type GetDocumentPathArgs = {
  collection: DocumentCollection;
  slug: string;
};

/** Returns the public route for a CMS document. */
export function getDocumentPath({ collection, slug }: GetDocumentPathArgs): string {
  if (collection === 'projects') return '/projects';
  if (collection === 'pages') return slug === 'home' ? '/' : `/${slug}`;

  return `/posts/${slug}`;
}

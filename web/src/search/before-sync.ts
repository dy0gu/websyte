import type { BeforeSync, DocToSync } from '@payloadcms/plugin-search/types';

export const beforeSyncWithSearch: BeforeSync = async ({ originalDoc, searchDoc }) => {
  const { coverImage, slug, title, meta, summary } = originalDoc;

  const modifiedDoc: DocToSync = {
    ...searchDoc,
    meta: {
      ...meta,
      description: meta?.description || summary,
      image: meta?.image?.id || meta?.image || coverImage?.id || coverImage,
      title: meta?.title || title,
    },
    slug: slug,
  };

  return modifiedDoc;
};

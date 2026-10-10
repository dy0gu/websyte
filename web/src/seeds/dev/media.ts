import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Payload } from 'payload';
import { defaultLocale, type Locale, locales } from '~/i18n/config';

export type SeedImage = {
  alt: Record<Locale, string>;
  filename: string;
};

const imagesDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), 'images');

export const getOrCreateSeedImage = async (payload: Payload, image: SeedImage): Promise<number> => {
  const existing = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    pagination: false,
    where: { filename: { equals: image.filename } },
  });

  let media = existing.docs[0];
  if (!media) {
    const imagePath = path.join(imagesDirectory, image.filename);
    const [data, fileStats] = await Promise.all([readFile(imagePath), stat(imagePath)]);
    media = await payload.create({
      collection: 'media',
      context: { disableRevalidate: true },
      data: { alt: image.alt[defaultLocale] },
      depth: 0,
      file: {
        data: data,
        mimetype: 'image/jpeg',
        name: image.filename,
        size: fileStats.size,
      },
      locale: defaultLocale,
    });
  }

  for (const locale of locales) {
    await payload.update({
      collection: 'media',
      context: { disableRevalidate: true },
      data: { alt: image.alt[locale] },
      depth: 0,
      id: media.id,
      locale: locale,
    });
  }

  return media.id;
};

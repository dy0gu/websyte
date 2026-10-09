import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Payload } from 'payload';

export type SeedImage = {
  alt: string;
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

  const existingImage = existing.docs[0];
  if (existingImage) {
    return existingImage.id;
  }

  const imagePath = path.join(imagesDirectory, image.filename);
  const [data, fileStats] = await Promise.all([readFile(imagePath), stat(imagePath)]);
  const media = await payload.create({
    collection: 'media',
    context: { disableRevalidate: true },
    data: { alt: image.alt },
    depth: 0,
    file: {
      data: data,
      mimetype: 'image/jpeg',
      name: image.filename,
      size: fileStats.size,
    },
  });

  return media.id;
};

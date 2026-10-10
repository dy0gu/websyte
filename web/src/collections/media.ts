import path from 'node:path';
import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical';
import type { CollectionConfig } from 'payload';

import { anyone } from '~/access/anyone';
import { authenticated } from '~/access/authenticated';

export const Media: CollectionConfig = {
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Storage',
  },
  fields: [
    {
      localized: true,
      name: 'alt',
      type: 'text',
      //required: true,
    },
    {
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()];
        },
      }),
      localized: true,
      name: 'caption',
      type: 'richText',
    },
  ],
  folders: true,
  slug: 'media',
  upload: {
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        height: 500,
        name: 'square',
        width: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        crop: 'center',
        height: 630,
        name: 'og',
        width: 1200,
      },
    ],
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(process.cwd(), 'public/media'),
  },
};

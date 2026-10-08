import type { Field } from 'payload';

export const searchFields: Field[] = [
  {
    admin: {
      readOnly: true,
    },
    index: true,
    name: 'slug',
    type: 'text',
  },
  {
    admin: {
      readOnly: true,
    },
    fields: [
      {
        label: 'Title',
        localized: true,
        name: 'title',
        type: 'text',
      },
      {
        label: 'Description',
        localized: true,
        name: 'description',
        type: 'text',
      },
      {
        label: 'Image',
        name: 'image',
        relationTo: 'media',
        type: 'upload',
      },
    ],
    index: true,
    label: 'Meta',
    name: 'meta',
    type: 'group',
  },
];

// fallow-ignore-file code-duplication -- this field owns its local editor field configuration.
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical';
import type { Field } from 'payload';

import { linkGroup } from '~/fields/link-group';

export const hero: Field = {
  fields: [
    {
      defaultValue: 'lowImpact',
      label: 'Type',
      name: 'type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
      ],
      required: true,
      type: 'select',
    },
    {
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ];
        },
      }),
      label: false,
      localized: true,
      name: 'richText',
      type: 'richText',
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      name: 'media',
      relationTo: 'media',
      required: true,
      type: 'upload',
    },
  ],
  label: false,
  name: 'hero',
  type: 'group',
};

import type { CollectionConfig } from 'payload';
import { slugField } from 'payload';

import { authenticated } from '~/access/authenticated';
import { authenticatedOrPublished } from '~/access/authenticated-or-published';
import {
  revalidateProject,
  revalidateProjectDelete,
} from '~/collections/projects/hooks/revalidate-project';
import { populatePublishedAt } from '~/hooks/populate-published-at';

export const Projects: CollectionConfig<'projects'> = {
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'typeLabel', 'publishedAt', 'updatedAt'],
    group: 'Portfolio',
    useAsTitle: 'title',
  },
  defaultPopulate: {
    coverImage: true,
    projectURL: true,
    publishedAt: true,
    slug: true,
    sourceURL: true,
    summary: true,
    technologies: true,
    title: true,
    typeLabel: true,
    visualStyle: true,
  },
  fields: [
    {
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      localized: true,
      name: 'summary',
      required: true,
      type: 'textarea',
    },
    {
      label: 'Project type',
      localized: true,
      name: 'typeLabel',
      required: true,
      type: 'text',
    },
    {
      fields: [
        {
          name: 'name',
          required: true,
          type: 'text',
        },
      ],
      name: 'technologies',
      type: 'array',
    },
    {
      fields: [
        {
          admin: {
            description: 'Optional live project or case-study URL.',
            width: '50%',
          },
          label: 'Project URL',
          name: 'projectURL',
          type: 'text',
        },
        {
          admin: {
            description: 'Optional source repository URL.',
            width: '50%',
          },
          label: 'Source URL',
          name: 'sourceURL',
          type: 'text',
        },
      ],
      type: 'row',
    },
    {
      name: 'coverImage',
      relationTo: 'media',
      type: 'upload',
    },
    {
      admin: {
        description: 'Used as an animated fallback when no cover image is uploaded.',
      },
      defaultValue: 'violet',
      name: 'visualStyle',
      options: [
        { label: 'Violet / Acid', value: 'violet' },
        { label: 'Dark / Coral', value: 'coral' },
        { label: 'Silver / Grid', value: 'silver' },
      ],
      required: true,
      type: 'select',
    },
    {
      admin: { position: 'sidebar' },
      name: 'publishedAt',
      type: 'date',
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateProject],
    afterDelete: [revalidateProjectDelete],
    beforeChange: [populatePublishedAt],
  },
  slug: 'projects',
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
};

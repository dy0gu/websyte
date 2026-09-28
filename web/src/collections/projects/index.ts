import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticated-or-published'
import { populatePublishedAt } from '../../hooks/populate-published-at'
import { revalidateProject, revalidateProjectDelete } from './hooks/revalidate-project'

export const Projects: CollectionConfig<'projects'> = {
  slug: 'projects',
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
    title: true,
    slug: true,
    summary: true,
    typeLabel: true,
    publishedAt: true,
    technologies: true,
    projectURL: true,
    sourceURL: true,
    coverImage: true,
    visualStyle: true,
  },
  fields: [
    {
      name: 'title',
      localized: true,
      type: 'text',
      required: true,
    },
    {
      name: 'summary',
      localized: true,
      type: 'textarea',
      required: true,
    },
    {
      name: 'typeLabel',
      localized: true,
      type: 'text',
      label: 'Project type',
      required: true,
    },
    {
      name: 'technologies',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'projectURL',
          type: 'text',
          admin: {
            description: 'Optional live project or case-study URL.',
            width: '50%',
          },
          label: 'Project URL',
        },
        {
          name: 'sourceURL',
          type: 'text',
          admin: {
            description: 'Optional source repository URL.',
            width: '50%',
          },
          label: 'Source URL',
        },
      ],
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'visualStyle',
      type: 'select',
      admin: {
        description: 'Used as an animated fallback when no cover image is uploaded.',
      },
      defaultValue: 'violet',
      options: [
        { label: 'Violet / Acid', value: 'violet' },
        { label: 'Dark / Coral', value: 'coral' },
        { label: 'Silver / Grid', value: 'silver' },
      ],
      required: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateProject],
    afterDelete: [revalidateProjectDelete],
    beforeChange: [populatePublishedAt],
  },
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}

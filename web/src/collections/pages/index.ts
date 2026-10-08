import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields';
import type { CollectionConfig } from 'payload';
import { slugField } from 'payload';
import { authenticated } from '~/access/authenticated';
import { authenticatedOrPublished } from '~/access/authenticated-or-published';
import { Archive } from '~/blocks/archive-block/config';
import { CallToAction } from '~/blocks/call-to-action/config';
import { Content } from '~/blocks/content/config';
import { FormBlock } from '~/blocks/form/config';
import { MediaBlock } from '~/blocks/media-block/config';
import { revalidateDelete, revalidatePage } from '~/collections/pages/hooks/revalidate-page';
import { translatedLocalesField } from '~/fields/translated-locales';
import { hero } from '~/heros/config';
import { populatePublishedAt } from '~/hooks/populate-published-at';
import { generatePreviewPath } from '~/utilities/generate-preview-path';

export const Pages: CollectionConfig<'pages'> = {
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Dynamic',
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          collection: 'pages',
          req: req,
          slug: data?.slug,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        collection: 'pages',
        req: req,
        slug: data?.slug as string,
      }),
    useAsTitle: 'title',
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    slug: true,
    title: true,
  },
  fields: [
    translatedLocalesField,
    {
      localized: true,
      name: 'title',
      required: true,
      type: 'text',
    },
    {
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              admin: {
                initCollapsed: true,
              },
              blocks: [CallToAction, Content, MediaBlock, Archive, FormBlock],
              name: 'layout',
              required: true,
              type: 'blocks',
            },
          ],
          label: 'Content',
        },
        {
          fields: [
            OverviewField({
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
              titlePath: 'meta.title',
            }),
            MetaTitleField({
              hasGenerateFn: true,
              overrides: { localized: true },
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({ overrides: { localized: true } }),
            PreviewField({
              descriptionPath: 'meta.description',
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
            }),
          ],
          label: 'SEO',
          name: 'meta',
        },
      ],
      type: 'tabs',
    },
    {
      admin: {
        position: 'sidebar',
      },
      name: 'publishedAt',
      type: 'date',
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    afterDelete: [revalidateDelete],
    beforeChange: [populatePublishedAt],
  },
  slug: 'pages',
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
};

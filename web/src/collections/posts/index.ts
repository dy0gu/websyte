import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields';
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical';
import type { CollectionConfig } from 'payload';
import { slugField } from 'payload';
import { authenticated } from '~/access/authenticated';
import { authenticatedOrPublished } from '~/access/authenticated-or-published';
import { Banner } from '~/blocks/banner/config';
import { Code } from '~/blocks/code/config';
import { MediaBlock } from '~/blocks/media-block/config';
import { populateAuthors } from '~/collections/posts/hooks/populate-authors';
import { revalidateDelete, revalidatePost } from '~/collections/posts/hooks/revalidate-post';
import { translatedLocalesField } from '~/fields/translated-locales';
import { generatePreviewPath } from '~/utilities/generate-preview-path';

export const Posts: CollectionConfig<'posts'> = {
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    group: 'Portfolio',
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          collection: 'posts',
          req: req,
          slug: data?.slug,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        collection: 'posts',
        req: req,
        slug: data?.slug as string,
      }),
    useAsTitle: 'title',
  },
  // This config controls what's populated by default when a post is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'posts'>
  defaultPopulate: {
    meta: {
      description: true,
      image: true,
    },
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
          fields: [
            {
              name: 'heroImage',
              relationTo: 'media',
              type: 'upload',
            },
            {
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ];
                },
              }),
              label: false,
              localized: true,
              name: 'content',
              required: true,
              type: 'richText',
            },
          ],
          label: 'Content',
        },
        {
          fields: [
            {
              admin: {
                position: 'sidebar',
              },
              filterOptions: ({ id }) => {
                return {
                  id: {
                    // biome-ignore lint/style/useNamingConvention: Payload's where operator is snake_case.
                    not_in: [id],
                  },
                };
              },
              hasMany: true,
              name: 'relatedPosts',
              relationTo: 'posts',
              type: 'relationship',
            },
          ],
          label: 'Meta',
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
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date();
            }
            return value;
          },
        ],
      },
      name: 'publishedAt',
      type: 'date',
    },
    {
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      name: 'authors',
      relationTo: 'admins',
      type: 'relationship',
    },
    // This field is only used to populate the user data via the `populateAuthors` hook
    // This is because the `user` collection has access control locked to protect user privacy
    // GraphQL will also not return mutated user data that differs from the underlying schema
    {
      access: {
        update: () => false,
      },
      admin: {
        disabled: true,
        readOnly: true,
      },
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
      ],
      name: 'populatedAuthors',
      type: 'array',
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePost],
    afterDelete: [revalidateDelete],
    afterRead: [populateAuthors],
  },
  slug: 'posts',
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

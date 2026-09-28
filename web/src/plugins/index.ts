import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { searchPlugin } from '@payloadcms/plugin-search'
import { seoPlugin } from '@payloadcms/plugin-seo'
import type { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Plugin } from 'payload'
import { localizeFormFields } from '@/fields/localize-form-fields'
import { revalidateRedirects } from '@/hooks/revalidate-redirects'
import { defaultLocale, isLocale, localizedPath } from '@/i18n/config'
import type { Page, Post } from '@/payload-types'
import { beforeSyncWithSearch } from '@/search/before-sync'
import { searchFields } from '@/search/field-overrides'
import { getServerSideURL } from '@/utilities/get-url'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Diogo Simões` : 'Diogo Simões'
}

const generateURL: GenerateURL<Post | Page> = ({ doc, collectionSlug, req }) => {
  const url = getServerSideURL()

  const locale = req.locale && isLocale(req.locale) ? req.locale : defaultLocale
  const path =
    !doc?.slug || doc.slug === 'home'
      ? '/'
      : `${collectionSlug === 'posts' ? '/posts' : ''}/${doc.slug}`
  return `${url}${localizedPath(path, locale)}`
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts', 'projects'],
    overrides: {
      admin: {
        group: 'Dynamic',
      },
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formSubmissionOverrides: {
      admin: {
        group: 'Storage',
      },
      access: {
        // Allow only anonymous public form submissions; disable manual creation in the admin
        create: ({ req }) => req.user?.collection !== 'admins',
      },
    },
    formOverrides: {
      admin: {
        group: 'Dynamic',
      },
      fields: ({ defaultFields }) => {
        return [
          ...localizeFormFields(defaultFields),
          {
            name: 'formKey',
            type: 'text' as const,
            unique: true,
            index: true,
            admin: { description: 'Stable identifier used by the frontend, e.g. contact.' },
          },
        ].map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
  }),
  searchPlugin({
    localize: true,
    collections: ['posts', 'projects'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      admin: {
        group: 'Storage',
      },
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
]

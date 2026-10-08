import { formBuilderPlugin } from '@payloadcms/plugin-form-builder';
import { redirectsPlugin } from '@payloadcms/plugin-redirects';
import { searchPlugin } from '@payloadcms/plugin-search';
import { seoPlugin } from '@payloadcms/plugin-seo';
import type { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types';
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical';
import type { Plugin } from 'payload';
import { localizeFormFields } from '~/fields/localize-form-fields';
import { revalidateRedirects } from '~/hooks/revalidate-redirects';
import { defaultLocale, isLocale, localizedPath } from '~/i18n/config';
import type { Page, Post } from '~/payload-types';
import { beforeSyncWithSearch } from '~/search/before-sync';
import { searchFields } from '~/search/field-overrides';
import { getDocumentPath } from '~/utilities/get-document-path';
import { getServerSideURL } from '~/utilities/get-server-url';
import { withSiteTitle } from '~/utilities/site';

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => withSiteTitle(doc?.title);

const generateUrl: GenerateURL<Post | Page> = ({ doc, collectionSlug, req }) => {
  const url = getServerSideURL();

  const locale = req.locale && isLocale(req.locale) ? req.locale : defaultLocale;
  const path = doc?.slug
    ? getDocumentPath({
        collection: collectionSlug === 'posts' ? 'posts' : 'pages',
        slug: doc.slug,
      })
    : '/';
  return `${url}${localizedPath(path, locale)}`;
};

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
            };
          }
          return field;
        });
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  seoPlugin({
    generateTitle: generateTitle,
    generateURL: generateUrl,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      admin: {
        group: 'Dynamic',
      },
      fields: ({ defaultFields }) => {
        return [
          ...localizeFormFields(defaultFields),
          {
            admin: { description: 'Stable identifier used by the frontend, e.g. contact.' },
            index: true,
            name: 'formKey',
            type: 'text' as const,
            unique: true,
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
                  ];
                },
              }),
            };
          }
          return field;
        });
      },
    },
    formSubmissionOverrides: {
      access: {
        // Allow only anonymous public form submissions; disable manual creation in the admin
        create: ({ req }) => req.user?.collection !== 'admins',
      },
      admin: {
        group: 'Storage',
      },
    },
  }),
  searchPlugin({
    beforeSync: beforeSyncWithSearch,
    collections: ['posts', 'projects'],
    localize: true,
    searchOverrides: {
      admin: {
        group: 'Storage',
      },
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields];
      },
    },
  }),
];

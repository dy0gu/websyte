// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';
import { localizeFormFields } from '~/fields/localize-form-fields';
import { defaultLocale, localizedPath, parseLocale } from '~/i18n/config';
import en from '~/i18n/messages/en.json';
import pt from '~/i18n/messages/pt.json';
import { localizedMetadata, localizedPageMetadata } from '~/i18n/metadata';
import { formatDateTime } from '~/utilities/format-date-time';
import { getDocumentPath } from '~/utilities/get-document-path';
import { siteName, titleSuffix, withSiteTitle } from '~/utilities/site';

const { revalidatePath, revalidateTag } = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));
vi.mock('next/cache', () => ({ revalidatePath: revalidatePath, revalidateTag: revalidateTag }));

import { revalidateLocalizedPath } from '~/i18n/revalidate';

describe('cookie-based locale selection', () => {
  it('uses a supported cookie locale and falls back to English', () => {
    expect(parseLocale('pt')).toBe('pt');
    for (const value of [undefined, null, '', 'de', 'pt-PT']) {
      expect(parseLocale(value)).toBe(defaultLocale);
    }
  });

  it('keeps public paths independent from the selected locale', () => {
    expect(localizedPath('/', 'pt')).toBe('/');
    expect(localizedPath('/posts/example?q=one#two', 'pt')).toBe('/posts/example?q=one#two');
  });

  it('invalidates a shared path once', () => {
    revalidatePath.mockClear();
    revalidateLocalizedPath('/posts/example');
    expect(revalidatePath.mock.calls).toEqual([['/posts/example', undefined]]);
  });
});

describe('translation and indexing policy', () => {
  it('uses one canonical URL while preventing fallback content from being indexed', () => {
    expect(localizedMetadata('/posts/example', 'pt', ['en'])).toMatchObject({
      alternates: { canonical: '/posts/example' },
      robots: { index: false },
    });
    expect(localizedMetadata('/posts/example', 'pt', ['en', 'pt']).robots).toBeUndefined();
  });

  it('creates consistent branded metadata while allowing route-specific indexing rules', () => {
    expect(withSiteTitle('Posts')).toBe(`Posts | ${siteName}`);
    expect(withSiteTitle()).toBe(siteName);
    expect(titleSuffix).toBe(`- ${siteName}`);
    expect(
      localizedPageMetadata({
        locale: 'en',
        path: '/search',
        robots: { follow: true, index: false },
        title: 'Search',
      }),
    ).toMatchObject({
      robots: { follow: true, index: false },
      title: `Search | ${siteName}`,
    });
  });

  it('uses one public-path convention for routable CMS collections', () => {
    expect(getDocumentPath({ collection: 'pages', slug: 'home' })).toBe('/');
    expect(getDocumentPath({ collection: 'pages', slug: 'about' })).toBe('/about');
    expect(getDocumentPath({ collection: 'posts', slug: 'example' })).toBe('/posts/example');
    expect(getDocumentPath({ collection: 'projects', slug: 'ignored' })).toBe('/projects');
  });

  it('provides Portuguese translations for every UI message and preserves ICU arguments', () => {
    expect(Object.keys(pt.UI).sort()).toEqual(Object.keys(en.UI).sort());
    for (const key of Object.keys(en.UI) as (keyof typeof en.UI)[]) {
      expect(pt.UI[key].length).toBeGreaterThan(0);
      expect(pt.UI[key].match(/\{\w+\}/g)).toEqual(en.UI[key].match(/\{\w+\}/g));
    }
  });

  it('formats dates in European Portuguese with a fixed timezone', () => {
    expect(formatDateTime('2026-09-15T12:00:00Z', 'pt')).toBe('15 de setembro de 2026');
  });

  it('translates form labels while retaining shared field names and option values', () => {
    const [field] = localizeFormFields([
      {
        blocks: [
          {
            fields: [
              { name: 'name', type: 'text' },
              { name: 'label', type: 'text' },
              {
                fields: [
                  { name: 'label', type: 'text' },
                  { name: 'value', type: 'text' },
                ],
                name: 'options',
                type: 'array',
              },
            ],
            slug: 'select',
          },
        ],
        name: 'fields',
        type: 'blocks',
      },
    ]);
    expect(field).toMatchObject({
      blocks: [
        {
          fields: [
            { name: 'name' },
            { localized: true, name: 'label' },
            { fields: [{ localized: true, name: 'label' }, { name: 'value' }], name: 'options' },
          ],
        },
      ],
    });
    if (field.type !== 'blocks') throw new Error('Expected blocks');
    expect('localized' in field).toBe(false);
    expect('localized' in field.blocks[0].fields[0]).toBe(false);
  });
});

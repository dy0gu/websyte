// @vitest-environment node

import { NextRequest } from 'next/server';
import { describe, expect, it, vi } from 'vitest';
import { localizeFormFields } from '~/fields/localize-form-fields';
import { localizedPath } from '~/i18n/config';
import en from '~/i18n/messages/en.json';
import pt from '~/i18n/messages/pt.json';
import { languageAlternates, localizedMetadata, localizedPageMetadata } from '~/i18n/metadata';
import proxy from '~/proxy';
import { formatDateTime } from '~/utilities/format-date-time';
import { getDocumentPath } from '~/utilities/get-document-path';
import { siteName, titleSuffix, withSiteTitle } from '~/utilities/site';

const { revalidatePath } = vi.hoisted(() => ({ revalidatePath: vi.fn() }));
vi.mock('next/cache', () => ({ revalidatePath: revalidatePath }));

import { revalidateLocalizedPath } from '~/i18n/revalidate';

describe('localized public routes', () => {
  it('redirects unprefixed routes to the locale requested by the browser and retains the query', () => {
    const rootResponse = proxy(
      new NextRequest('https://example.com', {
        headers: { 'accept-language': 'pt-PT,pt;q=0.9,en;q=0.8' },
      }),
    );
    expect(rootResponse.headers.get('location')).toBe('https://example.com/pt');

    const postsResponse = proxy(
      new NextRequest('https://example.com/posts?q=hello', {
        headers: { 'accept-language': 'pt' },
      }),
    );
    expect(postsResponse.headers.get('location')).toBe('https://example.com/pt/posts?q=hello');
  });

  it('falls back to English when the browser does not request a supported locale', () => {
    const response = proxy(
      new NextRequest('https://example.com/posts', {
        headers: { 'accept-language': 'de-DE,de;q=0.9' },
      }),
    );
    expect(response.headers.get('location')).toBe('https://example.com/en/posts');
  });

  it('keeps an explicit Portuguese locale', () => {
    const response = proxy(new NextRequest('https://example.com/pt/posts'));
    expect(response.headers.get('location')).toBeNull();
    expect(response.headers.get('x-middleware-request-x-next-intl-locale')).toBe('pt');
  });

  it('prefixes public URLs without changing admin, APIs, assets, external URLs, or existing prefixes', () => {
    expect(localizedPath('/', 'pt')).toBe('/pt');
    expect(localizedPath('/posts/example?q=one#two', 'pt')).toBe('/pt/posts/example?q=one#two');
    for (const path of [
      '/admin',
      '/api/media/file/image.webp',
      '/next/preview?path=/en',
      '/favicon.svg',
      '/pt/posts',
      '/en/posts',
      'https://example.com',
      '//example.com',
      'mailto:test@example.com',
      '#contact',
    ]) {
      expect(localizedPath(path, 'pt')).toBe(path);
    }
  });

  it('invalidates all languages when shared or fallback content changes', () => {
    revalidatePath.mockClear();
    revalidateLocalizedPath('/posts/example');
    expect(revalidatePath.mock.calls).toEqual([
      ['/en/posts/example', undefined],
      ['/pt/posts/example', undefined],
    ]);
  });
});

describe('translation and indexing policy', () => {
  it('does not advertise fallback content as an available translation', () => {
    expect(languageAlternates('/posts/example', ['en'])).toEqual({ en: '/en/posts/example' });
    expect(localizedMetadata('/posts/example', 'pt', ['en'])).toMatchObject({
      alternates: { canonical: '/pt/posts/example', languages: { en: '/en/posts/example' } },
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

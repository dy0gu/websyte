// @vitest-environment node

import { NextRequest } from 'next/server'
import { describe, expect, it, vi } from 'vitest'
import { localizeFormFields } from '@/fields/localize-form-fields'
import { localizedPath } from '@/i18n/config'
import en from '@/i18n/messages/en.json'
import pt from '@/i18n/messages/pt.json'
import { languageAlternates, localizedMetadata } from '@/i18n/metadata'
import proxy from '@/proxy'
import { formatDateTime } from '@/utilities/format-date-time'

const { revalidatePath } = vi.hoisted(() => ({ revalidatePath: vi.fn() }))
vi.mock('next/cache', () => ({ revalidatePath }))

import { revalidateLocalizedPath } from '@/i18n/revalidate'

describe('localized public routes', () => {
  it('redirects legacy URLs deterministically to English and retains the query', () => {
    const response = proxy(
      new NextRequest('https://example.com/posts?q=hello', {
        headers: { 'accept-language': 'pt' },
      }),
    )
    expect(response.headers.get('location')).toBe('https://example.com/en/posts?q=hello')
  })

  it('keeps an explicit Portuguese locale', () => {
    const response = proxy(new NextRequest('https://example.com/pt/posts'))
    expect(response.headers.get('location')).toBeNull()
    expect(response.headers.get('x-middleware-request-x-next-intl-locale')).toBe('pt')
  })

  it('prefixes public URLs without changing admin, APIs, assets, external URLs, or existing prefixes', () => {
    expect(localizedPath('/', 'pt')).toBe('/pt')
    expect(localizedPath('/posts/example?q=one#two', 'pt')).toBe('/pt/posts/example?q=one#two')
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
      expect(localizedPath(path, 'pt')).toBe(path)
    }
  })

  it('invalidates all languages when shared or fallback content changes', () => {
    revalidatePath.mockClear()
    revalidateLocalizedPath('/posts/example')
    expect(revalidatePath.mock.calls).toEqual([
      ['/en/posts/example', undefined],
      ['/pt/posts/example', undefined],
    ])
  })
})

describe('translation and indexing policy', () => {
  it('does not advertise fallback content as an available translation', () => {
    expect(languageAlternates('/posts/example', ['en'])).toEqual({ en: '/en/posts/example' })
    expect(localizedMetadata('/posts/example', 'pt', ['en'])).toMatchObject({
      robots: { index: false },
      alternates: { canonical: '/pt/posts/example', languages: { en: '/en/posts/example' } },
    })
    expect(localizedMetadata('/posts/example', 'pt', ['en', 'pt']).robots).toBeUndefined()
  })

  it('provides Portuguese translations for every UI message and preserves ICU arguments', () => {
    expect(Object.keys(pt.UI).sort()).toEqual(Object.keys(en.UI).sort())
    for (const key of Object.keys(en.UI) as (keyof typeof en.UI)[]) {
      expect(pt.UI[key].length).toBeGreaterThan(0)
      expect(pt.UI[key].match(/\{\w+\}/g)).toEqual(en.UI[key].match(/\{\w+\}/g))
    }
  })

  it('formats dates in European Portuguese with a fixed timezone', () => {
    expect(formatDateTime('2026-09-15T12:00:00Z', 'pt')).toBe('15 de setembro de 2026')
  })

  it('translates form labels while retaining shared field names and option values', () => {
    const [field] = localizeFormFields([
      {
        name: 'fields',
        type: 'blocks',
        blocks: [
          {
            slug: 'select',
            fields: [
              { name: 'name', type: 'text' },
              { name: 'label', type: 'text' },
              {
                name: 'options',
                type: 'array',
                fields: [
                  { name: 'label', type: 'text' },
                  { name: 'value', type: 'text' },
                ],
              },
            ],
          },
        ],
      },
    ])
    expect(field).toMatchObject({
      blocks: [
        {
          fields: [
            { name: 'name' },
            { name: 'label', localized: true },
            { name: 'options', fields: [{ name: 'label', localized: true }, { name: 'value' }] },
          ],
        },
      ],
    })
    if (field.type !== 'blocks') throw new Error('Expected blocks')
    expect('localized' in field).toBe(false)
    expect('localized' in field.blocks[0].fields[0]).toBe(false)
  })
})

import type { Payload, RequiredDataFromCollectionSlug } from 'payload'

type PostSeed = RequiredDataFromCollectionSlug<'posts'>

const textNode = (text: string) => ({
  type: 'text',
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text,
  version: 1,
})

const paragraph = (text: string) => ({
  type: 'paragraph',
  children: [textNode(text)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  version: 1,
})

const heading = (text: string) => ({
  type: 'heading',
  children: [textNode(text)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  tag: 'h2',
  version: 1,
})

const content = (intro: string, title: string, body: string): PostSeed['content'] => ({
  root: {
    type: 'root',
    children: [paragraph(intro), heading(title), paragraph(body)],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})

const posts: PostSeed[] = [
  {
    title: 'Building Calm Interfaces for Complicated Systems',
    slug: 'building-calm-interfaces',
    _status: 'published',
    publishedAt: '2026-02-18T09:00:00.000Z',
    meta: {
      title: 'Building Calm Interfaces for Complicated Systems',
      description:
        'Practical notes on reducing cognitive load without hiding the complexity users need.',
    },
    content: content(
      'Complex products do not need to feel complicated. The best interfaces reveal decisions at the moment they become useful.',
      'Start with the decision, not the data',
      'A dashboard becomes easier to understand when every number supports a clear action. Group related signals, name the trade-offs, and keep exceptional states visible instead of decorating every possible metric equally.',
    ),
  },
  {
    title: 'What I Learned Shipping a Small Service',
    slug: 'shipping-a-small-service',
    _status: 'published',
    publishedAt: '2026-01-22T09:00:00.000Z',
    meta: {
      title: 'What I Learned Shipping a Small Service',
      description:
        'A field guide to observability, boring technology, and the work that starts after launch.',
    },
    content: content(
      'Small services are useful teachers: every unnecessary dependency, unclear log line, and missing runbook becomes obvious quickly.',
      'Operational simplicity is a feature',
      'Choosing familiar tools made the service easier to deploy and easier to repair. A short health check, structured logs, and one useful dashboard paid for themselves long before the first feature rewrite.',
    ),
  },
  {
    title: 'Designing APIs for the Next Person',
    slug: 'designing-apis-for-the-next-person',
    _status: 'published',
    publishedAt: '2025-12-11T09:00:00.000Z',
    meta: {
      title: 'Designing APIs for the Next Person',
      description:
        'How consistent naming and useful errors make an API easier to adopt and maintain.',
    },
    content: content(
      'An API is a user interface. Its users happen to be developers, but they still benefit from consistency, guidance, and sensible defaults.',
      'Make the happy path unsurprising',
      'Clear resource names and predictable response shapes reduce the amount of documentation a consumer must keep in their head. When something fails, errors should explain both what happened and what the caller can do next.',
    ),
  },
]

export const seedFakePosts = async (payload: Payload): Promise<void> => {
  payload.logger.info('Ensuring fake development posts exist...')

  for (const data of posts) {
    const existing = await payload.find({
      collection: 'posts',
      depth: 0,
      limit: 1,
      pagination: false,
      where: { slug: { equals: data.slug } },
    })

    const existingPost = existing.docs[0]

    if (existingPost) {
      await payload.update({
        collection: 'posts',
        id: existingPost.id,
        data,
        depth: 0,
        context: { disableRevalidate: true },
      })
    } else {
      await payload.create({
        collection: 'posts',
        data,
        depth: 0,
        context: { disableRevalidate: true },
      })
    }
  }

  payload.logger.info('Fake development posts are ready.')
}

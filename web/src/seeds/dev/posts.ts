import type { Payload, RequiredDataFromCollectionSlug } from 'payload';
import { getOrCreateSeedImage, type SeedImage } from '~/seeds/dev/media';

type PostSeed = RequiredDataFromCollectionSlug<'posts'>;
type SeedPost = PostSeed & { image: SeedImage };

const textNode = (text: string) => ({
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text: text,
  type: 'text',
  version: 1,
});

const paragraph = (text: string) => ({
  children: [textNode(text)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  type: 'paragraph',
  version: 1,
});

const heading = (text: string) => ({
  children: [textNode(text)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  tag: 'h2',
  type: 'heading',
  version: 1,
});

const content = (intro: string, title: string, body: string): PostSeed['content'] => ({
  root: {
    children: [paragraph(intro), heading(title), paragraph(body)],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
});

const posts: SeedPost[] = [
  {
    _status: 'published',
    content: content(
      'Complex products do not need to feel complicated. The best interfaces reveal decisions at the moment they become useful.',
      'Start with the decision, not the data',
      'A dashboard becomes easier to understand when every number supports a clear action. Group related signals, name the trade-offs, and keep exceptional states visible instead of decorating every possible metric equally.',
    ),
    image: {
      alt: 'Close-up of an electronic circuit board',
      filename: 'building-calm-interfaces.jpg',
    },
    meta: {
      description:
        'Practical notes on reducing cognitive load without hiding the complexity users need.',
      title: 'Building Calm Interfaces for Complicated Systems',
    },
    publishedAt: '2026-02-18T09:00:00.000Z',
    slug: 'building-calm-interfaces',
    title: 'Building Calm Interfaces for Complicated Systems',
  },
  {
    _status: 'published',
    content: content(
      'Small services are useful teachers: every unnecessary dependency, unclear log line, and missing runbook becomes obvious quickly.',
      'Operational simplicity is a feature',
      'Choosing familiar tools made the service easier to deploy and easier to repair. A short health check, structured logs, and one useful dashboard paid for themselves long before the first feature rewrite.',
    ),
    image: {
      alt: 'Rows of servers in a data center',
      filename: 'shipping-a-small-service.jpg',
    },
    meta: {
      description:
        'A field guide to observability, boring technology, and the work that starts after launch.',
      title: 'What I Learned Shipping a Small Service',
    },
    publishedAt: '2026-01-22T09:00:00.000Z',
    slug: 'shipping-a-small-service',
    title: 'What I Learned Shipping a Small Service',
  },
  {
    _status: 'published',
    content: content(
      'An API is a user interface. Its users happen to be developers, but they still benefit from consistency, guidance, and sensible defaults.',
      'Make the happy path unsurprising',
      'Clear resource names and predictable response shapes reduce the amount of documentation a consumer must keep in their head. When something fails, errors should explain both what happened and what the caller can do next.',
    ),
    image: {
      alt: 'Developer writing code on a laptop',
      filename: 'designing-apis-for-the-next-person.jpg',
    },
    meta: {
      description:
        'How consistent naming and useful errors make an API easier to adopt and maintain.',
      title: 'Designing APIs for the Next Person',
    },
    publishedAt: '2025-12-11T09:00:00.000Z',
    slug: 'designing-apis-for-the-next-person',
    title: 'Designing APIs for the Next Person',
  },
];

export const seedFakePosts = async (payload: Payload): Promise<void> => {
  payload.logger.info('Ensuring fake development posts exist...');

  for (const post of posts) {
    const { image, ...data } = post;
    const imageId = await getOrCreateSeedImage(payload, image);
    const postData: PostSeed = {
      ...data,
      heroImage: imageId,
      meta: { ...data.meta, image: imageId },
    };
    const existing = await payload.find({
      collection: 'posts',
      depth: 0,
      limit: 1,
      pagination: false,
      where: { slug: { equals: postData.slug } },
    });

    const existingPost = existing.docs[0];

    if (existingPost) {
      await payload.update({
        collection: 'posts',
        context: { disableRevalidate: true },
        data: postData,
        depth: 0,
        id: existingPost.id,
      });
    } else {
      await payload.create({
        collection: 'posts',
        context: { disableRevalidate: true },
        data: postData,
        depth: 0,
      });
    }
  }

  payload.logger.info('Fake development posts are ready.');
};

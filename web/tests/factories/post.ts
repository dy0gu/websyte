import type { Payload, RequiredDataFromCollectionSlug } from 'payload';

const content = (text: string) => ({
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: text,
            type: 'text' as const,
            version: 1,
          },
        ],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        textFormat: 0,
        type: 'paragraph' as const,
        version: 1,
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    type: 'root' as const,
    version: 1,
  },
});

const defaults: RequiredDataFromCollectionSlug<'posts'> = {
  _status: 'published',
  content: content('Test post content.'),
  slug: 'test-post',
  title: 'Test post',
};

export const createPost = async (
  payload: Payload,
  overrides: Partial<RequiredDataFromCollectionSlug<'posts'>> = {},
) => {
  return payload.create({
    collection: 'posts',
    data: { ...defaults, ...overrides },
    depth: 0,
  });
};

import config from '@payload-config';
import { expect, test } from '@playwright/test';
import { getPayload } from 'payload';
import { createPost } from '$/tests/factories/post';
import { scope } from '$/tests/helpers/scope.e2e';

const posts = [
  {
    slug: 'building-calm-interfaces',
    title: 'Building Calm Interfaces for Complicated Systems',
  },
  {
    slug: 'shipping-a-small-service',
    title: 'What I Learned Shipping a Small Service',
  },
  {
    slug: 'designing-apis-for-the-next-person',
    title: 'Designing APIs for the Next Person',
  },
];

scope('Sitemap', () => {
  test.beforeAll(async () => {
    const payload = await getPayload({ config: config });
    for (const post of posts) await createPost(payload, post);
  });

  test('serves public routes and published posts in the sitemap', async ({ baseURL, request }) => {
    const response = await request.get('/sitemap.xml');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/xml');

    const sitemap = await response.text();
    const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

    expect(urls).toEqual(
      expect.arrayContaining([
        `${baseURL}/`,
        `${baseURL}/posts`,
        `${baseURL}/projects`,
        ...posts.map((post) => `${baseURL}/posts/${post.slug}`),
      ]),
    );

    for (const post of posts) {
      expect(sitemap).toMatch(
        new RegExp(`<loc>${baseURL}/posts/${post.slug}</loc>\\s*<lastmod>[^<]+</lastmod>`),
      );
    }
  });
});

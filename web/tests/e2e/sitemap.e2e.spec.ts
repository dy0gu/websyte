import { expect, test } from '@playwright/test';

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
      `${baseURL}/posts/building-calm-interfaces`,
      `${baseURL}/posts/shipping-a-small-service`,
      `${baseURL}/posts/designing-apis-for-the-next-person`,
    ]),
  );

  for (const slug of [
    'building-calm-interfaces',
    'shipping-a-small-service',
    'designing-apis-for-the-next-person',
  ]) {
    expect(sitemap).toMatch(
      new RegExp(`<loc>${baseURL}/posts/${slug}</loc>\\s*<lastmod>[^<]+</lastmod>`),
    );
  }
});

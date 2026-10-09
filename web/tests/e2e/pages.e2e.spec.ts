import config from '@payload-config';
import { expect, test } from '@playwright/test';
import { getPayload } from 'payload';
import { scope } from '$/tests/helpers/scope.e2e';

const slugRoutePage = {
  slug: 'slug-route-test',
  title: 'Slug route test page',
};

scope('Pages', () => {
  test.beforeAll(async () => {
    const payload = await getPayload({ config: config });

    await payload.create({
      collection: 'pages',
      data: {
        _status: 'published',
        hero: {
          type: 'none',
        },
        layout: [
          {
            blockType: 'content',
            columns: [],
          },
        ],
        meta: {
          title: slugRoutePage.title,
        },
        ...slugRoutePage,
      },
    });
  });

  test('renders a published CMS page at its slug', async ({ page }) => {
    await page.goto(`/${slugRoutePage.slug}`);

    await expect(page).toHaveURL(`/${slugRoutePage.slug}`);
    await expect(page).toHaveTitle(`${slugRoutePage.title} | Diogo Simões`);
  });
});

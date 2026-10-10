import config from '@payload-config';
import { type BrowserContext, expect, type Page, test } from '@playwright/test';
import { getPayload } from 'payload';
import { createAdmin } from '$/tests/factories/admin';
import { login } from '$/tests/helpers/login';
import { scope } from '$/tests/helpers/scope.e2e';

const testUser = {
  email: 'test-admin@example.com',
  password: 'test-password',
};

scope('Admin Panel', () => {
  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    const payload = await getPayload({ config: config });
    await createAdmin(payload, testUser);

    context = await browser.newContext();
    page = await context.newPage();
    await login({ page: page, user: testUser });
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('does not add a locale to Payload admin routes', async ({ request }) => {
    const response = await request.get('/admin');

    expect(new URL(response.url()).pathname).toMatch(/^\/admin/);
  });

  test('can navigate to dashboard', async () => {
    await page.goto('/admin');
    await expect(page).toHaveURL('/admin');
    const dashboardArtifact = page.locator('span[title="Dashboard"]').first();
    await expect(dashboardArtifact).toBeVisible();
  });

  test('can navigate to list view', async () => {
    await page.goto('/admin/collections/admins');
    await expect(page).toHaveURL(/\/admin\/collections\/admins(?:\?.*)?$/);
    const listViewArtifact = page.locator('h1', { hasText: 'Admins' }).first();
    await expect(listViewArtifact).toBeVisible();
  });

  test('can navigate to edit view', async () => {
    await page.goto('/admin/collections/pages/create');
    await expect(page).toHaveURL(/\/admin\/collections\/pages\/[a-zA-Z0-9-_]+/);
    const editViewArtifact = page.getByRole('textbox', { name: /Title/ });
    await expect(editViewArtifact).toBeVisible();
  });
});

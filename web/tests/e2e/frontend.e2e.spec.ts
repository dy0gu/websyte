import { expect, test } from '@playwright/test';

test('switches between English and Portuguese without changing the public URL', async ({
  context,
  page,
}) => {
  await page.goto('/');
  await expect(page).toHaveURL('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(
    'I build software that works',
  );

  await page.getByRole('combobox', { name: 'Language' }).selectOption('pt');
  await expect(page).toHaveURL('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt');
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(
    'Crio software que funciona',
  );
  await expect(page.getByRole('link', { exact: true, name: 'Pesquisar' })).toHaveAttribute(
    'href',
    '/search',
  );
  await expect
    .poll(
      async () => (await context.cookies()).find((cookie) => cookie.name === 'site-locale')?.value,
    )
    .toBe('pt');
});

test('keeps navigation visible and the layout within a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ height: 800, width: 320 });
  await page.goto('/');

  const navigation = page.getByRole('navigation', { name: 'Main navigation' });
  for (const name of ['Projects', 'Posts', 'Contact', 'Search']) {
    await expect(navigation.getByRole('link', { exact: true, name: name })).toBeVisible();
  }
  await expect(navigation.getByRole('combobox', { name: 'Language' })).toBeVisible();
  await expect(navigation.getByRole('combobox', { name: 'Select a theme' })).toBeVisible();
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasOverflow).toBe(false);
});

test('changes language in both directions and retains the search query', async ({ page }) => {
  const languageSelector = page.getByRole('combobox', { name: /Language|Idioma/ });
  await page.goto('/search?q=software');

  await languageSelector.selectOption('pt');
  await expect(page).toHaveURL('/search?q=software');
  await expect(page.getByPlaceholder('Pesquisar')).toHaveValue('software');

  await languageSelector.selectOption('en');
  await expect(page).toHaveURL('/search?q=software');
  await expect(page.getByPlaceholder('Search')).toHaveValue('software');
});

test('does not add a locale to Payload admin or API routes', async ({ request }) => {
  const response = await request.get('/api/posts?locale=pt');
  expect(response.status()).toBe(200);
  expect(response.url()).toContain('/api/posts?locale=pt');
  const admin = await request.get('/admin');
  expect(new URL(admin.url()).pathname).toMatch(/^\/admin/);
});

import { expect, test } from '@playwright/test';
import { scope } from '$/tests/helpers/scope.e2e';

scope('Root', () => {
  test('switches between English and Portuguese without changing the public URL', async ({
    context,
    page,
  }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { level: 2, name: 'Want to talk?' })).toBeVisible();

    await page.getByRole('combobox', { name: 'Language' }).selectOption('pt');
    await expect(page).toHaveURL('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt');
    await expect(page.getByRole('heading', { level: 2, name: 'Vamos conversar?' })).toBeVisible();
    await expect(page.getByRole('link', { exact: true, name: 'Pesquisar' })).toHaveAttribute(
      'href',
      '/search',
    );
    await expect
      .poll(
        async () =>
          (await context.cookies()).find((cookie) => cookie.name === 'site-locale')?.value,
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
});

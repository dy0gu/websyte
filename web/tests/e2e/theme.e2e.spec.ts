import { expect, test } from '@playwright/test';

for (const preference of ['light', 'dark', 'auto'] as const) {
  for (const system of ['light', 'dark'] as const) {
    test(`${preference} with ${system} system renders correctly without JavaScript`, async ({
      baseURL,
      browser,
    }) => {
      const context = await browser.newContext({
        baseURL: baseURL,
        colorScheme: system,
        javaScriptEnabled: false,
      });
      await context.addCookies([{ name: 'site-theme', url: baseURL, value: preference }]);
      const page = await context.newPage();
      try {
        for (const path of ['/', '/posts']) {
          await page.goto(path);
          await expect(page.locator('html')).toHaveAttribute('data-theme', preference);
          await expect(page.locator('html')).toHaveCSS(
            'color-scheme',
            preference === 'auto' ? system : preference,
          );
          await expect(page.getByRole('combobox', { name: 'Select a theme' })).toHaveValue(
            preference === 'auto' ? 'light' : preference,
          );
          await expect(page.locator('#theme-script')).toHaveCount(0);
          const foreground = await page
            .locator('body')
            .evaluate((element) => getComputedStyle(element).color);
          await expect(page.getByRole('banner')).toHaveCSS('color', foreground);
          await expect(page.locator('main')).toHaveCSS('color', foreground);
          const background = await page
            .locator('body')
            .evaluate((element) => getComputedStyle(element).backgroundColor);
          await expect(page.locator('main')).toHaveCSS('background-color', background);
          await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        }
        if (preference === 'auto') {
          const changed = system === 'dark' ? 'light' : 'dark';
          await page.emulateMedia({ colorScheme: changed });
          await expect(page.locator('html')).toHaveCSS('color-scheme', changed);
        }
      } finally {
        await context.close();
      }
    });
  }
}

test('an automatic preference displays the active system theme without offering Auto', async ({
  baseURL,
  browser,
}) => {
  const context = await browser.newContext({ baseURL: baseURL, colorScheme: 'dark' });
  await context.addCookies([{ name: 'site-theme', url: baseURL, value: 'auto' }]);
  const page = await context.newPage();

  try {
    await page.goto('/');
    const selector = page.getByRole('combobox', { name: 'Select a theme' });
    await expect(selector).toHaveValue('dark');
    await expect(selector.getByRole('option', { name: 'Auto' })).toHaveCount(0);
  } finally {
    await context.close();
  }
});

test('theme selection persists across reloads and locale changes', async ({ page, context }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.getByRole('combobox', { name: 'Select a theme' })).toHaveValue('dark');
  for (const preference of ['light', 'dark']) {
    await page.getByRole('combobox', { name: 'Select a theme' }).selectOption(preference);
    await expect(page.locator('html')).toHaveAttribute('data-theme', preference);
    await expect
      .poll(
        async () => (await context.cookies()).find((cookie) => cookie.name === 'site-theme')?.value,
      )
      .toBe(preference);
    await expect(page.getByRole('combobox', { name: 'Select a theme' })).toBeEnabled();
    await page.reload();
    await expect(page.getByRole('combobox', { name: 'Select a theme' })).toHaveValue(preference);
    await expect(page.locator('html')).toHaveCSS('color-scheme', preference);
  }
  await page.getByRole('combobox', { name: 'Select a theme' }).selectOption('light');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect
    .poll(
      async () => (await context.cookies()).find((cookie) => cookie.name === 'site-theme')?.value,
    )
    .toBe('light');
  const languageSelector = page.getByRole('combobox', { name: 'Language' });
  await languageSelector.selectOption('pt');
  await expect(languageSelector).toHaveValue('pt');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'light');
});

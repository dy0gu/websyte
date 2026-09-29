import { expect, test } from '@playwright/test'

const baseURL = process.env.THEME_TEST_URL || 'http://localhost:3000'

for (const preference of ['light', 'dark', 'auto'] as const) {
  for (const system of ['light', 'dark'] as const) {
    test(`${preference} with ${system} system renders correctly without JavaScript`, async ({
      browser,
    }) => {
      const context = await browser.newContext({ javaScriptEnabled: false, colorScheme: system })
      await context.addCookies([{ name: 'site-theme', value: preference, url: baseURL }])
      const page = await context.newPage()
      try {
        // Include the archive that previously forced static rendering.
        for (const path of ['/en', '/en/posts']) {
          await page.goto(`${baseURL}${path}`)
          await expect(page.locator('html')).toHaveAttribute('data-theme', preference)
          await expect(page.locator('html')).toHaveCSS(
            'color-scheme',
            preference === 'auto' ? system : preference,
          )
          await expect(page.getByRole('combobox', { name: 'Select a theme' })).toHaveValue(
            preference,
          )
          await expect(page.locator('#theme-script')).toHaveCount(0)
          const foreground = await page
            .locator('body')
            .evaluate((element) => getComputedStyle(element).color)
          await expect(page.getByRole('banner')).toHaveCSS('color', foreground)
        }
        if (preference === 'auto') {
          const changed = system === 'dark' ? 'light' : 'dark'
          await page.emulateMedia({ colorScheme: changed })
          await expect(page.locator('html')).toHaveCSS('color-scheme', changed)
        }
      } finally {
        await context.close()
      }
    })
  }
}

test('theme selection persists across reloads and locale changes', async ({ page, context }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto(`${baseURL}/en`)
  for (const preference of ['light', 'dark', 'auto']) {
    await page.getByRole('combobox', { name: 'Select a theme' }).selectOption(preference)
    await expect(page.locator('html')).toHaveAttribute('data-theme', preference)
    await expect
      .poll(
        async () => (await context.cookies()).find((cookie) => cookie.name === 'site-theme')?.value,
      )
      .toBe(preference)
    await expect(page.getByRole('combobox', { name: 'Select a theme' })).toBeEnabled()
    await page.reload()
    await expect(page.getByRole('combobox', { name: 'Select a theme' })).toHaveValue(preference)
    await expect(page.locator('html')).toHaveCSS(
      'color-scheme',
      preference === 'auto' ? 'dark' : preference,
    )
  }
  await page.getByRole('combobox', { name: 'Select a theme' }).selectOption('light')
  await expect(page.getByRole('combobox', { name: 'Select a theme' })).toBeEnabled()
  await page.getByRole('combobox', { name: 'Language' }).selectOption('pt')
  await expect(page).toHaveURL(`${baseURL}/pt`)
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await expect(page.locator('html')).toHaveCSS('color-scheme', 'light')
})

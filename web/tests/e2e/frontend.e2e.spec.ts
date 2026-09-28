import { expect, test } from '@playwright/test'

test('redirects old URLs and switches between English and Portuguese', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await expect(page).toHaveURL('http://localhost:3000/en')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(
    'I build software that works',
  )
  await page.getByRole('combobox', { name: 'Language' }).selectOption('pt')
  await expect(page).toHaveURL('http://localhost:3000/pt')
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt')
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(
    'Crio software que funciona',
  )
  await expect(page.getByRole('link', { name: 'Pesquisar', exact: true })).toHaveAttribute(
    'href',
    '/pt/search',
  )
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'http://localhost:3000/pt',
  )
})

test('retains search query when changing language', async ({ page }) => {
  await page.goto('http://localhost:3000/en/search?q=software')
  await page.getByRole('combobox', { name: 'Language' }).selectOption('pt')
  await expect(page).toHaveURL('http://localhost:3000/pt/search?q=software')
  await expect(page.getByPlaceholder('Pesquisar')).toHaveValue('software')
})

test('does not add a locale to Payload admin or API routes', async ({ request }) => {
  const response = await request.get('http://localhost:3000/api/posts?locale=pt')
  expect(response.status()).toBe(200)
  expect(response.url()).toContain('/api/posts?locale=pt')
  const admin = await request.get('http://localhost:3000/admin')
  expect(new URL(admin.url()).pathname).toMatch(/^\/admin/)
})

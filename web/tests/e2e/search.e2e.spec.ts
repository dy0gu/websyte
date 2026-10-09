import { expect, test } from '@playwright/test';
import { scope } from '$/tests/helpers/scope.e2e';

scope('Search', () => {
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
});

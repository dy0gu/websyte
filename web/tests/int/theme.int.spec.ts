import { act, cleanup, render } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { createElement } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, expect, it, vi } from 'vitest';
import en from '~/i18n/messages/en.json';
import { ThemeProvider, useTheme } from '~/providers/theme';
import { parseThemePreference } from '~/providers/theme/shared';
import { ThemeSelector } from '~/providers/theme/theme-selector';
import type { ThemeContextType, ThemePreference } from '~/providers/theme/types';

const { saveThemePreference } = vi.hoisted(() => ({ saveThemePreference: vi.fn() }));
vi.mock('~/providers/theme/actions', () => ({ saveThemePreference: saveThemePreference }));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  saveThemePreference.mockReset();
  document.documentElement.removeAttribute('data-theme');
});

let current: ThemeContextType;
function Consumer() {
  current = useTheme();
  return createElement(ThemeSelector);
}
const app = (preference: ThemePreference) =>
  createElement(NextIntlClientProvider, {
    // biome-ignore lint/correctness/noChildrenProp: createElement requires the component's required children prop
    children: createElement(ThemeProvider, {
      // biome-ignore lint/correctness/noChildrenProp: createElement requires the component's required children prop
      children: createElement(Consumer),
      initialPreference: preference,
    }),
    locale: 'en',
    messages: en,
    timeZone: 'UTC',
  });

it.each(['light', 'dark', 'auto'] as const)(
  'server-renders and hydrates the %s selection without scripts or mismatches',
  async (preference) => {
    const container = document.createElement('div');
    container.innerHTML = renderToString(app(preference));
    expect(container.querySelector('select')?.value).toBe(
      preference === 'auto' ? 'light' : preference,
    );
    expect(container.querySelector('script')).toBeNull();
    document.documentElement.dataset.theme = preference;
    const errors = vi.fn();
    let root: ReturnType<typeof hydrateRoot> | undefined;
    await act(async () => {
      root = hydrateRoot(container, app(preference), { onRecoverableError: errors });
    });
    expect(errors).not.toHaveBeenCalled();
    expect(document.documentElement.dataset.theme).toBe(preference);
    await act(async () => root?.unmount());
  },
);

it.each(['dark', 'light', 'auto'] as const)(
  'optimistically applies %s until the server confirms it',
  async (next) => {
    let complete: () => void = () => {};
    saveThemePreference.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          complete = resolve;
        }),
    );
    const view = render(app(next === 'dark' ? 'light' : 'dark'));
    act(() => current.setTheme(next));
    expect(document.documentElement.dataset.theme).toBe(next);
    expect(view.container.querySelector('select')?.value).toBe(next === 'auto' ? 'light' : next);
    expect(view.container.querySelector('select')?.disabled).toBe(true);
    expect(saveThemePreference).toHaveBeenCalledWith(next);
    // A Server Action refresh can replace the root layout attribute with the
    // previous server value while preserving the provider's client state.
    document.documentElement.dataset.theme = next === 'dark' ? 'light' : 'dark';
    await act(async () => {
      view.rerender(app(next));
      complete();
    });
    expect(document.documentElement.dataset.theme).toBe(next);
    expect(view.container.querySelector('select')?.disabled).toBe(false);
  },
);

it('reverts an unsuccessful save and exposes an accessible retry message', async () => {
  let fail: (reason: Error) => void = () => {};
  saveThemePreference.mockImplementation(
    () =>
      new Promise<void>((_, reject) => {
        fail = reject;
      }),
  );
  const view = render(app('light'));
  act(() => current.setTheme('dark'));
  expect(document.documentElement.dataset.theme).toBe('dark');
  await act(async () => {
    fail(new Error('Network unavailable'));
  });
  expect(document.documentElement.dataset.theme).toBe('light');
  expect(view.container.querySelector('select')?.disabled).toBe(false);
  expect(view.getByRole('alert').textContent).toBe(en.UI.themeSaveError);
});

it.each([undefined, null, '', 'invalid', 'auto'])('defaults cookie value %s to Auto', (value) => {
  expect(parseThemePreference(value)).toBe('auto');
});

it.each(['light', 'dark'])('accepts the %s cookie', (value) => {
  expect(parseThemePreference(value)).toBe(value);
});

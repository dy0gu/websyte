// @vitest-environment node

import { afterEach, expect, it, vi } from 'vitest';
import { saveThemePreference } from '~/providers/theme/actions';
import { themeCookieMaxAge, themeCookieName } from '~/providers/theme/shared';
import type { ThemePreference } from '~/providers/theme/types';

const { cookies, set } = vi.hoisted(() => {
  const set = vi.fn();
  return { cookies: vi.fn(async () => ({ set: set })), set: set };
});
vi.mock('next/headers', () => ({ cookies: cookies }));

afterEach(() => {
  vi.clearAllMocks();
});

it.each(['light', 'dark', 'auto'] as const)(
  'sets the %s preference on the server',
  async (preference: ThemePreference) => {
    await saveThemePreference(preference);
    expect(set).toHaveBeenCalledWith(
      themeCookieName,
      preference,
      expect.objectContaining({
        httpOnly: true,
        maxAge: themeCookieMaxAge,
        path: '/',
        sameSite: 'lax',
      }),
    );
  },
);

it.each(['invalid', '', null, undefined, { theme: 'dark' }])(
  'rejects invalid action input %s before touching cookies',
  async (value: unknown) => {
    await expect(saveThemePreference(value as ThemePreference)).rejects.toThrow(
      'Invalid theme preference',
    );
    expect(cookies).not.toHaveBeenCalled();
    expect(set).not.toHaveBeenCalled();
  },
);

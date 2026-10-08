'use server';

import { cookies } from 'next/headers';

import { env } from '$/env';
import { themeCookieMaxAge, themeCookieName } from '~/providers/theme/shared';
import { type ThemePreference, themeIsValid } from '~/providers/theme/types';

export async function saveThemePreference(preference: ThemePreference): Promise<void> {
  if (preference !== 'auto' && !themeIsValid(preference)) {
    throw new Error('Invalid theme preference');
  }

  const cookieStore = await cookies();
  cookieStore.set(themeCookieName, preference, {
    httpOnly: true,
    maxAge: themeCookieMaxAge,
    path: '/',
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
  });
}

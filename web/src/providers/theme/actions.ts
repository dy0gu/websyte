'use server'

import { cookies } from 'next/headers'
import { themeCookieMaxAge, themeCookieName } from './shared'
import { type ThemePreference, themeIsValid } from './types'

export async function saveThemePreference(preference: ThemePreference): Promise<void> {
  if (preference !== 'auto' && !themeIsValid(preference)) {
    throw new Error('Invalid theme preference')
  }

  const cookieStore = await cookies()
  cookieStore.set(themeCookieName, preference, {
    path: '/',
    maxAge: themeCookieMaxAge,
    sameSite: 'lax',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  })
}

import { type ThemePreference, themeIsValid } from './types'

export const themeCookieName = 'site-theme'
export const themeCookieMaxAge = 60 * 60 * 24 * 365

export const parseThemePreference = (value: unknown): ThemePreference =>
  themeIsValid(value) ? value : 'auto'

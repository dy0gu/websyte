import { type Theme, themeIsValid } from './types'

export const themeLocalStorageKey = 'payload-theme'
export const themeMediaQuery = '(prefers-color-scheme: dark)'
export const defaultTheme: Theme = 'light'

export const getImplicitPreference = (): Theme =>
  typeof window.matchMedia === 'function'
    ? window.matchMedia(themeMediaQuery).matches
      ? 'dark'
      : 'light'
    : defaultTheme

export const getStoredPreference = (): Theme | null => {
  try {
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    return themeIsValid(preference) ? preference : null
  } catch {
    return null
  }
}

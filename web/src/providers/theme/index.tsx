'use client'

import {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import {
  getImplicitPreference,
  getStoredPreference,
  themeLocalStorageKey,
  themeMediaQuery,
} from './shared'
import { type Theme, type ThemeContextType, themeIsValid } from './types'

const ThemeContext = createContext<ThemeContextType>({
  setTheme: () => null,
  theme: undefined,
  preference: undefined,
})

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Server rendering and the first hydration render must have identical state.
  // The head script owns the initial colors, independently of React loading.
  const [theme, setThemeState] = useState<Theme>()
  const [preference, setPreference] = useState<Theme | null>()
  const preferenceRef = useRef<Theme | null>(null)

  const applyPreference = useCallback((next: Theme | null) => {
    preferenceRef.current = next
    const resolved = next ?? getImplicitPreference()
    document.documentElement.setAttribute('data-theme', resolved)
    document.documentElement.style.colorScheme = resolved
    setPreference(next)
    setThemeState(resolved)
  }, [])

  const setTheme = useCallback(
    (next: Theme | null) => {
      try {
        if (next === null) window.localStorage.removeItem(themeLocalStorageKey)
        else window.localStorage.setItem(themeLocalStorageKey, next)
      } catch {
        // Theme changes still work when persistence is unavailable.
      }
      applyPreference(next)
    },
    [applyPreference],
  )

  useLayoutEffect(() => {
    // Also restore attributes cleared by React's development remount.
    applyPreference(getStoredPreference())
    const media =
      typeof window.matchMedia === 'function' ? window.matchMedia(themeMediaQuery) : null
    const onSystemChange = () => {
      if (preferenceRef.current === null) applyPreference(null)
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key === themeLocalStorageKey || event.key === null) {
        applyPreference(themeIsValid(event.newValue) ? event.newValue : null)
      }
    }
    media?.addEventListener('change', onSystemChange)
    window.addEventListener('storage', onStorage)
    return () => {
      media?.removeEventListener('change', onSystemChange)
      window.removeEventListener('storage', onStorage)
    }
  }, [applyPreference])

  return <ThemeContext value={{ setTheme, theme, preference }}>{children}</ThemeContext>
}

export const useTheme = (): ThemeContextType => use(ThemeContext)

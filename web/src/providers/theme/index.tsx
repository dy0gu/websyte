'use client'

import {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useLayoutEffect,
  useOptimistic,
  useState,
  useTransition,
} from 'react'
import { saveThemePreference } from './actions'
import type { ThemeContextType, ThemePreference } from './types'

const ThemeContext = createContext<ThemeContextType>({
  setTheme: () => null,
  preference: 'auto',
  isPending: false,
  saveFailed: false,
})

export const ThemeProvider = ({
  children,
  initialPreference,
}: {
  children: ReactNode
  initialPreference: ThemePreference
}) => {
  const [preference, setOptimisticPreference] = useOptimistic(initialPreference)
  const [isPending, startTransition] = useTransition()
  const [saveFailed, setSaveFailed] = useState(false)

  // CSS handles the first paint. Optimistic changes apply before the next paint;
  // failed saves revert to the server preference when the transition finishes.
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', preference)
  }, [preference])

  const setTheme = useCallback(
    (next: ThemePreference) => {
      setSaveFailed(false)
      startTransition(async () => {
        setOptimisticPreference(next)
        try {
          // Setting a cookie in a Server Action also refreshes the server layout.
          await saveThemePreference(next)
        } catch {
          setSaveFailed(true)
        }
      })
    },
    [setOptimisticPreference],
  )

  return (
    <ThemeContext value={{ setTheme, preference, isPending, saveFailed }}>{children}</ThemeContext>
  )
}

export const useTheme = (): ThemeContextType => use(ThemeContext)

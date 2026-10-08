'use client';

import {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useLayoutEffect,
  useState,
  useTransition,
} from 'react';
import { saveThemePreference } from '~/providers/theme/actions';
import type { ThemeContextType, ThemePreference } from '~/providers/theme/types';

const ThemeContext = createContext<ThemeContextType>({
  isPending: false,
  preference: 'auto',
  saveFailed: false,
  setTheme: () => null,
});

export const ThemeProvider = ({
  children,
  initialPreference,
}: {
  children: ReactNode;
  initialPreference: ThemePreference;
}) => {
  const [preference, setPreference] = useState<ThemePreference>(initialPreference);
  const [isPending, startTransition] = useTransition();
  const [saveFailed, setSaveFailed] = useState(false);

  // CSS handles the first paint. Optimistic changes apply before the next paint;
  // failed saves revert to the server preference when the transition finishes.
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', preference);
  }, [preference]);

  const setTheme = useCallback(
    (next: ThemePreference) => {
      setSaveFailed(false);
      setPreference(next);
      startTransition(async () => {
        try {
          // Setting a cookie in a Server Action also refreshes the server layout.
          await saveThemePreference(next);
        } catch {
          setPreference(initialPreference);
          setSaveFailed(true);
        }
      });
    },
    [initialPreference],
  );

  return (
    <ThemeContext
      value={{
        isPending: isPending,
        preference: preference,
        saveFailed: saveFailed,
        setTheme: setTheme,
      }}
    >
      {children}
    </ThemeContext>
  );
};

export const useTheme = (): ThemeContextType => use(ThemeContext);

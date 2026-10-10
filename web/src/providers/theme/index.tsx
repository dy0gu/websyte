'use client';

import {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { saveThemePreference } from '~/providers/theme/client';
import type { ThemeContextType, ThemePreference } from '~/providers/theme/types';

const ThemeContext = createContext<ThemeContextType>({
  isPending: false,
  preference: 'auto',
  saveFailed: false,
  setTheme: () => null,
  waitForThemeSave: () => Promise.resolve(),
});

export const ThemeProvider = ({
  children,
  initialPreference,
}: {
  children: ReactNode;
  initialPreference: ThemePreference;
}) => {
  const [preference, setPreference] = useState<ThemePreference>(initialPreference);
  const currentPreference = useRef<ThemePreference>(initialPreference);
  const pendingSave = useRef<Promise<void>>(Promise.resolve());

  // CSS handles the first paint. Keep the latest client choice in a ref so an
  // incoming server render cannot restore a stale root attribute.
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', currentPreference.current);
  });

  const setTheme = useCallback((next: ThemePreference) => {
    currentPreference.current = next;
    document.documentElement.setAttribute('data-theme', next);
    setPreference(next);

    saveThemePreference(next);
    pendingSave.current = Promise.resolve();
  }, []);

  const waitForThemeSave = useCallback(() => pendingSave.current, []);

  return (
    <ThemeContext
      value={{
        isPending: false,
        preference: preference,
        saveFailed: false,
        setTheme: setTheme,
        waitForThemeSave: waitForThemeSave,
      }}
    >
      {children}
    </ThemeContext>
  );
};

export const useTheme = (): ThemeContextType => use(ThemeContext);

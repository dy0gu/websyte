'use client';

import {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useLayoutEffect,
  useRef,
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
  const pendingSave = useRef<Promise<void>>(Promise.resolve());
  const [isPending, startTransition] = useTransition();
  const [saveFailed, setSaveFailed] = useState(false);

  // CSS handles the first paint. A Server Action refresh can replace the root
  // layout's attribute with a stale server value while preserving this client
  // state, so reassert the client preference after every render.
  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', preference);
  });

  const setTheme = useCallback(
    (next: ThemePreference) => {
      setSaveFailed(false);
      setPreference(next);

      let completeSave: () => void;
      const save = new Promise<void>((resolve) => {
        completeSave = resolve;
      });
      pendingSave.current = save;

      startTransition(async () => {
        try {
          // Invoking the Server Action inside the transition keeps controls
          // disabled until its route refresh has been applied.
          await saveThemePreference(next);
        } catch {
          setPreference(initialPreference);
          setSaveFailed(true);
        } finally {
          completeSave();
        }
      });
    },
    [initialPreference],
  );

  const waitForThemeSave = useCallback(() => pendingSave.current, []);

  return (
    <ThemeContext
      value={{
        isPending: isPending,
        preference: preference,
        saveFailed: saveFailed,
        setTheme: setTheme,
        waitForThemeSave: waitForThemeSave,
      }}
    >
      {children}
    </ThemeContext>
  );
};

export const useTheme = (): ThemeContextType => use(ThemeContext);

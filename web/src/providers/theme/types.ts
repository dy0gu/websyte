export type Theme = 'dark' | 'light';
export type ThemePreference = Theme | 'auto';

export type ThemeContextType = {
  setTheme: (theme: ThemePreference) => void;
  preference: ThemePreference;
  isPending: boolean;
  saveFailed: boolean;
};

export function themeIsValid(value: unknown): value is Theme {
  return value === 'dark' || value === 'light';
}

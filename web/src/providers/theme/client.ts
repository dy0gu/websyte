import { themeCookieMaxAge, themeCookieName } from '~/providers/theme/shared';
import type { ThemePreference } from '~/providers/theme/types';

export function saveThemePreference(preference: ThemePreference): void {
  // biome-ignore lint/suspicious/noDocumentCookie: this non-sensitive preference must update synchronously in all supported browsers
  document.cookie = `${themeCookieName}=${preference}; Max-Age=${themeCookieMaxAge}; Path=/; SameSite=Lax`;
}

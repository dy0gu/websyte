import { defaultTheme, themeLocalStorageKey, themeMediaQuery } from '../shared'

// A native inline script runs during HTML parsing, before content can paint.
// next/script beforeInteractive waits for the Next.js bootstrap instead.
export const InitTheme = () => (
  <script
    // biome-ignore lint/security/noDangerouslySetInnerHtml: only build-time constants are interpolated
    dangerouslySetInnerHTML={{
      __html: `(() => {
        let preference;
        try { preference = localStorage.getItem('${themeLocalStorageKey}'); } catch {}
        const theme = preference === 'light' || preference === 'dark'
          ? preference
          : typeof matchMedia === 'function'
            ? (matchMedia('${themeMediaQuery}').matches ? 'dark' : 'light')
            : '${defaultTheme}';
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.style.colorScheme = theme;
      })();`,
    }}
    id="theme-script"
  />
)

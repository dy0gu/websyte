import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import type React from 'react';
import styles from '~/app/(frontend)/layout.module.css';
import { Footer } from '~/footer/component';
import { Header } from '~/header/component';

import { ThemeProvider } from '~/providers/theme';
import { parseThemePreference, themeCookieName } from '~/providers/theme/shared';
import { getServerSideURL } from '~/utilities/get-server-url';
import { mergeOpenGraph } from '~/utilities/merge-open-graph';
import { cn } from '~/utilities/ui';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [locale, cookieStore] = await Promise.all([getLocale(), cookies()]);
  const preference = parseThemePreference(cookieStore.get(themeCookieName)?.value);
  return (
    <html
      className={cn(styles.root, GeistSans.variable, GeistMono.variable)}
      data-theme={preference}
      lang={locale}
    >
      <head>
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className={styles.body}>
        <NextIntlClientProvider>
          <ThemeProvider initialPreference={preference}>
            <Header />
            {children}
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
  },
};

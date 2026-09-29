import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import type React from 'react'
import { Footer } from '@/footer/component'
import { Header } from '@/header/component'
import { isLocale, locales } from '@/i18n/config'
import { ThemeProvider } from '@/providers/theme'
import { parseThemePreference, themeCookieName } from '@/providers/theme/shared'
import { getServerSideURL } from '@/utilities/get-url'
import { mergeOpenGraph } from '@/utilities/merge-open-graph'
import { cn } from '@/utilities/ui'
import styles from './layout.module.css'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const preference = parseThemePreference((await cookies()).get(themeCookieName)?.value)
  return (
    <html
      className={cn(styles.root, GeistSans.variable, GeistMono.variable)}
      lang={locale}
      data-theme={preference}
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
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
  },
}

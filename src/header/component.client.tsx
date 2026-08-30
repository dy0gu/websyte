'use client'
import { useHeaderTheme } from '@/providers/header-theme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/logo/logo'
import { HeaderNav } from './nav'
import { cn } from '@/utilities/ui'
import shared from '@/styles/shared.module.css'
import styles from './component.module.css'
import themeStyles from '@/styles/theme.module.css'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname intentionally triggers the reset
  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme, theme])

  return (
    <header
      className={cn(shared.container, styles.root, theme === 'dark' && themeStyles.dark)}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className={styles.inner}>
        <Link href="/">
          <Logo loading="eager" priority="high" className={styles.logo} />
        </Link>
        <HeaderNav data={data} />
      </div>
    </header>
  )
}

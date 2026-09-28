'use client'
import type React from 'react'
import { useEffect, useState } from 'react'
import { Logo } from '@/components/logo/logo'
import { Link, usePathname } from '@/i18n/navigation'

import type { Header } from '@/payload-types'
import { useHeaderTheme } from '@/providers/header-theme'
import shared from '@/styles/shared.module.css'
import themeStyles from '@/styles/theme.module.css'
import { cn } from '@/utilities/ui'
import styles from './component.module.css'
import { HeaderNav } from './nav'

interface HeaderClientProps {
  data: Header
  isLoggedIn: boolean
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, isLoggedIn }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname intentionally triggers the reset
  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname])

  useEffect(() => {
    if (headerTheme !== undefined && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme, theme])

  return (
    <header
      className={cn(styles.root, theme === 'dark' && themeStyles.dark)}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className={cn(shared.container, styles.inner)}>
        <Link href="/">
          <Logo className={styles.logo} />
        </Link>
        <HeaderNav data={data} isLoggedIn={isLoggedIn} />
      </div>
    </header>
  )
}

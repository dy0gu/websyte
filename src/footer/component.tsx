import { getCachedGlobal } from '@/utilities/get-globals'
import Link from 'next/link'
import { ThemeSelector } from '@/providers/theme/theme-selector'
import { CMSLink } from '@/components/link'
import { Logo } from '@/components/logo/logo'
import { cn } from '@/utilities/ui'
import shared from '@/styles/shared.module.css'
import styles from './component.module.css'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []

  return (
    <footer className={styles.footer}>
      <div className={cn(shared.container, styles.inner)}>
        <Link className={styles.logoLink} href="/">
          <Logo />
        </Link>

        <div className={styles.controls}>
          <ThemeSelector />
          <nav className={styles.nav}>
            {navItems.map(({ link }, i) => {
              return <CMSLink className={styles.link} key={i} {...link} />
            })}
          </nav>
        </div>
      </div>
    </footer>
  )
}

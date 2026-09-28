'use client'
import { useTranslations } from 'next-intl'
import type React from 'react'
import { CMSLink } from '@/components/cms-link'
import { LanguageSwitcher } from '@/components/language-switcher'
import { SmoothLink } from '@/components/smooth-link'
import { Link } from '@/i18n/navigation'
import type { Header as HeaderType } from '@/payload-types'
import styles from './index.module.css'

export const HeaderNav: React.FC<{ data: HeaderType; isLoggedIn: boolean }> = ({
  data,
  isLoggedIn,
}) => {
  const t = useTranslations('UI')
  const navItems = data?.navItems || []

  return (
    <nav aria-label={t('mainNav')} className={styles.nav}>
      {isLoggedIn && (
        <a href="/admin" target="_blank" rel="noreferrer">
          Admin
        </a>
      )}
      <SmoothLink href="/" targetId="work">
        {t('projects')}
      </SmoothLink>
      <SmoothLink href="/" targetId="writing">
        {t('posts')}
      </SmoothLink>
      <SmoothLink href="/" targetId="contact">
        {t('contact')}
      </SmoothLink>
      <Link href="/search">{t('search')}</Link>
      {navItems.map(({ id, link }) => {
        return <CMSLink key={id || link.label} {...link} appearance="link" />
      })}
      <LanguageSwitcher />
    </nav>
  )
}

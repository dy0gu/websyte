'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'
import shared from '@/styles/shared.module.css'
import styles from './index.module.css'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className={styles.nav}>
      {navItems.map(({ link }, i) => {
        return <CMSLink key={i} {...link} appearance="link" />
      })}
      <Link href="/search">
        <span className={shared.srOnly}>Search</span>
        <SearchIcon className={styles.searchIcon} />
      </Link>
    </nav>
  )
}

'use client';
import { HouseIcon, SearchIcon, ShieldIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type React from 'react';
import { CMSLink } from '~/components/cms-link';
import { LanguageSwitcher } from '~/components/language-switcher';
import styles from '~/header/nav/index.module.css';
import { Link } from '~/i18n/navigation';
import type { Header as HeaderType } from '~/payload-types';
import { ThemeSelector } from '~/providers/theme/theme-selector';

export const HeaderNav: React.FC<{ data: HeaderType; isLoggedIn: boolean }> = ({
  data,
  isLoggedIn,
}) => {
  const t = useTranslations('UI');
  const navItems = data?.navItems || [];

  return (
    <nav aria-label={t('mainNav')} className={styles.nav}>
      {isLoggedIn && (
        <a
          aria-label="Admin"
          className={styles.adminLink}
          href="/admin"
          rel="noreferrer"
          target="_blank"
        >
          <ShieldIcon aria-hidden="true" size={18} strokeWidth={1.75} />
        </a>
      )}
      <Link aria-label={t('home')} className={styles.homeLink} href="/">
        <HouseIcon aria-hidden="true" size={18} strokeWidth={1.75} />
      </Link>
      <Link aria-label={t('search')} className={styles.searchLink} href="/search">
        <SearchIcon aria-hidden="true" size={18} strokeWidth={1.75} />
      </Link>
      {navItems.length > 0 ? (
        navItems.map(({ id, link }) => {
          return <CMSLink key={id || link.label} {...link} appearance="link" />;
        })
      ) : (
        <>
          <Link href="/projects">{t('projects')}</Link>
          <Link href="/posts">{t('posts')}</Link>
          <Link href="/#contact">{t('contact')}</Link>
        </>
      )}
      <div className={styles.preferences}>
        <LanguageSwitcher />
        <ThemeSelector />
      </div>
    </nav>
  );
};

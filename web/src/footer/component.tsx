import { getTranslations } from 'next-intl/server';
import styles from '~/footer/component.module.css';

export async function Footer() {
  const t = await getTranslations('UI');
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <nav aria-label={t('socialLinks')} className={styles.nav}>
          <a href="https://linkedin.com" rel="noreferrer" target="_blank">
            LinkedIn ↗
          </a>
          <a href="https://github.com" rel="noreferrer" target="_blank">
            GitHub ↗
          </a>
        </nav>
        <p className={styles.copyright}>{/*© 2026 - {new Date().getFullYear()}*/}</p>
      </div>
    </footer>
  );
}

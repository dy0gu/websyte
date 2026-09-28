import { useTranslations } from 'next-intl'
import { SmoothLink } from '@/components/smooth-link'
import styles from './home.module.css'

export function HeroSection() {
  const t = useTranslations('UI')
  return (
    <section className={styles.hero}>
      <div aria-hidden="true" className={styles.heroGrid} />
      <div className={styles.heroTitleWrap}>
        <h1 className={styles.heroTitle} aria-label={t('heroLabel')}>
          <span className={styles.titleLine}>
            <span>{t('heroOne')}</span>
          </span>
          <span className={`${styles.titleLine} ${styles.titleLineOffset}`}>
            <span>{t('heroTwo')}</span>
          </span>
          <span className={`${styles.titleLine} ${styles.titleOutline}`}>
            <span>{t('heroThree')}</span>
          </span>
        </h1>
      </div>

      <div className={styles.heroBottom} data-reveal>
        <p>01110011 01100011 01110010 01101111 01101100 01101100</p>
        <SmoothLink aria-label={t('viewWork')} className={styles.roundLink} targetId="work">
          <span>↓</span>
        </SmoothLink>
      </div>
    </section>
  )
}

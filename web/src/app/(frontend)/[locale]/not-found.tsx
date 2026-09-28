import { useTranslations } from 'next-intl'
import styles from '@/app/(frontend)/pages.module.css'
import { ArchiveHero } from '@/components/archive-hero/archive-hero'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'

export default function NotFound() {
  const t = useTranslations('UI')
  return (
    <main className={styles.page}>
      <ArchiveHero
        description={t('notFoundDescription')}
        eyebrow={t('notFoundEyebrow')}
        title={t('notFoundTitle')}
      />
      <div className={styles.notFoundAction}>
        <Button asChild>
          <Link href="/">{t('goHome')}</Link>
        </Button>
      </div>
    </main>
  )
}

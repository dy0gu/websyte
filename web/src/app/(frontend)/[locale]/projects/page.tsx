import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getLocale, getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import styles from '@/app/(frontend)/pages.module.css'
import { ArchiveHero } from '@/components/archive-hero/archive-hero'
import { toHomeProjects } from '@/components/home/project-data'
import { WorkSection } from '@/components/home/work-section'
import { localizedMetadata } from '@/i18n/metadata'

export const revalidate = 600

export default async function ProjectsPage() {
  const { isEnabled: draft } = await draftMode()
  const t = await getTranslations('UI')
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    locale: await getLocale(),
    collection: 'projects',
    depth: 1,
    draft,
    limit: 100,
    overrideAccess: draft,
    pagination: false,
    sort: '-publishedAt',
  })
  const projects = toHomeProjects(result.docs)

  return (
    <main className={styles.page}>
      <ArchiveHero
        description={t('projectsDescription')}
        eyebrow={t('projectsEyebrow')}
        title={t('projectsTitle')}
      />
      {projects.length > 0 ? (
        <WorkSection kicker={t('allProjects')} projects={projects} showAllLink={false} />
      ) : (
        <p className={styles.emptyState}>{t('noProjects')}</p>
      )}
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('UI')
  return {
    ...localizedMetadata('/projects', await getLocale()),
    title: `${t('projectsTitle')} | Diogo`,
    description: t('projectsDescription'),
  }
}

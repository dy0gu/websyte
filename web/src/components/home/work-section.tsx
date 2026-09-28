import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

import { getMediaUrl } from '@/utilities/get-media-url'
import styles from './home.module.css'
import type { HomeProject } from './types'

const visualClasses = {
  violet: styles.projectKinetic,
  coral: styles.projectRituals,
  silver: styles.projectMachine,
}

const formatYearRange = (projects: HomeProject[]) => {
  const years = projects
    .map(({ publishedAt }) => (publishedAt ? new Date(publishedAt).getFullYear() : undefined))
    .filter((year): year is number => year !== undefined && !Number.isNaN(year))
    .sort()

  if (years.length === 0) return null

  const oldestYear = years[0]
  const newestYear = years[years.length - 1]

  return oldestYear === newestYear ? String(oldestYear) : `${oldestYear} - ${newestYear}`
}

export function WorkSection({
  kicker,
  projects,
  showAllLink = true,
}: {
  kicker?: string
  projects: HomeProject[]
  showAllLink?: boolean
}) {
  const t = useTranslations('UI')
  const yearRange = formatYearRange(projects)

  return (
    <section className={styles.work} id="work">
      <div className={styles.sectionIntro} data-reveal>
        <div className={styles.sectionMeta}>
          <p className={styles.kicker}>{kicker ?? t('latestProjects')}</p>
          {yearRange && <p className={styles.yearRange}>{yearRange}</p>}
        </div>
        {showAllLink && (
          <Link className={styles.allProjectsLink} href="/projects">
            {t('allProjects')}
          </Link>
        )}
      </div>

      <div className={styles.projectList}>
        {projects.map((project, index) => {
          const words = project.title.toUpperCase().split(' ')
          const projectIsExternal = project.projectURL?.startsWith('http')
          const sourceIsExternal = project.sourceURL?.startsWith('http')

          return (
            <article className={styles.project} data-reveal key={project.id}>
              <span className={styles.projectNumber}>{String(index + 1).padStart(2, '0')}</span>
              <div className={`${styles.projectVisual} ${visualClasses[project.visualStyle]}`}>
                {project.cover ? (
                  <Image
                    alt={project.cover.alt}
                    className={styles.projectCover}
                    fill
                    sizes="(max-width: 768px) 28vw, 15vw"
                    src={getMediaUrl(project.cover.url)}
                  />
                ) : project.visualStyle === 'violet' ? (
                  <div className={styles.kineticArt} aria-hidden="true">
                    <span>{project.title.charAt(0)}</span>
                    <span>{project.title.charAt(1) || '/'}</span>
                    <i />
                  </div>
                ) : project.visualStyle === 'coral' ? (
                  <div className={styles.ritualArt} aria-hidden="true">
                    <span>{words[0]}</span>
                    <span>{words.slice(1).join(' ') || 'SYSTEM'}</span>
                    <i>{String(index + 1).padStart(2, '0')}</i>
                  </div>
                ) : (
                  <div className={styles.machineArt} aria-hidden="true">
                    <div />
                    <span>
                      {words[0]}
                      <br />
                      {words.slice(1).join(' ')}
                    </span>
                    <i>↗</i>
                  </div>
                )}
              </div>
              <div className={styles.projectCopy}>
                <h3>{project.title}</h3>
                <p className={styles.projectSummary}>{project.summary}</p>
              </div>
              <div className={styles.projectMeta}>
                <div className={styles.projectMetaHeader}>
                  <span>{project.typeLabel}</span>
                  {project.technologies.length > 0 && (
                    <span>{project.technologies.slice(0, 2).join(', ')}</span>
                  )}
                  {project.publishedAt && (
                    <time dateTime={project.publishedAt}>
                      {new Date(project.publishedAt).getFullYear()}
                    </time>
                  )}
                </div>
                {(project.projectURL || project.sourceURL) && (
                  <div className={styles.projectActions}>
                    {project.projectURL && (
                      <a
                        className={styles.projectAction}
                        href={project.projectURL}
                        rel={projectIsExternal ? 'noreferrer' : undefined}
                        target={projectIsExternal ? '_blank' : undefined}
                      >
                        {t('viewLive')}
                      </a>
                    )}
                    {project.sourceURL && (
                      <a
                        className={styles.projectAction}
                        href={project.sourceURL}
                        rel={sourceIsExternal ? 'noreferrer' : undefined}
                        target={sourceIsExternal ? '_blank' : undefined}
                      >
                        {t('viewSource')}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

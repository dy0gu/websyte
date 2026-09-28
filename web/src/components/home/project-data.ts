import type { Media, Project } from '@/payload-types'
import type { HomeProject } from './types'

export function toHomeProjects(projects: Project[]): HomeProject[] {
  return projects.map((project) => {
    const cover = typeof project.coverImage === 'object' ? (project.coverImage as Media) : null

    return {
      cover: cover?.url
        ? {
            alt: cover.alt || project.title,
            height: cover.height || undefined,
            url: cover.url,
            width: cover.width || undefined,
          }
        : null,
      id: project.id,
      projectURL: project.projectURL,
      publishedAt: project.publishedAt,
      sourceURL: project.sourceURL,
      summary: project.summary,
      technologies: project.technologies?.map(({ name }) => name) || [],
      title: project.title,
      typeLabel: project.typeLabel,
      visualStyle: project.visualStyle,
    }
  })
}

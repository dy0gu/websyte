import type { Payload, RequiredDataFromCollectionSlug } from 'payload'

const projects: RequiredDataFromCollectionSlug<'projects'>[] = [
  {
    title: 'Relay',
    slug: 'relay',
    _status: 'published',
    summary:
      'A real-time operations workspace that turns alerts, ownership, and incident notes into one focused timeline.',
    typeLabel: 'Product engineering',
    technologies: [{ name: 'Next.js' }, { name: 'TypeScript' }, { name: 'PostgreSQL' }],
    projectURL: 'https://example.com/relay',
    sourceURL: 'https://github.com/example/relay',
    visualStyle: 'violet',
    publishedAt: '2026-02-10T09:00:00.000Z',
  },
  {
    title: 'Northstar',
    slug: 'northstar',
    _status: 'published',
    summary:
      'An infrastructure cost explorer that helps teams understand spend, spot regressions, and assign ownership.',
    typeLabel: 'Cloud platform',
    technologies: [{ name: 'Go' }, { name: 'React' }, { name: 'ClickHouse' }],
    projectURL: 'https://example.com/northstar',
    sourceURL: 'https://github.com/example/northstar',
    visualStyle: 'coral',
    publishedAt: '2026-01-14T09:00:00.000Z',
  },
  {
    title: 'Field Notes',
    slug: 'field-notes',
    _status: 'published',
    summary:
      'An offline-first research notebook for collecting observations and synchronizing them when connectivity returns.',
    typeLabel: 'Web application',
    technologies: [{ name: 'React' }, { name: 'IndexedDB' }, { name: 'Node.js' }],
    projectURL: 'https://example.com/field-notes',
    sourceURL: 'https://github.com/example/field-notes',
    visualStyle: 'silver',
    publishedAt: '2025-12-03T09:00:00.000Z',
  },
]

export const seedFakeProjects = async (payload: Payload): Promise<void> => {
  payload.logger.info('Ensuring fake development projects exist...')

  for (const data of projects) {
    const existing = await payload.find({
      collection: 'projects',
      depth: 0,
      limit: 1,
      pagination: false,
      where: { slug: { equals: data.slug } },
    })

    const existingProject = existing.docs[0]

    if (existingProject) {
      await payload.update({
        collection: 'projects',
        id: existingProject.id,
        data,
        depth: 0,
        context: { disableRevalidate: true },
      })
    } else {
      await payload.create({
        collection: 'projects',
        data,
        depth: 0,
        context: { disableRevalidate: true },
      })
    }
  }

  payload.logger.info('Fake development projects are ready.')
}

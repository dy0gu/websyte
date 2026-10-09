import type { Payload, RequiredDataFromCollectionSlug } from 'payload';
import { getOrCreateSeedImage, type SeedImage } from '~/seeds/dev/media';

type ProjectSeed = RequiredDataFromCollectionSlug<'projects'>;
type SeedProject = ProjectSeed & { image: SeedImage };

const projects: SeedProject[] = [
  {
    _status: 'published',
    image: {
      alt: 'Software code displayed on a computer screen',
      filename: 'relay.jpg',
    },
    projectURL: 'https://example.com/relay',
    publishedAt: '2026-02-10T09:00:00.000Z',
    slug: 'relay',
    sourceURL: 'https://github.com/example/relay',
    summary:
      'A real-time operations workspace that turns alerts, ownership, and incident notes into one focused timeline.',
    technologies: [{ name: 'Next.js' }, { name: 'TypeScript' }, { name: 'PostgreSQL' }],
    title: 'Relay',
    typeLabel: 'Product engineering',
    visualStyle: 'violet',
  },
  {
    _status: 'published',
    image: {
      alt: 'Earth viewed from space at night',
      filename: 'northstar.jpg',
    },
    projectURL: 'https://example.com/northstar',
    publishedAt: '2026-01-14T09:00:00.000Z',
    slug: 'northstar',
    sourceURL: 'https://github.com/example/northstar',
    summary:
      'An infrastructure cost explorer that helps teams understand spend, spot regressions, and assign ownership.',
    technologies: [{ name: 'Go' }, { name: 'React' }, { name: 'ClickHouse' }],
    title: 'Northstar',
    typeLabel: 'Cloud platform',
    visualStyle: 'coral',
  },
  {
    _status: 'published',
    image: {
      alt: 'Person taking notes beside a laptop',
      filename: 'field-notes.jpg',
    },
    projectURL: 'https://example.com/field-notes',
    publishedAt: '2025-12-03T09:00:00.000Z',
    slug: 'field-notes',
    sourceURL: 'https://github.com/example/field-notes',
    summary:
      'An offline-first research notebook for collecting observations and synchronizing them when connectivity returns.',
    technologies: [{ name: 'React' }, { name: 'IndexedDB' }, { name: 'Node.js' }],
    title: 'Field Notes',
    typeLabel: 'Web application',
    visualStyle: 'silver',
  },
];

export const seedFakeProjects = async (payload: Payload): Promise<void> => {
  payload.logger.info('Ensuring fake development projects exist...');

  for (const project of projects) {
    const { image, ...data } = project;
    const coverImage = await getOrCreateSeedImage(payload, image);
    const projectData: ProjectSeed = { ...data, coverImage: coverImage };
    const existing = await payload.find({
      collection: 'projects',
      depth: 0,
      limit: 1,
      pagination: false,
      where: { slug: { equals: projectData.slug } },
    });

    const existingProject = existing.docs[0];

    if (existingProject) {
      await payload.update({
        collection: 'projects',
        context: { disableRevalidate: true },
        data: projectData,
        depth: 0,
        id: existingProject.id,
      });
    } else {
      await payload.create({
        collection: 'projects',
        context: { disableRevalidate: true },
        data: projectData,
        depth: 0,
      });
    }
  }

  payload.logger.info('Fake development projects are ready.');
};

import type { Payload, RequiredDataFromCollectionSlug } from 'payload';
import { defaultLocale, type Locale, locales } from '~/i18n/config';
import { getOrCreateSeedImage, type SeedImage } from '~/seeds/dev/media';

type ProjectSeed = RequiredDataFromCollectionSlug<'projects'>;
type SeedProject = ProjectSeed & { image: SeedImage };

const projects: SeedProject[] = [
  {
    _status: 'published',
    image: {
      alt: {
        en: 'Software code displayed on a computer screen',
        pt: 'Código de software apresentado num ecrã de computador',
      },
      filename: 'relay.jpg',
    },
    projectURL: 'https://example.com/relay',
    publishedAt: '2026-02-10T09:00:00.000Z',
    slug: 'relay',
    sourceURL: 'https://github.com/example/relay',
    summary:
      'A real-time operations workspace that turns alerts, ownership, and incident notes into one focused timeline.',
    technologies: [],
    title: 'Veyra',
    typeLabel: 'Product engineering',
    visualStyle: 'violet',
  },
  {
    _status: 'published',
    image: {
      alt: {
        en: 'Earth viewed from space at night',
        pt: 'Terra vista do espaço durante a noite',
      },
      filename: 'northstar.jpg',
    },
    projectURL: 'https://example.com/northstar',
    publishedAt: '2026-01-14T09:00:00.000Z',
    slug: 'northstar',
    sourceURL: 'https://github.com/example/northstar',
    summary:
      'An infrastructure cost explorer that helps teams understand spend, spot regressions, and assign ownership.',
    technologies: [],
    title: 'Orivon',
    typeLabel: 'Cloud platform',
    visualStyle: 'coral',
  },
  {
    _status: 'published',
    image: {
      alt: {
        en: 'Person taking notes beside a laptop',
        pt: 'Pessoa a tirar notas ao lado de um portátil',
      },
      filename: 'field-notes.jpg',
    },
    projectURL: 'https://example.com/field-notes',
    publishedAt: '2025-12-03T09:00:00.000Z',
    slug: 'field-notes',
    sourceURL: 'https://github.com/example/field-notes',
    summary:
      'An offline-first research notebook for collecting observations and synchronizing them when connectivity returns.',
    technologies: [],
    title: 'Lunexa',
    typeLabel: 'Web application',
    visualStyle: 'silver',
  },
];

type ProjectTranslation = Pick<ProjectSeed, 'summary' | 'title' | 'typeLabel'>;

const projectTranslations: Record<Locale, Partial<Record<string, ProjectTranslation>>> = {
  en: {},
  pt: {
    'field-notes': {
      summary:
        'Um caderno de investigação offline para recolher observações e sincronizá-las quando a ligação é restabelecida.',
      title: 'Lunexa',
      typeLabel: 'Aplicação web',
    },
    northstar: {
      summary:
        'Um explorador de custos de infraestrutura que ajuda as equipas a compreender gastos, detetar regressões e atribuir responsabilidades.',
      title: 'Orivon',
      typeLabel: 'Plataforma de cloud',
    },
    relay: {
      summary:
        'Um espaço de trabalho operacional em tempo real que reúne alertas, responsáveis e notas de incidentes numa única linha temporal.',
      title: 'Veyra',
      typeLabel: 'Engenharia de produto',
    },
  },
};

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

    const seededProject =
      existingProject ??
      (await payload.create({
        collection: 'projects',
        context: { disableRevalidate: true },
        data: projectData,
        depth: 0,
        locale: defaultLocale,
      }));

    for (const locale of locales) {
      const translation = projectTranslations[locale][project.slug];
      await payload.update({
        collection: 'projects',
        context: { disableRevalidate: true },
        data: { ...projectData, ...translation },
        depth: 0,
        id: seededProject.id,
        locale: locale,
      });
    }
  }

  payload.logger.info('Fake development projects are ready in all configured locales.');
};

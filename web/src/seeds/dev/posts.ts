import type { Payload, RequiredDataFromCollectionSlug } from 'payload';
import { defaultLocale, type Locale, locales } from '~/i18n/config';
import { getOrCreateSeedImage, type SeedImage } from '~/seeds/dev/media';

type PostSeed = RequiredDataFromCollectionSlug<'posts'>;
type SeedPost = PostSeed & { image: SeedImage };

const textNode = (text: string) => ({
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text: text,
  type: 'text',
  version: 1,
});

const paragraph = (text: string) => ({
  children: [textNode(text)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  type: 'paragraph',
  version: 1,
});

const heading = (text: string) => ({
  children: [textNode(text)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  tag: 'h2',
  type: 'heading',
  version: 1,
});

const content = (intro: string, title: string, body: string): PostSeed['content'] => ({
  root: {
    children: [paragraph(intro), heading(title), paragraph(body)],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
});

const posts: SeedPost[] = [
  {
    _status: 'published',
    content: content(
      'Complex products do not need to feel complicated. The best interfaces reveal decisions at the moment they become useful.',
      'Start with the decision, not the data',
      'A dashboard becomes easier to understand when every number supports a clear action. Group related signals, name the trade-offs, and keep exceptional states visible instead of decorating every possible metric equally.',
    ),
    image: {
      alt: {
        en: 'Close-up of an electronic circuit board',
        pt: 'Plano aproximado de uma placa de circuito eletrónico',
      },
      filename: 'building-calm-interfaces.jpg',
    },
    meta: {
      description:
        'Practical notes on reducing cognitive load without hiding the complexity users need.',
      title: 'Building Calm Interfaces for Complicated Systems',
    },
    publishedAt: '2026-02-18T09:00:00.000Z',
    slug: 'building-calm-interfaces',
    title: 'Building Calm Interfaces for Complicated Systems',
  },
  {
    _status: 'published',
    content: content(
      'Small services are useful teachers: every unnecessary dependency, unclear log line, and missing runbook becomes obvious quickly.',
      'Operational simplicity is a feature',
      'Choosing familiar tools made the service easier to deploy and easier to repair. A short health check, structured logs, and one useful dashboard paid for themselves long before the first feature rewrite.',
    ),
    image: {
      alt: {
        en: 'Rows of servers in a data center',
        pt: 'Filas de servidores num centro de dados',
      },
      filename: 'shipping-a-small-service.jpg',
    },
    meta: {
      description:
        'A field guide to observability, boring technology, and the work that starts after launch.',
      title: 'What I Learned Shipping a Small Service',
    },
    publishedAt: '2026-01-22T09:00:00.000Z',
    slug: 'shipping-a-small-service',
    title: 'What I Learned Shipping a Small Service',
  },
  {
    _status: 'published',
    content: content(
      'An API is a user interface. Its users happen to be developers, but they still benefit from consistency, guidance, and sensible defaults.',
      'Make the happy path unsurprising',
      'Clear resource names and predictable response shapes reduce the amount of documentation a consumer must keep in their head. When something fails, errors should explain both what happened and what the caller can do next.',
    ),
    image: {
      alt: {
        en: 'Developer writing code on a laptop',
        pt: 'Programador a escrever código num portátil',
      },
      filename: 'designing-apis-for-the-next-person.jpg',
    },
    meta: {
      description:
        'How consistent naming and useful errors make an API easier to adopt and maintain.',
      title: 'Designing APIs for the Next Person',
    },
    publishedAt: '2025-12-11T09:00:00.000Z',
    slug: 'designing-apis-for-the-next-person',
    title: 'Designing APIs for the Next Person',
  },
];

type PostTranslation = Pick<PostSeed, 'content' | 'meta' | 'title'>;

const postTranslations: Record<Locale, Partial<Record<string, PostTranslation>>> = {
  en: {},
  pt: {
    'building-calm-interfaces': {
      content: content(
        'Produtos complexos não precisam de parecer complicados. As melhores interfaces mostram decisões no momento em que se tornam úteis.',
        'Começa pela decisão, não pelos dados',
        'Um painel torna-se mais fácil de compreender quando cada número sustenta uma ação clara. Agrupa sinais relacionados, nomeia as escolhas e mantém os estados excecionais visíveis em vez de decorar todos os cenários possíveis.',
      ),
      meta: {
        description:
          'Notas práticas para reduzir a carga cognitiva sem esconder a complexidade de que as pessoas precisam.',
        title: 'Criar interfaces tranquilas para sistemas complexos',
      },
      title: 'Criar interfaces tranquilas para sistemas complexos',
    },
    'designing-apis-for-the-next-person': {
      content: content(
        'Uma API é uma interface de utilizador. Os seus utilizadores são programadores, mas continuam a beneficiar de consistência, orientação e predefinições sensatas.',
        'Torna o caminho feliz previsível',
        'Nomes de recursos claros e respostas previsíveis reduzem a documentação que quem consome a API precisa de memorizar. Quando algo falha, os erros devem explicar o que aconteceu e o que fazer a seguir.',
      ),
      meta: {
        description:
          'Como nomes consistentes e erros úteis tornam uma API mais fácil de adotar.',
        title: 'Desenhar APIs para a próxima pessoa',
      },
      title: 'Desenhar APIs para a próxima pessoa',
    },
    'shipping-a-small-service': {
      content: content(
        'Serviços pequenos são professores úteis: cada dependência desnecessária, linha de registo pouco clara e manual em falta torna-se rapidamente evidente.',
        'A simplicidade operacional é uma funcionalidade',
        'Escolher ferramentas familiares tornou o serviço mais fácil de implementar e reparar. Uma verificação de saúde curta, registos estruturados e um painel útil compensaram muito antes da primeira reescrita.',
      ),
      meta: {
        description:
          'Um guia de campo sobre observabilidade, tecnologia simples e o trabalho que começa após o lançamento.',
        title: 'O que aprendi ao lançar um pequeno serviço',
      },
      title: 'O que aprendi ao lançar um pequeno serviço',
    },
  },
};

export const seedFakePosts = async (payload: Payload): Promise<void> => {
  payload.logger.info('Ensuring fake development posts exist...');

  for (const post of posts) {
    const { image, ...data } = post;
    const imageId = await getOrCreateSeedImage(payload, image);
    const postData: PostSeed = {
      ...data,
      heroImage: imageId,
      meta: { ...data.meta, image: imageId },
    };
    const existing = await payload.find({
      collection: 'posts',
      depth: 0,
      limit: 1,
      pagination: false,
      where: { slug: { equals: postData.slug } },
    });

    const existingPost = existing.docs[0];

    const seededPost =
      existingPost ??
      (await payload.create({
        collection: 'posts',
        context: { disableRevalidate: true },
        data: postData,
        depth: 0,
        locale: defaultLocale,
      }));

    for (const locale of locales) {
      const translation = postTranslations[locale][post.slug];
      await payload.update({
        collection: 'posts',
        context: { disableRevalidate: true },
        data: {
          ...postData,
          ...translation,
          meta: { ...postData.meta, ...translation?.meta },
        },
        depth: 0,
        id: seededPost.id,
        locale: locale,
      });
    }
  }

  payload.logger.info('Fake development posts are ready in all configured locales.');
};

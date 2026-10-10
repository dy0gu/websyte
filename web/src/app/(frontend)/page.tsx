import configPromise from '@payload-config';
import type { Form as ContactForm } from '@payloadcms/plugin-form-builder/types';
import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { getLocale, getTranslations } from 'next-intl/server';
import { getPayload } from 'payload';
import { env } from '$/env';
import { ContactSection } from '~/components/home/contact-section';
import styles from '~/components/home/home.module.css';
import { toHomeProjects } from '~/components/home/project-data';
import type { HomePost, HomeProject } from '~/components/home/types';
import { WorkSection } from '~/components/home/work-section';
import { WritingSection } from '~/components/home/writing-section';
import { localizedPageMetadata } from '~/i18n/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const [t, locale] = await Promise.all([getTranslations('UI'), getLocale()]);
  return localizedPageMetadata({
    description: t('homeDescription'),
    locale: locale,
    path: '/',
  });
}

export default async function HomePage() {
  const [{ isEnabled: draft }, locale] = await Promise.all([draftMode(), getLocale()]);
  const payload = await getPayload({ config: configPromise });

  const [workResult, postResult, contactFormResult] = await Promise.all([
    payload.find({
      collection: 'projects',
      depth: 1,
      draft: draft,
      limit: 3,
      locale: locale,
      overrideAccess: draft,
      pagination: false,
      sort: '-publishedAt',
    }),
    payload.find({
      collection: 'posts',
      depth: 1,
      draft: draft,
      limit: 3,
      locale: locale,
      overrideAccess: draft,
      pagination: false,
      select: {
        heroImage: true,
        meta: true,
        publishedAt: true,
        slug: true,
        title: true,
      },
      sort: '-publishedAt',
    }),
    payload.find({
      collection: 'forms',
      depth: 0,
      limit: 1,
      locale: locale,
      overrideAccess: false,
      pagination: false,
      select: {
        confirmationMessage: true,
        confirmationType: true,
        fields: true,
        redirect: true,
        submitButtonLabel: true,
        title: true,
      },
      where: {
        formKey: {
          equals: 'contact',
        },
      },
    }),
  ]);

  const projects: HomeProject[] = toHomeProjects(workResult.docs);

  const posts: HomePost[] = postResult.docs.map((post) => {
    const heroImage = typeof post.heroImage === 'object' ? post.heroImage : null;

    return {
      cover: heroImage?.url
        ? {
            alt: heroImage.alt || post.title,
            url: heroImage.url,
          }
        : null,
      description: post.meta?.description,
      id: post.id,
      publishedAt: post.publishedAt,
      slug: post.slug,
      title: post.title,
    };
  });

  const contactForm = (contactFormResult.docs[0] as unknown as ContactForm | undefined) || null;

  return (
    <main className={styles.root}>
      {projects.length > 0 && <WorkSection projects={projects} />}
      {posts.length > 0 && <WritingSection posts={posts} />}
      <ContactSection contactEmail={env.CONTACT_EMAIL} contactForm={contactForm} />
    </main>
  );
}

import configPromise from '@payload-config'
import type { Form as ContactForm } from '@payloadcms/plugin-form-builder/types'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getLocale, getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import { ContactSection } from '@/components/home/contact-section'
import { HeroSection } from '@/components/home/hero-section'
import styles from '@/components/home/home.module.css'
import { toHomeProjects } from '@/components/home/project-data'
import { RevealObserver } from '@/components/home/reveal-observer'
import type { HomePost, HomeProject } from '@/components/home/types'
import { WorkSection } from '@/components/home/work-section'
import { WritingSection } from '@/components/home/writing-section'
import { localizedMetadata } from '@/i18n/metadata'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('UI')
  return {
    ...localizedMetadata('/', await getLocale()),
    title: 'Diogo Simões',
    description: t('homeDescription'),
  }
}

export default async function HomePage() {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const [workResult, postResult, contactFormResult] = await Promise.all([
    payload.find({
      locale: await getLocale(),
      collection: 'projects',
      depth: 1,
      draft,
      limit: 3,
      overrideAccess: draft,
      pagination: false,
      sort: '-publishedAt',
    }),
    payload.find({
      locale: await getLocale(),
      collection: 'posts',
      depth: 1,
      draft,
      limit: 3,
      overrideAccess: draft,
      pagination: false,
      sort: '-publishedAt',
      select: {
        title: true,
        slug: true,
        publishedAt: true,
        meta: true,
      },
    }),
    payload.find({
      locale: await getLocale(),
      collection: 'forms',
      depth: 0,
      limit: 1,
      overrideAccess: false,
      pagination: false,
      select: {
        title: true,
        fields: true,
        submitButtonLabel: true,
        confirmationType: true,
        confirmationMessage: true,
        redirect: true,
      },
      where: {
        formKey: {
          equals: 'contact',
        },
      },
    }),
  ])

  const projects: HomeProject[] = toHomeProjects(workResult.docs)

  const posts: HomePost[] = postResult.docs.map((post) => ({
    description: post.meta?.description,
    id: post.id,
    publishedAt: post.publishedAt,
    slug: post.slug,
    title: post.title,
  }))

  const contactForm = (contactFormResult.docs[0] as unknown as ContactForm | undefined) || null

  return (
    <main className={styles.root} data-reveal-root>
      <RevealObserver />
      <HeroSection />
      {projects.length > 0 && <WorkSection projects={projects} />}
      {posts.length > 0 && <WritingSection posts={posts} />}
      <ContactSection contactEmail={process.env.CONTACT_EMAIL} contactForm={contactForm} />
    </main>
  )
}

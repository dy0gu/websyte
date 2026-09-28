import { locales, defaultLocale } from './i18n/config'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import path from 'path'
import { buildConfig, type PayloadRequest } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { defaultLexical } from '@/fields/default-lexical'
import { Media } from './collections/media'
import { Pages } from './collections/pages'
import { Posts } from './collections/posts'
import { Admins } from './collections/admins'
import { Projects } from './collections/projects'
import { Footer } from './footer/config'
import { Header } from './header/config'
import { plugins } from './plugins'
import { getServerSideURL } from './utilities/get-url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  localization: { locales: [...locales], defaultLocale, fallback: true },
  admin: {
    meta: {
      titleSuffix: '- DS',
      description: 'Oh no, you found the admin panel!',
      icons: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          url: '/favicon.svg',
        },
      ],
    },
    components: {
      graphics: {
        // Override the large image component in the auth pages
        Logo: "/components/logo/logo",
        // Override the small image component inside the admin panel
        Icon: "/components/logo/logo",
      },
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel
      beforeLogin: ['@/components/before-login'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel
      beforeDashboard: ['@/components/before-dashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(dirname, 'app/(payload)/admin/import-map.js'),
    },
    user: Admins.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    // Schema changes must be created and applied through migrations in every environment.
    push: false,
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  email: nodemailerAdapter({
    defaultFromName: 'Websyte',
    defaultFromAddress: process.env.SMTP_FROM || 'no-reply@websyte.local',
    transportOptions: {
      host: process.env.SMTP_HOST || 'localhost',
      port: Number(process.env.SMTP_PORT) || 1025,
      secure: process.env.SMTP_SECURE === 'true',
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
          : undefined,
    },
  }),
  collections: [Pages, Posts, Projects, Media, Admins],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})

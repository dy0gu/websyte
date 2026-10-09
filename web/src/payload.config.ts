import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';
import { buildConfig, type PayloadRequest } from 'payload';
import sharp from 'sharp';
import { env } from '$/env';
import { Admins } from '~/collections/admins';
import { Media } from '~/collections/media';
import { Pages } from '~/collections/pages';
import { Posts } from '~/collections/posts';
import { Projects } from '~/collections/projects';
import { defaultLexical } from '~/fields/default-lexical';
import { Footer } from '~/footer/config';
import { Header } from '~/header/config';
import { defaultLocale, locales } from '~/i18n/config';
import { plugins } from '~/plugins';
import { getServerSideURL } from '~/utilities/get-server-url';
import { titleSuffix } from '~/utilities/site';

const databaseUrl = new URL('postgresql://');
databaseUrl.hostname = env.POSTGRES_HOST;
databaseUrl.port = String(env.POSTGRES_PORT);
databaseUrl.username = env.POSTGRES_USER;
databaseUrl.password = env.POSTGRES_PASSWORD;
databaseUrl.pathname = env.NODE_ENV === 'test' ? `${env.POSTGRES_DB}_test` : env.POSTGRES_DB;

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    components: {
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel
      beforeDashboard: ['~/components/before-dashboard#BeforeDashboard'],
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel
      beforeLogin: ['~/components/before-login#BeforeLogin'],
      graphics: {
        // Override the small image component inside the admin panel
        Icon: '/components/logo/logo#AdminLogo',
        // Override the large image component in the auth pages
        Logo: '/components/logo/logo#AdminLogo',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(dirname, 'app/(payload)/admin/import-map.js'),
    },
    livePreview: {
      breakpoints: [
        {
          height: 667,
          label: 'Mobile',
          name: 'mobile',
          width: 375,
        },
        {
          height: 1024,
          label: 'Tablet',
          name: 'tablet',
          width: 768,
        },
        {
          height: 900,
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
        },
      ],
    },
    meta: {
      description: 'Oh no, you found the admin panel!',
      icons: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          url: '/favicon.svg',
        },
      ],
      titleSuffix: titleSuffix,
    },
    user: Admins.slug,
  },
  collections: [Pages, Posts, Projects, Media, Admins],
  cors: [getServerSideURL()].filter(Boolean),
  db: postgresAdapter({
    disableCreateDatabase: false,
    pool: {
      connectionString: databaseUrl.toString(),
    },
    // Schema changes must be created and applied through migrations in every environment.
    push: false,
  }),
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  email: nodemailerAdapter({
    defaultFromAddress: env.SMTP_FROM,
    defaultFromName: 'Websyte',
    skipVerify: true,
    transportOptions: {
      auth:
        env.SMTP_USER && env.SMTP_PASS
          ? {
              pass: env.SMTP_PASS,
              user: env.SMTP_USER,
            }
          : undefined,
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
    },
  }),
  globals: [Header, Footer],
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true;

        const secret = env.CRON_SECRET;
        if (!secret) return false;

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization');
        return authHeader === `Bearer ${secret}`;
      },
    },
    tasks: [],
  },
  localization: { defaultLocale: defaultLocale, fallback: true, locales: [...locales] },
  plugins: plugins,
  secret: env.PAYLOAD_SECRET,
  sharp: sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
});
